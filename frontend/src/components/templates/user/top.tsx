import styled from 'styled-components'

/* components */
import { Icon } from 'components/atoms'
import { Pagination } from 'components/molecules'
import { EvaluationItem, RadarChart } from 'components/organisms'

/* lib, types */
import { mediaSp } from 'lib/media-query'
import { User, Evaluation, AvarageEvaluation } from 'types/types'

type Props = {
  className?: string
  user: User
  evaluations: Evaluation[]
  avarageEvaluation: AvarageEvaluation
  currentPage: number
  lastPage: number
  publishEvaluation: (id: string) => void
  unpublishEvaluation: (id: string) => void
  deleteEvaluation: (id: string) => void
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

  ${mediaSp`
  `}
`

export const UserTopTpl: React.FC<Props> = ({
  user,
  evaluations,
  avarageEvaluation,
  currentPage,
  lastPage,
  publishEvaluation,
  unpublishEvaluation,
  deleteEvaluation,
}) => {
  const getChartData = (): string[] => {
    const values = Object.values(avarageEvaluation) as (number | User)[]
    return values.splice(1).map((num) => `${num}`)
  }

  return (
    <StyledWrapper>
      <div className="user">
        <Icon src={user.icon_url} alt={user.name} size={10} className="icon" />
        <p className="name">{user.name}</p>
        <p className="profile">{user.profile}</p>
      </div>

      <RadarChart data={getChartData()} className="chart" />

      <div className="evaluations">
        <p className="title">{user.name}さんへの評価</p>
        <div className="evaluation-items-wrapper">
          {evaluations.map((evaluation) => (
            <EvaluationItem
              evaluation={evaluation}
              key={evaluation.id}
              publishEvaluation={publishEvaluation}
              unpublishEvaluation={unpublishEvaluation}
              deleteEvaluation={deleteEvaluation}
            />
          ))}
        </div>
      </div>

      <Pagination currentPage={currentPage} lastPage={lastPage} />
    </StyledWrapper>
  )
}
