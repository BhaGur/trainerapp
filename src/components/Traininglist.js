import React, { useState, useEffect} from 'react';
import dayjs from 'dayjs';
import { Snackbar } from '@mui/material';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box } from '@mui/material';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

export default function Traininglist() {
    const [trainings, setTrainings] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState();

    const [columnDefs] = useState([    
        {headerName: "Date", field: 'date', sortable: true, filter: true, width: 200},
        {headerName: "Duration", field: 'duration', sortable: true, filter: true, width: 200},
        {headerName: "Activity (min)", field: 'activity', sortable: true, filter: true, width: 200},
        {headerName: "Customer Name", field: 'customer', sortable: true, filter: true, width: 200},
        {
            headerName: "Delete",
            field: "delete",
            width: 150,
            disableExport: true,
            renderCell: (params) => <DeleteButtonCell {...params} />
        }
    ]);

    function DeleteButtonCell(props) {
        return (
            <Button         
            size='small'
            color='error'
            onClick={() => deleteTraining(props.row)}
            >
                <DeleteIcon />
            </Button>
        )
    }

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
        const id = params.id;
        
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
           <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                <Box width="95%">
                    <div
                        style={{width: '90%', height: 600, margin: 'auto'}}>
                        <DataGrid
                            components={{Toolbar: GridToolbar}}
                            rows={trainings}
                            columns={columnDefs}
                            initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            pagination
                            pageSize={10}
                            pageSizeOptions={[5, 10, 15]}
                            getRowId={(row) => row.id} 
                        />        
                    </div>
                </Box> 
            </Box> 
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose= {() => setOpen(false)}
                message={msg}
            />
       </>     
    );
}