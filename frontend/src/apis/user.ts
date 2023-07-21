import { get, put, deleteData } from 'lib/axios'
import { User, Evaluation } from 'types/types'

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

export const fetchIconUrl = async (iconKey: string): Promise<string> => {
  try {
    const { imageSrc } = await get<{ imageSrc: string }, { key: string }>('/s3/get-icon', undefined, { key: iconKey })
    if (!imageSrc) {
      throw new Error('データの取得に失敗しました')
    }
    return imageSrc
  } catch (e) {
    throw new Error('データの取得に失敗しました')
  }
}
