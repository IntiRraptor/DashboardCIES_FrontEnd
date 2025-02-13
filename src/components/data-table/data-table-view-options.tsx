"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  MixerHorizontalIcon,
  DownloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { downloadEquipmentAsExcel, downloadMaintenanceHistoryAsExcel } from "@/lib/excelUtils";
import { useMemo } from 'react';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  showDelete: boolean;
  showDownload: boolean;
  onDelete: () => void;
  data: TData[];
  downloadType: 'equipment' | 'maintenance';
}

export function DataTableViewOptions<TData>({
  table,
  showDelete,
  showDownload,
  onDelete,
  data,
  downloadType,
}: DataTableViewOptionsProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
  const isDownloadDisabled = downloadType === 'maintenance' && selectedRows.length === 0;

  const handleDownload = () => {
    if (downloadType === 'maintenance') {
      downloadMaintenanceHistoryAsExcel(selectedRows);
    } else if (downloadType === 'equipment') {
      downloadEquipmentAsExcel(data);
    }
  };

  return (
    <div className="flex space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            Ver
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Alternar columnas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>

      {showDelete && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 lg:flex"
          onClick={onDelete}
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      )}

      {showDownload && (
        <Button 
          size="sm" 
          className="h-8 lg:flex" 
          onClick={handleDownload}
          disabled={isDownloadDisabled}
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          Descargar
        </Button>
      )}
    </div>
  );
}
