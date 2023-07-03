type DBProperties = {
  collection: string
  key: string
}

export type User = {
  auth0_id: string
  name: string
  profile: string
  icon_url: string
  is_deleted: boolean
}

export type DBUser = DBProperties & { props: User }

export type Auth0User = {
  email: string
  email_verified: boolean
  name: string
  nickname: string
  picture: string
  sub: string
  updated_at: string
}

// TODO: google以外のログインも受け付けるなら要変更
export type Auth0AuthenticatedBy = 'google' | 'auth0'

export const EvaluationLabels = {
  e1: '情熱',
  e2: '情熱',
  e3: '情熱',
  e4: '情熱',
  e5: '情熱',
  e6: '情熱',
} as const

export type EvaluationLabels = (typeof EvaluationLabels)[keyof typeof EvaluationLabels]

export type Evaluation = {
  id: string
  evaluateByName: string
  evaluateByIconUrl: string
  evaluateByRelationship: string
  comment: string
  e1: number
  e1Reason: string | null
  e2: number
  e2Reason: string | null
  e3: number
  e3Reason: string | null
  e4: number
  e4Reason: string | null
  e5: number
  e5Reason: string | null
  isPublished: boolean
  isDeleted: boolean
}
