import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { EvaluationDetailTpl, Layout } from 'components/templates'

/* lib, types, apis */
import { Evaluation, FlashMessage } from 'types/types'
import { fetchUser } from 'apis/user'
import { fetchSelfEvaluation, fetchOthersEvaluation, publishEvaluation, unpublishEvaluation, deleteEvaluation } from 'apis/evaluation'
import { errorMessages } from 'const/errorMessages'

export const EvaluationDetail: React.FC = () => {
  const [evaluation, setEvaluation] = useState<Evaluation>()
  const [evaluateeName, setEvaluateeName] = useState<string>('')
  const [flashMessage, setFlashMessage] = useState<FlashMessage | undefined>()
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const params = useParams()

  const fetchEvaluation = useCallback(async (): Promise<Evaluation> => {
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
      throw new Error(errorMessages.evaluation.get)
    }
  }, [isAuthenticated, getAccessTokenSilently, params.evaluationId])

  const refetchAfterUpdateEvaluation = async (): Promise<void> => {
    try {
      const evaluation = await fetchEvaluation()
      setEvaluation(evaluation)
    } catch (e) {
      if (e instanceof Error) {
        setFlashMessage({ type: 'error', message: e.message })
      }
    }
  }

  const onClickPublish = async (): Promise<void> => {
    try {
      const token = await getAccessTokenSilently()
      await publishEvaluation(token, params.evaluationId)
      await refetchAfterUpdateEvaluation()
    } catch (e) {
      if (e instanceof Error) {
        setFlashMessage({ type: 'error', message: e.message })
      }
    }
  }

  const onClickUnpublish = async (): Promise<void> => {
    try {
      const token = await getAccessTokenSilently()
      await unpublishEvaluation(token, params.evaluationId)
      await refetchAfterUpdateEvaluation()
    } catch (e) {
      if (e instanceof Error) {
        setFlashMessage({ type: 'error', message: e.message })
      }
    }
  }

  const onClickDelete = async (): Promise<void> => {
    const canProceed = confirm('本当に削除してもよろしいですか？\nこの処理は元に戻すことはできません。')
    if (!canProceed) return
    try {
      const token = await getAccessTokenSilently()
      await deleteEvaluation(token, params.evaluationId)
      await refetchAfterUpdateEvaluation()
    } catch (e) {
      if (e instanceof Error) {
        setFlashMessage({ type: 'error', message: e.message })
      }
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
        if (e instanceof Error) {
          setFlashMessage({ type: 'error', message: e.message })
        }
      }
    })()
  }, [isLoading, fetchEvaluation])

  return (
    <Layout flashMessages={flashMessage ? [flashMessage] : undefined}>
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
