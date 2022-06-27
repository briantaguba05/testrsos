// ** React Imports
import { useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";

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

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

import { firebaseAuth } from 'src/configs/firebase';

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
    router.push('/register')
  }

  async function handleLogin() {

    try {
      const response = await signInWithEmailAndPassword(firebaseAuth, values.email, values.password)

      if (response.user) {
        router.push('/home')
      }
    } catch (error) {
      setValues({ ...values, error: error.message })

      setTimeout(() => {
        setValues({ ...values, error: null })
      }, 5000)
    }
  }

  return (
    <Box className='content-center'>
      <Head>
        <title>{`${themeConfig.templateName} - Login`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} - Login`}
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
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <TextField autoFocus fullWidth id='email' type='email' value={values.email} onChange={handleChange('email')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }} label='Email' sx={{ marginBottom: 4 }} />
            <TextField autoFocus fullWidth id='password' type='password' value={values.password} onChange={handleChange('password')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }} label='Password' sx={{ marginBottom: 4 }} />
            <Box sx={{ mb: 5, }} />
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7 }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </form>
          <Button
            fullWidth
            size='large'
            color='secondary'
            variant='contained'
            sx={{ marginBottom: 7 }}
            onClick={handleRegister}
          >
            Register
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
