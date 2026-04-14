import { describe, it, expect } from 'vitest'
import {
  getScoreLabel,
  barColor,
  submissionTotal,
  toPercent,
  areaAverage,
  aggregateAverage,
  areaTag,
} from '../utils/scores'
import type { Submission } from '../types'

const makeSubmission = (scores: [number, number, number, number, number, number, number]): Submission => ({
  id: '1',
  pm_id: 'pm1',
  assessor_name: 'Test Assessor',
  score_competency: scores[0],
  score_knowledge: scores[1],
  score_client: scores[2],
  score_delivery: scores[3],
  score_risk: scores[4],
  score_admin: scores[5],
  score_leadership: scores[6],
  comment_competency: null,
  comment_knowledge: null,
  comment_client: null,
  comment_delivery: null,
  comment_risk: null,
  comment_admin: null,
  comment_leadership: null,
  submitted_at: '2026-04-14T00:00:00Z',
})

describe('getScoreLabel', () => {
  it('returns Developing for 1', () => expect(getScoreLabel(1).label).toBe('Developing'))
  it('returns Developing for 3', () => expect(getScoreLabel(3).label).toBe('Developing'))
  it('returns Progressing for 4', () => expect(getScoreLabel(4).label).toBe('Progressing'))
  it('returns Progressing for 5', () => expect(getScoreLabel(5).label).toBe('Progressing'))
  it('returns Competent for 6', () => expect(getScoreLabel(6).label).toBe('Competent'))
  it('returns Competent for 7', () => expect(getScoreLabel(7).label).toBe('Competent'))
  it('returns Strong for 8', () => expect(getScoreLabel(8).label).toBe('Strong'))
  it('returns Strong for 10', () => expect(getScoreLabel(10).label).toBe('Strong'))
})

describe('barColor', () => {
  it('returns red class for score 3', () => expect(barColor(3)).toBe('bg-red-400'))
  it('returns amber class for score 5', () => expect(barColor(5)).toBe('bg-amber-400'))
  it('returns blue class for score 7', () => expect(barColor(7)).toBe('bg-blue-400'))
  it('returns green class for score 10', () => expect(barColor(10)).toBe('bg-green-400'))
})

describe('submissionTotal', () => {
  it('sums all 7 area scores', () => {
    expect(submissionTotal(makeSubmission([8, 7, 6, 9, 5, 7, 6]))).toBe(48)
  })
  it('returns 70 for max scores', () => {
    expect(submissionTotal(makeSubmission([10, 10, 10, 10, 10, 10, 10]))).toBe(70)
  })
})

describe('toPercent', () => {
  it('converts 56 out of 70 to 80%', () => expect(toPercent(56)).toBe(80))
  it('converts 35 out of 70 to 50%', () => expect(toPercent(35)).toBe(50))
  it('converts 70 out of 70 to 100%', () => expect(toPercent(70)).toBe(100))
})

describe('areaAverage', () => {
  it('returns average of competency scores across two submissions', () => {
    const subs = [makeSubmission([8, 7, 6, 9, 5, 6, 7]), makeSubmission([6, 7, 6, 7, 5, 6, 7])]
    expect(areaAverage(subs, 'competency')).toBe(7)
  })
  it('returns 0 for empty submissions array', () => {
    expect(areaAverage([], 'competency')).toBe(0)
  })
})

describe('aggregateAverage', () => {
  it('averages submission totals', () => {
    const subs = [makeSubmission([10, 10, 10, 10, 10, 10, 10]), makeSubmission([5, 5, 5, 5, 5, 5, 5])]
    // totals: 70 + 35 = 105, avg = 52.5
    expect(aggregateAverage(subs)).toBe(52.5)
  })
  it('returns 0 for empty submissions array', () => {
    expect(aggregateAverage([])).toBe(0)
  })
})

describe('areaTag', () => {
  it('returns strength for avg exactly 7', () => expect(areaTag(7)).toBe('strength'))
  it('returns strength for avg 9', () => expect(areaTag(9)).toBe('strength'))
  it('returns needs-support for avg exactly 4', () => expect(areaTag(4)).toBe('needs-support'))
  it('returns needs-support for avg 2', () => expect(areaTag(2)).toBe('needs-support'))
  it('returns competent for avg 5.5', () => expect(areaTag(5.5)).toBe('competent'))
  it('returns competent for avg 6.9', () => expect(areaTag(6.9)).toBe('competent'))
})
