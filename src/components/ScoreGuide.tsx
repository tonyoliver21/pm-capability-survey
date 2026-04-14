const BANDS = [
  { range: '1–3', label: 'Developing', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  { range: '4–5', label: 'Progressing', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  { range: '6–7', label: 'Competent', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  { range: '8–10', label: 'Strong', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
]

export default function ScoreGuide() {
  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {BANDS.map(({ range, label, bg, border, text }) => (
        <div key={label} className={`rounded-xl p-3 border ${bg} ${border}`}>
          <div className={`text-xs font-bold ${text}`}>{range}</div>
          <div className={`text-xs font-semibold ${text} mt-0.5`}>{label}</div>
        </div>
      ))}
    </div>
  )
}
