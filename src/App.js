import './App.css';
import Customerlist from './components/Customerlist';
import Traininglist from './components/Traininglist';
import CalendarMap from './components/Calendar';
import Statistics from './components/Statistics';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Switch } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'

function App() {
  const [value, setValue] = useState('one');
  const [theme, settheme] = useState(false);
  const darkTheme = createTheme({
        palette: {
            mode: theme ? 'dark' : 'light',
        },
    });

  const handleTheme = (event) => {
    settheme(event.target.checked);
  }

  const handleChange = (event, value) => {
    setValue(value);
  }

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' style={{flexGrow: 1}}>CUSTOMER PERSONAL TRAINING</Typography>
            <label>Dark Mode</label>
                  <Switch
                      checked={theme}
                      color='success'
                      onChange={handleTheme} />
          </Toolbar>
        </AppBar>
        <Tabs value={value} onChange={handleChange}>
          <Tab value="one" label="CUSTOMER" />
          <Tab value="two" label="TRAINING" />
          <Tab value="three" label="CALENDAR" />
          <Tab value="four" label="STATISTICS" />
        </Tabs>
        {value === 'one' && <div><Customerlist /></div>}
        {value === 'two' && <div><Traininglist /></div>}
        {value === 'three' && <div><CalendarMap /></div>}
        {value === 'four' && <div><Statistics /></div>}
      </ThemeProvider>
    </div>
  );
}

export default App;
