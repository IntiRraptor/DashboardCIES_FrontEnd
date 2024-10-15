"use client";

import { columns } from "./data/columns";
import { DataTable } from "@/components/data-table/data-table";
import { maintenanceTypes, regionals, statuses } from "./data/data";
import { getMantenimientos } from "@/lib/apiService";
import { useEffect, useState } from "react";

type SearchParams = {
  tipo?: string;
  region?: string;
  estado?: string;
};

export default function HistorialMantenimientosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [maintenanceHistory, setMaintenanceHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchMaintenanceHistory = async () => {
      const data = await getMantenimientos();
      setMaintenanceHistory(data);
    };

    fetchMaintenanceHistory();
  }, []);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Historial mantenimientos
          </h2>
          <p className="text-muted-foreground">
            Lista de todos los mantenimientos registrados.
          </p>
        </div>
      </div>
      <DataTable
        data={maintenanceHistory}
        columns={columns}
        filterColumn="equipo"
        filterPlaceholder="Buscar por Cód. Activo"
        facetedFilters={[
          {
            column: "tipo",
            title: "Tipo de Mantenimiento",
            options: [
              { label: "Correctivo", value: "correctivo" },
              { label: "Capacitación", value: "capacitacion" },
              { label: "Instalación", value: "instalacion" },
              { label: "Preventivo", value: "preventivo" },
            ],
          },
          {
            column: "regional",
            title: "Regional",
            options: regionals.map((regional) => ({
              label: regional.label,
              value: regional.value,
            })),
          },
          {
            column: "estado",
            title: "Estados",
            options: statuses.map((status) => ({
              label: status.label,
              value: status.value,
            })),
          },
        ]}
      />
    </div>
  );
}
