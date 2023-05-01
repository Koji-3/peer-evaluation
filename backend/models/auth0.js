const { ManagementClient } = require('auth0');

const auth0ManagementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MANEGEMENT_API_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANEGEMENT_API_CLIENT_SECRET,
  scope: 'create:users read:users update:users delete:users'
})

const updateName = async (auth0id, newName) => {
  await auth0ManagementClient.updateUser({id: auth0id}, {name: newName}, async(e) => {
    if(e) throw e
  })
}

const updateEmail = async (auth0id, newEmail) => {
  await auth0ManagementClient.updateUser({id: auth0id}, {email: newEmail}, async(e) => {
    if(e) throw e
    // メールアドレス変更後に新しいメールアドレスにverificationメールを送る
    await auth0ManagementClient.sendEmailVerification({user_id: auth0id}, (e) => {
      if(e) throw e
    })
  })
}

const deleteUser = async (auth0id) => {
  // 退会処理でauth0上のデータは物理削除する
  await auth0ManagementClient.deleteUser({id: auth0id}, async(e) => {
    if(e) throw e
  })
}

exports.updateName = updateName
exports.updateEmail = updateEmail
exports.deleteUser = deleteUser
