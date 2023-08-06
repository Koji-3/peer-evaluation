import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/* components */
import { SignupTpl, Layout } from 'components/templates'

/* lib, types, apis */
import { validateIcon } from 'lib/validate'
import { UserInput, FlashMessage } from 'types/types'
import { userUploadIconToS3 } from 'apis/icon'
import { createUser } from 'apis/user'
import { errorMessages } from 'const/errorMessages'

export const Signup: React.FC = () => {
  const { user: auth0User, getAccessTokenSilently, isLoading: isAuth0Loading } = useAuth0()
  const initialUserInput: UserInput = {
    name: '',
    profile: '',
    icon_key: '',
  }
  const [userInput, setUserInput] = useState<UserInput>(initialUserInput)
  const [iconFile, setIconFile] = useState<File>()
  const [iconObjectUrl, setIconObjectUrl] = useState<string>('')
  const [iconInputError, setIconInputError] = useState<string | null>(null)
  const [flashMessage, setFlashMessage] = useState<FlashMessage | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const onChangeUserInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value } = e.target
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

  const register = async (): Promise<void> => {
    setIsLoading(true)
    if (!iconFile || !auth0User || !auth0User.sub) {
      setIsLoading(false)
      setFlashMessage({ type: 'error', message: errorMessages.user.create })
      return
    }
    const token = await getAccessTokenSilently()
    try {
      const iconKey = await userUploadIconToS3({ file: iconFile, token })
      const user = await createUser({ ...userInput, icon_key: iconKey }, token)
      setIsLoading(false)
      navigate(`/user/${user.key}`)
    } catch (e) {
      setIsLoading(false)
      if (e instanceof Error) {
        setFlashMessage({ type: 'error', message: e.message })
      }
    }
  }

  // TODO: Auth0からのコールバックじゃなければエラー表示
  useEffect(() => {
    console.log(searchParams.get('supportSignUp'))
    if (!searchParams.get('supportSignUp')) {
      console.log('error')
    }
  }, [searchParams])

  return (
    <Layout flashMessages={flashMessage ? [flashMessage] : undefined} isLoading={isAuth0Loading || isLoading}>
      <SignupTpl
        userInput={userInput}
        iconObjectUrl={iconObjectUrl}
        iconInputError={iconInputError}
        onChangeUserInput={onChangeUserInput}
        onChangeIconInput={onChangeIconInput}
        register={register}
      />
    </Layout>
  )
}
