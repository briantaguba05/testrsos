// ** React Imports
import { forwardRef, useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

import FilterVariant from 'mdi-material-ui/FilterVariant'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'

// ** Icons Imports
import BellOutline from 'mdi-material-ui/BellOutline'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Styled Menu component
const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'visible',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  overflow: 'visible',
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const styles = {
  maxHeight: 349,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0
  }
}

const capital = (string) => {
  var words = string.split(' ')

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ")
}

const DateInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />
})

const FilterDropdown = props => {
  const { onClick, status, defaultStatus, startDateDisable, endDateDisable } = props;

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  const [values, setValues] = useState({
    startDate: null,
    endDate: null,
    status: defaultStatus,
  })

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClickApply = () => {
    if (onClick) {
      onClick({
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status,
      })
    }
  }

  const handleDropdownClose = () => {
    handleClickApply()
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <FilterVariant />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ overflow: 'visible' }}
      >
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 600 }}>Filter</Typography>
          </Box>
        </MenuItem>
        {
          !startDateDisable ? <MenuItem>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', overflow: 'visible', zIndex: '20' }}>
              <FormControl fullWidth>
                <DatePickerWrapper>
                  <DatePicker
                    selected={values.startDate}
                    popperProps={{
                      positionFixed: true // use this to make the popper position: fixed
                    }}
                    isClearable={true}
                    showYearDropdown
                    showMonthDropdown
                    dateFormat='yyyy/MM/dd'
                    placeholderText='YYYY/MM/DD'
                    customInput={<DateInput label='Start Date' />}
                    id='form-layouts-separator-date'
                    onChange={date => setValues(prevValues => { return { ...prevValues, startDate: date, endDate: null } })}
                  />
                </DatePickerWrapper>
              </FormControl>
            </Box>
          </MenuItem> : null
        }
        {
          !endDateDisable ? <MenuItem>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', overflow: 'visible', zIndex: '10' }}>
              <FormControl fullWidth>
                <DatePickerWrapper>
                  <DatePicker
                    selected={values.endDate}
                    disabled={!values.startDate}
                    isClearable={true}
                    showYearDropdown
                    showMonthDropdown
                    minDate={values.startDate}
                    dateFormat='yyyy/MM/dd'
                    placeholderText='YYYY/MM/DD'
                    customInput={<DateInput label='End Date' />}
                    id='form-layouts-separator-date'
                    onChange={date => setValues(prevValues => { return { ...prevValues, endDate: date } })}
                  />
                </DatePickerWrapper>
              </FormControl>
            </Box>
          </MenuItem> : null
        }
        {
          status && <MenuItem>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', overflow: 'visible' }}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Status</InputLabel>
                <Select
                  label='Status'
                  value={values.status}
                  id='form-layouts-separator-select'
                  onChange={(e) => setValues(prevValues => { return { ...prevValues, status: e.target.value } })}
                  labelId='form-layouts-separator-select-label'
                >
                  {
                    status.map((data, index) => {
                      return <MenuItem key={`status-${index}`} value={data}>{capital(data)}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
            </Box>
          </MenuItem>
        }
        <MenuItem
          disableRipple
          sx={{ py: 3.5, borderBottom: 0, borderTop: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Button fullWidth variant='contained' onClick={handleDropdownClose}>
            Apply
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default FilterDropdown
