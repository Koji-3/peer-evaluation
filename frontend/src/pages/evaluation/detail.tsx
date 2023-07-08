import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* lib, types */
import { get } from 'lib/axios'
import { Evaluation } from 'types/types'

/* components */
import { EvaluationDetailTpl, Layout } from 'components/templates'

/* FIXME: 仮 */
import { fixtureEvaluation } from '__fixtures__/evaluation'

export const EvaluationDetail: React.FC = () => {
  const [evaluation, setEvaluation] = useState<Evaluation>()
  const { isLoading } = useAuth0()
  const params = useParams()

  const publishEvaluation = (): void => {
    console.log(`publish ${params.id}`)
  }

  const unpublishEvaluation = (): void => {
    console.log(`unpublish ${params.id}`)
  }

  const deleteEvaluation = (): void => {
    console.log(`delete ${params.id}`)
  }

  useEffect(() => {
    if (isLoading) return
    ;(async () => {
      // TODO: API
      console.log(params.id)
      // const res = await get<{ user: DBUser | null }>(`/user/${params.id}`)
      // if (!res.user) {
      //   // TODO: データ取得失敗のアラート出す
      //   return
      // }

      setEvaluation(fixtureEvaluation)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <Layout>
      {/* TODO: isDeletedの時エラーページへ */}
      {evaluation && (
        <EvaluationDetailTpl
          evaluation={evaluation}
          publishEvaluation={publishEvaluation}
          unpublishEvaluation={unpublishEvaluation}
          deleteEvaluation={deleteEvaluation}
        />
      )}
    </Layout>
  )
}
