import CyclicDb from '@cyclic.sh/dynamodb'
import crypto from 'crypto'
import { EvaluationInput, DBEvaluation } from '../types/types'

const db = CyclicDb('motionless-crab-hoseCyclicDB')
const evaluations = db.collection('evaluations')

export const createEvaluation = async (evaluation: EvaluationInput): Promise<DBEvaluation | undefined> => {
  const uuid = crypto.randomUUID()
  if (!evaluation) return
  const newEvaluation = await evaluations.set(uuid, evaluation)
  return newEvaluation
}

// export const getEvaluation = async(): Promise<any> => {
//   const testEvaluation = await evaluations.get("test_evaluation1")
//   console.log('get', testEvaluation)
// }

// export const getAllEvaluationsByUser = async(): Promise<any> => {
//   const evaluationsByUser = await evaluations.filter({user_id: 'test1', is_deleted: false})
//   console.log('getEvaluationsByUser', evaluationsByUser)
// }

// export const getPublishedEvaluationsByUser = async(): Promise<any> => {
//   const evaluationsByUser = await evaluations.filter({user_id: 'test1', is_published: true, is_deleted: false})
//   console.log('getEvaluationsByUser', evaluationsByUser)
// }
