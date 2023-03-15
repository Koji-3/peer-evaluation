const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("motionless-crab-hoseCyclicDB")
const shortUuid = require('short-uuid')

const users = db.collection("users")

const createUser = async(user) => {
  const uuid = shortUuid.generate()
  if(!user) return
  const {auth0_id, name, profile, icon_url, is_deleted} = user
  const newUser = await users.set(uuid, {
    auth0_id,
    name,
    profile,
    icon_url,
    is_deleted 
  })
  return newUser
}

const getUserbyAuth0Id = async(auth0Id) => {
  const userbyAuth0Id = await users.filter({auth0_id: auth0Id})
  if(!userbyAuth0Id.results.length) return undefined
  // TODO: is_deletedがtrueのときの処理
  return userbyAuth0Id.results[0]
}
// データ確認用。
const getUserList = async() => {
  const usersList = await users.list()
  console.log('getUserList',usersList.results[0].props)
}

exports.createUser = createUser
exports.getUserbyAuth0Id = getUserbyAuth0Id


