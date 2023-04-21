import React, { useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { API_URL } from '../constants';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

export default function Traininglist() {
    const [trainings, setTrainings] = useState([]);

    const [columnDefs] = useState([
        {field: 'date', sortable: true, filter: true},
        {field: 'duration', sortable: true, filter: true},
        {field: 'activity', sortable: true, filter: true},
        {field: 'customer', sortable: true, filter: true}
    ]);

    const getTrainings = () => {
        fetch(API_URL+'/trainings')
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
                data.content.map((training) =>
                    fetch(training.links.find((link) => link.rel === "customer").href)
                        .then((response) => response.json())
                        .then((customerData) => ({
                            date: dayjs(training.date).format("DD.MM.YYYY HH:mm"),
                            duration: training.duration,
                            activity: training.activity,
                            customer: `${customerData.firstname} ${customerData.lastname}`,
                            link: training.links[0].href,
                        })
                    )
                )
            )
            .then((formattedTrainings) => setTrainings(formattedTrainings))
            .catch(err => console.error(err))
        });
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
       </>     
    );
}