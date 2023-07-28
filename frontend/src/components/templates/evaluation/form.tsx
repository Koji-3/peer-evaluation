import styled from 'styled-components'

/* components */
import { Button, Icon } from 'components/atoms'
import { TextInputWithLabel, IconInput, TextareaWithLabel } from 'components/molecules'
import { EvaluationFormItem } from 'components/organisms'

/* lib, types, options */
import { getE1Options, getE2Options, getE3Options, getE4Options, getE5Options, getE6Options } from 'lib/options'
import { User, EvaluationInput, EvaluationLabelKeys } from 'types/types'

/* images */
import defaultIcon from 'assets/images/icon/default-icon.svg'

type Props = {
  className?: string
  evaluatee: User
  evaluateeIconUrl: string
  evaluationInput: EvaluationInput
  iconObjectUrl: string
  iconInputError: string | null
  onChangeIconInput: (file: File) => void
  onChangeEvaluationInput: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void
  onChangeEvaluationPoint: (label: EvaluationLabelKeys, e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeEvaluationReason: (label: EvaluationLabelKeys, e: React.ChangeEvent<HTMLTextAreaElement>) => void
  submit: () => void
}

const StyledWrapper = styled.div`
  padding: 5.3rem 0;

  .evaluatee {
    margin: 0 0 4.5rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    align-items: center;

    > p {
      font-size: 2rem;
      font-weight: 700;
    }
  }

  .content {
    margin: 0 0 2.5rem;
    background: ${(props): string => props.theme.white};
    border-bottom: 0.3rem solid ${(props): string => props.theme.primary};

    .form-item {
      padding: 1.8rem 4rem;
      border-top: 0.3rem solid ${(props): string => props.theme.primary};

      > .inner {
        width: 33rem;
        margin: 0 auto;
      }

      &.icon {
        .title {
          margin: 0 0 2rem;
          font-size: 1.6rem;
        }

        .icon {
          margin: 0 auto 1.4rem;
        }

        .input {
          margin: 0 auto;
        }
      }

      &.evaluator {
        .title {
          margin: 0 0 2.6rem;
          font-size: 1.6rem;
        }

        .evaluator-name {
          margin: 0 0 2rem;
        }
      }

      &.comment {
        .title {
          margin: 0 0 1rem;
          font-size: 1.6rem;
        }

        .description {
          margin: 0 0 1.5rem;
          font-size: 1.2rem;
        }
      }
    }
  }

  .submit-btn {
    margin: 0 auto;
  }
`

export const EvaluationFormTpl: React.FC<Props> = ({
  className,
  evaluatee,
  evaluateeIconUrl,
  evaluationInput,
  iconObjectUrl,
  iconInputError,
  onChangeIconInput,
  onChangeEvaluationInput,
  onChangeEvaluationPoint,
  onChangeEvaluationReason,
  submit,
}) => {
  const { evaluatorName, relationship, comment, e1, e2, e3, e4, e5, e6 } = evaluationInput

  const e1Options = getE1Options((e) => {
    onChangeEvaluationPoint('e1', e)
  })
  const e2Options = getE2Options((e) => {
    onChangeEvaluationPoint('e2', e)
  })
  const e3Options = getE3Options((e) => {
    onChangeEvaluationPoint('e3', e)
  })
  const e4Options = getE4Options((e) => {
    onChangeEvaluationPoint('e4', e)
  })
  const e5Options = getE5Options((e) => {
    onChangeEvaluationPoint('e5', e)
  })
  const e6Options = getE6Options((e) => {
    onChangeEvaluationPoint('e6', e)
  })

  const isDisableSubmit = (): boolean => {
    if (!evaluatorName || !relationship || !comment || !e1.point || !e2.point || !e3.point || !e4.point || !e5.point || !e6.point)
      return true
    return false
  }

  return (
    <StyledWrapper className={className}>
      <div className="evaluatee">
        <p>{evaluatee.name}さんを紹介しよう！</p>
        <Icon src={evaluateeIconUrl} alt={evaluatee.name} size={10} />
      </div>

      <div className="content">
        <div className="form-item evaluator">
          <div className="inner">
            <p className="title">あなたは誰ですか？</p>
            <TextInputWithLabel
              labelText="名前（ニックネーム可）"
              placeholder="taro"
              name="evaluatorName"
              value={evaluatorName}
              onChange={onChangeEvaluationInput}
              className="evaluator-name"
            />
            <TextInputWithLabel
              labelText="関係性"
              placeholder="友人"
              name="relationship"
              value={relationship}
              onChange={onChangeEvaluationInput}
            />
          </div>
        </div>

        <div className="form-item icon">
          <div className="inner">
            <p className="title">アイコン画像の登録（任意）</p>
            <Icon src={iconObjectUrl || defaultIcon} alt={evaluatorName} size={14.6} className="icon" />
            <IconInput label="アイコンを登録" onChange={onChangeIconInput} error={iconInputError} className="input" />
          </div>
        </div>

        <div className="form-item comment">
          <div className="inner">
            <p className="title">紹介コメントを簡単にお願いします！</p>
            <p className="description">{evaluatee.name}さんのプロフィールトップに表示されます。</p>
            <TextareaWithLabel
              placeholder="コメント記入"
              name="comment"
              value={comment}
              maxLength={200}
              onChange={onChangeEvaluationInput}
            />
          </div>
        </div>

        <div className="form-item comment">
          <div className="inner">
            <EvaluationFormItem
              buttons={e1Options.buttons}
              checkedValue={e1.point}
              label={e1Options.label}
              reasonInput={e1.reason}
              index={1}
              onChangeReasonInput={(e) => onChangeEvaluationReason('e1', e)}
            />
          </div>
        </div>
        <div className="form-item comment">
          <div className="inner">
            <EvaluationFormItem
              buttons={e2Options.buttons}
              checkedValue={e2.point}
              label={e2Options.label}
              reasonInput={e2.reason}
              index={2}
              onChangeReasonInput={(e) => onChangeEvaluationReason('e2', e)}
            />
          </div>
        </div>
        <div className="form-item comment">
          <div className="inner">
            <EvaluationFormItem
              buttons={e3Options.buttons}
              checkedValue={e3.point}
              label={e3Options.label}
              reasonInput={e3.reason}
              index={3}
              onChangeReasonInput={(e) => onChangeEvaluationReason('e3', e)}
            />
          </div>
        </div>
        <div className="form-item comment">
          <div className="inner">
            <EvaluationFormItem
              buttons={e4Options.buttons}
              checkedValue={e4.point}
              label={e4Options.label}
              reasonInput={e4.reason}
              index={4}
              onChangeReasonInput={(e) => onChangeEvaluationReason('e4', e)}
            />
          </div>
        </div>
        <div className="form-item comment">
          <div className="inner">
            <EvaluationFormItem
              buttons={e5Options.buttons}
              checkedValue={e5.point}
              label={e5Options.label}
              reasonInput={e5.reason}
              index={5}
              onChangeReasonInput={(e) => onChangeEvaluationReason('e5', e)}
            />
          </div>
        </div>
        <div className="form-item comment">
          <div className="inner">
            <EvaluationFormItem
              buttons={e6Options.buttons}
              checkedValue={e6.point}
              label={e6Options.label}
              reasonInput={e6.reason}
              index={6}
              onChangeReasonInput={(e) => onChangeEvaluationReason('e6', e)}
            />
          </div>
        </div>
      </div>

      <Button buttonText="送信する" buttonType="primary" disabled={isDisableSubmit()} onClick={submit} className="submit-btn" />
    </StyledWrapper>
  )
}
