import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { UserEditTpl, Layout } from 'components/templates'

/* lib, types, apis */
import { validateIcon, validateEmail } from 'lib/validate'
import { User, Auth0AuthenticatedBy } from 'types/types'
import { fetchUser, updateEmail, updateUser as updateUserApi, deleteUser as deleteUserApi } from 'apis/user'
import { fetchIconUrl, userUploadIconToS3 } from 'apis/icon'

export const UserEdit: React.FC = () => {
  const [userInput, setUserInput] = useState<User>()
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [iconFile, setIconFile] = useState<File>()
  const [iconObjectUrl, setIconObjectUrl] = useState<string>('')
  const [iconInputError, setIconInputError] = useState<string | null>(null)
  const [isIconChanged, setIsIconChanged] = useState<boolean>(false)
  const { isLoading, user: auth0User, isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0()
  const params = useParams()
  const navigate = useNavigate()

  const authenticatedBy = (auth0Id: string): Auth0AuthenticatedBy => {
    if (auth0Id.startsWith('google')) return 'google'
    return 'auth0'
  }

  const shouldShowEmailInput = (auth0User?.sub && authenticatedBy(auth0User.sub) === 'auth0') || false

  const onChangeUserInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void => {
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
      setIsIconChanged(true)
    }
  }

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target
    setEmail(value)
    const error = validateEmail(value)
    setEmailError(error)
  }

  const login = (): void => {
    loginWithRedirect()
  }

  const updateUser = async (): Promise<void> => {
    if (!auth0User || !userInput) return

    try {
      const { name, profile } = userInput
      const token = await getAccessTokenSilently()
      if (isIconChanged && iconFile) {
        const iconKey = await userUploadIconToS3({ file: iconFile, token })
        await updateUserApi({ name, profile, icon_key: iconKey }, token)
      } else {
        await updateUserApi({ name, profile }, token)
      }
      console.log(!!email && email !== auth0User?.email)
      if (!!email && email !== auth0User?.email) {
        await updateEmail(email, token)
        navigate('/')
      } else {
        // TODO: プロフィールの編集が完了しました表示
        navigate(`/user/${params.id}`)
      }
    } catch (e) {
      // TODO: エラー処理
      console.log('iconkey error', e)
    }
  }

  const deleteUser = async (): Promise<void> => {
    try {
      const token = await getAccessTokenSilently()
      await deleteUserApi(token)
      // TODO: ホームに遷移して「退会しました」のアラート出す
      navigate('/')
    } catch (e) {
      // TODO: エラー処理
      console.log('iconkey error', e)
    }
  }

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      // TODO: ホームに遷移して「ログインしてください」のアラート出す
      navigate('/')
    }
    ;(async () => {
      if (!auth0User || !auth0User.email || !auth0User.sub) {
        // TODO: データ取得失敗のアラート出す
        return
      }
      try {
        const user = await fetchUser(params.id)
        const iconUrl = await fetchIconUrl(user.icon_key)
        setUserInput(user)
        setIconObjectUrl(iconUrl)
        setEmail(auth0User.email)
      } catch (e) {
        // TODO: データ取得失敗のアラート出す
        console.log(e)
      }
    })()
  }, [auth0User, isAuthenticated, isLoading, navigate, params.id])

  return (
    <Layout>
      {userInput && (
        <UserEditTpl
          userInput={userInput}
          email={email}
          emailError={emailError}
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
    </Layout>
  )
}
