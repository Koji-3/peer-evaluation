import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { UserTopTpl, Layout } from 'components/templates'

/* lib, types */
import { get } from 'lib/axios'
import { User, AvarageEvaluation, Evaluation } from 'types/types'

/* FIXME: 仮 */
import { fixtureAvarageEvaluation } from '__fixtures__/evaluation'

export const UserTop: React.FC = () => {
  const [user, setUser] = useState<User>()
  const [userIconUrl, setUserIconUrl] = useState<string>('')
  const [avarageEvaluation, setAvarageEvaluation] = useState<AvarageEvaluation>()
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(10)
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const params = useParams()
  const [searchParams] = useSearchParams()

  const publishEvaluation = (id: string): void => {
    console.log(`publish ${id}`)
  }

  const unpublishEvaluation = (id: string): void => {
    console.log(`unpublish ${id}`)
  }

  const deleteEvaluation = (id: string): void => {
    console.log(`delete ${id}`)
  }

  useEffect(() => {
    if (isLoading) return
    ;(async () => {
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
      } catch (e) {
        // TODO: データ取得失敗のアラート出す
        console.log(`/user/${params.id} error`, e)
        return
      }

      let iconUrl: string
      try {
        const { file } = await get<{ file: string }, { key: string }>('/s3/get-icon', undefined, { key: user.icon_key })
        if (!file) {
          // TODO: データ取得失敗のアラート出す
          console.log('file undefined')
          return
        }
        iconUrl = file
      } catch (e) {
        // TODO: データ取得失敗のアラート出す
        console.log(`get icon error`, e)
        return
      }

      let evaluations: Evaluation[]
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently()
          const { evaluations: res } = await get<{ evaluations: Evaluation[] | null }>(`/evaluation/self/${params.id}`, token)
          if (!res) {
            // TODO: データ取得失敗のアラート出す
            console.log('evaluations null')
            return
          }
          evaluations = res
        } catch (e) {
          // TODO: データ取得失敗のアラート出す
          console.log('evaluations error', e)
          return
        }
      } else {
        try {
          const { evaluations: res } = await get<{ evaluations: Evaluation[] | null }>(`/evaluation/${params.id}`)
          if (!res) {
            // TODO: データ取得失敗のアラート出す
            console.log('evaluations null')
            return
          }
          evaluations = res
        } catch (e) {
          // TODO: データ取得失敗のアラート出す
          console.log('evaluations error', e)
          return
        }
      }

      setUser(user)
      setUserIconUrl(iconUrl)
      setEvaluations(evaluations)
      setLastPage(10)
      setAvarageEvaluation(fixtureAvarageEvaluation)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  useEffect(() => {
    setCurrentPage(Number(searchParams.get('page')) || 1)
  }, [searchParams])

  return (
    <Layout>
      {/* TODO: is_deletedの時エラーページへ */}
      {user && avarageEvaluation && (
        <UserTopTpl
          user={user}
          userIconUrl={userIconUrl}
          evaluations={evaluations}
          avarageEvaluation={avarageEvaluation}
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
