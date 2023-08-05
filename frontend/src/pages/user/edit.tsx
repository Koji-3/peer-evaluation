import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { UserEditTpl, Layout } from 'components/templates'

/* lib, types, apis */
import { validateIcon, validateEmail } from 'lib/validate'
import { User, Auth0AuthenticatedBy, FlashMessage } from 'types/types'
import { fetchUser, updateEmail, updateUser as updateUserApi, deleteUser as deleteUserApi } from 'apis/user'
import { fetchIconUrl, userUploadIconToS3 } from 'apis/icon'
import { errorMessages } from 'const/errorMessages'

export const UserEdit: React.FC = () => {
  const [userInput, setUserInput] = useState<User>()
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [iconFile, setIconFile] = useState<File>()
  const [iconObjectUrl, setIconObjectUrl] = useState<string>('')
  const [iconInputError, setIconInputError] = useState<string | null>(null)
  const [isIconChanged, setIsIconChanged] = useState<boolean>(false)
  const [flashMessage, setFlashMessage] = useState<FlashMessage | undefined>()
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
      if (!!email && email !== auth0User?.email) {
        await updateEmail(email, token)
        navigate('/')
      } else {
        setFlashMessage({ type: 'success', message: 'プロフィールを更新しました。' })
      }
    } catch (e) {
      if (e instanceof Error) {
        setFlashMessage({ type: 'error', message: e.message })
      }
    }
  }

  const deleteUser = async (): Promise<void> => {
    try {
      const token = await getAccessTokenSilently()
      await deleteUserApi(token)
      navigate('/', { state: { flashMessage: { type: 'success', message: '退会が完了しました。' } } })
    } catch (e) {
      if (e instanceof Error) {
        setFlashMessage({ type: 'error', message: e.message })
      }
    }
  }

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      navigate('/', { state: { flashMessage: { type: 'error', message: 'ログインしてください。' } } })
    }
    ;(async () => {
      if (!auth0User || !auth0User.email || !auth0User.sub) {
        setFlashMessage({ type: 'error', message: errorMessages.user.get })
        return
      }
      try {
        const user = await fetchUser(params.id)
        const iconUrl = await fetchIconUrl(user.icon_key)
        setUserInput(user)
        setIconObjectUrl(iconUrl)
        setEmail(auth0User.email)
      } catch (e) {
        if (e instanceof Error) {
          setFlashMessage({ type: 'error', message: e.message })
        }
      }
    })()
  }, [auth0User, isAuthenticated, isLoading, navigate, params.id])

  return (
    <Layout flashMessages={flashMessage ? [flashMessage] : undefined}>
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
