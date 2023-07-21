import { get, post } from 'lib/axios'
type UserUploadIconToS3Arg = {
  file: File
  token: string
  auth0Id: string
}
type EvaluatorUploadIconToS3Arg = {
  file: File
  evaluatorName: string
}

export const userUploadIconToS3 = async ({ file, token, auth0Id }: UserUploadIconToS3Arg): Promise<string> => {
  if (!file) throw new Error('登録に失敗しました')
  try {
    const formData = new FormData()
    formData.append('icon_file', file)
    const { key } = await post<{ key: string | null }, FormData>(`/s3/upload-icon/user/${auth0Id}`, formData, token, 'multipart/form-data')
    if (!key) throw new Error('登録に失敗しました')
    return key
  } catch (e) {
    throw new Error('登録に失敗しました')
  }
}

export const evaluatorUploadIconToS3 = async ({ file, evaluatorName }: EvaluatorUploadIconToS3Arg): Promise<string> => {
  if (!file) throw new Error('アイコンの登録に失敗しました')
  try {
    const formData = new FormData()
    formData.append('icon_file', file)
    const { key } = await post<{ key: string | null }, FormData>(
      `/s3/upload-icon/evaluator/${evaluatorName}`,
      formData,
      undefined,
      'multipart/form-data',
    )
    if (!key) throw new Error('アイコンの登録に失敗しました')
    return key
  } catch (e) {
    throw new Error('アイコンの登録に失敗しました')
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
