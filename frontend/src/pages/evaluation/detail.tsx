import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { EvaluationDetailTpl, Layout } from 'components/templates'

/* lib, types, apis */
import { Evaluation } from 'types/types'
import { fetchUser } from 'apis/user'
import { fetchSelfEvaluation, fetchOthersEvaluation, publishEvaluation, unpublishEvaluation, deleteEvaluation } from 'apis/evaluation'

export const EvaluationDetail: React.FC = () => {
  const [evaluation, setEvaluation] = useState<Evaluation>()
  const [evaluateeName, setEvaluateeName] = useState<string>('')
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const params = useParams()

  const fetchEvaluation = useCallback(async(): Promise<Evaluation> => {
    try {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently()
        const evaluation = await fetchSelfEvaluation(token, params.evaluationId)
        return evaluation
      } else {
        const evaluation = await fetchOthersEvaluation(params.evaluationId)
        return evaluation
      }
    } catch (e) {
      console.log(e)
      throw new Error('データの取得に失敗しました')
    }
  }, [isAuthenticated, getAccessTokenSilently, params.evaluationId])

  const refetchAfterUpdateEvaluation = async (): Promise<void> => {
    try {
      const evaluation = await fetchEvaluation()
      setEvaluation(evaluation)
    } catch (e) {
      // TODO: データ取得失敗のアラート出す
      console.log('update fail')
    }
  }

  const onClickPublish = async (): Promise<void> => {
    const token = await getAccessTokenSilently()
    const update = await publishEvaluation(token, params.evaluationId)
    if (update) {
      await refetchAfterUpdateEvaluation()
    } else {
      // TODO: データ取得失敗のアラート出す
      console.log('update fail')
    }
  }

  const onClickUnpublish = async (): Promise<void> => {
    const token = await getAccessTokenSilently()
    const update = await unpublishEvaluation(token, params.evaluationId)
    if (update) {
      refetchAfterUpdateEvaluation()
    } else {
      // TODO: データ取得失敗のアラート出す
      console.log('update fail')
    }
  }

  const onClickDelete = async (): Promise<void> => {
    const canProceed = confirm('本当に削除してもよろしいですか？\nこの処理は元に戻すことはできません。')
    if (!canProceed) return
    const token = await getAccessTokenSilently()
    const update = await deleteEvaluation(token, params.evaluationId)
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
        const evaluation = await fetchEvaluation()
        const user = await fetchUser(evaluation.evaluateeId)
        setEvaluation(evaluation)
        setEvaluateeName(user.name)
      } catch (e) {
        // TODO: データ取得失敗のアラート出す
        console.log(e)
      }
    })()
  }, [isLoading, fetchEvaluation])

  return (
    <Layout>
      {evaluation && (
        <EvaluationDetailTpl
          evaluation={evaluation}
          evaluateeName={evaluateeName}
          onClickPublish={onClickPublish}
          onClickUnpublish={onClickUnpublish}
          onClickDelete={onClickDelete}
        />
      )}
    </Layout>
  )
}
