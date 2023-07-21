import { get, post, put, deleteData } from 'lib/axios'
import { Evaluation, DBEvaluation, EvaluationInput } from 'types/types'

export const fetchSelfEvaluations = async (token: string, id?: string): Promise<Evaluation[]> => {
  if (!id) throw new Error('データの取得に失敗しました')
  try {
    const { evaluations } = await get<{ evaluations: Evaluation[] | null }>(`/evaluation/list/self/${id}`, token)
    if (!evaluations) {
      throw new Error('データの取得に失敗しました')
    }
    return evaluations
  } catch (e) {
    throw new Error('データの取得に失敗しました')
  }
}

export const fetchOthersEvaluations = async (id?: string): Promise<Evaluation[]> => {
  if (!id) throw new Error('データの取得に失敗しました')
  try {
    const { evaluations } = await get<{ evaluations: Evaluation[] | null }>(`/evaluation/list/${id}`)
    if (!evaluations) {
      throw new Error('データの取得に失敗しました')
    }
    return evaluations
  } catch (e) {
    throw new Error('データの取得に失敗しました')
  }
}

export const fetchSelfEvaluation = async (token: string, id?: string): Promise<Evaluation> => {
  if (!id) throw new Error('データの取得に失敗しました')
  try {
    const { evaluation } = await get<{ evaluation: Evaluation | null }>(`/evaluation/self/${id}`, token)
    if (!evaluation) {
      throw new Error('データの取得に失敗しました')
    }
    return evaluation
  } catch (e) {
    throw new Error('データの取得に失敗しました')
  }
}

export const fetchOthersEvaluation = async (id?: string): Promise<Evaluation> => {
  if (!id) throw new Error('データの取得に失敗しました')
  try {
    const { evaluation } = await get<{ evaluation: Evaluation | null }>(`/evaluation/${id}`)
    if (!evaluation) {
      throw new Error('データの取得に失敗しました')
    }
    return evaluation
  } catch (e) {
    throw new Error('データの取得に失敗しました')
  }
}

export const submitEvaluation = async (evaluation: EvaluationInput, evaluateeId?: string): Promise<void> => {
  if (!evaluateeId) throw new Error('評価の送信に失敗しました')
  try {
    const res = await post<{ evaluation: DBEvaluation | null }, { evaluation: EvaluationInput }>(`/evaluation/${evaluateeId}`, {
      evaluation,
    })
    if (!res.evaluation) {
      throw new Error('評価の送信に失敗しました')
    }
  } catch (e) {
    throw new Error('評価の送信に失敗しました')
  }
}

export const publishEvaluation = async (token: string, id?: string): Promise<boolean> => {
  if (!id) throw new Error('データの取得に失敗しました')
  try {
    const { update } = await put<{ update: boolean }>(`/evaluation/publish/${id}`, undefined, token)
    return update
  } catch (e) {
    throw new Error('公開できませんでした')
  }
}

export const unpublishEvaluation = async (token: string, id?: string): Promise<boolean> => {
  if (!id) throw new Error('データの取得に失敗しました')
  try {
    const { update } = await put<{ update: boolean }>(`/evaluation/unpublish/${id}`, undefined, token)
    return update
  } catch (e) {
    throw new Error('公開できませんでした')
  }
}

export const deleteEvaluation = async (token: string, id?: string): Promise<boolean> => {
  if (!id) throw new Error('データの取得に失敗しました')
  try {
    const { update } = await deleteData<{ update: boolean }>(`/evaluation/${id}`, token)
    return update
  } catch (e) {
    throw new Error('公開できませんでした')
  }
}
