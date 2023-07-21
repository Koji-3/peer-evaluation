import { get, post } from 'lib/axios'
import { User, DBUser, UserInput } from 'types/types'

export const fetchUser = async (id?: string): Promise<User> => {
  if (!id) throw new Error('データの取得に失敗しました')
  try {
    const { user } = await get<{ user: User | null }>(`/user/${id}`)
    if (!user) {
      throw new Error('データの取得に失敗しました')
    }
    return user
  } catch (e) {
    throw new Error('データの取得に失敗しました')
  }
}

export const fetchUserByAuth0Id = async (token: string, auth0Id?: string): Promise<DBUser | null> => {
  if (!auth0Id) throw new Error('データの取得に失敗しました')
  try {
    const { user } = await get<{ user: DBUser | null }>(`/user/auth/${auth0Id}`, token)
    return user
  } catch (e) {
    throw new Error('データの取得に失敗しました')
  }
}

export const createUser = async (auth0UserId: string, user: UserInput, token: string): Promise<DBUser> => {
  try {
    const { user: resUser } = await post<{ user: DBUser }, { user: UserInput }>(`/user/signup/${auth0UserId}`, { user }, token)
    return resUser
  } catch (e) {
    throw new Error('登録に失敗しました')
  }
}
