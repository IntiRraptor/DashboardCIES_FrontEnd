"use client";

import { columns } from "./data/columns";
import { DataTable } from "@/components/data-table/data-table";
import { getEquipment } from "@/lib/apiService";
import { useEffect, useState } from "react";
import { EquipmentDetail } from "./data/schema";
import { Loader2 } from "lucide-react"; // Importa el ícono de loader

export default function EquiposMedicosPage() {
  const [equipment, setEquipment] = useState<EquipmentDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await getEquipment();
        setEquipment(data);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  // Mapear los datos para que coincidan con el tipo esperado
  const mappedEquipment = equipment.map((item) => ({
    id: item.codigoaf,
    name: item.nombreaf,
    brand: item.aux1,
    model: item.descaf,
    assetCode: item.codigoaf,
    category: "default",
  }));

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Equipos Médicos</h2>
          <p className="text-muted-foreground">
            Lista de todos los equipos médicos registrados.
          </p>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <DataTable
          data={mappedEquipment}
          columns={columns}
          showDelete={false}
          filterColumn="name"
          filterPlaceholder="Filtrar equipos..."
          facetedFilters={[]}
          downloadType="equipment"
        />
      )}
    </div>
  );
}
