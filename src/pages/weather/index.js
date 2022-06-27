import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import themeConfig from 'src/configs/themeConfig'
import moment from 'moment';

// ** MUI Imports
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'

const axios = require('axios').default;

const capital = (string) => {
  var words = string.split(' ')

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ")
}


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
  [`&.${tableCellClasses.th}`]: {
    fontSize: 20,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function Dashboard() {
  const [values, setValues] = useState({
    weather: null,
    weather5Days: null,
  })

  const theme = useTheme()

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(getWeather);
  }, []);

  async function getWeather(position) {
    try {
      const response = await axios({
        method: 'get',
        url: `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=60d505bb48f9c02e8d1f29a621cd125f&units=metric`,
      })

      if (response.status === 200) {
        console.log(response.data)

        const groups = response.data.list.reduce((groups, value) => {
          const date = moment(value.dt * 1000).format("MMMM DD,YYYY");
          console.log(date)
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(value);

          return groups;
        }, {});

        const groupArrays = Object.keys(groups).map((date) => {
          return {
            date,
            forecast: groups[date]
          };
        });

        console.log(groupArrays)

        setValues(prevValues => { return { ...prevValues, weather: response.data, weather5Days: groupArrays } })
      }

    } catch (error) {
      console.log(error)
    }
  }


  return (
    <Grid container spacing={6}>
      <Head>
        <title>{`${themeConfig.templateName} - News`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} - News`}
        />
        <meta name='keywords' content='RSOS' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      {
        values.weather ? <Grid item xs={12}>
          <Typography variant='h5'>
            5 Day Weather Forecast at {values.weather.city.name}, {values.weather.city.country}
          </Typography>
        </Grid> : null
      }
      {
        values.weather5Days ? values.weather5Days.map(data => {
          console.log(data);

          return <Grid key={data.dt} item xs={12} md={4} lg={4}>
            <Card>
              <CardContent>
                <Typography variant='body2' sx={{ fontWeight: 800, fontSize: '15px' }}>
                  {data.date}
                </Typography>
                <br />
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer sx={{ maxHeight: 700 }}>
                    <Table stickyHeader aria-label='sticky table'>
                      <TableHead>
                        <TableRow>
                          <TableCell key='date' align='left' sx={{ minWidth: 150 }}>
                            Date
                          </TableCell>
                          <TableCell key='temp' align='center' sx={{ minWidth: 50 }}>
                            Temperature
                          </TableCell>
                          <TableCell key='temp' align='right' sx={{ minWidth: 180 }}>
                            Weather
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.forecast.map(forecast => {
                          return <StyledTableRow key={forecast.dt} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }} >
                            <StyledTableCell sx={{ fontWeight: 800, fontSize: '15px', minWidth: 150 }} component='th' scope='row'>
                              {moment(forecast.dt * 1000).format("hh:mm a")}
                            </StyledTableCell >
                            <StyledTableCell align='center' sx={{ minWidth: 50 }}>{forecast.main.temp}°c</StyledTableCell>
                            <StyledTableCell align='right' sx={{ minWidth: 180 }}>{capital(forecast.weather[0].description)}</StyledTableCell>
                          </StyledTableRow>
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        }) : <CircularProgress />
      }
    </Grid>
  )
}

export default Dashboard