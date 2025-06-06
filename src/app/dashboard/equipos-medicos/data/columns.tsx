"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

// Define la interfaz para los datos de equipo
interface EquipmentData {
  id: string;
  assetCode: string;
  name: string;
  brand: string;
  model: string;
  category: string;
}

export const columns: ColumnDef<EquipmentData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name", // Cambiar "name" por "nombreaf"
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre Equipo" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>, // Cambiar "name" por "nombreaf"
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "assetCode", // Cambiar "assetCode" por "codigoaf"
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código de Activo" />
    ),
    cell: ({ row }) => <div>{row.getValue("assetCode")}</div>, // Cambiar "assetCode" por "codigoaf"
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "model", // Añadir una columna para la descripción si es necesario
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Modelo" />
    ),
    cell: ({ row }) => <div>{row.getValue("model")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "brand", // Añadir esta columna si aux1 es relevante
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marca" />
    ),
    cell: ({ row }) => <div>{row.getValue("brand")}</div>,
    enableSorting: true,
    enableHiding: true,
  }
];
