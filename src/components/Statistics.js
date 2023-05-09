import { useState, useEffect } from "react"
import { BarChart,CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from "recharts";
import _ from "lodash";
import { URL } from "../constants";

export default function Statistics () {
    const[trainings, setTrainings] = useState([]);

    const fetchData = () => {
      fetch(URL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                alert('Something went wrong while fetching');
            }   
        })        
        .then(data => setTrainings(data))
        .catch(err => console.error(err))
    };

    useEffect(() => {
        fetchData();
    }, []);

    const barChartData = _(trainings)
      .groupBy(training => training.activity.toLowerCase())
      .map((group, name) => ({
        name: _.startCase(name),
        minutes: _.sumBy(group, 'duration'),
      }))
    .value();
  
    const pieChartData = _(trainings)
      .map(training => {
        const date = new Date(training.date);
        return { ...training, day: date.toLocaleString('en-US', { weekday: 'long' }) };
      })
      .groupBy('day')
      .map((group, day) => ({
        name: day,
        value: group.length,
      }))
    .value();
    
    const COLORS = ['Aqua', 'BlueViolet', 'Crimson', 'DarkGreen', 'DimGrey', 'Orange', 'Brown'];
  

    return(
        <div>
            <h2>Activity Statistics</h2>
            <h3>Bar Chart of Trainings</h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                <BarChart width={700} height={350} data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Duration (min)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend verticalAlign="top" align="right" />
                    <Bar dataKey="minutes" fill="BlueViolet" />
                </BarChart>
            </div>
            <h3>Trainings by Day of the week</h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                <PieChart width={500} height={330}>
                    <Pie
                        data={pieChartData}
                        cx={250}
                        cy={150}
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={90}
                        fill="BlueViolet"
                        dataKey="value">
                        {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>
        </div>
    )
}