import React, { useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { API_URL } from '../constants';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

export default function Customerlist() {
    const [customers, setCustomers] = useState([]);

    const [columnDefs] = useState([
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

    useEffect(() => {
        getCustomers();
    }, []);

    return (
       <> 
            <div
                className='ag-theme-material'
                style={{width: '90%', height: 600, margin: 'auto'}}>
                <AgGridReact
                    rowData={customers}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={10}
                />        
            </div>
       </>     
    );
}