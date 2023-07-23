import AWS from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'
import { errorMessages } from '../const/errorMessages'

const s3 = new AWS.S3()

export const uploadIcon = async (file: Express.Multer.File, auth0id: string | null, evaluatorName: string | null): Promise<string> => {
  const iconBuffer = Buffer.from(file.buffer)
  const fileName = `${new Date().getTime()}.${file.mimetype.split('/')[1]}`
  const key = auth0id ? `user/${auth0id}/${fileName}` : `evaluator/${evaluatorName}/${fileName}`
  try {
    await s3
      .putObject({
        Body: iconBuffer,
        Bucket: process.env.CYCLIC_BUCKET_NAME || '',
        Key: key,
      })
      .promise()
    return key
  } catch (e) {
    console.error('uploadIcon error: ', e)
    throw new Error(errorMessages.icon.create)
  }
}

export const getIcon = async (key: string): Promise<PromiseResult<AWS.S3.GetObjectOutput, AWS.AWSError>> => {
  try {
    const icon = await s3
      .getObject({
        Bucket: process.env.CYCLIC_BUCKET_NAME || '',
        Key: key,
      })
      .promise()
    return icon
  } catch (e) {
    console.error('getIcon error: ', e)
    throw new Error(errorMessages.icon.get)
  }
}
