import styled from 'styled-components'

/* components */
import { Icon } from 'components/atoms'
import { Pagination } from 'components/molecules'
import { EvaluationItem, RadarChart } from 'components/organisms'

/* lib, types */
import { parseNumberToOneDecimalText } from 'lib/function'
import { User, Evaluation } from 'types/types'

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
      width: 32.9rem;
      margin: 0 auto;
      font-size: 1.2rem;
    }
  }

  .chart {
    margin: 0 auto 5rem;
  }

  .evaluations {
    margin: 0 0 3.5rem;

    .title {
      margin: 0 0 2rem;
      font-size: 1.6rem;
      font-weight: 700;
      text-align: center;
    }

    .evaluation-items-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
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
  const getChartData = (): string[] => {
    const values = Object.values(user.averageEvaluation) as number[]
    return values.map((num) => (num === 0 ? '0' : parseNumberToOneDecimalText(num)))
  }

  return (
    <StyledWrapper>
      <a href={`/evaluation/form/${user.id}`}>評価を書く</a>
      <div className="user">
        <Icon src={userIconUrl} alt={user.name} size={10} className="icon" />
        <p className="name">{user.name}</p>
        <p className="profile">{user.profile}</p>
      </div>

      <RadarChart data={getChartData()} className="chart" />

      <div className="evaluations">
        <p className="title">{user.name}さんへの評価</p>
        {evaluations.length ? (
          <div className="evaluation-items-wrapper">
            {evaluations.map((evaluation) => (
              <EvaluationItem
                evaluation={evaluation}
                onClickPublish={onClickPublish}
                onClickUnpublish={onClickUnpublish}
                onClickDelete={onClickDelete}
                key={evaluation.id}
              />
            ))}
          </div>
        ) : (
          // TODO:
          <p style={{ textAlign: 'center' }}>評価はありません</p>
        )}
      </div>

      {!!lastPage && <Pagination currentPage={currentPage} lastPage={lastPage} />}
    </StyledWrapper>
  )
}
