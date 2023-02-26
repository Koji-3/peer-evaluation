const AWS = require("aws-sdk");
const s3 = new AWS.S3()

const setTestFile = async() => {
  await s3.putObject({
      Body: JSON.stringify({key:"value"}),
      Bucket: "cyclic-motionless-crab-hose-us-west-1",
      Key: "some_files/my_file.json",
  }).promise()
}

setTestFile()