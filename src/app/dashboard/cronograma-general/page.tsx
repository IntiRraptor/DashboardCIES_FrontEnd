"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getMantenimientos } from "@/lib/apiService";
import { Loader2 } from "lucide-react";

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

          const details = JSON.parse(item.details);
          const typeForm = details.typeForm;

          return {
            title: `${item.tipo} - ${typeForm}`,
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

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Cronograma General
          </h2>
          <p className="text-muted-foreground">
            Visualiza todas las actividades y mantenimientos programados.
          </p>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Calendario events={events} />
      )}
    </div>
  );
}
