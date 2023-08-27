import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

/* components */
import { Icon } from 'components/atoms'
import { Pagination, ButtonWithIcon } from 'components/molecules'
import { EvaluationItem, RadarChart } from 'components/organisms'

/* lib, types */
import { parseNumberToOneDecimalText } from 'lib/function'
import { User, Evaluation } from 'types/types'

/* images */
import pencilIcon from 'assets/images/icon/pencil.svg'

type Props = {
  className?: string
  user: User
  userIconUrl: string
  evaluations: Evaluation[]
  currentPage: number
  lastPage: number
  onClickPublish: (id: string) => void
  onClickUnpublish: (id: string) => void
  onClickDelete: (id: string) => void
}

const StyledWrapper = styled.div`
  padding: 3.5rem 0 14rem;

  .user {
    margin: 0 0 3rem;

    .icon {
      margin: 0 auto 1.6rem;
    }

    .name {
      margin: 0 0 1.6rem;
      font-size: 2rem;
      text-align: center;
    }

    .profile {
      width: 35.8rem;
      margin: 0 auto;
      font-size: 1.4rem;
    }
  }

  .chart {
    margin: 0 auto 5rem;
  }

  .evaluations {
    margin: 0 0 3.5rem;

    .title-wrapper {
      width: 37rem;
      margin: 0 auto 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        padding: 0 0 0 1.5rem;
        font-size: 1.6rem;
        font-weight: 700;
        text-align: center;
        position: relative;

        &::before {
          width: 0.5rem;
          height: 100%;
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          background: ${(props): string => props.theme.primary};
        }
      }
    }

    .evaluation-items-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2.5rem;
      &:has(.with-buttons) {
        gap: 3rem;
      }
    }
  }
`

export const UserTopTpl: React.FC<Props> = ({
  user,
  userIconUrl,
  evaluations,
  currentPage,
  lastPage,
  onClickPublish,
  onClickUnpublish,
  onClickDelete,
}) => {
  const navigate = useNavigate()

  const getChartData = (): string[] => {
    const values = Object.values(user.averageEvaluation) as number[]
    return values.map((num) => (num === 0 ? '0' : parseNumberToOneDecimalText(num)))
  }

  const onClickIntroduce = (): void => {
    navigate(`/evaluation/form/${user.id}`)
  }

  return (
    <StyledWrapper>
      <a href={`/evaluation/form/${user.id}`}>紹介を書く</a>
      <div className="user">
        <Icon src={userIconUrl} alt={user.name} size={10} className="icon" />
        <p className="name">{user.name}</p>
        <p className="profile">{user.profile}</p>
      </div>

      <RadarChart data={getChartData()} className="chart" />

      <div className="evaluations">
        <div className="title-wrapper">
          <p className="title">{user.name}さんの紹介一覧</p>
          <ButtonWithIcon buttonText="紹介する" icon={pencilIcon} buttonType="primary" onClick={onClickIntroduce} />
        </div>
        {evaluations.length ? (
          <div className="evaluation-items-wrapper">
            {evaluations.map((evaluation) => (
              <EvaluationItem
                evaluation={evaluation}
                onClickPublish={onClickPublish}
                onClickUnpublish={onClickUnpublish}
                onClickDelete={onClickDelete}
                key={evaluation.id}
                className={evaluation.shouldShowOperateButtons ? 'with-buttons' : ''}
              />
            ))}
          </div>
        ) : (
          // TODO:
          <p style={{ textAlign: 'center' }}>紹介はありません</p>
        )}
      </div>

      {!!lastPage && <Pagination currentPage={currentPage} lastPage={lastPage} />}
    </StyledWrapper>
  )
}
