"use client"; // Forzar la ejecución en el lado del cliente

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { getMantenimientos } from '@/lib/apiService'; // Asegúrate de importar la función correcta

export default function CronogramaGeneral() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const maintenanceData = await getMantenimientos();
      const formattedEvents = maintenanceData.map((item: any) => ({
        title: item.tipo,
        start: item.fechaInicio,
        end: item.fechaFin,
      }));
      setEvents(formattedEvents);
    }

    fetchEvents();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cronograma General</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        events={events}
        eventColor="#378006"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        buttonText={{
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
        }}
        height="auto"
        eventDisplay="block"
      />
    </div>
  );
}
