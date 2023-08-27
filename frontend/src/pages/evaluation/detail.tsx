import { useCallback, useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { EvaluationDetailTpl, Layout } from 'components/templates'

/* lib, types, apis */
import { User, Evaluation, FlashMessage } from 'types/types'
import { fetchUser } from 'apis/user'
import { fetchSelfEvaluation, fetchOthersEvaluation, publishEvaluation, unpublishEvaluation, deleteEvaluation } from 'apis/evaluation'
import { errorMessages } from 'const/errorMessages'

export const EvaluationDetail: React.FC = () => {
  const [evaluation, setEvaluation] = useState<Evaluation>()
  const [evaluatee, setEvaluatee] = useState<User>()
  const [flashMessage, setFlashMessage] = useState<FlashMessage | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { isLoading: isAuth0Loading, isAuthenticated, user: auth0User, getAccessTokenSilently } = useAuth0()
  const params = useParams()

  const isSelfMyPage = useMemo(() => {
    if (!auth0User || !evaluatee?.auth0_id) return false
    return auth0User.sub === evaluatee.auth0_id
  }, [auth0User, evaluatee])

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
        setEvaluatee(user)
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
      {evaluation && evaluatee && !isLoading && (
        <EvaluationDetailTpl
          evaluation={evaluation}
          evaluatee={evaluatee}
          isSelfMyPage={isSelfMyPage}
          onClickPublish={onClickPublish}
          onClickUnpublish={onClickUnpublish}
          onClickDelete={onClickDelete}
        />
      )}
    </Layout>
  )
}
