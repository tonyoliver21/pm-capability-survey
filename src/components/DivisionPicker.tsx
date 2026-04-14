import type { Division } from '../types'

const DIVISIONS: Division[] = ['LLD', 'LDB', 'PPD', 'ALL']

interface Props {
  value: Division | null
  onChange: (d: Division) => void
}

export default function DivisionPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {DIVISIONS.map(d => (
        <button
          key={d}
          type="button"
          onClick={() => onChange(d)}
          className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
            value === d
              ? 'bg-black text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {d}
        </button>
      ))}
    </div>
  )
}
