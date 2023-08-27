export type RadioButton = {
  id: string
  name: string
  value: string | number
  label: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export type FlashMessage = {
  type: 'success' | 'error'
  message: string
}

type DBProperties = {
  collection: string
  key: string
}

export type User = {
  id: string
  auth0_id: string
  name: string
  profile: string
  icon_key: string
  is_deleted: boolean
  averageEvaluation: AverageEvaluation
  publishedEvaluationNum: number
  allEvaluationNum: number
  created: string
}

export type DBUser = DBProperties & { props: Omit<User, 'id' | 'averageEvaluation' | 'publishedEvaluationNum' | 'allEvaluationNum'> }

export type Auth0User = {
  email: string
  email_verified: boolean
  name: string
  nickname: string
  picture: string
  sub: string
  updated_at: string
}

export type UserInput = {
  name: string
  profile: string
  icon_key: string
}

export type Auth0AuthenticatedBy = 'google' | 'auth0'

export type EvaluationLabelKeys = 'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6'
export const EvaluationLabels = {
  e1: 'ポジティブ',
  e2: 'ユーモア',
  e3: 'おしゃれ',
  e4: 'クリエイティブ',
  e5: '優しさ',
  e6: '親しみやすさ',
} as const satisfies Record<EvaluationLabelKeys, string>
export type EvaluationLabels = (typeof EvaluationLabels)[keyof typeof EvaluationLabels]
export const EvaluationLabelKeys = Object.keys(EvaluationLabels) as EvaluationLabelKeys[]
export const EvaluationLabelValues = Object.values(EvaluationLabels)

export type EvaluationInput = {
  evaluatorName: string
  evaluatorIconKey?: string
  relationship: string
  comment: string
  e1: {
    point: number
    reason: string
  }
  e2: {
    point: number
    reason: string
  }
  e3: {
    point: number
    reason: string
  }
  e4: {
    point: number
    reason: string
  }
  e5: {
    point: number
    reason: string
  }
  e6: {
    point: number
    reason: string
  }
}

export type DBEvaluation = DBProperties & {
  props: EvaluationInput & {
    evaluateeId: string
    is_published: boolean
    is_deleted: boolean
    created: string
  }
}

export type Evaluation = DBEvaluation['props'] & {
  id: string
  evaluatorIconUrl?: string
}

export type AverageEvaluation = Record<EvaluationLabelKeys, number>
