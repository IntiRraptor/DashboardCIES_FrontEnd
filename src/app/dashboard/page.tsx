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
  const reportesFallidos = maintenanceHistory.filter(
    (m: any) => m.estado === "Fallido"
  ).length;
  const reportesEnviados = maintenanceHistory.filter(
    (m: any) => m.estado === "Enviado"
  ).length;
  const reportesDeportados = maintenanceHistory.filter(
    (m: any) => m.estado === "Deportado"
  ).length;
  const reportesProgramados = maintenanceHistory.filter(
    (m: any) => m.estado === "Programado"
  ).length;

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
              Reportes Fallidos
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportesFallidos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reportes Enviados
            </CardTitle>
            <Send className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportesEnviados}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reportes Deportados
            </CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportesDeportados}</div>
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
