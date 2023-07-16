import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/* components */
import { SignupTpl, Layout } from 'components/templates'

/* lib, types */
import { post } from 'lib/axios'
import { userUploadIconToS3 } from 'lib/upload-icon'
import { validateIcon } from 'lib/validate'
import { UserInput, DBUser } from 'types/types'

export const Signup: React.FC = () => {
  const { user: auth0User, getAccessTokenSilently } = useAuth0()
  const initialUserInput: UserInput = {
    name: '',
    profile: '',
    icon_key: '',
  }
  const [userInput, setUserInput] = useState<UserInput>(initialUserInput)
  const [iconFile, setIconFile] = useState<File>()
  const [iconObjectUrl, setIconObjectUrl] = useState<string>('')
  const [iconInputError, setIconInputError] = useState<string | null>(null)
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
    if (!iconFile || !auth0User || !auth0User.sub) return
    const token = await getAccessTokenSilently()
    let iconKey: string | undefined
    try {
      iconKey = await userUploadIconToS3({ file: iconFile, token, auth0Id: auth0User.sub })
    } catch (e) {
      // TODO: エラー処理
    }
    // TODO: エラー処理
    if (!iconKey) return
    const res = await post<{ user: DBUser }, { user: UserInput }>(
      `/user/signup/${auth0User?.sub}`,
      { user: { ...userInput, icon_key: iconKey } },
      token,
    )
    navigate(`/user/${res.user.key}`)
  }

  // TODO: Auth0からのコールバックじゃなければエラー表示
  useEffect(() => {
    console.log(searchParams.get('supportSignUp'))
    if (!searchParams.get('supportSignUp')) {
      console.log('error')
    }
  }, [searchParams])

  return (
    <Layout>
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
