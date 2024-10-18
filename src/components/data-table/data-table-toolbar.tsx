"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { DataTableViewOptions } from "./data-table-view-options";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Input } from "../ui/input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterColumn: string;
  filterPlaceholder: string;
  facetedFilters: {
    column: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  children?: React.ReactNode;
  data: TData[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onDeleteSelected?: () => void;
  downloadType: 'equipment' | 'maintenance';
  showDelete: boolean;
}

export function DataTableToolbar<TData>({
  table,
  filterColumn,
  filterPlaceholder,
  facetedFilters,
  children,
  data,
  downloadType,
  showDelete,
  globalFilter,
  setGlobalFilter,
  onDeleteSelected,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || globalFilter !== "";

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={filterPlaceholder}
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {facetedFilters.map((filter) => {
          const column = table.getColumn(filter.column);
          return (
            column && (
              <DataTableFacetedFilter
                key={filter.column}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          );
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setGlobalFilter("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        {children}
      </div>
      <DataTableViewOptions
        table={table}
        downloadType={downloadType}
        showDelete={showDelete ? !!onDeleteSelected : false}
        showDownload={true}
        onDelete={onDeleteSelected ?? (() => {})}
        data={data}
      />
    </div>
  );
}
