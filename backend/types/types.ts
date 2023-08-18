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

export type UserInput = {
  name: string
  profile: string
  icon_key: string
}

export type EvaluationLabelKeys = 'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6'

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

export type Evaluation = Omit<DBEvaluation['props'], 'evaluatorIconKey'> & {
  id: string
  evaluatorIconUrl?: string
  shouldShowOperateButtons: boolean
}
export type AverageEvaluation = Record<EvaluationLabelKeys, number>
