import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { Button } from 'components/atoms'
import { AuthWrapper } from 'components/templates'

/* lib, types */
import { get, put } from 'lib/axios'
import { DBUser, User, Auth0AuthenticatedBy } from 'types/types'

export const MypageEdit: React.FC = () => {
  const [userInput, setUserInput] = useState<User>()
  const [email, setEmail] = useState<string>('')
  const { isLoading, user: auth0User, getAccessTokenSilently } = useAuth0()
  const params = useParams()
  const navigate = useNavigate()

  const changeUserInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    if (!userInput) return
    setUserInput({ ...userInput, [name]: value })
  }

  const authenticatedBy = (auth0Id: string): Auth0AuthenticatedBy => {
    if (auth0Id.startsWith('google')) return 'google'
    return 'auth0'
  }

  const updateEmail = async (): Promise<void> => {
    if (!auth0User || !auth0User.sub) {
      // TODO: データ取得失敗のアラート出す
      return
    }
    const token = await getAccessTokenSilently()
    const res = await put<{ user: DBUser }, { email: string }>(`/user/update-email/${auth0User.sub}`, { email }, token)
    if (res) {
      // TODO: メールアドレスを変更するとAuth0側で自動でログアウトされるのでホームに遷移して新しいメールアドレスでログインしてください的なアラート出す
      navigate('/')
    } else {
      // TODO: メールアドレス変更に失敗したときの処理
    }
  }

  const updateUser = async (): Promise<void> => {
    if (!userInput) {
      // TODO: データ取得失敗のアラート出す
      return
    }
    const token = await getAccessTokenSilently()
    const res = await put<{ updateEmail: boolean }, { user: User }>(`/user/update/${params.id}`, { user: userInput }, token)

    if (!!email && email !== auth0User?.email) {
      await updateEmail()
      return
    } else {
      if (res) {
        // TODO: 変更しました的なアラート
      }
    }
  }

  useEffect(() => {
    if (isLoading) return
    if (!auth0User || !auth0User.email) {
      // TODO: データ取得失敗のアラート出す
      return
    }
    ;(async () => {
      const res = await get<{ user: DBUser | null }>(`/user/${params.id}`)
      if (!res.user) {
        // TODO: データ取得失敗のアラートだす
        return
      }
      setUserInput(res.user.props)
      setEmail(auth0User?.email || '')
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    // TODO: バリデーション
    <AuthWrapper>
      <div style={{ marginBottom: '50px' }}>
        <h1>データ変更</h1>
        <input name="name" placeholder="名前" value={userInput?.name} onChange={changeUserInput} />
        {/* googleアカウントでログインしている場合はemail, passwordは変更できない */}
        {auth0User?.sub && authenticatedBy(auth0User.sub) === 'auth0' && (
          <>
            <div>
              <h1>email</h1>
              <input
                name="email"
                placeholder="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
            </div>
          </>
        )}
        <Button onClick={updateUser}>編集</Button>
      </div>
    </AuthWrapper>
  )
}
