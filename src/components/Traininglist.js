import React, { useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { Snackbar } from '@mui/material';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { URL } from '../constants';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

export default function Traininglist() {
    const [trainings, setTrainings] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");


    const [columnDefs] = useState([
        {headerName: "Date", field: 'date', sortable: true, filter: true},
        {headerName: "Duration", field: 'duration', sortable: true, filter: true},
        {headerName: "Activity (min)", field: 'activity', sortable: true, filter: true},
        {headerName: "Customer Name", field: 'customer', sortable: true, filter: true},
        {
            cellRenderer: params => 
            <Button 
                size='small' 
                color='error'
                onClick={() => deleteTraining(params)}
                startIcon={<DeleteIcon />}
            >
            </Button>
            , width: 120}
    ]);

    const getTrainings = () => {
        fetch(URL)
        .then(response => {
            if (response.ok){
                return response.json();
            }
            else {
                alert('Something went wrong in GET request');
            }    
        })
        .then((data) => {
            Promise.all(
                data.map((training) =>
                    ({
                        date: dayjs(training.date).format("DD.MM.YYYY HH:mm"),
                        duration: training.duration,
                        activity: training.activity,
                        customer: `${training.customer.firstname} ${training.customer.lastname}`,
                    })
                )
            )
            .then((formattedTrainings) => setTrainings(formattedTrainings))
            .catch(err => console.error(err))
        });
    }
    
    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        setSnackbarOpen(false);
    };
    
    const deleteTraining = (params) => {
        if (window.confirm('Are you sure?')) {
            const url = params.links.find((link) => link.rel === "self").href;
            fetch(url, { method: 'DELETE'})
            .then(response => {
                if (response.ok) {
                    setTrainings((prevTrainings) =>
                    prevTrainings.filter((t) => t.links[0].href !== url)
                  );
                  setSnackbarMessage("Training deleted successfully");
                  setSnackbarOpen(true);
                }
                else {
                    alert('Something went wrong in deletion');
                }
            })
            .catch(err => console.error(err))
        } 
    }


    useEffect(() => {
        getTrainings();
    }, []);

    return (
        <> 
            <div
                className='ag-theme-material'
                style={{width: '90%', height: 600, margin: 'auto'}}>
                <AgGridReact
                    rowData={trainings}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={10}
                />        
            </div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose= {handleSnackbarClose}
                message={snackbarMessage}
            />
       </>     
    );
}