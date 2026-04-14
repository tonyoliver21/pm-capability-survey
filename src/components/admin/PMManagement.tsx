import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { PM, Division } from '../../types'

type PMDivision = Exclude<Division, 'ALL'>

interface Props {
  allPms: PM[]
  onPmsChange: (pms: PM[]) => void
}

const DIVISIONS: PMDivision[] = ['LLD', 'LDB', 'PPD']

export default function PMManagement({ allPms, onPmsChange }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [division, setDivision] = useState<PMDivision>('LLD')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!name.trim() || !role.trim()) return
    setAdding(true)
    setAddError(null)
    const { data, error } = await supabase
      .from('pms')
      .insert({ name: name.trim(), role: role.trim(), division, active: true })
      .select()
      .single()
    if (error || !data) {
      setAddError('Failed to add PM. Please try again.')
    } else {
      onPmsChange([...allPms, data as PM])
      setName('')
      setRole('')
      setDivision('LLD')
    }
    setAdding(false)
  }

  const handleToggle = async (pm: PM) => {
    setToggling(pm.id)
    const { error } = await supabase
      .from('pms')
      .update({ active: !pm.active })
      .eq('id', pm.id)
    if (!error) {
      onPmsChange(allPms.map(p => (p.id === pm.id ? { ...p, active: !p.active } : p)))
    }
    setToggling(null)
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
      >
        <span className={`transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
        Manage PMs
      </button>

      {open && (
        <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Add PM form */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Add PM
            </div>
            <div className="flex gap-3 flex-wrap">
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 placeholder:text-gray-400 w-48"
              />
              <input
                type="text"
                placeholder="Role (e.g. Project Manager)"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 placeholder:text-gray-400 flex-1 min-w-48"
              />
              <div className="flex gap-1.5">
                {DIVISIONS.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDivision(d)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      division === d
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAdd}
                disabled={adding || !name.trim() || !role.trim()}
                className="px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
              >
                {adding ? 'Adding…' : 'Add'}
              </button>
            </div>
            {addError && <p className="text-xs text-red-600 mt-2">{addError}</p>}
          </div>

          {/* PM list */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">Division</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">Status</th>
                <th className="px-5 py-3 w-32" />
              </tr>
            </thead>
            <tbody>
              {allPms
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(pm => (
                  <tr key={pm.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3 font-medium text-gray-900">{pm.name}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{pm.role}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{pm.division}</td>
                    <td className="px-5 py-3">
                      {pm.active ? (
                        <span className="text-xs font-medium text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggle(pm)}
                        disabled={toggling === pm.id}
                        className="text-xs font-semibold text-blue-500 hover:text-blue-700 disabled:opacity-40 transition-colors"
                      >
                        {toggling === pm.id
                          ? '…'
                          : pm.active
                          ? 'Deactivate'
                          : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
