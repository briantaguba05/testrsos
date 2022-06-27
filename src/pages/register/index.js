// ** React Imports
import { useState, useEffect } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, addDoc, getDocs, Timestamp, query, where } from "firebase/firestore";

const axios = require('axios').default;

// ** Next Imports
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

import { firebaseAuth, firestore } from 'src/configs/firebase';

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    motorcycleType: '',
    plateNumber: '',
    riderID: '',
    role: 'rider',
    error: null
  })

  const router = useRouter()

  useEffect(() => {
    if (firebaseAuth.currentUser) {
      router.push('/home')
    }
  });

  // ** Hook
  const theme = useTheme()


  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  async function handleRegister() {
    if (values.password != values.confirmPassword) {
      setValues({ ...values, error: 'Password not match' })

      setTimeout(() => {
        setValues({ ...values, error: null })
      }, 5000)

      return
    }

    try {
      const response = await createUserWithEmailAndPassword(firebaseAuth, values.email, values.password)

      if (response.user) {
        updateProfile(response.user, {
          displayName: `${values.fullName}|${values.role}`,
        })
        if (values.role === 'rider') {
          console.log('added rider')
          addDoc(collection(firestore, "users"), {
            auth_uid: response.user.uid,
            full_name: values.fullName,
            email: values.email,
            mobile_number: values.phone,
            motorcycle_type: values.motorcycleType,
            plate_number: values.plateNumber,
            role: values.role,
          });
        } else {
          console.log('added family')
          addDoc(collection(firestore, "users"), {
            auth_uid: response.user.uid,
            full_name: values.fullName,
            email: values.email,
            mobile_number: values.phone,
            riderID: values.riderID,
            role: values.role,
          });
        }

        router.push('/home')
      }
    } catch (error) {
      setValues({ ...values, error: error.message })

      setTimeout(() => {
        setValues({ ...values, error: null })
      }, 5000)
    }

  }

  async function handleLogin() {
    router.push('/')
  }

  return (
    <Box className='content-center'>
      <Head>
        <title>{`${themeConfig.templateName} - Register`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} - Register`}
        />
        <meta name='keywords' content='RSOS' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>

      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>

          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}
            </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()} >
            <TextField autoFocus fullWidth id='fullName' type='text' value={values.fullName} onChange={handleChange('fullName')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRegister();
                }
              }} label='Full Name' sx={{ marginBottom: 4 }} />
            <TextField autoFocus fullWidth id='email' type='email' value={values.email} onChange={handleChange('email')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRegister();
                }
              }} label='Email' sx={{ marginBottom: 4 }} />
            <TextField autoFocus fullWidth id='phone' type='tel' value={values.phone} onChange={handleChange('phone')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRegister();
                }
              }} label='Phone' sx={{ marginBottom: 4 }} />
            <TextField autoFocus fullWidth id='password' type='password' value={values.password} onChange={handleChange('password')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRegister();
                }
              }} label='Password' sx={{ marginBottom: 4 }} />
            <TextField autoFocus fullWidth id='confirmPassword' type='password' value={values.confirmPassword} onChange={handleChange('confirmPassword')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRegister();
                }
              }} label='Confirm Password' sx={{ marginBottom: 4 }} />
            <FormControl fullWidth sx={{ marginBottom: 4 }}>
              <InputLabel id='form-layouts-separator-select-label'>User Type</InputLabel>
              <Select
                label='User Type'
                value={values.role}
                id='form-layouts-separator-select'
                onChange={(e) => setValues(prevValues => { return { ...prevValues, role: e.target.value } })}
                labelId='form-layouts-separator-select-label'
              >
                <MenuItem value='rider'>Rider</MenuItem>
                <MenuItem value='family'>Family</MenuItem>
              </Select>
            </FormControl>
            {
              values.role === 'family' ? <TextField autoFocus fullWidth id='riderID' type='text' value={values.riderID} onChange={handleChange('riderID')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRegister();
                  }
                }} label='Rider ID' sx={{ marginBottom: 4 }} /> : <>
                <TextField autoFocus fullWidth id='plateNumber' type='text' value={values.plateNumber} onChange={handleChange('plateNumber')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRegister();
                    }
                  }} label='Plate Number' sx={{ marginBottom: 4 }} />
                <TextField autoFocus fullWidth id='motorcycleType' type='text' value={values.motorcycleType} onChange={handleChange('motorcycleType')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRegister();
                    }
                  }} label='Motorcycle Type' sx={{ marginBottom: 4 }} /></>
            }

            <Box sx={{ mb: 5, }} />
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7 }}
              onClick={handleRegister}
            >
              Register
            </Button>
          </form>
          <Button
            fullWidth
            size='large'
            color='secondary'
            variant='contained'
            sx={{ marginBottom: 7 }}
            onClick={handleLogin}
          >
            Login instead
          </Button>
          {values.error ? <Alert severity="error">{values.error}</Alert> : ''}
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
