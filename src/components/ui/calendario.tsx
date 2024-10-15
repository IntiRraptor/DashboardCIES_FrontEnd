"use client";

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import "moment/locale/es";
moment.locale("es");

const localizer = momentLocalizer(moment);

export function Calendario({ events = [] }) {
  const [view, setView] = useState("week");
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setMounted(true);
  }, []);

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: "#E1F0FF",
      color: "#0080FF",
      border: "none",
      borderRadius: "5px",
    };

    if (event.title.includes("Preventivo")) {
      style.backgroundColor = "#F3E5FF";
      style.color = "#9747FF";
    } else if (event.title.includes("Correctivo")) {
      style.backgroundColor = "#FFF1E5";
      style.color = "#FF8A00";
    } else if (event.title.includes("Instalación")) {
      style.backgroundColor = "#FFE5E5";
      style.color = "#FF0000";
    } else if (event.title.includes("Capacitación")) {
      style.backgroundColor = "#E5FFE9";
      style.color = "#00BA34";
    }

    return { style };
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 bg-white rounded-md shadow-md mt-3">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={"ghost"}
            onClick={() => {
              const newDate = new Date(currentDate);
              if (view === "day") newDate.setDate(newDate.getDate() - 1);
              if (view === "week") newDate.setDate(newDate.getDate() - 7);
              if (view === "month") newDate.setMonth(newDate.getMonth() - 1);
              setCurrentDate(newDate);
            }}
          >
            <ChevronLeft />
          </Button>
          <Button variant={"ghost"} onClick={() => setCurrentDate(new Date())}>
            Hoy
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => {
              const newDate = new Date(currentDate);
              if (view === "day") newDate.setDate(newDate.getDate() + 1);
              if (view === "week") newDate.setDate(newDate.getDate() + 7);
              if (view === "month") newDate.setMonth(newDate.getMonth() + 1);
              setCurrentDate(newDate);
            }}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={view === "day" ? "secondary" : "ghost"}
            onClick={() => setView("day")}
          >
            Día
          </Button>
          <Button
            variant={view === "week" ? "secondary" : "ghost"}
            onClick={() => setView("week")}
          >
            Semana
          </Button>
          <Button
            variant={view === "month" ? "secondary" : "ghost"}
            onClick={() => setView("month")}
          >
            Mes
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar"
            className="pl-8 pr-4 py-2 rounded-md border border-gray-300"
          />
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={["day", "week", "month"]}
        view={view as View}
        date={currentDate}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        onView={(newView) => setView(newView)}
        eventPropGetter={eventStyleGetter}
        formats={{
          timeGutterFormat: (date, culture, localizer) =>
            localizer?.format(date, "h A", culture) || "",
          dayFormat: (date, culture, localizer) =>
            localizer?.format(date, "ddd D", culture) || "",
        }}
        components={{
          toolbar: () => null,
        }}
      />
    </div>
  );
}
