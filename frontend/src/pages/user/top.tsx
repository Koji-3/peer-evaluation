import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { UserTopTpl, Layout } from 'components/templates'

/* lib, types, apis */
import { User, Evaluation } from 'types/types'
import { fetchUser } from 'apis/user'
import { fetchIconUrl } from 'apis/icon'
import { fetchSelfEvaluations, fetchOthersEvaluations, publishEvaluation, unpublishEvaluation, deleteEvaluation } from 'apis/evaluation'
import { errorMessages } from 'const/errorMessages'

export const UserTop: React.FC = () => {
  const [user, setUser] = useState<User>()
  const [userIconUrl, setUserIconUrl] = useState<string>('')
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(10)
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const params = useParams()
  const [searchParams] = useSearchParams()

  const fetchEvaluations = async (): Promise<Evaluation[]> => {
    try {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently()
        const evaluations = await fetchSelfEvaluations(token, params.id)
        return evaluations
      } else {
        const evaluations = await fetchOthersEvaluations(params.id)
        return evaluations
      }
    } catch (e) {
      throw new Error(errorMessages.evaluation.get)
    }
  }

  const refetchAfterUpdateEvaluation = async (): Promise<void> => {
    try {
      const user = await fetchUser(params.id)
      const evaluations = await fetchEvaluations()
      setUser(user)
      setEvaluations(evaluations)
    } catch (e) {
      // TODO: データ取得失敗のアラート出す
      console.log('update fail')
    }
  }

  const onClickPublish = async (id: string): Promise<void> => {
    const token = await getAccessTokenSilently()
    const update = await publishEvaluation(token, id)
    if (update) {
      await refetchAfterUpdateEvaluation()
    } else {
      // TODO: データ取得失敗のアラート出す
      console.log('update fail')
    }
  }

  const onClickUnpublish = async (id: string): Promise<void> => {
    const token = await getAccessTokenSilently()
    const update = await unpublishEvaluation(token, id)
    if (update) {
      refetchAfterUpdateEvaluation()
    } else {
      // TODO: データ取得失敗のアラート出す
      console.log('update fail')
    }
  }

  const onClickDelete = async (id: string): Promise<void> => {
    const canProceed = confirm('本当に削除してもよろしいですか？\nこの処理は元に戻すことはできません。')
    if (!canProceed) return
    const token = await getAccessTokenSilently()
    const update = await deleteEvaluation(token, id)
    if (update) {
      refetchAfterUpdateEvaluation()
    } else {
      // TODO: データ取得失敗のアラート出す
      console.log('update fail')
    }
  }

  useEffect(() => {
    if (isLoading) return
    ;(async () => {
      try {
        const user = await fetchUser(params.id)
        console.log(user)
        const iconUrl = await fetchIconUrl(user.icon_key)
        const evaluations = await fetchEvaluations()
        setUser(user)
        setUserIconUrl(iconUrl)
        setEvaluations(evaluations)
        const evaluationNum = isAuthenticated ? user.allEvaluationNum : user.publishedEvaluationNum
        const lastPage = evaluationNum % 4 === 0 ? evaluationNum / 4 : Math.floor(evaluationNum / 4) + 1
        setLastPage(lastPage)
      } catch (e) {
        // TODO: データ取得失敗のアラート出す
        console.log(e)
      }
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
          onClickPublish={onClickPublish}
          onClickUnpublish={onClickUnpublish}
          onClickDelete={onClickDelete}
        />
      )}
    </Layout>
  )
}
