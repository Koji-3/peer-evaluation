import { post } from 'lib/axios'
type UserUploadIconToS3Arg = {
  file: File
  token: string
  auth0Id: string
}
type EvaluatorUploadIconToS3Arg = {
  file: File
  evaluatorName: string
}

export const userUploadIconToS3 = async ({ file, token, auth0Id }: UserUploadIconToS3Arg): Promise<string | undefined> => {
  if (!file) return
  try {
    const formData = new FormData()
    formData.append('icon_file', file)
    const { key } = await post<{ key: string | null }, FormData>(`/s3/upload-icon/user/${auth0Id}`, formData, token, 'multipart/form-data')
    if (key) return key
  } catch (e) {
    // TODO: エラー処理
    console.log(e)
  }
}

export const evaluatorUploadIconToS3 = async ({ file, evaluatorName }: EvaluatorUploadIconToS3Arg): Promise<string | undefined> => {
  if (!file) return
  try {
    const formData = new FormData()
    formData.append('icon_file', file)
    const { key } = await post<{ key: string | null }, FormData>(
      `/s3/upload-icon/evaluator/${evaluatorName}`,
      formData,
      undefined,
      'multipart/form-data',
    )
    if (key) return key
  } catch (e) {
    // TODO: エラー処理
    console.log(e)
  }
}
