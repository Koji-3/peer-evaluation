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
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { isLoading: isAuth0Loading, isAuthenticated, getAccessTokenSilently } = useAuth0()
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
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(errorMessages.evaluation.get)
    }
  }, [isAuthenticated, getAccessTokenSilently, params.evaluationId])

  const refetchAfterUpdateEvaluation = async (): Promise<void> => {
    try {
      const evaluation = await fetchEvaluation()
      setEvaluation(evaluation)
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
    }
  }

  const onClickPublish = async (): Promise<void> => {
    setIsLoading(true)
    setFlashMessage(undefined)
    try {
      const token = await getAccessTokenSilently()
      await publishEvaluation(token, params.evaluationId)
      await refetchAfterUpdateEvaluation()
      setIsLoading(false)
      setFlashMessage({ type: 'success', message: '公開しました。' })
    } catch (e) {
      setIsLoading(false)
      if (e instanceof Error) {
        setFlashMessage({ type: 'error', message: e.message })
      }
    }
  }

  const onClickUnpublish = async (): Promise<void> => {
    setIsLoading(true)
    setFlashMessage(undefined)
    try {
      const token = await getAccessTokenSilently()
      await unpublishEvaluation(token, params.evaluationId)
      await refetchAfterUpdateEvaluation()
      setIsLoading(false)
      setFlashMessage({ type: 'success', message: '非公開にしました。' })
    } catch (e) {
      setIsLoading(false)
      if (e instanceof Error) {
        setFlashMessage({ type: 'error', message: e.message })
      }
    }
  }

  const onClickDelete = async (): Promise<void> => {
    const canProceed = confirm('本当に削除してもよろしいですか？\nこの処理は元に戻すことはできません。')
    if (!canProceed) return

    setIsLoading(true)
    setFlashMessage(undefined)
    try {
      const token = await getAccessTokenSilently()
      await deleteEvaluation(token, params.evaluationId)
      await refetchAfterUpdateEvaluation()
      setIsLoading(false)
      setFlashMessage({ type: 'success', message: '削除しました。' })
    } catch (e) {
      setIsLoading(false)
      if (e instanceof Error) {
        setFlashMessage({ type: 'error', message: e.message })
      }
    }
  }

  useEffect(() => {
    if (isAuth0Loading) return
    ;(async () => {
      try {
        const evaluation = await fetchEvaluation()
        const user = await fetchUser(evaluation.evaluateeId)
        setEvaluation(evaluation)
        setEvaluateeName(user.name)
        setIsLoading(false)
      } catch (e) {
        setIsLoading(false)
        if (e instanceof Error) {
          setFlashMessage({ type: 'error', message: e.message })
        }
      }
    })()
  }, [isAuth0Loading, fetchEvaluation])

  return (
    <Layout flashMessages={flashMessage ? [flashMessage] : undefined} isLoading={isAuth0Loading || isLoading}>
      {evaluation && !isLoading && (
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
