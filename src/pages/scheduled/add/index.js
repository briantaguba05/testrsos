import React, { useState, useEffect, forwardRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import themeConfig from 'src/configs/themeConfig'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import { firebaseAuth, firestore } from 'src/configs/firebase';

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'


const DateInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />
})

function Dashboard() {
  const [values, setValues] = useState({
    title: null,
    description: null,
    startDate: null,
    endDate: null,
    isLoading: false
  })

  const router = useRouter()
  const theme = useTheme()

  useEffect(() => {
    getUserdata()
  }, []);

  async function getUserdata() {
    const q = query(collection(firestore, "users"), where("auth_uid", "==", firebaseAuth.currentUser.uid))

    await getDocs(q).then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.data().role != 'admin') {
          router.replace('/401')
        }
      })
    })
  }

  async function addScheduledRide() {
    addDoc(collection(firestore, "scheduled_ride"), {
      title: values.title,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
    });



    router.back()
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Head>
          <title>{`${themeConfig.templateName} - Add Scheduled Ride`}</title>
          <meta
            name='description'
            content={`${themeConfig.templateName} - Add Scheduled Ride`}
          />
          <meta name='keywords' content='RSOS' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
        <Grid item xs={12}>
          <Card>
            <form onSubmit={e => {
              e.preventDefault();
              addScheduledRide()
            }}>
              <CardContent>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Title' onChange={(e) => setValues(prevValues => { return { ...prevValues, title: e.target.value } })} required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Description' onChange={(e) => setValues(prevValues => { return { ...prevValues, description: e.target.value } })} required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      selected={values.startDate != null ? values.startDate : null}
                      showYearDropdown
                      showMonthDropdown
                      showTimeSelect
                      required
                      minDate={new Date()}
                      dateFormat='yyyy/MM/dd hh:ss a'
                      placeholderText='Start Date and Time'
                      customInput={<DateInput required />}
                      id='form-layouts-separator-date'
                      onChange={date => setValues(prevValues => { return { ...prevValues, startDate: date } })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      selected={values.endDate != null ? values.endDate : null}
                      showYearDropdown
                      showMonthDropdown
                      showTimeSelect
                      required
                      minDate={new Date()}
                      dateFormat='yyyy/MM/dd hh:ss a'
                      placeholderText='End Date and Time'
                      customInput={<DateInput required />}
                      id='form-layouts-separator-date'
                      onChange={date => setValues(prevValues => { return { ...prevValues, endDate: date } })}
                    />
                  </Grid>

                </Grid>

                {values.error ? <><br /><Alert severity="error">{values.error}</Alert></> : ''}
              </CardContent>
              <Divider sx={{ margin: 0 }} />

              <CardActions>
                {
                  values.isLoading ?
                    <Button size='large' sx={{ mr: 2 }} variant='contained'>
                      <CircularProgress style={{ 'color': 'white' }} />
                    </Button> :
                    <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                      Submit
                    </Button>
                }
              </CardActions>
            </form>
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default Dashboard