import { Metadata } from "next"
import { columns } from "./data/columns"
import { DataTable } from "@/components/data-table/data-table"
import { ExternalRequest,externalRequestSchema } from "./data/schema"
import { statuses, regionals } from "./data/data"
import { z } from "zod"
export const metadata: Metadata = {
  title: "Solicitudes Externas",
  description: "Gestión de solicitudes externas de mantenimiento.",
}

// Simulate a database read for external requests.
async function getExternalRequests(page = 1, limit = 10, region = ""): Promise<ExternalRequest[]> {
  
  const response = await fetch(`http://localhost:4000/api/solicitudes-externas`);

  if (!response.ok) {
    throw new Error('Error fetching solicitudes');
  }

  const data = await response.json();
  
  // Log the data to see what exactly you're receiving
  console.log("Data received from backend:", JSON.stringify(data, null, 2));

  // Validate using Zod
  const parsedData = z.array(externalRequestSchema).parse(data.solicitudes);

  return parsedData;
}
export default async function SolicitudesExternasPage() {
  const externalRequests = await getExternalRequests();

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
