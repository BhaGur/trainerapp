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
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState();


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
        fetch('https://traineeapp.azurewebsites.net/gettrainings')
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
                        id: training.id,
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
    
    
    const deleteTraining = (params) => {
        const id = params.data.id;
        
        if (window.confirm('Are you sure?')) {
          const deleteURL = `https://traineeapp.azurewebsites.net/api/trainings/${id}`;
      
          fetch(deleteURL.replace("http://", "https://"), { method: 'DELETE' })
            .then(response => {
              if (response.ok) {
                getTrainings();
                setMsg("Training deleted");
                setOpen(true);
              } else {
                alert('Something went wrong in deletion');
              }
            })
            .catch(err => console.error(err));
        }
      };


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
                open={open}
                autoHideDuration={3000}
                onClose= {() => setOpen(false)}
                message={msg}
            />
       </>     
    );
}