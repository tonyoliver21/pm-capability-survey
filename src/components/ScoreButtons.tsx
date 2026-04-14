const IDLE: Record<number, string> = {
  1: 'bg-red-100 text-red-700 hover:bg-red-200',
  2: 'bg-red-100 text-red-700 hover:bg-red-200',
  3: 'bg-red-100 text-red-700 hover:bg-red-200',
  4: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  5: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  6: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  7: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  8: 'bg-green-100 text-green-700 hover:bg-green-200',
  9: 'bg-green-100 text-green-700 hover:bg-green-200',
  10: 'bg-green-100 text-green-700 hover:bg-green-200',
}

const ACTIVE: Record<number, string> = {
  1: 'bg-red-500 text-white shadow-sm',
  2: 'bg-red-500 text-white shadow-sm',
  3: 'bg-red-500 text-white shadow-sm',
  4: 'bg-amber-500 text-white shadow-sm',
  5: 'bg-amber-500 text-white shadow-sm',
  6: 'bg-blue-500 text-white shadow-sm',
  7: 'bg-blue-500 text-white shadow-sm',
  8: 'bg-green-500 text-white shadow-sm',
  9: 'bg-green-500 text-white shadow-sm',
  10: 'bg-green-500 text-white shadow-sm',
}

interface Props {
  value: number | null
  onChange: (score: number) => void
  disabled?: boolean
}

export default function ScoreButtons({ value, onChange, disabled = false }: Props) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
            value === n ? ACTIVE[n] : IDLE[n]
          } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}
