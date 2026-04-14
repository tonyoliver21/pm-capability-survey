import React from 'react'
import type { PMWithSubmissions } from '../../types'
import { getScoreLabel } from '../../utils/scores'
import PMDetail from './PMDetail'

interface Props {
  pms: PMWithSubmissions[]
  selectedPmId: string | null
  onSelect: (id: string) => void
}

export default function PMRankingTable({ pms, selectedPmId, onSelect }: Props) {
  if (pms.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-12">
        No submissions yet.
      </p>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 w-10">#</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400">Name</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400">Division</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400">Submissions</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400">Avg Score</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400">%</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400">Rating</th>
            <th className="px-5 py-3.5 w-16" />
          </tr>
        </thead>
        <tbody>
          {pms.map((pm, i) => {
            const label = getScoreLabel(pm.submissions.length > 0 ? pm.avgTotal / 5 : 0)
            const isSelected = selectedPmId === pm.id
            const hasData = pm.submissions.length > 0

            return (
              <React.Fragment key={pm.id}>
                <tr
                  className={`border-b border-gray-50 cursor-pointer transition-colors ${
                    isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onSelect(pm.id)}
                >
                  <td className="px-5 py-4 text-gray-300 font-mono text-xs">{i + 1}</td>
                  <td className="px-5 py-4 font-semibold text-gray-900">{pm.name}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{pm.division}</td>
                  <td className="px-5 py-4 text-gray-500">{pm.submissions.length}</td>
                  <td className="px-5 py-4 text-gray-700">
                    {hasData ? `${pm.avgTotal}/50` : '–'}
                  </td>
                  <td className="px-5 py-4">
                    {hasData ? (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${label.bgColor} ${label.textColor}`}
                      >
                        {pm.percent}%
                      </span>
                    ) : (
                      '–'
                    )}
                  </td>
                  <td className={`px-5 py-4 text-xs font-semibold ${label.textColor}`}>
                    {hasData ? label.label : '–'}
                  </td>
                  <td className="px-5 py-4 text-blue-400 text-xs font-medium">
                    {isSelected ? 'Hide ↑' : 'View ↓'}
                  </td>
                </tr>
                {isSelected && (
                  <tr>
                    <td colSpan={8} className="px-5 py-5 bg-gray-50 border-b border-gray-100">
                      <PMDetail pm={pm} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
