import { get, post, put, deleteData } from 'lib/axios'
import { User, DBUser, UserInput } from 'types/types'
import { errorMessages } from 'const/errorMessages'

type UpdateUserArg = {
  name: string
  profile: string
  icon_key?: string
}

export const fetchUser = async (id?: string): Promise<User> => {
  if (!id) throw new Error(errorMessages.user.get)
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

export const updateEmail = async (email: string, token: string): Promise<boolean> => {
  try {
    const { updateEmail, error } = await put<{ updateEmail: boolean; error?: string }, { email: string }>(
      `/user/update-email`,
      { email },
      token,
    )
    if (!updateEmail) {
      throw new Error(error)
    }
    return updateEmail
  } catch (e) {
    throw new Error(errorMessages.user.updateEmail)
  }
}

export const updateUser = async (newUser: UpdateUserArg, token: string): Promise<DBUser> => {
  try {
    const { user: resUser, error } = await put<{ user: DBUser | null; error?: string }, { newUser: UpdateUserArg }>(
      `/user/update`,
      { newUser },
      token,
    )
    if (!resUser) {
      throw new Error(error)
    }
    return resUser
  } catch (e) {
    throw new Error(errorMessages.user.update)
  }
}

export const deleteUser = async (token: string): Promise<boolean> => {
  try {
    const { deleteUser, error } = await deleteData<{ deleteUser: boolean; error?: string }>(`/user/delete`, token)
    if (!deleteUser) {
      throw new Error(error)
    }
    return deleteUser
  } catch (e) {
    throw new Error(errorMessages.user.delete)
  }
}
