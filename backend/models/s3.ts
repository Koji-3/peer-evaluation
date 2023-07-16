import AWS from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'
const s3 = new AWS.S3()

export const uploadIcon = async (file: Express.Multer.File, auth0id: string | null, evaluatorName: string | null): Promise<string> => {
  const iconBuffer = Buffer.from(file.buffer)
  const fileName = `${new Date().getTime()}.${file.mimetype.split('/')[1]}`
  const key = auth0id ? `user/${auth0id}/${fileName}` : `evaluator/${evaluatorName}/${fileName}`
  await s3
    .putObject({
      Body: iconBuffer,
      Bucket: process.env.CYCLIC_BUCKET_NAME || '',
      Key: key,
    })
    .promise()
  return key
}

export const getIcon = async (key: string): Promise<PromiseResult<AWS.S3.GetObjectOutput, AWS.AWSError>> => {
  const icon = await s3
    .getObject({
      Bucket: process.env.CYCLIC_BUCKET_NAME || '',
      Key: key,
    })
    .promise()
  return icon
}
