import styled from 'styled-components'

/* lib, types */
import { mediaSp } from 'lib/media-query'
import { User, Evaluation } from 'types/types'

/* components */
import { Pagination } from 'components/molecules'
import { EvaluationItem, RadarChart } from 'components/organisms'

type Props = {
  className?: string
  user: User
  evaluations: Evaluation[]
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

    .icon-wrapper {
      width: 10rem;
      height: 10rem;
      margin: 0 auto 1.6rem;
      border-radius: 50%;
      overflow: hidden;

      > img {
        width: 100%;
        height: 100%;
      }
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

export const MypageTopTpl: React.FC<Props> = ({
  user,
  evaluations,
  currentPage,
  lastPage,
  publishEvaluation,
  unpublishEvaluation,
  deleteEvaluation,
}) => {
  return (
    <StyledWrapper>
      <div className="user">
        <div className="icon-wrapper">
          <img src={user.icon_url} alt={user.name} className="icon" />
        </div>
        <p className="name">{user.name}</p>
        <p className="profile">{user.profile}</p>
      </div>

      {/* TODO: バックエンドから小数第1位までのstringにして返す */}
      <RadarChart data={['5.0', '4.0', '3.3', '5.0', '4.2', '3.0']} className="chart" />

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
