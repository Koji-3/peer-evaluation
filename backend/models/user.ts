import CyclicDb from '@cyclic.sh/dynamodb'
import shortUuid from 'short-uuid'
import crypto from 'crypto'
import { UserInput, DBUser, User, DBEvaluation, AverageEvaluation } from '../types/types'
import { getAllEvaluations, getPublishedEvaluations } from './evaluation'
import { errorMessages } from '../const/errorMessages'
import { roundToFirstDecimal } from '../lib/lib'

const db = CyclicDb('motionless-crab-hoseCyclicDB')
const users = db.collection('users')

type UpdateUserArg = {
  name: string
  profile: string
  icon_key?: string
}

export const createUser = async (user: UserInput, auth0id: string): Promise<DBUser> => {
  const uuid = shortUuid.generate()
  const newUser: Omit<DBUser['props'], 'created'> = {
    ...user,
    is_deleted: false,
    auth0_id: auth0id,
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
    const initialAverageEvaluation: AverageEvaluation = {
      e1: 0,
      e2: 0,
      e3: 0,
      e4: 0,
      e5: 0,
      e6: 0,
    }
    const allEvaluations = await getAllEvaluations(id)
    if (!allEvaluations.length) {
      return {
        ...user.props,
        id: user.key,
        allEvaluationNum: allEvaluations.length,
        publishedEvaluationNum: 0,
        averageEvaluation: initialAverageEvaluation,
      }
    }
    const publishedEvaluations = await getPublishedEvaluations(id)
    if (!publishedEvaluations.length) {
      return {
        ...user.props,
        id: user.key,
        allEvaluationNum: allEvaluations.length,
        publishedEvaluationNum: publishedEvaluations.length,
        averageEvaluation: initialAverageEvaluation,
      }
    }
    const e1values = publishedEvaluations.map((evaluation: DBEvaluation) => evaluation.props.e1.point)
    const e2values = publishedEvaluations.map((evaluation: DBEvaluation) => evaluation.props.e2.point)
    const e3values = publishedEvaluations.map((evaluation: DBEvaluation) => evaluation.props.e3.point)
    const e4values = publishedEvaluations.map((evaluation: DBEvaluation) => evaluation.props.e4.point)
    const e5values = publishedEvaluations.map((evaluation: DBEvaluation) => evaluation.props.e5.point)
    const e6values = publishedEvaluations.map((evaluation: DBEvaluation) => evaluation.props.e6.point)
    const sumReducer = (sum: number, currentValue: number): number => sum + currentValue
    const averageEvaluation: AverageEvaluation = {
      e1: roundToFirstDecimal(e1values.reduce(sumReducer) / e1values.length),
      e2: roundToFirstDecimal(e2values.reduce(sumReducer) / e2values.length),
      e3: roundToFirstDecimal(e3values.reduce(sumReducer) / e3values.length),
      e4: roundToFirstDecimal(e4values.reduce(sumReducer) / e4values.length),
      e5: roundToFirstDecimal(e5values.reduce(sumReducer) / e5values.length),
      e6: roundToFirstDecimal(e6values.reduce(sumReducer) / e6values.length),
    }
    return {
      ...user.props,
      id: user.key,
      allEvaluationNum: allEvaluations.length,
      publishedEvaluationNum: publishedEvaluations.length,
      averageEvaluation,
    }
  } catch (e) {
    console.error('getUserById error: ', e)
    throw new Error(errorMessages.user.get)
  }
}

export const updateUser = async (auth0Id: string, newUser: UpdateUserArg): Promise<DBUser> => {
  try {
    const user = (await getUserByAuth0Id(auth0Id)) as DBUser
    const updatedUser = await users.set(user.key, newUser)
    return updatedUser
  } catch (e) {
    console.error('updateUser error: ', e)
    throw new Error(errorMessages.user.update)
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
