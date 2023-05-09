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

function App() {
  const [value, setValue] = useState('one');

  const handleChange = (event, value) => {
    setValue(value);
  }

  return (
    <div className="App">
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>CUSTOMER PERSONAL TRAINING</Typography>
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

    </div>
  );
}

export default App;
