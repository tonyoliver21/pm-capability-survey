import type { AreaId, Submission } from '../types'

export interface ScoreLabel {
  label: string
  textColor: string
  bgColor: string
  borderColor: string
}

export function getScoreLabel(score: number): ScoreLabel {
  if (score <= 3)
    return { label: 'Developing', textColor: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
  if (score <= 5)
    return { label: 'Progressing', textColor: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' }
  if (score <= 7)
    return { label: 'Competent', textColor: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' }
  return { label: 'Strong', textColor: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
}

export function barColor(score: number): string {
  if (score <= 3) return 'bg-red-400'
  if (score <= 5) return 'bg-amber-400'
  if (score <= 7) return 'bg-blue-400'
  return 'bg-green-400'
}

export function submissionTotal(s: Submission): number {
  return (
    s.score_competency +
    s.score_knowledge +
    s.score_client +
    s.score_delivery +
    s.score_risk +
    s.score_admin +
    s.score_leadership
  )
}

export function toPercent(total: number, max = 70): number {
  return Math.round((total / max) * 100)
}

export function areaAverage(submissions: Submission[], areaId: AreaId): number {
  if (submissions.length === 0) return 0
  const key = `score_${areaId}` as keyof Submission
  const sum = submissions.reduce((acc, s) => acc + (s[key] as number), 0)
  return Math.round((sum / submissions.length) * 10) / 10
}

export function aggregateAverage(submissions: Submission[]): number {
  if (submissions.length === 0) return 0
  const sum = submissions.reduce((acc, s) => acc + submissionTotal(s), 0)
  return Math.round((sum / submissions.length) * 10) / 10
}

export function areaTag(avg: number): 'strength' | 'competent' | 'needs-support' {
  if (avg >= 7) return 'strength'
  if (avg <= 4) return 'needs-support'
  return 'competent'
}
