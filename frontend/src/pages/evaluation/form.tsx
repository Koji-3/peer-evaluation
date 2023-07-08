import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

/* lib, types */
import { get } from 'lib/axios'
import { validateIcon } from 'lib/validate'
import { User, EvaluationInput, EvaluationLabelKeys } from 'types/types'

/* components */
import { EvaluationFormTpl, Layout } from 'components/templates'

/* FIXME: 仮 */
import { fixtureUser } from '__fixtures__/user'

export const EvaluationForm: React.FC = () => {
  const initialEvaluationInput: EvaluationInput = {
    evaluatorName: '',
    evaluatorIconUrl: '',
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
  const [evaluationInput, setEvaluationInput] = useState<EvaluationInput>(initialEvaluationInput)
  const [iconFile, setIconFile] = useState<File>()
  const [iconObjectUrl, setIconObjectUrl] = useState<string>('')
  const [iconInputError, setIconInputError] = useState<string | null>(null)
  const { isLoading } = useAuth0()
  const params = useParams()

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

  const submit = (): void => {
    // TODO: s3にアップ
    console.log(iconFile)
    // TODO: API
    console.log(`submit`)
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
    })()

    setEvaluatee(fixtureUser)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <Layout>
      {evaluatee && (
        <EvaluationFormTpl
          evaluatee={evaluatee}
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
