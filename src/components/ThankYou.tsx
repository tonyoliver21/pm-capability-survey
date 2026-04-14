interface Props {
  assessorName: string
  pmCount: number
  onReset: () => void
}

export default function ThankYou({ assessorName, pmCount, onReset }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <div className="text-center max-w-sm px-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Submitted</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Thanks, {assessorName}. Your ratings for {pmCount} PM
          {pmCount !== 1 ? 's' : ''} have been saved.
        </p>
        <button
          onClick={onReset}
          className="mt-8 text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
        >
          Submit another response
        </button>
      </div>
    </div>
  )
}
