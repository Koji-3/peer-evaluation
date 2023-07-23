import { get, post, put, deleteData } from 'lib/axios'
import { Evaluation, DBEvaluation, EvaluationInput } from 'types/types'
import { errorMessages } from 'const/errorMessages'

export const fetchSelfEvaluations = async (token: string, id?: string): Promise<Evaluation[]> => {
  if (!id) throw new Error(errorMessages.evaluation.get)
  try {
    const { evaluations, error } = await get<{ evaluations: Evaluation[] | null; error?: string }>(`/evaluation/list/self/${id}`, token)
    if (!evaluations) {
      throw new Error(error)
    }
    return evaluations
  } catch (e) {
    throw new Error(errorMessages.evaluation.get)
  }
}

export const fetchOthersEvaluations = async (id?: string): Promise<Evaluation[]> => {
  if (!id) throw new Error(errorMessages.evaluation.get)
  try {
    const { evaluations, error } = await get<{ evaluations: Evaluation[] | null; error?: string }>(`/evaluation/list/${id}`)
    if (!evaluations) {
      throw new Error(error)
    }
    return evaluations
  } catch (e) {
    throw new Error(errorMessages.evaluation.get)
  }
}

export const fetchSelfEvaluation = async (token: string, id?: string): Promise<Evaluation> => {
  if (!id) throw new Error('データの取得に失敗しました')
  try {
    const { evaluation, error } = await get<{ evaluation: Evaluation | null; error?: string }>(`/evaluation/self/${id}`, token)
    if (!evaluation) {
      throw new Error(error)
    }
    return evaluation
  } catch (e) {
    throw new Error(errorMessages.evaluation.get)
  }
}

export const fetchOthersEvaluation = async (id?: string): Promise<Evaluation> => {
  if (!id) throw new Error('データの取得に失敗しました')
  try {
    const { evaluation, error } = await get<{ evaluation: Evaluation | null; error?: string }>(`/evaluation/${id}`)
    if (!evaluation) {
      throw new Error(error)
    }
    return evaluation
  } catch (e) {
    throw new Error(errorMessages.evaluation.get)
  }
}

export const submitEvaluation = async (evaluation: EvaluationInput, evaluateeId?: string): Promise<void> => {
  if (!evaluateeId) throw new Error('評価の送信に失敗しました')
  try {
    const { evaluation: resEvaluation, error } = await post<
      { evaluation: DBEvaluation | null; error?: string },
      { evaluation: EvaluationInput }
    >(`/evaluation/${evaluateeId}`, {
      evaluation,
    })
    if (!resEvaluation) {
      throw new Error(error)
    }
  } catch (e) {
    throw new Error(errorMessages.evaluation.create)
  }
}

export const publishEvaluation = async (token: string, id?: string): Promise<boolean> => {
  if (!id) throw new Error('データの取得に失敗しました')
  try {
    const { update, error } = await put<{ update: boolean; error?: string }>(`/evaluation/publish/${id}`, undefined, token)
    if (!update) {
      throw new Error(error)
    }
    return update
  } catch (e) {
    throw new Error(errorMessages.evaluation.publish)
  }
}

export const unpublishEvaluation = async (token: string, id?: string): Promise<boolean> => {
  if (!id) throw new Error('データの取得に失敗しました')
  try {
    const { update, error } = await put<{ update: boolean; error?: string }>(`/evaluation/unpublish/${id}`, undefined, token)
    if (!update) {
      throw new Error(error)
    }
    return update
  } catch (e) {
    throw new Error(errorMessages.evaluation.unpublish)
  }
}

export const deleteEvaluation = async (token: string, id?: string): Promise<boolean> => {
  if (!id) throw new Error('データの取得に失敗しました')
  try {
    const { update, error } = await deleteData<{ update: boolean; error?: string }>(`/evaluation/${id}`, token)
    if (!update) {
      throw new Error(error)
    }
    return update
  } catch (e) {
    throw new Error(errorMessages.evaluation.delete)
  }
}
