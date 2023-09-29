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

export const fetchSelfEvaluation = async (token: string, evaluateeId?: string, evaluationId?: string): Promise<Evaluation> => {
  if (!evaluateeId || !evaluationId) throw new Error(errorMessages.evaluation.get)
  try {
    const { evaluation, error } = await get<{ evaluation: Evaluation | null; error?: string }>(
      `/evaluation/self/${evaluateeId}/${evaluationId}`,
      token,
    )
    if (!evaluation) {
      throw new Error(error)
    }
    return evaluation
  } catch (e) {
    throw new Error(errorMessages.evaluation.get)
  }
}

export const fetchOthersEvaluation = async (evaluateeId?: string, evaluationId?: string): Promise<Evaluation> => {
  if (!evaluateeId || !evaluationId) throw new Error(errorMessages.evaluation.get)
  try {
    const { evaluation, error } = await get<{ evaluation: Evaluation | null; error?: string }>(`/evaluation/${evaluateeId}/${evaluationId}`)
    if (!evaluation) {
      throw new Error(error)
    }
    return evaluation
  } catch (e) {
    throw new Error(errorMessages.evaluation.get)
  }
}

export const submitEvaluation = async (evaluation: EvaluationInput, evaluateeId?: string): Promise<void> => {
  if (!evaluateeId) throw new Error(errorMessages.evaluation.create)
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

export const publishEvaluation = async (token: string, evaluateeId?: string, evaluationId?: string): Promise<boolean> => {
  if (!evaluateeId || !evaluationId) throw new Error(errorMessages.evaluation.publish)
  try {
    const { update, error } = await put<{ update: boolean; error?: string }>(
      `/evaluation/publish/${evaluateeId}/${evaluationId}`,
      undefined,
      token,
    )
    if (!update) {
      throw new Error(error)
    }
    return update
  } catch (e) {
    throw new Error(errorMessages.evaluation.publish)
  }
}

export const unpublishEvaluation = async (token: string, evaluateeId?: string, evaluationId?: string): Promise<boolean> => {
  if (!evaluateeId || !evaluationId) throw new Error(errorMessages.evaluation.unpublish)
  try {
    const { update, error } = await put<{ update: boolean; error?: string }>(
      `/evaluation/unpublish/${evaluateeId}/${evaluationId}`,
      undefined,
      token,
    )
    if (!update) {
      throw new Error(error)
    }
    return update
  } catch (e) {
    throw new Error(errorMessages.evaluation.unpublish)
  }
}

export const deleteEvaluation = async (token: string, evaluateeId?: string, evaluationId?: string): Promise<boolean> => {
  if (!evaluateeId || !evaluationId) throw new Error(errorMessages.evaluation.delete)
  try {
    const { update, error } = await deleteData<{ update: boolean; error?: string }>(`/evaluation/${evaluateeId}/${evaluationId}`, token)
    if (!update) {
      throw new Error(error)
    }
    return update
  } catch (e) {
    throw new Error(errorMessages.evaluation.delete)
  }
}
