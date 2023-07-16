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

const getKeyForUserIcon = (auth0Id: string, file: File): string => `user/${auth0Id}/${file.name}`
const getKeyForEvaluatorIcon = (evaluatorName: string, file: File): string => `evaluator/${evaluatorName}/${file.name}`

export const userUploadIconToS3 = async ({ file, token, auth0Id }: UserUploadIconToS3Arg): Promise<string | undefined> => {
  if (!file) return
  try {
    const formData = new FormData()
    formData.append('icon_file', file)
    const { uploadIcon } = await post<{ uploadIcon: boolean }, FormData>(
      `/s3/upload-icon/user/${auth0Id}`,
      formData,
      token,
      'multipart/form-data',
    )
    if (uploadIcon) return getKeyForUserIcon(auth0Id, file)
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
    const { uploadIcon } = await post<{ uploadIcon: boolean }, FormData>(
      `/s3/upload-icon/evaluator/${evaluatorName}`,
      formData,
      undefined,
      'multipart/form-data',
    )
    console.log(uploadIcon)
    if (uploadIcon) return getKeyForEvaluatorIcon(evaluatorName, file)
  } catch (e) {
    // TODO: エラー処理
    console.log(e)
  }
}
