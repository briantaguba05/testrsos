import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import themeConfig from 'src/configs/themeConfig'

import moment from 'moment';

// ** MUI Imports
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Skeleton from '@mui/material/Skeleton'
import { useTheme } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'

import { firebaseAuth, firestore } from 'src/configs/firebase';

// ** Icons Imports
import Pencil from 'mdi-material-ui/Pencil'
import Delete from 'mdi-material-ui/Delete'

const columns = [
  { id: 'title', label: 'Title', minWidth: 200, align: 'center', },
  { id: 'description', label: 'Description', minWidth: 50, align: 'center', },
  { id: 'startDate', label: 'Start Date and Time', minWidth: 100, align: 'center' },
  { id: 'endDate', label: 'End Date and Time', minWidth: 100, align: 'center' },
  { id: 'status', label: 'Status', minWidth: 50, align: 'center' },
  { id: 'action', label: 'Action', minWidth: 50, align: 'center' },
]

function Dashboard() {
  const [values, setValues] = useState({
    list: null,
    page: 0,
    rowsPerPage: 10,
  })

  const router = useRouter()
  const theme = useTheme()

  useEffect(() => {
    getUserdata()
    getData()
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

  async function getData() {
    const q = query(collection(firestore, "scheduled_ride"))

    await getDocs(q).then((snapshot) => {
      var array = []

      snapshot.forEach((data) => {
        array.push({
          title: data.data().title,
          description: data.data().description,
          startDate: moment(data.data().startDate.seconds * 1000).format("MMMM DD, YYYY hh:mm A"),
          endDate: moment(data.data().endDate.seconds * 1000).format("MMMM DD, YYYY hh:mm A"),
          status: moment().isBetween(moment(data.data().startDate.seconds * 1000), moment(data.data().endDate.seconds * 1000)) ? 'Active' : 'Inactive',
          action: <>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
            >
              <IconButton aria-label="edit" color="primary" size="small" onClick={() => { router.push(`/scheduled/edit?scheduledID=${data.id}`) }}>
                <Pencil fontSize="inherit" />
              </IconButton>
              <IconButton aria-label="edit" color="primary" size="small" onClick={async () => { await deleteDoc(doc(firestore, "scheduled_ride", data.id)); router.reload() }}>
                <Delete fontSize="inherit" />
              </IconButton>
            </Stack></>
        })
      })

      setValues(prevValues => { return { ...prevValues, list: array } })
    })
  }



  const handleChangePage = (event, newPage) => {
    setValues(prevValues => { return { ...prevValues, page: newPage } })
  }

  const handleChangeRowsPerPage = event => {
    setValues(prevValues => { return { ...prevValues, rowsPerPage: +event.target.value } })
    setValues(prevValues => { return { ...prevValues, page: 0 } })
  }


  return (
    <Grid container spacing={6}>
      <Head>
        <title>{`${themeConfig.templateName} - All Scheduled Ride`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} - All Scheduled Ride`}
        />
        <meta name='keywords' content='RSOS' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <Grid item xs={12}>
        <Typography variant='h5'>
          All Scheduled Ride
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 700 }}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    {columns.map(column => (
                      <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.list != null ? values.list.slice(values.page * values.rowsPerPage, values.page * values.rowsPerPage + values.rowsPerPage).map(row => {
                    return (
                      <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                        {columns.map(column => {
                          const value = row[column.id]

                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number' ? column.format(value) : value}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  }) : (
                    <TableRow hover role='checkbox' tabIndex={-1}>
                      {columns.map(column => (
                        <TableCell key={'skeleton' + column.id} align='center' sx={{ minWidth: column.minWidth }}>
                          <Skeleton variant="text" height={40} />
                        </TableCell>
                      ))}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component='div'
              count={values.list != null ? values.list.length : 0}
              rowsPerPage={values.rowsPerPage}
              page={values.page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Dashboard
