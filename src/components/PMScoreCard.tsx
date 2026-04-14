import { useState } from 'react'
import { AREAS } from '../data/areas'
import type { PM, AreaId, ScoreField, CommentField } from '../types'
import ScoreButtons from './ScoreButtons'

const AREA_IDS: AreaId[] = ['competency', 'knowledge', 'client', 'delivery', 'risk']

interface Props {
  pm: PM
  scores: Partial<Record<ScoreField, number>>
  comments: Partial<Record<CommentField, string>>
  onScore: (pmId: string, area: AreaId, score: number) => void
  onComment: (pmId: string, area: AreaId, comment: string) => void
  isDuplicate: boolean
}

export default function PMScoreCard({ pm, scores, comments, onScore, onComment, isDuplicate }: Props) {
  const [expanded, setExpanded] = useState(false)

  const scoredCount = AREA_IDS.filter(a => (scores[`score_${a}`] ?? 0) > 0).length
  const isFullyScored = scoredCount === 5

  return (
    <div
      className={`rounded-2xl border shadow-sm overflow-hidden ${
        isDuplicate
          ? 'border-amber-200 bg-amber-50/60'
          : isFullyScored
          ? 'border-green-200 bg-white'
          : 'border-gray-200 bg-white'
      }`}
    >
      {/* Card header — acts as toggle */}
      <button
        type="button"
        onClick={() => { if (!isDuplicate) setExpanded(e => !e) }}
        disabled={isDuplicate}
        className={`w-full px-5 py-4 border-b flex items-center justify-between text-left transition-colors ${
          isDuplicate
            ? 'border-amber-100 cursor-default'
            : 'border-gray-100 hover:bg-gray-50 cursor-pointer'
        }`}
      >
        <div>
          <div className="font-semibold text-gray-900">{pm.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">
            {pm.role} · {pm.division}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isDuplicate && (
            <span className="text-xs font-medium text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full">
              Already submitted
            </span>
          )}
          {!isDuplicate && isFullyScored && (
            <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
              Scored ✓
            </span>
          )}
          {!isDuplicate && !isFullyScored && scoredCount > 0 && (
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
              {scoredCount}/5
            </span>
          )}
          {!isDuplicate && (
            <span className={`text-gray-400 text-sm inline-block transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
              ▾
            </span>
          )}
        </div>
      </button>

      {/* Card body — only shown when expanded */}
      {!isDuplicate && expanded && (
        <div className="px-5 py-5 space-y-6">
          {AREAS.map((area, i) => (
            <div key={area.id}>
              <div className="text-sm font-semibold text-gray-900 mb-0.5">
                {i + 1}. {area.label}
              </div>
              <div className="text-xs text-gray-500 mb-3 leading-relaxed">
                {area.definition}
              </div>
              <ScoreButtons
                value={scores[`score_${area.id}`] ?? null}
                onChange={score => onScore(pm.id, area.id, score)}
              />
              <textarea
                placeholder="Optional comment..."
                value={comments[`comment_${area.id}`] ?? ''}
                onChange={e => onComment(pm.id, area.id, e.target.value)}
                rows={2}
                className="mt-2.5 w-full text-xs rounded-xl border border-gray-200 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-black/10 placeholder:text-gray-400"
              />
            </div>
          ))}
        </div>
      )}

      {/* Duplicate body */}
      {isDuplicate && (
        <div className="px-5 py-4 text-sm text-amber-700">
          You've already rated {pm.name}. Your earlier submission stands.
        </div>
      )}
    </div>
  )
}
