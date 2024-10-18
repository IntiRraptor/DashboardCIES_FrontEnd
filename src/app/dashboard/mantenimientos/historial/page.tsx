"use client";

import { columns } from "./data/columns";
import { DataTable } from "@/components/data-table/data-table";
import { maintenanceTypes, regionals, statuses } from "./data/data";
import { getMantenimientos, deleteMantenimiento } from "@/lib/apiService";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

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

  const handleDeleteSelected = async (selectedRows: any[]) => {
    try {
      for (const row of selectedRows) {
        console.log("row: ", row);
        await deleteMantenimiento(row._id);
      }
      // Actualizar la lista después de eliminar
      const updatedData = await getMantenimientos();
      setMaintenanceHistory(updatedData);
      toast({
        title: "Éxito",
        description: "Mantenimientos seleccionados eliminados correctamente.",
      });
    } catch (error) {
      console.error("Error al eliminar mantenimientos:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar los mantenimientos.",
        variant: "destructive",
      });
    }
  };

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
        showDelete={true}
        data={maintenanceHistory}
        columns={columns}
        filterColumn="equipo"
        filterPlaceholder="Buscar por Cód. Activo o Nombre"
        facetedFilters={[
          {
            column: "tipo",
            title: "Tipo de Mantenimiento",
            options: maintenanceTypes.map((type) => ({
              label: type.label,
              value: type.value,
            })),
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
        onDeleteSelected={handleDeleteSelected}
        downloadType="maintenance"
      />
    </div>
  );
}
