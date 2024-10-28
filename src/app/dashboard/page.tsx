"use client";

import { getMantenimientos } from "@/lib/apiService";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { NotificationCard } from "@/components/dashboard/notification-card";
import { Overview } from "@/components/dashboard/overview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileText, Send, Clock, Activity } from "lucide-react";
import { useEffect, useState } from "react";

// Función actualizada para calcular la disponibilidad de equipos
function calcularDisponibilidadEquipos(mantenimientos: any[]): number {
  const totalEquipos = 200; // Total estimado de equipos
  const mantenimientosNoConcluidos = mantenimientos.filter(m => m.estado !== "Completado").length;
  const porcentajeNoDisponible = (mantenimientosNoConcluidos / totalEquipos) * 100;
  const disponibilidad = 100 - porcentajeNoDisponible;
  return Math.max(0, Math.min(100, Math.round(disponibilidad * 100) / 100)); // Aseguramos que esté entre 0 y 100, redondeado a 2 decimales
}

// Función para calcular el tiempo de inactividad de equipos
function calcularTiempoInactividad(mantenimientos: any[]): number {
  const tiempoTotal = mantenimientos.reduce((total, m) => {
    const inicio = new Date(m.fechaInicio);
    const fin = new Date(m.fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    return total + diferencia;
  }, 0);
  return Math.round(tiempoTotal / (1000 * 60 * 60)); // Convertir a horas y redondear
}

export default function DashboardPage() {
  const [maintenanceHistory, setMaintenanceHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchMaintenanceHistory = async () => {
      const data = await getMantenimientos();
      setMaintenanceHistory(data);
    };

    fetchMaintenanceHistory();
  }, []);

  const reportesGenerados = maintenanceHistory.length;
  const reportesProgramados = maintenanceHistory.filter(
    (m: any) => m.estado === "Programado"
  ).length;
  const correctivos = maintenanceHistory.filter(
    (m: any) => m.tipo === "Correctivo"
  ).length;
  const preventivos = maintenanceHistory.filter(
    (m: any) => m.tipo === "Preventivo"
  ).length;
  const ratioCorrectivoPreventivo =
    preventivos > 0 ? (correctivos / preventivos).toFixed(2) : "N/A";
  const preventivosCompletados = maintenanceHistory.filter(
    (m: any) => m.tipo === "Preventivo" && m.estado === "Completado"
  ).length;
  const porcentajePreventivoCompletado =
    reportesProgramados > 0
      ? ((preventivosCompletados / reportesProgramados) * 100).toFixed(2)
      : "N/A";

  // Nuevas métricas
  const disponibilidadEquipos = calcularDisponibilidadEquipos(maintenanceHistory);
  const tiempoInactividad = calcularTiempoInactividad(maintenanceHistory);

  return (
    <div className="flex-col space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard CIES</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reportes Generados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportesGenerados}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reportes Programados</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportesProgramados}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibilidad de Equipos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disponibilidadEquipos.toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo de Inactividad</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tiempoInactividad} horas</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ratio Correctivo vs. Preventivo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ratioCorrectivoPreventivo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preventivo Completado</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{porcentajePreventivoCompletado}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Descripción general</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview maintenanceHistory={maintenanceHistory} />
          </CardContent>
        </Card>
        <div className="col-span-2">
          <NotificationCard />
        </div>
      </div>
    </div>
  );
}
