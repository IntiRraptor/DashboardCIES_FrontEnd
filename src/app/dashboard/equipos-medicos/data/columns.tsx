"use client";

import { ColumnDef } from "@tanstack/react-table";
import { categories, brands, models } from "../data/data";
import { Equipment, equipmentSchema } from "../data/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

export const columns: ColumnDef<Equipment>[] = [
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
    accessorKey: "nombreaf", // Cambiar "name" por "nombreaf"
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre Equipo" />
    ),
    cell: ({ row }) => <div>{row.getValue("nombreaf")}</div>, // Cambiar "name" por "nombreaf"
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "codigoaf", // Cambiar "assetCode" por "codigoaf"
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código de Activo" />
    ),
    cell: ({ row }) => <div>{row.getValue("codigoaf")}</div>, // Cambiar "assetCode" por "codigoaf"
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "descaf", // Añadir una columna para la descripción si es necesario
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
    cell: ({ row }) => <div>{row.getValue("descaf")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "aux1", // Añadir esta columna si aux1 es relevante
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Auxiliar" />
    ),
    cell: ({ row }) => <div>{row.getValue("aux1")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        labels={categories}
        schema={equipmentSchema}
        labelField="category" // Ajustar si "category" se refiere a algo en los datos
      />
    ),
  },
];
    