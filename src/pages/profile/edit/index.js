// ** React Imports
import { forwardRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const axios = require('axios').default;
const cookie = require('cookie-cutter');

import moment from 'moment';
import Head from 'next/head'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import Close from 'mdi-material-ui/Close'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

const AccountSettings = () => {
  const [values, setValues] = useState({
    profileID: null,
    birthday: null,
    email: null,
    firstName: null,
    lastName: null,
    middleName: null,
    phone: null,
    profileImage: null,
    newImage: null,
    error: null
  })

  const router = useRouter()

  useEffect(() => {
    getProfile()
  }, []);

  async function getProfile() {
    try {
      const response = await axios({
        method: 'get',
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`
        },
        url: process.env.NEXT_PUBLIC_API_HOST + 'api/v1/auth/admin/profile',
      })

      if (response.status === 200) {
        setValues(prevValues => {
          return {
            ...prevValues,
            profileID: response.data.payload._id,
            birthday: new Date(response.data.payload.user.birthday),
            email: response.data.payload.user.email,
            firstName: response.data.payload.user.firstName,
            middleName: response.data.payload.user.middleName,
            lastName: response.data.payload.user.lastName,
            phone: response.data.payload.user.phone,
            profileImage: response.data.payload.user.profileImage,
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function updateProfile() {
    try {
      const response = await axios({
        method: 'post',
        headers: {
          Authorization: `Bearer ${cookie.get('token')}`
        },
        data: {
          userid: values.profileID,
          user: {
            birthday: moment(values.birthday).format("YYYY/MM/DD"),
            email: values.email,
            firstName: values.firstName,
            middleName: values.middleName,
            lastName: values.lastName,
            phone: values.phone,
            profileImage: values.newImage != null ? values.newImage : process.env.NEXT_PUBLIC_SPACES_HOST + values.profileImage,
          }
        },
        url: process.env.NEXT_PUBLIC_API_HOST + 'api/v1/auth/admin/edit',
      })

      if (response.status === 200) {
        router.reload()
      }
    } catch (error) {
      if (error.response && error.response.data.error.length > 0) {
        setValues({ ...values, error: `${error.response.data.error[0].msg} ${error.response.data.error[0].param}` })
        setTimeout(() => {
          setValues({ ...values, error: null })
        }, 5000)
      }
    }
  }

  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setValues(prevValues => { return { ...prevValues, newImage: reader.result } })
      reader.readAsDataURL(files[0])
    }
  }

  return (
    <DatePickerWrapper>
      <Card>
        <Head>
          <title>{`${themeConfig.templateName} - Edit Profile`}</title>
          <meta
            name='description'
            content={`${themeConfig.templateName} - Edit Profile`}
          />
          <meta name='keywords' content='Adda' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
        <CardContent>
          <form onSubmit={e => {
            e.preventDefault();
            updateProfile()
          }}>
            <Grid container spacing={7}>
              <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {
                    values.newImage != null ?
                      <ImgStyled src={values.newImage} alt='Profile Pic' />
                      : <ImgStyled src={values.profileImage != null ? process.env.NEXT_PUBLIC_SPACES_HOST + values.profileImage : ''} alt='Profile Pic' />
                  }

                  <Box>
                    <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                      Upload New Photo
                      <input
                        hidden
                        type='file'
                        onChange={onChange}
                        accept='image/png, image/jpeg'
                        id='account-settings-upload-image'
                      />
                    </ButtonStyled>
                    {
                      values.newImage != null ? <ResetButtonStyled color='error' variant='outlined' onClick={() => setValues(prevValues => { return { ...prevValues, newImage: null } })}>
                        Reset
                      </ResetButtonStyled> : null
                    }

                    <Typography variant='body2' sx={{ marginTop: 5 }}>
                      Allowed PNG or JPEG.
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='First Name' required value={values.firstName != null ? values.firstName : ''} onChange={(e) => setValues(prevValues => { return { ...prevValues, firstName: e.target.value } })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Middle Name' required value={values.middleName != null ? values.middleName : ''} onChange={(e) => setValues(prevValues => { return { ...prevValues, middleName: e.target.value } })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Last Name' required value={values.lastName != null ? values.lastName : ''} onChange={(e) => setValues(prevValues => { return { ...prevValues, lastName: e.target.value } })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Email' type='email' value={values.email != null ? values.email : ''} onChange={(e) => setValues(prevValues => { return { ...prevValues, email: e.target.value } })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Phone' type='tel' value={values.phone != null ? values.phone : ''} onChange={(e) => setValues(prevValues => { return { ...prevValues, phone: e.target.value } })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  selected={values.birthday != null ? values.birthday : null}
                  showYearDropdown
                  showMonthDropdown
                  dateFormat='yyyy/MM/dd'
                  placeholderText='YYYY/MM/DD'
                  customInput={<CustomInput />}
                  id='form-layouts-separator-date'
                  onChange={date => setValues(prevValues => { return { ...prevValues, birthday: date } })}
                />
              </Grid>

              <Grid item xs={12}>
                {values.error ? <><Alert severity="error">{values.error}</Alert><br /></> : ''}
                <Button type='submit' variant='contained' sx={{ marginRight: 3.5 }}>
                  Save Changes
                </Button>
                <Button variant='outlined' color='secondary' onClick={() => router.back()}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </DatePickerWrapper >
  )
}

export default AccountSettings
