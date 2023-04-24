import React, { useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { API_URL } from '../constants';
import Addcustomer from './Addcustomer';
import Editcustomer from './Editcustomer';
import Addtraining from './Addtraining';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

export default function Customerlist() {
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState();

    const [columnDefs] = useState([
        {cellRenderer: params =>
            <Editcustomer
                params = {params.data}
                updateCustomer ={updateCustomer} />
            , width: 70},
        {cellRenderer: params => 
            <Button 
                size='small' 
                color='error'
                onClick={() => deleteCustomer(params)}
                startIcon = {<DeleteIcon />}
            >
            </Button>, width: 70},
        {cellRenderer: params =>
            <Addtraining
                date={moment()}
                activity=''
                duration=''
                customer={params.data.links[1].href}
                saveTraining ={addTrainingToCustomers} />
            , width: 150},
        {field: 'firstname', sortable: true, filter: true, width: 130},
        {field: 'lastname', sortable: true, filter: true, width: 135},
        {field: 'streetaddress', sortable: true, filter: true, width: 200},
        {field: 'postcode', sortable: true, filter: true, width: 130},
        {field: 'city', sortable: true, filter: true, width: 110},
        {field: 'email', sortable: true, filter: true, width: 200},
        {field: 'phone', sortable: true, filter: true, width: 150}
    ]);

    const getCustomers = () => {
        fetch(API_URL+'/customers')
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
            fetch(params.data.links[0].href, { method: 'DELETE'})
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
        fetch(API_URL + '/customers', {
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
        fetch(url, {
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
            <div
                className='ag-theme-material'
                style={{width: '90%', height: 600, margin: 'auto'}}>
                <Addcustomer addCustomer={addCustomer}/>    
                <AgGridReact
                    rowData={customers}
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