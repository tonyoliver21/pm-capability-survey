export type Division = 'LLD' | 'LDB' | 'PPD' | 'ALL'
export type AreaId = 'competency' | 'knowledge' | 'client' | 'delivery' | 'risk' | 'admin' | 'leadership'
export type ScoreField = `score_${AreaId}`
export type CommentField = `comment_${AreaId}`

export interface PM {
  id: string
  name: string
  role: string
  division: Exclude<Division, 'ALL'>
  active: boolean
}

export interface Area {
  id: AreaId
  label: string
  definition: string
}

export interface Submission {
  id: string
  pm_id: string
  assessor_name: string
  score_competency: number
  score_knowledge: number
  score_client: number
  score_delivery: number
  score_risk: number
  score_admin: number
  score_leadership: number
  comment_competency: string | null
  comment_knowledge: string | null
  comment_client: string | null
  comment_delivery: string | null
  comment_risk: string | null
  comment_admin: string | null
  comment_leadership: string | null
  submitted_at: string
}

export interface PMWithSubmissions extends PM {
  submissions: Submission[]
  avgTotal: number
  percent: number
}
