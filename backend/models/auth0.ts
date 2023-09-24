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
      // auth0の名前の更新に失敗しても致命的ではないのでエラーを投げない
      console.error('updateUser error', e)
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateEmail = (auth0id: string, newEmail: string, res: Record<string, any>): void => {
  auth0ManagementClient.updateUser({ id: auth0id }, { email: newEmail }, (e) => {
    if (e) {
      console.error('updateEmail error', e.message)
      if (e.message.includes(errorMessages.auth0.emailAlreadyExists)) {
        return res.json({ updateEmail: false, error: errorMessages.user.emailAlreadyExists })
      }
      return res.json({ updateEmail: false, error: errorMessages.user.updateEmail })
    }
    return res.json({ updateEmail: true })
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

export const getAuth0ManagementClient = (): ManagementClient => auth0ManagementClient
