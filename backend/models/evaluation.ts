import CyclicDb from '@cyclic.sh/dynamodb'
import crypto from 'crypto'
import { getIcon } from './s3'
import { getUserByAuth0Id } from './user'
import { EvaluationInput, DBEvaluation, Evaluation } from '../types/types'
import { errorMessages } from '../const/errorMessages'

const db = CyclicDb('motionless-crab-hoseCyclicDB')
const evaluations = db.collection('evaluations')

export const createEvaluation = async (evaluation: EvaluationInput, evaluateeId: string): Promise<DBEvaluation> => {
  const uuid = crypto.randomUUID()
  const newEvaluation: Omit<DBEvaluation['props'], 'created'> = { ...evaluation, is_published: false, is_deleted: false, evaluateeId }

  try {
    const result = await evaluations.set(uuid, newEvaluation)
    return result
  } catch (e) {
    console.error('createEvaluation error: ', e)
    throw new Error(errorMessages.evaluation.create)
  }
}

const formatDBEvaluationToEvaluation = async (evaluation: DBEvaluation): Promise<Evaluation> => {
  if (!evaluation.props.evaluatorIconKey) {
    return { ...evaluation.props, id: evaluation.key, evaluatorIconUrl: undefined }
  } else {
    const icon = await getIcon(evaluation.props.evaluatorIconKey)
    const base64Image = Buffer.from(await icon.Body!.transformToByteArray()).toString('base64')
    const imageSrc = `data:image/jpeg;base64,${base64Image}`
    return { ...evaluation.props, id: evaluation.key, evaluatorIconUrl: imageSrc }
  }
}

export const getEvaluation = async (evaluationId: string, auth0Id?: string): Promise<Evaluation | null> => {
  try {
    const evaluation: DBEvaluation = await evaluations.get(evaluationId)
    const isPublished = evaluation.props.is_published
    const isDeleted = evaluation.props.is_deleted
    if (auth0Id) {
      // 自分の紹介の取得
      return !isDeleted ? await formatDBEvaluationToEvaluation(evaluation) : null
    } else {
      return isPublished && !isDeleted ? await formatDBEvaluationToEvaluation(evaluation) : null
    }
  } catch (e) {
    console.error('getEvaluation error: ', e)
    throw new Error(errorMessages.evaluation.get)
  }
}

const sortByCreatedAt = (results: DBEvaluation[]): DBEvaluation[] => {
  const sortedResults = results.sort((a, b) => {
    const unixTimeA = new Date(a.props.created).getTime()
    const unixTimeB = new Date(b.props.created).getTime()
    return unixTimeB - unixTimeA
  })
  return sortedResults
}

const addParamsForReturnValueToEvaluations = async (results: DBEvaluation[]): Promise<Evaluation[]> => {
  try {
    const returnValue = await Promise.all(results.map(async (result) => await formatDBEvaluationToEvaluation(result)))
    return returnValue
  } catch (e) {
    console.error('addParamsForReturnValueToEvaluations error: ', e)
    throw new Error('addParamsForReturnValueToEvaluations error')
  }
}

export const getAllEvaluations = async (evaluateeId: string): Promise<DBEvaluation[]> => {
  const res: { results: DBEvaluation[] } = await evaluations.filter({ evaluateeId, is_deleted: false })
  return res.results
}

const getSortedAllEvaluations = async (evaluateeId: string): Promise<Evaluation[]> => {
  try {
    const allEvaluations = await getAllEvaluations(evaluateeId)
    if (!allEvaluations.length) return []
    const sortedResults = sortByCreatedAt(allEvaluations)
    return addParamsForReturnValueToEvaluations(sortedResults)
  } catch (e) {
    console.error('getSortedAllEvaluations error: ', e)
    throw new Error('getSortedAllEvaluations error')
  }
}

export const getPublishedEvaluations = async (evaluateeId: string): Promise<DBEvaluation[]> => {
  const res: { results: DBEvaluation[] } = await evaluations.filter({ evaluateeId, is_published: true, is_deleted: false })
  if (!res.results.length) return []
  return res.results
}

const getSortedPublishedEvaluations = async (evaluateeId: string): Promise<Evaluation[]> => {
  try {
    const publishedEvaluations = await getPublishedEvaluations(evaluateeId)
    if (!publishedEvaluations.length) return []
    const sortedResults = sortByCreatedAt(publishedEvaluations)
    return addParamsForReturnValueToEvaluations(sortedResults)
  } catch (e) {
    console.error('getSortedPublishedEvaluations error: ', e)
    throw new Error('getSortedPublishedEvaluations error')
  }
}

export const getEvaluations = async (evaluateeId: string, auth0Id?: string): Promise<Evaluation[]> => {
  if (auth0Id) {
    try {
      const user = await getUserByAuth0Id(auth0Id)
      const userId = user?.key
      if (!userId) {
        throw new Error(errorMessages.evaluation.get)
      }
      if (evaluateeId === userId) {
        return await getSortedAllEvaluations(evaluateeId)
      }
      return await getSortedPublishedEvaluations(evaluateeId)
    } catch (e) {
      console.error('getEvaluations error: ', e)
      throw new Error(errorMessages.evaluation.get)
    }
  } else {
    try {
      return await getSortedPublishedEvaluations(evaluateeId)
    } catch (e) {
      console.error('getEvaluations error: ', e)
      throw new Error(errorMessages.evaluation.get)
    }
  }
}

export const updateEvaluation = async ({
  evaluationId,
  isPublished,
  isDeleted,
}: {
  evaluationId: string
  isPublished?: boolean
  isDeleted?: boolean
}): Promise<{ update: boolean }> => {
  try {
    const evaluation: DBEvaluation = await evaluations.get(evaluationId)
    const res = await evaluations.set(evaluationId, {
      is_published: isPublished ?? evaluation.props.is_published,
      is_deleted: isDeleted ?? evaluation.props.is_deleted,
    })
    if (!!res) return { update: true }
    return { update: false }
  } catch (e) {
    console.error('updateEvaluation error: ', e)
    throw new Error(
      isDeleted ? errorMessages.evaluation.delete : isPublished ? errorMessages.evaluation.publish : errorMessages.evaluation.unpublish,
    )
  }
}

// データ確認用
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteAllEvaluations = async (): Promise<void> => {
  const evaluationsList = await evaluations.list()
  const targetKeys: string[] = evaluationsList.results.map((result: DBEvaluation) => result.key)
  targetKeys.forEach(async (key) => {
    await evaluations.delete(key)
  })
}
// deleteAllEvaluations()
