"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Button } from "@/components/ui/button"
import { ExternalRequest, externalRequestSchema } from "./schema"
import { statuses, regionals } from "./data"
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions"
import ActionButton from '../forms/action_button'; // Asegúrate de que la ruta sea correcta
// Definición de las columnas de la tabla
export const columns: ColumnDef<ExternalRequest>[] = [
  
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
    accessorKey: "nombrePersona",  // Cambio aquí
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre Persona" />
    ),
    cell: ({ row }) => <div>{row.getValue("nombrePersona")}</div>,  // Cambio aquí
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "region",  // Cambio aquí
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Regional" />
    ),
    cell: ({ row }) => {
      const regional = regionals.find(
        (regional) => regional.value === row.getValue("region")  // Cambio aquí
      )
      return <div>{regional ? regional.label : row.getValue("region")}</div>  // Cambio aquí
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "fechaLlegada",  // Cambio aquí
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Llegada" />
    ),
    cell: ({ row }) => <div>{row.getValue("fechaLlegada")}</div>,  // Cambio aquí
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "codigoActivo",  // Cambio aquí
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código de Activo" />
    ),
    cell: ({ row }) => <div>{row.getValue("codigoActivo")}</div>,  // Cambio aquí
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "ticket",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket" />
    ),
    cell: ({ row }) => <div>{row.getValue("ticket")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "action",  // Asegúrate de que "action" exista en los datos
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acción" />
    ),
    cell: ({ row }) => {
      const actionValue = row.getValue("action");
      return <ActionButton actionValue={actionValue} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fechaAccion",  // Si "actionDate" es realmente "fechaAccion"
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Acción" />
    ),
    cell: ({ row }) => <div>{row.getValue("fechaAccion")}</div>,  // Cambio aquí
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "estado",  // Cambio aquí
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("estado")  // Cambio aquí
      )
      return <div>{status ? status.label : row.getValue("estado")}</div>  // Cambio aquí
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        labels={statuses}
        schema={externalRequestSchema}
        labelField="estado"  // Cambio aquí
      />
    ),
  },
]
