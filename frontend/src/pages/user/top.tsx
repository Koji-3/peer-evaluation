import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* lib, types */
import { get } from 'lib/axios'
import { DBUser, User, AvarageEvaluation } from 'types/types'

/* components */
import { UserTopTpl, Layout } from 'components/templates'

/* FIXME: 仮 */
import { fixtureUser } from '__fixtures__/user'
import { fixtureEvaluations, fixtureAvarageEvaluation } from '__fixtures__/evaluation'

export const UserTop: React.FC = () => {
  const [user, setUser] = useState<User>()
  const [avarageEvaluation, setAvarageEvaluation] = useState<AvarageEvaluation>()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(10)
  const { isLoading } = useAuth0()
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
    console.log(isLoading)
    if (isLoading) return
    ;(async () => {
      const res = await get<{ user: DBUser | null }>(`/user/${params.id}`)
      if (!res.user) {
        // TODO: データ取得失敗のアラート出す
        // return
      }

      // setUser(res.user.props)
      setUser(fixtureUser)
      setLastPage(10)
      setAvarageEvaluation(fixtureAvarageEvaluation)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  useEffect(() => {
    setCurrentPage(Number(searchParams.get('page')) || 3)
  }, [searchParams])

  return (
    <Layout>
      {/* TODO: isDeletedの時エラーページへ */}
      {user && avarageEvaluation && (
        <UserTopTpl
          user={user}
          evaluations={fixtureEvaluations}
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
