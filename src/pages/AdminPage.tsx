import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import type { PM, Submission, PMWithSubmissions } from '../types'
import { aggregateAverage, toPercent } from '../utils/scores'
import Header from '../components/Header'
import PMRankingTable from '../components/admin/PMRankingTable'

type DivisionFilter = 'ALL' | 'LLD' | 'LDB' | 'PPD'

export default function AdminPage() {
  const [pms, setPms] = useState<PM[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [divisionFilter, setDivisionFilter] = useState<DivisionFilter>('ALL')
  const [selectedPmId, setSelectedPmId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('pms').select('*').eq('active', true).order('name'),
      supabase.from('submissions').select('*'),
    ]).then(([{ data: pmsData }, { data: subsData }]) => {
      if (pmsData) setPms(pmsData as PM[])
      if (subsData) setSubmissions(subsData as Submission[])
      setLoading(false)
    })
  }, [])

  const pmsWithData: PMWithSubmissions[] = useMemo(() => {
    return pms
      .filter(pm => divisionFilter === 'ALL' || pm.division === divisionFilter)
      .map(pm => {
        const pmSubs = submissions.filter(s => s.pm_id === pm.id)
        const avgTotal = aggregateAverage(pmSubs)
        return { ...pm, submissions: pmSubs, avgTotal, percent: toPercent(avgTotal) }
      })
      .sort((a, b) => b.avgTotal - a.avgTotal)
  }, [pms, submissions, divisionFilter])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">PM Rankings</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {submissions.length} submission{submissions.length !== 1 ? 's' : ''} across {pms.length} PMs
            </p>
          </div>
          <div className="flex gap-2">
            {(['ALL', 'LLD', 'LDB', 'PPD'] as DivisionFilter[]).map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDivisionFilter(d)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  divisionFilter === d
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <PMRankingTable
          pms={pmsWithData}
          selectedPmId={selectedPmId}
          onSelect={id => setSelectedPmId(prev => (prev === id ? null : id))}
        />
      </div>
    </div>
  )
}
