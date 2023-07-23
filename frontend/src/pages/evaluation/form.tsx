import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* components */
import { EvaluationFormTpl, Layout } from 'components/templates'

/* lib, types */
import { validateIcon } from 'lib/validate'
import { evaluatorUploadIconToS3, fetchIconUrl } from 'apis/icon'
import { fetchUser } from 'apis/user'
import { submitEvaluation } from 'apis/evaluation'
import { User, EvaluationInput, EvaluationLabelKeys } from 'types/types'

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
  const { isLoading, isAuthenticated } = useAuth0()
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
    let iconKey = ''
    if (iconFile) {
      try {
        iconKey = await evaluatorUploadIconToS3({ file: iconFile, evaluatorName: evaluationInput.evaluatorName })
      } catch (e) {
        // TODO: エラー処理
        console.log(e)
        return
      }
    }

    try {
      await submitEvaluation({ ...evaluationInput, evaluatorIconKey: iconKey }, params.evaluateeId)
      navigate(`/user/${params.evaluateeId}`)
    } catch (e) {
      // TODO: エラー処理
    }
  }

  useEffect(() => {
    if (isLoading) return
    ;(async () => {
      try {
        const evaluatee = await fetchUser(params.evaluateeId)
        const evaluateeIconUrl = await fetchIconUrl(evaluatee.icon_key)
        setEvaluatee(evaluatee)
        setEvaluateeIconUrl(evaluateeIconUrl)
      } catch (e) {
        // TODO: データ取得失敗のアラート出す
        console.log(`/user/${params.evaluateeId} error`, e)
        return
      }
    })()

    // TODO: ログイン済みならアイコン取得
    console.log(isAuthenticated)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <Layout>
      {evaluatee && (
        <EvaluationFormTpl
          evaluatee={evaluatee}
          evaluateeIconUrl={evaluateeIconUrl}
          evaluationInput={evaluationInput}
          iconObjectUrl={iconObjectUrl}
          iconInputError={iconInputError}
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
