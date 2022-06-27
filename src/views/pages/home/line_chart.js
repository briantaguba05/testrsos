// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const LineChart = props => {
  // ** Props
  const { title, subtitle, data, labels, colors } = props

  // ** Hook
  const theme = useTheme()

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
    labels: labels,
    colors: colors,
    xaxis: {
      type: 'datetime'
    }
  }

  return (
    <Card>
      <CardHeader
        title={title}
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        {data != null ?
          <>
            <ReactApexcharts type='line' height={300} options={options} series={data} />
            <Typography variant='body' sx={{ mr: 4 }}>
              {subtitle}
            </Typography>
          </> :
          <CircularProgress />}
      </CardContent>
    </Card>
  )
}

export default LineChart
