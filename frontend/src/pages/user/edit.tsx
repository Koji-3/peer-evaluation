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
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { isLoading: isAuth0Loading, user: auth0User, isAuthenticated, loginWithRedirect, getAccessTokenSilently, logout } = useAuth0()
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
    loginWithRedirect({ authorizationParams: { prompt: 'login' } })
  }

  const updateUser = async (): Promise<void> => {
    setIsLoading(true)
    setFlashMessage(undefined)
    if (!auth0User || !userInput) {
      setIsLoading(false)
      setFlashMessage({ type: 'error', message: errorMessages.user.update })
      return
    }

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
        logout({ logoutParams: { returnTo: `${window.location.origin}/update/login` } })
      } else {
        navigate(`/user/${params.id}`, { state: { flashMessage: { type: 'success', message: 'プロフィールを更新しました。' } } })
      }
    } catch (e) {
      setIsLoading(false)
      if (e instanceof Error) {
        setFlashMessage({ type: 'error', message: e.message })
      }
    }
  }

  const deleteUser = async (): Promise<void> => {
    const canProceed = confirm(
      '本当に退会してもよろしいですか？\n退会するとプロフィールやマイページ内の情報が消去され、元に戻せなくなります。',
    )
    if (!canProceed) return

    try {
      const token = await getAccessTokenSilently()
      await deleteUserApi(token)
      setIsLoading(false)
      navigate('/', { state: { flashMessage: { type: 'success', message: '退会が完了しました。' } } })
    } catch (e) {
      setIsLoading(false)
      if (e instanceof Error) {
        setFlashMessage({ type: 'error', message: e.message })
      }
    }
  }

  useEffect(() => {
    if (isAuth0Loading) return
    if (!isAuthenticated) {
      setIsLoading(false)
      navigate('/', { state: { flashMessage: { type: 'error', message: 'ログインしてください。' } } })
    }
    ;(async () => {
      if (!auth0User || !auth0User.email || !auth0User.sub) {
        setIsLoading(false)
        setFlashMessage({ type: 'error', message: errorMessages.user.get })
        return
      }
      try {
        const user = await fetchUser(params.id)
        const iconUrl = await fetchIconUrl(user.icon_key)
        setUserInput(user)
        setIconObjectUrl(iconUrl)
        setEmail(auth0User.email)
        setIsLoading(false)
      } catch (e) {
        setIsLoading(false)
        if (e instanceof Error) {
          setFlashMessage({ type: 'error', message: e.message })
        }
      }
    })()
  }, [auth0User, isAuthenticated, isAuth0Loading, navigate, params.id])

  return (
    <Layout flashMessages={flashMessage ? [flashMessage] : undefined} isLoading={isAuth0Loading || isLoading}>
      {userInput && !isLoading && (
        <UserEditTpl
          userId={params.id}
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
