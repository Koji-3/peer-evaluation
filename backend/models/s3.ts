import AWS from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'
const s3 = new AWS.S3()

export const uploadIcon = async (
  file: Express.Multer.File,
  auth0id: string | null,
  evaluatorName: string | null,
): Promise<PromiseResult<AWS.S3.GetObjectOutput, AWS.AWSError>> => {
  const iconBuffer = Buffer.from(file.buffer)
  const result = await s3
    .putObject({
      Body: iconBuffer,
      Bucket: process.env.CYCLIC_BUCKET_NAME || '',
      Key: auth0id ? `user/${auth0id}/${file.originalname}` : `evaluator/${evaluatorName}/${file.originalname}`,
    })
    .promise()
  return result
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
