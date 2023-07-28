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

  .data {
    color: ${(props): string => props.theme.primary};
    font-size: 2.4rem;
    font-weight: 700;
    position: absolute;

    /* TODO: 場所要調整 */
    &.index0 {
      top: -1rem;
      left: calc(50% + 1.5rem);
    }
    &.index1 {
      top: 8.5rem;
      right: 0;
    }
    &.index2 {
      bottom: 4.2rem;
      right: 0;
    }
    &.index3 {
      bottom: -0.5rem;
      left: calc(50% + 1.5rem);
    }
    &.index4 {
      bottom: 4.2rem;
      left: 0;
    }
    &.index5 {
      top: 8.5rem;
      left: 0;
    }
  }
`

export const RadarChart: React.FC<Props> = ({ className, data }) => {
  const chartData = {
    labels: EvaluationLabelValues,
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
        <span className={`data index${index}`} key={index}>
          {data[index]}
        </span>
      ))}
    </StyledWrapper>
  )
}
