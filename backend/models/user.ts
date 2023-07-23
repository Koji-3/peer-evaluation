import CyclicDb from '@cyclic.sh/dynamodb'
import shortUuid from 'short-uuid'
import crypto from 'crypto'
import { UserInput, DBUser, User, AverageEvaluation, DBEvaluation } from '../types/types'
import { errorMessages } from '../const/errorMessages'

const db = CyclicDb('motionless-crab-hoseCyclicDB')
const users = db.collection('users')

export const createUser = async (user: UserInput, auth0id: string): Promise<DBUser> => {
  const uuid = shortUuid.generate()
  const defaultAverageEvaluation: AverageEvaluation = { e1: 0, e2: 0, e3: 0, e4: 0, e5: 0, e6: 0 }
  const newUser: Omit<DBUser['props'], 'created'> = {
    ...user,
    is_deleted: false,
    auth0_id: auth0id,
    averageEvaluation: defaultAverageEvaluation,
    publishedEvaluationNum: 0,
    allEvaluationNum: 0,
  }
  try {
    const result = await users.set(uuid, newUser)
    return result
  } catch (e) {
    console.error('createUser error: ', e)
    throw new Error(errorMessages.user.create)
  }
}

export const getUserByAuth0Id = async (auth0Id: string): Promise<DBUser | null> => {
  try {
    const userbyAuth0Id: { results: DBUser[] } = await users.filter({ auth0_id: auth0Id })
    if (!userbyAuth0Id.results.length || userbyAuth0Id.results[0].props.is_deleted) {
      // FEで出し分けたいのでnullを返す
      return null
    }
    return userbyAuth0Id.results[0]
  } catch (e) {
    console.error('getUserByAuth0Id error: ', e)
    throw new Error(errorMessages.user.get)
  }
}

export const getUserById = async (id: string): Promise<User> => {
  try {
    const user: DBUser = await users.get(id)
    if (!user || user.props.is_deleted) {
      console.error('!user || user.props.is_deleted in getUserById')
      throw new Error(errorMessages.user.get)
    }
    return { ...user.props, id: user.key }
  } catch (e) {
    console.error('getUserById error: ', e)
    throw new Error(errorMessages.user.get)
  }
}

export const updateUser = async (auth0Id: string, newUser: UserInput): Promise<DBUser> => {
  try {
    const user = (await getUserByAuth0Id(auth0Id)) as DBUser
    const updatedUser = await users.set(user.key, newUser)
    return updatedUser
  } catch (e) {
    console.error('updateUser error: ', e)
    throw new Error(errorMessages.user.update)
  }
}

export const increaseUserAllEvaluationNum = async (userId: string): Promise<void> => {
  try {
    const user: DBUser = await users.get(userId)
    const { allEvaluationNum } = user.props
    const newAllEvaluationNum = allEvaluationNum + 1
    await users.set(user.key, { ...user, allEvaluationNum: newAllEvaluationNum })
  } catch (e) {
    console.error('increaseUserAllEvaluationNum error: ', e)
  }
}

export const increaseUserAvarageEvaluation = async (userId: string, evaluation: DBEvaluation['props']): Promise<void> => {
  try {
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
  } catch (e) {
    console.error('increaseUserAvarageEvaluation error: ', e)
  }
}

export const decreaseUserAvarageEvaluation = async (userId: string, evaluation: DBEvaluation['props']): Promise<void> => {
  try {
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
  } catch (e) {
    console.error('decreaseUserAvarageEvaluation error: ', e)
  }
}

export const deleteUser = async (auth0Id: string): Promise<DBUser> => {
  try {
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
  } catch (e) {
    console.error('deleteUser error: ', e)
    throw new Error(errorMessages.user.delete)
  }
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
