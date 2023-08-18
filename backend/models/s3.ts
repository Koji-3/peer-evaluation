import { GetObjectCommandOutput, S3 } from '@aws-sdk/client-s3'
import { errorMessages } from '../const/errorMessages'

const s3 = new S3()

export const uploadIcon = async (file: Express.Multer.File, auth0id: string | null, evaluatorName: string | null): Promise<string> => {
  const iconBuffer = Buffer.from(file.buffer)
  const fileName = `${new Date().getTime()}.${file.mimetype.split('/')[1]}`
  const key = auth0id ? `user/${auth0id}/${fileName}` : `evaluator/${evaluatorName}/${fileName}`
  try {
    await s3.putObject({
      Body: iconBuffer,
      Bucket: process.env.CYCLIC_BUCKET_NAME || '',
      Key: key,
    })
    return key
  } catch (e) {
    console.error('uploadIcon error: ', e)
    throw new Error(errorMessages.icon.create)
  }
}

export const getIcon = async (key: string): Promise<GetObjectCommandOutput> => {
  try {
    const icon = await s3.getObject({
      Bucket: process.env.CYCLIC_BUCKET_NAME || '',
      Key: key,
    })
    return icon
  } catch (e) {
    console.error('getIcon error: ', e)
    throw new Error(errorMessages.icon.get)
  }
}
