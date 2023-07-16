import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { UserTopTpl, Layout } from 'components/templates'

/* lib, types */
import { get, put, deleteData } from 'lib/axios'
import { User, Evaluation } from 'types/types'

export const UserTop: React.FC = () => {
  const [user, setUser] = useState<User>()
  const [userIconUrl, setUserIconUrl] = useState<string>('')
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(10)
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const params = useParams()
  const [searchParams] = useSearchParams()

  const fetchUser = async (): Promise<User | undefined> => {
    let user: User
    try {
      const res = await get<{ user: User | null }>(`/user/${params.id}`)
      if (!res.user) {
        // TODO: データ取得失敗のアラート出す
        console.log('user is null')
        return
      }
      console.log('get user', res)
      user = res.user
      setUser(res.user)

      console.log(isAuthenticated)
      console.log(res.user.allEvaluationNum)

      const evaluationNum = isAuthenticated ? res.user.allEvaluationNum : res.user.publishedEvaluationNum
      const lastPage = evaluationNum % 4 === 0 ? evaluationNum / 4 : Math.floor(evaluationNum / 4) + 1
      console.log(lastPage)
      setLastPage(lastPage)
    } catch (e) {
      // TODO: データ取得失敗のアラート出す
      console.log(`/user/${params.id} error`, e)
      return
    }
    return user
  }

  const fetchIconUrl = async (iconKey: string): Promise<void> => {
    try {
      const { imageSrc } = await get<{ imageSrc: string }, { key: string }>('/s3/get-icon', undefined, { key: iconKey })
      if (!imageSrc) {
        // TODO: データ取得失敗のアラート出す
        console.log('imageSrc undefined')
        return
      }
      setUserIconUrl(imageSrc)
    } catch (e) {
      // TODO: データ取得失敗のアラート出す
      console.log(`get icon error`, e)
      return
    }
  }

  const fetchEvaluations = async (): Promise<void> => {
    if (isAuthenticated) {
      try {
        const token = await getAccessTokenSilently()
        const { evaluations } = await get<{ evaluations: Evaluation[] | null }>(`/evaluation/self/${params.id}`, token)
        if (!evaluations) {
          // TODO: データ取得失敗のアラート出す
          console.log('evaluations null')
          return
        }
        setEvaluations(evaluations)
      } catch (e) {
        // TODO: データ取得失敗のアラート出す
        console.log('evaluations error', e)
        return
      }
    } else {
      try {
        const { evaluations } = await get<{ evaluations: Evaluation[] | null }>(`/evaluation/${params.id}`)
        if (!evaluations) {
          // TODO: データ取得失敗のアラート出す
          console.log('evaluations null')
          return
        }
        setEvaluations(evaluations)
      } catch (e) {
        // TODO: データ取得失敗のアラート出す
        console.log('evaluations error', e)
        return
      }
    }
  }

  const publishEvaluation = async (id: string): Promise<void> => {
    const token = await getAccessTokenSilently()
    const { update } = await put<{ update: boolean }>(`/evaluation/publish/${id}`, undefined, token)
    if (update) {
      await fetchUser()
      await fetchEvaluations()
    } else {
      // TODO: データ取得失敗のアラート出す
      console.log('update fail')
    }
  }

  const unpublishEvaluation = async (id: string): Promise<void> => {
    const token = await getAccessTokenSilently()
    const { update } = await put<{ update: boolean }>(`/evaluation/unpublish/${id}`, undefined, token)
    if (update) {
      await fetchUser()
      await fetchEvaluations()
    } else {
      // TODO: データ取得失敗のアラート出す
      console.log('update fail')
    }
  }

  const deleteEvaluation = async (id: string): Promise<void> => {
    const canProceed = confirm('本当に削除してもよろしいですか？\nこの処理は元に戻すことはできません。')
    if (!canProceed) return
    const token = await getAccessTokenSilently()
    const { update } = await deleteData<{ update: boolean }>(`/evaluation/${id}`, token)
    if (update) {
      await fetchUser()
      await fetchEvaluations()
    } else {
      // TODO: データ取得失敗のアラート出す
      console.log('update fail')
    }
  }

  useEffect(() => {
    if (isLoading) return
    ;(async () => {
      const user = (await fetchUser()) as User
      await fetchIconUrl(user.icon_key)
      await fetchEvaluations()
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  useEffect(() => {
    setCurrentPage(Number(searchParams.get('page')) || 1)
  }, [searchParams])

  return (
    <Layout>
      {/* TODO: is_deletedの時エラーページへ */}
      {user && (
        <UserTopTpl
          user={user}
          userIconUrl={userIconUrl}
          evaluations={evaluations}
          currentPage={currentPage}
          lastPage={lastPage}
          publishEvaluation={publishEvaluation}
          unpublishEvaluation={unpublishEvaluation}
          deleteEvaluation={deleteEvaluation}
        />
      )}
    </Layout>
  )
}
