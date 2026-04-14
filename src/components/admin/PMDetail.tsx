import { AREAS } from '../../data/areas'
import type { PMWithSubmissions } from '../../types'
import { areaAverage, areaTag, barColor, submissionTotal, getScoreLabel } from '../../utils/scores'

interface Props {
  pm: PMWithSubmissions
}

const TAG_STYLES = {
  strength: { bg: 'bg-green-100', text: 'text-green-700', label: 'Strength' },
  competent: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Competent' },
  'needs-support': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Needs support' },
}

export default function PMDetail({ pm }: Props) {
  if (pm.submissions.length === 0) {
    return <p className="text-sm text-gray-400">No submissions yet for this PM.</p>
  }

  const overallLabel = getScoreLabel(pm.avgTotal / 7)

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="font-bold text-gray-900 text-base">{pm.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">
            {pm.role} · {pm.division} ·{' '}
            {pm.submissions.length} submission{pm.submissions.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-black ${overallLabel.textColor}`}>{pm.percent}%</div>
          <div className="text-xs text-gray-400">{pm.avgTotal}/70 avg</div>
        </div>
      </div>

      {/* Area breakdown */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Area breakdown
        </div>
        <div className="space-y-3">
          {AREAS.map(area => {
            const avg = areaAverage(pm.submissions, area.id)
            const tag = areaTag(avg)
            const tagStyle = TAG_STYLES[tag]
            return (
              <div key={area.id} className="flex items-center gap-3">
                <div className="w-36 text-xs font-medium text-gray-700 shrink-0">
                  {area.label}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${barColor(avg)}`}
                    style={{ width: `${(avg / 10) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-xs font-semibold text-gray-700 text-right shrink-0">
                  {avg}
                </div>
                <div className="w-28 shrink-0">
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${tagStyle.bg} ${tagStyle.text}`}
                  >
                    {tagStyle.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Individual submissions */}
      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Individual submissions
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-semibold text-gray-500">Assessor</th>
                {AREAS.map(a => (
                  <th key={a.id} className="text-left py-2 pr-3 font-semibold text-gray-500">
                    {a.label.split(' ')[0]}
                  </th>
                ))}
                <th className="text-left py-2 pr-3 font-semibold text-gray-500">Total</th>
                <th className="text-left py-2 font-semibold text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {pm.submissions.map(s => {
                const commentPairs = AREAS.map(a => ({
                  label: a.label,
                  text: s[`comment_${a.id}` as keyof typeof s] as string | null,
                })).filter(c => c.text)

                return (
                  <>
                    <tr key={s.id} className={commentPairs.length ? 'border-b-0' : 'border-b border-gray-50'}>
                      <td className="py-2.5 pr-4 font-medium text-gray-700">{s.assessor_name}</td>
                      {AREAS.map(a => (
                        <td key={a.id} className="py-2.5 pr-3">
                          {s[`score_${a.id}` as keyof typeof s] as number}
                        </td>
                      ))}
                      <td className="py-2.5 pr-3 font-semibold text-gray-900">
                        {submissionTotal(s)}/70
                      </td>
                      <td className="py-2.5 text-gray-400">
                        {new Date(s.submitted_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                    </tr>
                    {commentPairs.length > 0 && (
                      <tr key={`${s.id}-comments`} className="border-b border-gray-50">
                        <td colSpan={8} className="pb-2.5 pr-4">
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {commentPairs.map(c => (
                              <span key={c.label} className="text-gray-500">
                                <span className="font-medium text-gray-600">{c.label}:</span> {c.text}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
