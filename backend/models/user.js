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

const getUserByAuth0Id = async(auth0Id) => {
  const userbyAuth0Id = await users.filter({auth0_id: auth0Id})
  if(!userbyAuth0Id.results.length) return undefined
  // TODO: is_deletedがtrueのときの処理
  return userbyAuth0Id.results[0]
}

const getUserById = async(id) => {
  const user = await users.get(id)
  return user
}

const updateUser = async(id, user) => {
  if(!id || !user) return
  const {auth0_id, name, profile, icon_url, is_deleted} = user
  const updatedUser = await users.set(id, {
    auth0_id,
    name,
    profile,
    icon_url,
    is_deleted 
  })
  return updatedUser
}

// FIXME: データ確認用なので最後に消す
const getUserList = async() => {
  const usersList = await users.list()
  console.log('getUserList',usersList)
}

exports.createUser = createUser
exports.getUserByAuth0Id = getUserByAuth0Id
exports.getUserById = getUserById
exports.updateUser = updateUser

// FIXME: データ確認用なので最後に消す
getUserList()


