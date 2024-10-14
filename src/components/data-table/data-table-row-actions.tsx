"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Define la interfaz para los datos de equipo, sin la validación de zod
interface EquipmentData {
  codigoaf: string;
  codigoaf1: string | null;
  codigoaf2: string | null;
  nombreaf: string;
  descaf: string;
  aux1: string;
}

// Tipo para las claves válidas en EquipmentData
type EquipmentField = keyof EquipmentData;

interface DataTableRowActionsProps {
  row: Row<EquipmentData>;
  labels: { value: string; label: string }[];
  labelField: EquipmentField;
} 

export function DataTableRowActions({
  row,
  labels,
  labelField,
}: DataTableRowActionsProps) {
  console.log("Row original data:", JSON.stringify(row.original, null, 2)); // Imprimir los datos originales

  const value = row.original[labelField as keyof EquipmentData] || undefined; // Asegurarse de que el acceso sea seguro

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>Editar</DropdownMenuItem>
        <DropdownMenuItem>Hacer una copia</DropdownMenuItem>
        <DropdownMenuItem>Favorito</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>{labelField}</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={value}>
              {labels.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Eliminar
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
