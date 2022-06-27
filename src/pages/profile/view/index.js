// ** React Imports
import { useState, useEffect } from 'react'
import { firebaseAuth, firestore } from 'src/configs/firebase';
import { collection, getDocs, query, where } from "firebase/firestore";

import Head from 'next/head'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'


const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const AccountSettings = () => {
  const [values, setValues] = useState({
    account: null,
    error: null
  })

  useEffect(() => {
    getUserdata()
  }, []);

  async function getUserdata() {
    const q = query(collection(firestore, "users"), where("auth_uid", "==", firebaseAuth.currentUser.uid))

    await getDocs(q).then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.data())

        setValues(prevValues => { return { ...prevValues, account: doc.data() } })
      })
    })
  }

  return (
    <Card>
      <Head>
        <title>{`${themeConfig.templateName} - View Profile`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} - View Profile`}
        />
        <meta name='keywords' content='Adda' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <CardContent>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Full Name' value={values.account != null ? values.account.full_name : ''} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Mobile Number' value={values.account != null ? values.account.mobile_number : ''} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Email' value={values.account != null ? values.account.email : ''} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Motorcycle Type' value={values.account != null && values.account.motorcycle_type != null ? values.account.motorcycle_type : ''} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Plate Number' value={values.account != null && values.account.plate_number != null ? values.account.plate_number : ''} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Role' value={values.account != null ? values.account.role : ''} InputProps={{ readOnly: true }} />
          </Grid>
          {
            values.account && values.account.role === 'family' ? <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Linked Rider ID' value={values.account != null && values.account.riderID != null ? values.account.riderID : ''} InputProps={{ readOnly: true }} />
            </Grid> : null
          }
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AccountSettings
