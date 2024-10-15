"use client";

import { columns } from "./data/columns";
import { DataTable } from "@/components/data-table/data-table";
import { categories, brands, models } from "./data/data";
import { getEquipment } from "@/lib/apiService";
import { useEffect, useState } from "react";
import { EquipmentDetail } from "./data/schema";

export default function EquiposMedicosPage() {
  const [equipment, setEquipment] = useState<EquipmentDetail[]>([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      const data = await getEquipment();
      setEquipment(data);
    };

    fetchEquipment();
  }, []);
  
  // Mapear los datos para que coincidan con el tipo esperado
  const mappedEquipment = equipment.map(item => ({
    id: item.codigoaf, // Asignar un valor único para 'id'
    name: item.nombreaf,
    brand: item.aux1, // Asumiendo que 'aux1' es la marca
    model: item.descaf, // Asumiendo que 'descaf' es el modelo
    assetCode: item.codigoaf,
    category: "default", // Asignar un valor por defecto o derivar de otra propiedad
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
      <DataTable
        data={mappedEquipment} // Usar los datos mapeados
        columns={columns}
        filterColumn="name"
        filterPlaceholder="Filtrar equipos..."
        facetedFilters={[
          {
            column: "category",
            title: "Categoría",
            options: categories.map((cat) => ({
              label: cat.label,
              value: cat.value,
            })),
          },
          {
            column: "brand",
            title: "Marca",
            options: brands.map((brand) => ({
              label: brand.label,
              value: brand.value,
            })),
          },
          {
            column: "model",
            title: "Modelo",
            options: models.map((model) => ({
              label: model.label,
              value: model.value,
            })),
          },
        ]}
      />
    </div>
  );
}
