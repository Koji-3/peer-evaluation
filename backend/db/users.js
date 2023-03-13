const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("motionless-crab-hoseCyclicDB")

const users = db.collection("users")

export const setUser = async() => {
  // FIXME: "test"はuser IDで、UUIDになる想定。
  const id1User = await users.set("test1", {
    auth0_id : 'test_auth01',
    name: 'Ayaka1',
    profile: 'テストテスト',
    icon_url: '',
    is_deleted: false  
  })
  console.log('id1User', id1User)
}

export const getUser = async() => {
  const testUser = await users.get("test")
  console.log('id1User', testUser)
}


