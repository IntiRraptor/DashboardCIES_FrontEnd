"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getMantenimientos } from "@/lib/apiService";

// Importación dinámica del componente Calendario
const Calendario = dynamic(
  () => import("@/components/ui/calendario").then((mod) => mod.Calendario),
  {
    ssr: false, // Deshabilita el SSR para este componente
  }
);

export default function CronogramaGeneral() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        const maintenanceData = await getMantenimientos();
        const formattedEvents = maintenanceData.map((item) => {
          const startDate = new Date(item.fechaInicio);
          const endDate = new Date(item.fechaFin);

          if (item.hora) {
            const [hours, minutes] = item.hora.split(":").map(Number);
            startDate.setHours(hours, minutes);
            endDate.setHours(hours + 1, minutes);
          }

          return {
            title: item.tipo,
            start: startDate,
            end: endDate,
            status: item.estado,
            allDay: false, // Asegúrate de que no sean eventos de todo el día
          };
        });
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cronograma General</h1>
      <Calendario events={events} />
    </div>
  );
}
