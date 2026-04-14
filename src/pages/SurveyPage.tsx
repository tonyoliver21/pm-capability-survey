import { useState } from 'react'
import type { Division } from '../types'
import Header from '../components/Header'
import DivisionPicker from '../components/DivisionPicker'
import ScoreGuide from '../components/ScoreGuide'

export default function SurveyPage() {
  const [assessorName, setAssessorName] = useState('')
  const [division, setDivision] = useState<Division | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
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

        {division && assessorName.trim() && (
          <>
            <ScoreGuide />
            <p className="text-sm text-gray-500">PM list will load here.</p>
          </>
        )}
      </div>
    </div>
  )
}
