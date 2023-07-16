import { ManagementClient } from 'auth0'

const auth0ManagementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN || '',
  clientId: process.env.AUTH0_MANEGEMENT_API_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANEGEMENT_API_CLIENT_SECRET,
  scope: 'create:users read:users update:users delete:users',
})

export const updateName = (auth0id: string, newName: string): void => {
  auth0ManagementClient.updateUser({ id: auth0id }, { name: newName }, async (e) => {
    if (e) throw e
  })
}

export const updateEmail = (auth0id: string, newEmail: string): void => {
  auth0ManagementClient.updateUser({ id: auth0id }, { email: newEmail }, async (e) => {
    if (e) throw e
    // メールアドレス変更後に新しいメールアドレスにverificationメールを送る
    auth0ManagementClient.sendEmailVerification({ user_id: auth0id }, (e) => {
      if (e) throw e
    })
  })
}

export const deleteUser = (auth0id: string): void => {
  // 退会処理でauth0上のデータは物理削除する
  auth0ManagementClient.deleteUser({ id: auth0id }, async (e) => {
    if (e) throw e
  })
}
