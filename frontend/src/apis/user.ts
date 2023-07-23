import { get, post } from 'lib/axios'
import { User, DBUser, UserInput } from 'types/types'
import { errorMessages } from 'const/errorMessages'

export const fetchUser = async (id?: string): Promise<User> => {
  if (!id) throw new Error('データの取得に失敗しました')
  try {
    const { user, error } = await get<{ user: User | null; error?: string }>(`/user/${id}`)
    if (!user) {
      throw new Error(error)
    }
    return user
  } catch (e) {
    throw new Error(errorMessages.user.get)
  }
}

export const fetchUserByAuth0Id = async (token: string): Promise<DBUser | null> => {
  try {
    const { user, error } = await get<{ user: DBUser | null; error?: string }>('/user/auth0', token)
    if (error) {
      throw new Error(error)
    }
    return user
  } catch (e) {
    throw new Error(errorMessages.user.get)
  }
}

export const createUser = async (user: UserInput, token: string): Promise<DBUser> => {
  try {
    const { user: resUser, error } = await post<{ user: DBUser; error?: string }, { user: UserInput }>('/user/signup', { user }, token)
    if (!resUser) {
      throw new Error(error)
    }
    return resUser
  } catch (e) {
    throw new Error(errorMessages.user.create)
  }
}
