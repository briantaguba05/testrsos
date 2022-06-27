import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import themeConfig from 'src/configs/themeConfig'
import Link from 'next/link';

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

const axios = require('axios').default;

function Dashboard() {
  const [values, setValues] = useState({
    news: null,
  })

  const theme = useTheme()

  useEffect(() => {
    getNews()
  }, []);

  async function getNews() {
    try {
      const response = await axios({
        method: 'get',
        url: `https://newsapi.org/v2/top-headlines?country=ph&apiKey=80e699c8c8f24206974d630f39c4de56`,
      })

      if (response.status === 200) {
        console.log(response.data)

        setValues(prevValues => { return { ...prevValues, news: response.data.articles } })
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
        values.news ? values.news.map(data => (
          <Grid key={data.url} item xs={12} md={4} lg={4}>
            <Card>
              {
                data.urlToImage ? <CardMedia sx={{ height: '14.5625rem' }} image={data.urlToImage} /> : <CardMedia sx={{ height: '14.5625rem' }} image='/images/favicon.png' />
              }
              <CardContent>
                <Typography variant='h6' sx={{ marginBottom: 2 }}>
                  {data.title}
                </Typography>
                <Typography variant='body2'>
                  Source: {data.source.name}
                </Typography>
                <Typography variant='body2'>
                  Published At: {new Date(data.publishedAt).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions className='card-action-dense'>
                <Link href={data.url} passHref={true}>
                  <Button>Read More</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        )) : <CircularProgress />
      }
    </Grid>
  )
}

export default Dashboard