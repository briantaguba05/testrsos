// ** Icon imports
import Calendar from 'mdi-material-ui/Calendar'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import CalendarPlus from 'mdi-material-ui/CalendarPlus'
import WeatherCloudy from 'mdi-material-ui/WeatherCloudy'
import Newspaper from 'mdi-material-ui/Newspaper'

const navigation = () => {
  return [
    {
      title: 'Home',
      icon: HomeOutline,
      path: '/home'
    },
    {
      title: 'News',
      icon: Newspaper,
      path: '/news',
    },
    {
      title: 'Weather Forecast',
      icon: WeatherCloudy,
      path: '/weather',
    },
    {
      sectionTitle: 'Ride Management'
    },
    {
      title: 'Add Scheduled Ride',
      icon: CalendarPlus,
      path: '/scheduled/add',
    },
    {
      title: 'Scheduled Rides',
      icon: Calendar,
      path: '/scheduled/all',
    },

  ]
}

export default navigation
