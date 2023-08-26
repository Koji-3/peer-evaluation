import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { EvaluationFormTpl, Layout } from 'components/templates'

/* lib, types */
import { validateIcon } from 'lib/validate'
import { evaluatorUploadIconToS3, fetchIconUrl } from 'apis/icon'
import { fetchUser, fetchUserByAuth0Id } from 'apis/user'
import { submitEvaluation } from 'apis/evaluation'
import { User, DBUser, EvaluationInput, EvaluationLabelKeys, FlashMessage } from 'types/types'

export const EvaluationForm: React.FC = () => {
  const initialEvaluationInput: EvaluationInput = {
    evaluatorName: '',
    evaluatorIconKey: '',
    relationship: '',
    comment: '',
    e1: {
      point: 1,
      reason: '',
    },
    e2: {
      point: 1,
      reason: '',
    },
    e3: {
      point: 1,
      reason: '',
    },
    e4: {
      point: 1,
      reason: '',
    },
    e5: {
      point: 1,
      reason: '',
    },
    e6: {
      point: 1,
      reason: '',
    },
  }
  const [evaluatee, setEvaluatee] = useState<User>()
  const [evaluateeIconUrl, setEvaluateeIconUrl] = useState<string>('')
  const [evaluationInput, setEvaluationInput] = useState<EvaluationInput>(initialEvaluationInput)
  const [iconFile, setIconFile] = useState<File>()
  const [iconObjectUrl, setIconObjectUrl] = useState<string>('')
  const [iconInputError, setIconInputError] = useState<string | null>(null)
  const [flashMessage, setFlashMessage] = useState<FlashMessage | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { isLoading: isAuth0Loading, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const params = useParams()
  const navigate = useNavigate()

  const onChangeIconInput = (file: File): void => {
    const error = validateIcon(file)
    setIconInputError(error)
    if (!error) {
      setIconObjectUrl(URL.createObjectURL(file))
      // 後でs3にアップするためにセット
      setIconFile(file)
    }
  }

  const onChangeEvaluationInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setEvaluationInput({ ...evaluationInput, [name]: value })
  }

  const onChangeEvaluationPoint = (label: EvaluationLabelKeys, e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target
    setEvaluationInput({ ...evaluationInput, [label]: { ...evaluationInput[label], point: Number(value) } })
  }

  const onChangeEvaluationReason = (label: EvaluationLabelKeys, e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { value } = e.target
    setEvaluationInput({ ...evaluationInput, [label]: { ...evaluationInput[label], reason: value } })
  }

  const submit = async (): Promise<void> => {
    setIsLoading(true)
    setFlashMessage(undefined)
    let iconKey = ''
    if (iconFile) {
      try {
        iconKey = await evaluatorUploadIconToS3({ file: iconFile, evaluatorName: evaluationInput.evaluatorName })
      } catch (e) {
        setIsLoading(false)
        if (e instanceof Error) {
          setFlashMessage({ type: 'error', message: e.message })
        }
        return
      }
    } else if (isAuthenticated) {
      try {
        const token = await getAccessTokenSilently()
        const user = (await fetchUserByAuth0Id(token)) as DBUser
        iconKey = user?.props.icon_key
      } catch (e) {
        setIsLoading(false)
        if (e instanceof Error) {
          setFlashMessage({ type: 'error', message: e.message })
        }
        return
      }
    }

    try {
      await submitEvaluation({ ...evaluationInput, evaluatorIconKey: iconKey }, params.evaluateeId)
      setIsLoading(false)
      navigate(`/user/${params.evaluateeId}`, { state: { flashMessage: { type: 'success', message: `送信しました。${evaluatee?.name}さんがあなたの紹介を公開するとこのページに表示されます。` } } })
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
        const evaluatee = await fetchUser(params.evaluateeId)
        const evaluateeIconUrl = await fetchIconUrl(evaluatee.icon_key)
        setEvaluatee(evaluatee)
        setEvaluateeIconUrl(evaluateeIconUrl)
        setIsLoading(false)
      } catch (e) {
        setIsLoading(false)
        if (e instanceof Error) {
          setFlashMessage({ type: 'error', message: e.message })
        }
      }
    })()
  }, [isAuth0Loading, params.evaluateeId])

  return (
    <Layout flashMessages={flashMessage ? [flashMessage] : undefined} isLoading={isAuth0Loading || isLoading}>
      {evaluatee && !isLoading && (
        <EvaluationFormTpl
          evaluatee={evaluatee}
          evaluateeIconUrl={evaluateeIconUrl}
          evaluationInput={evaluationInput}
          iconObjectUrl={iconObjectUrl}
          iconInputError={iconInputError}
          shouldShowIconInput={!isAuthenticated}
          onChangeIconInput={onChangeIconInput}
          onChangeEvaluationInput={onChangeEvaluationInput}
          onChangeEvaluationPoint={onChangeEvaluationPoint}
          onChangeEvaluationReason={onChangeEvaluationReason}
          submit={submit}
        />
      )}
    </Layout>
  )
}
