import React, { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const CalendarView = ({ events }) => {
  const calendarRef = useRef(null);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.removeAllEvents();
      events.forEach(event => calendarApi.addEvent(event));
    }
  }, [events]);

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      height="auto"
      contentHeight={500}
      aspectRatio={2}
      events={events}
    />
  );
};

export default CalendarView;