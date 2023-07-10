import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

/* components */
import { SignupTpl, Layout } from 'components/templates'

/* lib, types */
import { post, get } from 'lib/axios'
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

  const uploadIconToS3 = async (): Promise<string | undefined> => {
    // TODO: アイコンをs3にアップロードする機能
    if (!iconFile) return
    try {
      const formData = new FormData()
      formData.append('icon_file', iconFile)
      const token = await getAccessTokenSilently()
      const { uploadIcon } = await post<{ uploadIcon: boolean }, FormData>(
        `/s3/upload-icon/${auth0User?.sub}`,
        formData,
        token,
        'multipart/form-data',
      )
      if (uploadIcon) return `${auth0User?.sub}/${iconFile.name}`
    } catch (e) {
      // TODO: エラー処理
      console.log(e)
    }
  }

  const register = async (): Promise<void> => {
    const iconKey = await uploadIconToS3()
    // TODO: エラー処理
    if (!iconKey) return
    const token = await getAccessTokenSilently()
    const res = await post<{ user: DBUser }, { user: UserInput }>(
      `/user/signup/${auth0User?.sub}`,
      { user: { ...userInput, icon_key: iconKey } },
      token,
    )
    navigate(`/user/${res.user.key}`)
  }

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
