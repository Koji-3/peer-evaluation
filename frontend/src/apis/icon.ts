import { get, post } from 'lib/axios'
import { errorMessages } from 'const/errorMessages'

type UserUploadIconToS3Arg = {
  file: File
  token: string
  auth0Id: string
}
type EvaluatorUploadIconToS3Arg = {
  file: File
  evaluatorName: string
}

export const userUploadIconToS3 = async ({ file, token }: UserUploadIconToS3Arg): Promise<string> => {
  if (!file) {
    throw new Error(errorMessages.icon.create)
  }
  try {
    const formData = new FormData()
    formData.append('icon_file', file)
    const { key, error } = await post<{ key: string | null; error?: string }, FormData>(
      '/s3/upload-icon/user',
      formData,
      token,
      'multipart/form-data',
    )
    if (!key) {
      throw new Error(error)
    }
    return key
  } catch (e) {
    throw new Error(errorMessages.icon.create)
  }
}

export const evaluatorUploadIconToS3 = async ({ file, evaluatorName }: EvaluatorUploadIconToS3Arg): Promise<string> => {
  if (!file) {
    throw new Error(errorMessages.icon.create)
  }
  try {
    const formData = new FormData()
    formData.append('icon_file', file)
    const { key, error } = await post<{ key: string | null; error?: string }, FormData>(
      `/s3/upload-icon/evaluator/${evaluatorName}`,
      formData,
      undefined,
      'multipart/form-data',
    )
    if (!key) {
      throw new Error(error)
    }
    return key
  } catch (e) {
    throw new Error(errorMessages.icon.create)
  }
}

export const fetchIconUrl = async (iconKey: string): Promise<string> => {
  try {
    const { imageSrc, error } = await get<{ imageSrc: string | null; error?: string }, { key: string }>('/s3/get-icon', undefined, {
      key: iconKey,
    })
    if (!imageSrc) {
      throw new Error(error)
    }
    return imageSrc
  } catch (e) {
    throw new Error(errorMessages.icon.get)
  }
}
