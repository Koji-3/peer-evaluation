import CyclicDb from '@cyclic.sh/dynamodb'
import crypto from 'crypto'
import { getIcon } from './s3'
import { getUserByAuth0Id, increaseUserAvarageEvaluation, decreaseUserAvarageEvaluation, increaseUserAllEvaluationNum } from './user'
import { EvaluationInput, DBEvaluation, Evaluation } from '../types/types'
import { errorMessages } from '../const/errorMessages'

const db = CyclicDb('motionless-crab-hoseCyclicDB')
const evaluations = db.collection('evaluations')

export const createEvaluation = async (evaluation: EvaluationInput, evaluateeId: string): Promise<DBEvaluation> => {
  const uuid = crypto.randomUUID()
  const newEvaluation: Omit<DBEvaluation['props'], 'created'> = { ...evaluation, is_published: false, is_deleted: false, evaluateeId }
  try {
    const result = await evaluations.set(uuid, newEvaluation)
    await increaseUserAllEvaluationNum(evaluateeId)
    return result
  } catch (e) {
    console.error('createEvaluation error: ', e)
    throw new Error(errorMessages.evaluation.create)
  }
}

export const getEvaluation = async (evaluationId: string, auth0Id?: string): Promise<Evaluation | null> => {
  try {
    const evaluation: DBEvaluation = await evaluations.get(evaluationId)
    const isPublished = evaluation.props.is_published
    const isDeleted = evaluation.props.is_deleted
    if (auth0Id) {
      const user = await getUserByAuth0Id(auth0Id)
      const userId = user?.key
      if (!userId) {
        throw new Error(errorMessages.evaluation.get)
      }
      if (evaluation.props.evaluateeId === userId) {
        return !isDeleted ? { ...evaluation.props, id: evaluation.key, shouldShowOperateButtons: true } : null
      }
      return isPublished || !isDeleted ? { ...evaluation.props, id: evaluation.key, shouldShowOperateButtons: false } : null
    } else {
      return isPublished || !isDeleted ? { ...evaluation.props, id: evaluation.key, shouldShowOperateButtons: false } : null
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

const addParamsForReturnValueToEvaluations = async (results: DBEvaluation[], isSelf: boolean): Promise<Evaluation[]> => {
  try {
    const returnValue = await Promise.all(
      results.map(async (result) => {
        if (!result.props.evaluatorIconKey) {
          return { ...result.props, id: result.key, evaluatorIconUrl: undefined, shouldShowOperateButtons: isSelf }
        } else {
          const icon = await getIcon(result.props.evaluatorIconKey)
          const base64Image = Buffer.from(icon.Body as Buffer).toString('base64')
          const imageSrc = `data:image/jpeg;base64,${base64Image}`
          return { ...result.props, id: result.key, evaluatorIconUrl: imageSrc, shouldShowOperateButtons: isSelf }
        }
      }),
    )
    return returnValue
  } catch (e) {
    console.error('addParamsForReturnValueToEvaluations error: ', e)
    throw new Error('addParamsForReturnValueToEvaluations error')
  }
}

const getAllEvaluations = async (evaluateeId: string): Promise<Evaluation[]> => {
  try {
    const res: { results: DBEvaluation[] } = await evaluations.filter({ evaluateeId, is_deleted: false })
    if (!res.results.length) return []
    const sortedResults = sortByCreatedAt(res.results)
    return addParamsForReturnValueToEvaluations(sortedResults, true)
  } catch (e) {
    console.error('getAllEvaluations error: ', e)
    throw new Error('getAllEvaluations error')
  }
}

const getPublishedEvaluations = async (evaluateeId: string): Promise<Evaluation[]> => {
  try {
    const res: { results: DBEvaluation[] } = await evaluations.filter({ evaluateeId, is_published: true, is_deleted: false })
    if (!res.results.length) return []
    const sortedResults = sortByCreatedAt(res.results)
    return addParamsForReturnValueToEvaluations(sortedResults, false)
  } catch (e) {
    console.error('getPublishedEvaluations error: ', e)
    throw new Error('getPublishedEvaluations error')
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
        return await getAllEvaluations(evaluateeId)
      }
      return await getPublishedEvaluations(evaluateeId)
    } catch (e) {
      console.error('getEvaluations error: ', e)
      throw new Error(errorMessages.evaluation.get)
    }
  } else {
    try {
      return await getPublishedEvaluations(evaluateeId)
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
      ...evaluation,
      is_published: isPublished ?? evaluation.props.is_published,
      is_deleted: isDeleted ?? evaluation.props.is_deleted,
    })
    if (isPublished) {
      await increaseUserAvarageEvaluation(evaluation.props.evaluateeId, evaluation.props)
    } else {
      await decreaseUserAvarageEvaluation(evaluation.props.evaluateeId, evaluation.props)
    }
    if (!!res) return { update: true }
    return { update: false }
  } catch (e) {
    console.error('updateEvaluation error: ', e)
    throw new Error(
      isDeleted ? errorMessages.evaluation.delete : isPublished ? errorMessages.evaluation.publish : errorMessages.evaluation.unpublish,
    )
  }
}

// FIXME: データ確認用なので最後に消す
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteAllEvaluations = async (): Promise<void> => {
  const usersList = await evaluations.list()
  const targetKeys: string[] = usersList.results.map((result: DBEvaluation) => result.key)
  targetKeys.forEach(async (key) => {
    await evaluations.delete(key)
  })
}

// FIXME: データ確認用なので最後に消す
// deleteAllEvaluations()
