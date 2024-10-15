"use client";

import { getMantenimientos } from "@/lib/apiService";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { NotificationCard } from "@/components/dashboard/notification-card";
import { Overview } from "@/components/dashboard/overview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileText, Send, UserX } from "lucide-react";
import { useEffect, useState } from "react";

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

  // New metrics calculations
  const correctivos = maintenanceHistory.filter(
    (m: any) => m.tipo === "Correctivo"
  ).length;
  const preventivos = maintenanceHistory.filter(
    (m: any) => m.tipo === "Preventivo"
  ).length;
  const ratioCorrectivoPreventivo =
    preventivos > 0 ? (correctivos / preventivos).toFixed(2) : "N/A";

  // Updated metric calculation
  const preventivosCompletados = maintenanceHistory.filter(
    (m: any) => m.tipo === "Preventivo" && m.estado === "Completado"
  ).length;
  const porcentajePreventivoCompletado =
    reportesProgramados > 0
      ? ((preventivosCompletados / reportesProgramados) * 100).toFixed(2)
      : "N/A";

  return (
    <div className="flex-col space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard CIES</h1>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>Descargar</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reportes Generados
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportesGenerados}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reportes Programados
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportesProgramados}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ratio Correctivo vs. Preventivo
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ratioCorrectivoPreventivo}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Preventivo Completado
            </CardTitle>
            <Send className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {porcentajePreventivoCompletado}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Descripción general</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>
        <div className="col-span-2">
          <NotificationCard />
        </div>
      </div>
    </div>
  );
}
