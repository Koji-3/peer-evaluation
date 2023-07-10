const AWS = require("aws-sdk");
const s3 = new AWS.S3()

const uploadIcon = async(file,  auth0id) => {
  console.log('uploadIcon model!!!', file, `${auth0id}/${file.originalname}`)
  const iconBuffer = Buffer.from(file.buffer)
  const result = await s3.putObject({
      Body: iconBuffer,
      Bucket: process.env.CYCLIC_BUCKET_NAME,
      Key: `${auth0id}/${file.originalname}`,
  }).promise()
  return result
}

const getIcon = async(key) => {
  const icon = await s3.getObject({
      Bucket: process.env.CYCLIC_BUCKET_NAME,
      Key: key,
  }).promise()
  return icon
}

exports.uploadIcon = uploadIcon
exports.getIcon = getIcon
