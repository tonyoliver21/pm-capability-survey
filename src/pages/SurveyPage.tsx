import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { PM, Division, AreaId, ScoreField, CommentField } from '../types'
import Header from '../components/Header'
import DivisionPicker from '../components/DivisionPicker'
import ScoreGuide from '../components/ScoreGuide'
import PMScoreCard from '../components/PMScoreCard'
import ThankYou from '../components/ThankYou'

const AREA_IDS: AreaId[] = ['competency', 'knowledge', 'client', 'delivery', 'risk']

type ScoreMap = Record<string, Partial<Record<ScoreField, number>>>
type CommentMap = Record<string, Partial<Record<CommentField, string>>>

export default function SurveyPage() {
  const [assessorName, setAssessorName] = useState('')
  const [division, setDivision] = useState<Division | null>(null)
  const [pms, setPms] = useState<PM[]>([])
  const [scores, setScores] = useState<ScoreMap>({})
  const [comments, setComments] = useState<CommentMap>({})
  const [duplicates, setDuplicates] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load PMs when division changes
  useEffect(() => {
    if (!division) return
    let cancelled = false
    const query = supabase.from('pms').select('*').eq('active', true)
    if (division !== 'ALL') query.eq('division', division)
    query.order('name').then(({ data }) => {
      if (!cancelled && data) setPms(data as PM[])
    })
    return () => { cancelled = true }
  }, [division])

  // Check for duplicates when assessor name or PM list changes
  useEffect(() => {
    if (!assessorName.trim() || pms.length === 0) {
      setDuplicates(new Set())
      return
    }
    let cancelled = false
    const pmIds = pms.map(p => p.id)
    supabase
      .from('submissions')
      .select('pm_id')
      .eq('assessor_name', assessorName.trim())
      .in('pm_id', pmIds)
      .then(({ data }) => {
        if (!cancelled && data) setDuplicates(new Set(data.map((r: { pm_id: string }) => r.pm_id)))
      })
    return () => { cancelled = true }
  }, [assessorName, pms])

  const handleScore = useCallback((pmId: string, area: AreaId, score: number) => {
    setScores(prev => ({
      ...prev,
      [pmId]: { ...prev[pmId], [`score_${area}`]: score },
    }))
  }, [])

  const handleComment = useCallback((pmId: string, area: AreaId, comment: string) => {
    setComments(prev => ({
      ...prev,
      [pmId]: { ...prev[pmId], [`comment_${area}`]: comment },
    }))
  }, [])

  const activePms = pms.filter(p => !duplicates.has(p.id))

  const isValid =
    assessorName.trim().length > 0 &&
    division !== null &&
    activePms.length > 0 &&
    activePms.every(pm =>
      AREA_IDS.every(a => (scores[pm.id]?.[`score_${a}`] ?? 0) > 0)
    )

  const handleSubmit = async () => {
    if (!isValid || submitting) return
    setSubmitting(true)
    setError(null)

    const rows = activePms.map(pm => ({
      pm_id: pm.id,
      assessor_name: assessorName.trim(),
      score_competency: scores[pm.id]!.score_competency!,
      score_knowledge: scores[pm.id]!.score_knowledge!,
      score_client: scores[pm.id]!.score_client!,
      score_delivery: scores[pm.id]!.score_delivery!,
      score_risk: scores[pm.id]!.score_risk!,
      comment_competency: comments[pm.id]?.comment_competency ?? null,
      comment_knowledge: comments[pm.id]?.comment_knowledge ?? null,
      comment_client: comments[pm.id]?.comment_client ?? null,
      comment_delivery: comments[pm.id]?.comment_delivery ?? null,
      comment_risk: comments[pm.id]?.comment_risk ?? null,
    }))

    const { error: err } = await supabase.from('submissions').insert(rows)
    if (err) {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
      return
    }
    setSubmitting(false)
    setSubmitted(true)
  }

  const handleReset = () => {
    setAssessorName('')
    setDivision(null)
    setPms([])
    setScores({})
    setComments({})
    setDuplicates(new Set())
    setSubmitted(false)
    setSubmitting(false)
    setError(null)
  }

  if (submitted) {
    return (
      <ThankYou
        assessorName={assessorName}
        pmCount={activePms.length}
        onReset={handleReset}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Setup block */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-5">PM Capability Assessment</h1>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Your name{' '}
              <span className="font-normal text-gray-400">(the person scoring)</span>
            </label>
            <input
              type="text"
              value={assessorName}
              onChange={e => setAssessorName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Division</label>
            <DivisionPicker value={division} onChange={setDivision} />
          </div>
        </div>

        {pms.length > 0 && (
          <>
            <ScoreGuide />
            <div className="space-y-4 mb-6">
              {pms.map(pm => (
                <PMScoreCard
                  key={pm.id}
                  pm={pm}
                  scores={scores[pm.id] ?? {}}
                  comments={comments[pm.id] ?? {}}
                  onScore={handleScore}
                  onComment={handleComment}
                  isDuplicate={duplicates.has(pm.id)}
                />
              ))}
            </div>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
            >
              {submitting ? 'Submitting…' : 'Submit all ratings'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
