import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { URL } from "../constants";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function CalendarMap() {
    const [trainings, setTrainings] = useState([]);

    useEffect(() => {
        getTrainings()
    }, []);

    const getTrainings = () => {
        fetch(URL)
          .then((response) => response.json())
          .then((data) => {
            Promise.all(
              data.map((training) =>
                ({
                  title: `${training.activity} / ${training.customer.firstname} ${training.customer.lastname}`,
                  start: moment(training.date).toDate(),
                  end: moment(training.date).add(training.duration, "m").toDate(),
                  customerName: `${training.customer.firstname} ${training.customer.lastname}`,
                })
              )
            )
            .then((formattedTrainings) => setTrainings(formattedTrainings))
            .catch((error) => console.error(error));
          });
      };
   
    return(
        <div>
            <Calendar
                localizer={localizer}
                events={trainings}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                tooltipAccessor="customerName"
                style={{ height: 500, width: '95%'}}
                views={["month", "week", "day"]}
                defaultView="week"
            />
        </div>
    )
}