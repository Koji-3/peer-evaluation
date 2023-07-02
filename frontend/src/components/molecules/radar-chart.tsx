/* @see https://www.chartjs.org/docs/latest/charts/radar.html */
import styled from 'styled-components'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { Radar } from 'react-chartjs-2'

/* lib, types */
import { mediaSp } from 'lib/media-query'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

type Props = {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string
      borderColor: string
      borderWidth: number
    }[]
  }
}

const Wrapper = styled.div`
  width: 300px;
  ${mediaSp`
  `}
`

export const RadarChart: React.FC<Props> = ({ data }) => {
  return (
    <Wrapper>
      <Radar data={data} />
    </Wrapper>
  )
}
