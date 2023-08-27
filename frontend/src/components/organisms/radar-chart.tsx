/* @see https://www.chartjs.org/docs/latest/charts/radar.html */
import styled from 'styled-components'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { Radar } from 'react-chartjs-2'
import { theme } from 'theme'

/* lib, types */
import { EvaluationLabelValues } from 'types/types'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

type Props = {
  className?: string
  data: string[]
}

const StyledWrapper = styled.div`
  width: 31.3rem;
  position: relative;

  .label {
    font-size: 1.2rem;
    position: absolute;

    &.index0 {
      top: 0;
      left: calc(50% - 4rem);
    }
    &.index1 {
      top: 6rem;
      right: -1rem;
    }
    &.index2 {
      top: calc(50% + 5rem);
      right: -1rem;
    }
    &.index3 {
      bottom: 0;
      left: calc(50% - 5.5rem);
    }
    &.index4 {
      top: calc(50% + 5rem);
      left: -1rem;
    }
    &.index5 {
      top: 6rem;
      left: -2.1rem;
    }
  }

  .data {
    width: 3.7rem;
    color: ${(props): string => props.theme.primary};
    font-size: 2.4rem;
    font-weight: 700;
    text-align: center;
    position: absolute;

    &.index0 {
      top: -0.7rem;
      left: calc(50% + 2.2rem);
      text-align: left;
    }
    &.index1 {
      top: 7.5rem;
      right: -0.4rem;
    }
    &.index2 {
      top: calc(50% + 6.5rem);
      right: -0.4rem;
    }
    &.index3 {
      bottom: -0.5rem;
      left: calc(50% + 3rem);
      text-align: left;
    }
    &.index4 {
      top: calc(50% + 6.5rem);
      left: -1rem;
    }
    &.index5 {
      top: 7.5rem;
      left: -1rem;
    }
  }
`

export const RadarChart: React.FC<Props> = ({ className, data }) => {
  const chartData = {
    labels: ['', '', '', '', '', ''],
    datasets: [
      {
        label: '',
        data,
        backgroundColor: `rgba(${theme.primaryRgb}, 0.5)`,
        borderColor: `rgba(${theme.primaryRgb}, 0.5)`,
        borderWidth: 1,
      },
    ],
  }

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: () => '',
          showLabelBackdrop: () => false,
        },
        pointLabels: {
          font: {
            size: 12,
            family: 'Noto Sans JP',
          },
          color: 'black',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  }

  return (
    <StyledWrapper className={className}>
      <Radar data={chartData} options={options} />
      {[...Array(6)].map((_, index) => (
        <div key={index}>
          <span className={`label index${index}`}>{EvaluationLabelValues[index]}</span>
          <span className={`data index${index}`} key={index}>
            {data[index]}
          </span>
        </div>
      ))}
    </StyledWrapper>
  )
}
