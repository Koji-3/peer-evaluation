const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("motionless-crab-hoseCyclicDB")
const shortUuid = require('short-uuid')
const { getAuth0UserInfo } = require('./auth0')

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

const getUserByAuth0Id = async(auth0Id) => {
  const userbyAuth0Id = await users.filter({auth0_id: auth0Id})
  if(!userbyAuth0Id.results.length) return undefined
  // TODO: is_deletedがtrueのときの処理
  return userbyAuth0Id.results[0]
}

const getUserByAuth0Token = async(token) => {
  console.log("token", token)
  const auth0User = await getAuth0UserInfo(token)
  console.log("auth0User", auth0User)
  const user = await getUserByAuth0Id(auth0User.sub)
  console.log("user", user)
  return user
}

// データ確認用。
const getUserList = async() => {
  const usersList = await users.list()
  console.log('getUserList',usersList.results[0].props)
}

exports.createUser = createUser
exports.getUserByAuth0Id = getUserByAuth0Id
exports.getUserByAuth0Token = getUserByAuth0Token


