import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

export default function Addtraining (props) {
    const [open, setOpen] = React.useState(false);
    const [training, setTraining] = React.useState({
        date: null,
        activity: '',
        duration: '',
        customer: ''
    });

    const handleClickOpen = () => {
        setTraining({
            date: props.date,
            customer: props.customer
        })
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }
    
    const updateTraining = () => {
        const newTraining = {
            date: dayjs(training.date).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
            activity: training.activity,
            duration: parseInt(training.duration, 10),
            customer: training.customer
        }
        console.log('newTraining:', newTraining);

        props.saveTraining(newTraining);
        handleClose();
    };

    return(
        <div>
            <Button variant="text" color="primary" onClick={handleClickOpen}>
                Add Training
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New Training</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker 
                            value={dayjs(training.date)}
                            onChange={e => setTraining({...training, date: e})}
                            label="Date"
                            renderInpuit={(params) => <TextField {...params} />}
                            fullWidth
                            format='DD.MM.YY HH:mm'
                            variant="standard"/>
                    </LocalizationProvider>                        
                    <TextField
                        margin="dense"
                        value={training.activity}
                        onChange={e => setTraining({...training, activity: e.target.value})}
                        label="Activity"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        value={training.duration}
                        onChange={e => setTraining({...training, duration: e.target.value})}
                        label="Duration"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={updateTraining} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}