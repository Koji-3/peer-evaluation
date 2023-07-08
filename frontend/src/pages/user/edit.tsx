import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { UserEditTpl, AuthWrapper, Layout } from 'components/templates'

/* lib, types */
import { get, put, deleteData } from 'lib/axios'
import { validateIcon } from 'lib/validate'
import { DBUser, User, Auth0AuthenticatedBy } from 'types/types'

// FIXME: 仮
import { fixtureUser } from '__fixtures__/user'

export const UserEdit: React.FC = () => {
  const [userInput, setUserInput] = useState<User>()
  const [email, setEmail] = useState<string>('')
  const [iconFile, setIconFile] = useState<File>()
  const [iconObjectUrl, setIconObjectUrl] = useState<string>('')
  const [iconInputError, setIconInputError] = useState<string | null>(null)
  const { isLoading, user: auth0User, loginWithRedirect, getAccessTokenSilently } = useAuth0()
  const params = useParams()
  const navigate = useNavigate()

  const authenticatedBy = (auth0Id: string): Auth0AuthenticatedBy => {
    if (auth0Id.startsWith('google')) return 'google'
    return 'auth0'
  }

  const shouldShowEmailInput = (auth0User?.sub && authenticatedBy(auth0User.sub) === 'auth0') || false

  const onChangeUserInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    if (!userInput) return
    setUserInput({ ...userInput, [name]: value })
  }

  const onChangeIconInput = (file: File): void => {
    const error = validateIcon(file)
    setIconInputError(error)
    if (!error) {
      setIconObjectUrl(URL.createObjectURL(file))
      // 後でs3にアップするためにセット
      setIconFile(file)
    }
  }

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
  }

  const updateEmail = async (): Promise<void> => {
    if (!auth0User || !auth0User.sub) return

    const token = await getAccessTokenSilently()
    const res = await put<{ user: DBUser }, { email: string }>(`/user/update-email/${auth0User.sub}`, { email }, token)
    if (res) {
      // TODO: メールアドレスを変更するとAuth0側で自動でログアウトされるのでホームに遷移して新しいメールアドレスでログインしてください的なアラート出す
      navigate('/')
    } else {
      // TODO: メールアドレス変更に失敗したときの処理
    }
  }

  const login = (): void => {
    loginWithRedirect()
  }

  const updateUser = async (): Promise<void> => {
    // TODO: s3
    console.log(iconFile)
    if (!auth0User || !auth0User.sub || !userInput) return

    const token = await getAccessTokenSilently()
    const res = await put<{ updateEmail: boolean }, { user: User }>(`/user/update/${auth0User.sub}`, { user: userInput }, token)

    if (!!email && email !== auth0User?.email) {
      await updateEmail()
      return
    } else {
      if (res) {
        console.log(res)
        // TODO: 変更しました的なアラート
      }
    }
  }

  const deleteUser = async (): Promise<void> => {
    if (!auth0User || !auth0User.sub) return

    const token = await getAccessTokenSilently()
    const res = await deleteData<{ deleteUser: boolean }>(`/user/${auth0User.sub}`, token)

    if (res) {
      // TODO: ホームに遷移して「退会しました」のアラート出す
      navigate('/')
    } else {
      // TODO: メールアドレス変更に失敗したときの処理
    }
  }

  useEffect(() => {
    if (isLoading) return
    if (!auth0User || !auth0User.email || !auth0User.sub) {
      // TODO: データ取得失敗のアラート出す
      // return
    }
    ;(async () => {
      const res = await get<{ user: DBUser | null }>(`/user/${params.id}`)
      if (!res.user) {
        // TODO: データ取得失敗のアラートだす
        // return
      }
      // setUserInput(res.user.props)
      setUserInput(fixtureUser)
      // setEmail(auth0User?.email || '')
      setEmail('bayakau.tka@gmail.com')
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <Layout>
      {/* TODO: auth */}
      {/* <AuthWrapper> */}
      {userInput && (
        <UserEditTpl
          userInput={userInput}
          email={email}
          shouldShowEmailInput={shouldShowEmailInput}
          iconObjectUrl={iconObjectUrl}
          iconInputError={iconInputError}
          onChangeUserInput={onChangeUserInput}
          onChangeIconInput={onChangeIconInput}
          onChangeEmail={onChangeEmail}
          login={login}
          updateUser={updateUser}
          deleteUser={deleteUser}
        />
      )}
      {/* </AuthWrapper> */}
    </Layout>
  )
}
