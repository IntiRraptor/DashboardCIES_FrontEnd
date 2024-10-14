import { Metadata } from "next";
import { columns } from "./data/columns";
import { DataTable } from "@/components/data-table/data-table";
import { categories, brands, models } from "./data/data";
import { getEquipment } from "@/lib/apiService";

export const metadata: Metadata = {
  title: "Equipos Médicos",
  description: "Gestión de equipos médicos usando Tanstack Table.",
};

export default async function EquiposMedicosPage() {
  const equipment = await getEquipment();

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
        data={equipment}
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
