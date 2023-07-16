import CyclicDb from '@cyclic.sh/dynamodb'
import shortUuid from 'short-uuid'
import crypto from 'crypto'
import { UserInput, DBUser, User, AverageEvaluation, DBEvaluation } from '../types/types'

const db = CyclicDb('motionless-crab-hoseCyclicDB')
const users = db.collection('users')

export const createUser = async (user: UserInput, auth0id: string): Promise<DBUser | undefined> => {
  const uuid = shortUuid.generate()
  if (!user) return undefined
  const defaultAverageEvaluation: AverageEvaluation = { e1: 0, e2: 0, e3: 0, e4: 0, e5: 0, e6: 0 }
  const newUser: Omit<DBUser['props'], 'created'> = {
    ...user,
    is_deleted: false,
    auth0_id: auth0id,
    averageEvaluation: defaultAverageEvaluation,
    publishedEvaluationNum: 0,
    allEvaluationNum: 0,
  }
  const result = await users.set(uuid, newUser)
  return result
}

export const getUserByAuth0Id = async (auth0Id: string): Promise<DBUser | undefined> => {
  const userbyAuth0Id = await users.filter({ auth0_id: auth0Id })
  if (!userbyAuth0Id.results.length) return undefined
  // TODO: is_deletedがtrueのときの処理
  return userbyAuth0Id.results[0]
}

export const getUserById = async (id: string): Promise<User | undefined> => {
  const user: DBUser = await users.get(id)
  // TODO: そのidのユーザーがいないときの処理
  // TODO: is_deletedがtrueのときの処理
  return { ...user.props, id: user.key }
}

export const updateUser = async (auth0Id: string, newUser: UserInput): Promise<DBUser | undefined> => {
  const user = (await getUserByAuth0Id(auth0Id)) as DBUser
  const updatedUser = await users.set(user.key, newUser)
  return updatedUser
}

export const increaseUserAllEvaluationNum = async (userId: string): Promise<void> => {
  const user: DBUser = await users.get(userId)
  const { allEvaluationNum } = user.props
  const newAllEvaluationNum = allEvaluationNum + 1
  await users.set(user.key, { ...user, allEvaluationNum: newAllEvaluationNum })
}

export const increaseUserAvarageEvaluation = async (userId: string, evaluation: DBEvaluation['props']): Promise<void> => {
  const user: DBUser = await users.get(userId)
  const { averageEvaluation, publishedEvaluationNum } = user.props
  const newAverageEvaluation = {
    e1: Math.round(((averageEvaluation.e1 * publishedEvaluationNum + evaluation.e1.point) / (publishedEvaluationNum + 1)) * 10) / 10,
    e2: Math.round(((averageEvaluation.e2 * publishedEvaluationNum + evaluation.e2.point) / (publishedEvaluationNum + 1)) * 10) / 10,
    e3: Math.round(((averageEvaluation.e3 * publishedEvaluationNum + evaluation.e3.point) / (publishedEvaluationNum + 1)) * 10) / 10,
    e4: Math.round(((averageEvaluation.e4 * publishedEvaluationNum + evaluation.e4.point) / (publishedEvaluationNum + 1)) * 10) / 10,
    e5: Math.round(((averageEvaluation.e5 * publishedEvaluationNum + evaluation.e5.point) / (publishedEvaluationNum + 1)) * 10) / 10,
    e6: Math.round(((averageEvaluation.e6 * publishedEvaluationNum + evaluation.e6.point) / (publishedEvaluationNum + 1)) * 10) / 10,
  }
  const newPublishedEvaluationNum = publishedEvaluationNum + 1
  await users.set(user.key, { ...user, averageEvaluation: newAverageEvaluation, publishedEvaluationNum: newPublishedEvaluationNum })
}

export const decreaseUserAvarageEvaluation = async (userId: string, evaluation: DBEvaluation['props']): Promise<void> => {
  const user: DBUser = await users.get(userId)
  const { averageEvaluation, publishedEvaluationNum } = user.props
  const newAverageEvaluation = {
    e1: Math.round(((averageEvaluation.e1 * publishedEvaluationNum - evaluation.e1.point) / (publishedEvaluationNum - 1)) * 10) / 10,
    e2: Math.round(((averageEvaluation.e2 * publishedEvaluationNum - evaluation.e2.point) / (publishedEvaluationNum - 1)) * 10) / 10,
    e3: Math.round(((averageEvaluation.e3 * publishedEvaluationNum - evaluation.e3.point) / (publishedEvaluationNum - 1)) * 10) / 10,
    e4: Math.round(((averageEvaluation.e4 * publishedEvaluationNum - evaluation.e4.point) / (publishedEvaluationNum - 1)) * 10) / 10,
    e5: Math.round(((averageEvaluation.e5 * publishedEvaluationNum - evaluation.e5.point) / (publishedEvaluationNum - 1)) * 10) / 10,
    e6: Math.round(((averageEvaluation.e6 * publishedEvaluationNum - evaluation.e6.point) / (publishedEvaluationNum - 1)) * 10) / 10,
  }
  const newPublishedEvaluationNum = publishedEvaluationNum - 1
  await users.set(user.key, { ...user, averageEvaluation: newAverageEvaluation, publishedEvaluationNum: newPublishedEvaluationNum })
}

export const deleteUser = async (auth0Id: string): Promise<DBUser | undefined> => {
  const user = (await getUserByAuth0Id(auth0Id)) as DBUser
  const uuid = crypto.randomUUID()

  // 退会処理でdynamoDB上のデータは論理削除する
  const deletedUser = await users.set(user.key, {
    auth0_id: uuid, // auth0_idは一意のidを生成
    name: '退会済みユーザー',
    profile: '',
    icon_key: '',
    is_deleted: true,
  })
  return deletedUser
}

// FIXME: データ確認用なので最後に消す
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUserList = async (): Promise<any> => {
  const usersList = await users.list()
  console.log('getUserList', usersList)
}

// FIXME: データ確認用なので最後に消す
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteAllUser = async (): Promise<void> => {
  const usersList = await users.list()
  const targetKeys: string[] = usersList.results.map((result: DBUser) => result.key)
  targetKeys.forEach(async (key) => {
    await users.delete(key)
  })
}

// FIXME: データ確認用なので最後に消す
// deleteAllUser()
getUserList()
