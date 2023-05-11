import React, { useState, useEffect} from 'react';
import { Box } from '@mui/material';

import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { API_URL } from '../constants';
import Addcustomer from './Addcustomer';
import Editcustomer from './Editcustomer';
import Addtraining from './Addtraining';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

export default function Customerlist() {
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState();

    const [columnDefs] = useState([
        {
            headerName: "Edit",
            field: "edit",
            width: 60, 
            disableExport: true, 
            renderCell: (params) => <EditButtonCell {...params} />
        },
        {
            headerName: "Delete",
            field: "delete",
            width: 60,
            disableExport: true,
            renderCell: (params) => <DeleteButtonCell {...params} />
        },
        {
            headerName: "Add Training",
            field: "addTraining",
            width: 130,
            disableExport: true,
            renderCell: (params) => <AddTrainingButtonCell {...params} />
        },
        {headerName: "First Name", field: 'firstname', sortable: true, filter: true, width: 120},
        {headerName: "Last Name", field: 'lastname', sortable: true, filter: true, width: 125},
        {headerName: "Street Address", field: 'streetaddress', sortable: true, filter: true, width: 190},
        {headerName: "Postcode", field: 'postcode', sortable: true, filter: true, width: 100},
        {headerName: "City", field: 'city', sortable: true, filter: true, width: 110},
        {headerName: "E-mail", field: 'email', sortable: true, filter: true, width: 200},
        {headerName: "Phone", field: 'phone', sortable: true, filter: true, width: 150}
    ]);

    function EditButtonCell(props) {
        return (
          <Editcustomer
            params={props.row}
            updateCustomer={updateCustomer}
          >
            <EditIcon />
          </Editcustomer>
        );
    }
      
    function DeleteButtonCell(props) {
        return (
          <Button
            size="small"
            color="error"
            onClick={() => deleteCustomer(props.row)}
          >
            <DeleteIcon />
          </Button>
        );
    }
      
    function AddTrainingButtonCell(props) {
        return (
          <Addtraining
            date={moment()}
            activity=""
            duration=""
            customer={props.row.links[1].href}
            saveTraining={addTrainingToCustomers}
          />
        );
    }

    const getCustomers = () => {
        fetch('https://traineeapp.azurewebsites.net/api/customers')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                alert('Something went wrong in GET request');
            }   
        })        
        .then(data => setCustomers(data.content))
        .catch(err => console.error(err))
    }

    const deleteCustomer= (params) => {
        if (window.confirm('Are you sure?')) {
            fetch(params.data.links[0].href.replace("http://", "https://"), { method: 'DELETE'})
            .then((response) => {
                if (response.ok) {
                    setMsg("Customer deleted");
                    setOpen(true);
                    getCustomers();
                }
                else {
                    alert('Something went wrong in deletion');
                }
            })
            .catch(err => console.error(err))
        } 
    };

    const addCustomer = (customer) => {
        fetch( 'https://traineeapp.azurewebsites.net/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
        .then(response => {
            if(response.ok) {
                getCustomers();
            }
            else {
                alert('Something went wrong in addition: ' + response.statusText);
            }
        })
        .catch(err => console.error(err))
    }

    const updateCustomer = (updatedCustomer, url) => {
        fetch(url.replace("http://", "https://"), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCustomer)
        })
        .then(response => {
            if (response.ok) {
                setMsg("Customer edited successfully");
                setOpen(true);
                getCustomers();
            }
            else {
                alert('Something went wrong when editing');
            }
        })
        .catch(err => console.error(err))
    }

    const addTraining = async (training) => {
        const response = await fetch(API_URL + '/trainings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(training)
        });
        const data = await response.json();
        console.log("API response: ", data);
        if(response.ok) {
            setMsg('Training added.');
            setOpen(true);
        }
        else {
            alert('Something went wrong in addition: ' + response.statusText);
            setOpen(true);
        }
    }   

    const addTrainingToCustomers = async (training) => {
        await addTraining(training);
        getCustomers();
    }

    useEffect(() => {
        getCustomers();
    }, []);

    return (
       <>                 
        <Addcustomer addCustomer={addCustomer}/>    
        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
            <Box width="95%">
                <div
                    style={{width: '90%', height: 600, margin: 'auto'}}>
                    <DataGrid 
                        components={{ Toolbar: GridToolbar  }}
                        rows={customers}
                        columns={columnDefs}
                        initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pagination
                        pageSize={10}
                        pageSizeOptions={[5, 10, 15]}
                        getRowId={(row) => row.email} 
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