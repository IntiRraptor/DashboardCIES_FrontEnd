"use client";

import { columns } from "./data/columns"
import { DataTable } from "@/components/data-table/data-table"
import { statuses, regionals } from "./data/data"
import { getExternalRequests } from "@/lib/apiService"
import { useState, useEffect } from "react"

export default function SolicitudesExternasPage() {
  const [externalRequests, setExternalRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchExternalRequests = async () => {
      const data = await getExternalRequests();
      setExternalRequests(data);
    };

    fetchExternalRequests();
  }, []);

  // Verifica que externalRequests tenga datos antes de pasarlos a DataTable
  console.log("External Requests to render:", externalRequests);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Solicitudes Externas</h2>
          <p className="text-muted-foreground">
            Lista de todas las solicitudes externas de mantenimiento.
          </p>
        </div>
      </div>
      <DataTable 
        data={externalRequests} 
        columns={columns}
        filterColumn="assetCode"
        filterPlaceholder="Buscar por Cód. Activo..."
        facetedFilters={[
          {
            column: "status",
            title: "Estado",
            options: statuses.map(status => ({ label: status.label, value: status.value }))
          },
          {
            column: "regional",
            title: "Regional",
            options: regionals.map(regional => ({ label: regional.label, value: regional.value }))
          }
        ]}
      />
    </div>
  );
}
