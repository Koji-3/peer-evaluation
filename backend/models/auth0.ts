import { ManagementClient } from 'auth0'
import { errorMessages } from '../const/errorMessages'

const auth0ManagementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN || '',
  clientId: process.env.AUTH0_MANEGEMENT_API_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANEGEMENT_API_CLIENT_SECRET,
  scope: 'create:users read:users update:users delete:users',
})

export const updateName = (auth0id: string, newName: string): void => {
  auth0ManagementClient.updateUser({ id: auth0id }, { name: newName }, (e) => {
    if (e) {
      console.error('updateUser error', e)
      throw new Error(errorMessages.user.update)
    }
  })
}

export const updateEmail = (auth0id: string, newEmail: string): void => {
  auth0ManagementClient.updateUser({ id: auth0id }, { email: newEmail }, (e) => {
    if (e) {
      console.error('updateUser error', e)
      throw new Error(errorMessages.user.updateEmail)
    }
    // メールアドレス変更後に新しいメールアドレスにverificationメールを送る
    auth0ManagementClient.sendEmailVerification({ user_id: auth0id }, (e) => {
      if (e) {
        console.error('sendEmailVerification error', e)
        throw new Error(errorMessages.user.updateEmail)
      }
    })
  })
}

export const deleteUser = (auth0id: string): void => {
  // 退会処理でauth0上のデータは物理削除する
  auth0ManagementClient.deleteUser({ id: auth0id }, (e) => {
    if (e) {
      console.error('deleteUser error', e)
      throw new Error(errorMessages.user.delete)
    }
  })
}
