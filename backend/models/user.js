const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("motionless-crab-hoseCyclicDB")
const shortUuid = require('short-uuid')
const crypto = require("crypto");

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
  // TODO: is_deletedがtrueのときの処理
  return user
}

const updateUser = async(auth0Id, newUser) => {
  if(!newUser) return
  const user = await getUserByAuth0Id(auth0Id)
  const {auth0_id, name, profile, icon_url, is_deleted} = newUser
  const updatedUser = await users.set(user.key, {
    auth0_id,
    name,
    profile,
    icon_url,
    is_deleted 
  })
  return updatedUser
}

const deleteUser = async(auth0Id) => {
  const user = await getUserByAuth0Id(auth0Id)
  const uuid = crypto.randomUUID()
  
  // 退会処理でdynamoDB上のデータは論理削除する
  const deletedUser = await users.set(user.key, {
    auth0_id: uuid, // auth0_idは一意のidを生成
    name: '退会済みユーザー',
    profile: '',
    icon_url: '',
    is_deleted: true
  })
  return deletedUser
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
exports.deleteUser = deleteUser

// FIXME: データ確認用なので最後に消す
getUserList()


