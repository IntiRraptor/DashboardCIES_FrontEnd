"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { ExternalRequest } from "./schema";
import { statuses, regionals } from "./data";
import { format } from "date-fns";
import Modal from "@/components/ui/Modal";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { updateSolicitudExterna } from "@/lib/apiService";
import { toast } from "@/components/ui/use-toast";
import ServiceForm from "@/components/forms/service-form";
import { getEquipment } from "@/lib/apiService";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";

export const columns: ColumnDef<ExternalRequest>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "nombrePersona",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre Persona" />
    ),
    cell: ({ row }) => <div>{row.getValue("nombrePersona")}</div>,
  },
  {
    accessorKey: "regional",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Regional" />
    ),
    cell: ({ row }) => {
      const regional = regionals.find(
        (regional) => regional.value === row.getValue("regional")
      );
      return <div>{regional ? regional.label : row.getValue("regional")}</div>;
    },
  },
  {
    accessorKey: "fechaLlegada",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Llegada" />
    ),
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("fechaLlegada")), "dd/MM/yyyy")}</div>
    ),
  },
  {
    accessorKey: "codigoActivo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código de Activo" />
    ),
    cell: ({ row }) => <div>{row.getValue("codigoActivo")}</div>,
  },
  {
    accessorKey: "ticket",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket" />
    ),
    cell: ({ row }) => <div>{row.getValue("ticket")}</div>,
  },
  {
    accessorKey: "accion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acción" />
    ),
    cell: ({ row }) => <ActionCell row={row} />,
  },
  {
    accessorKey: "fechaAccion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Acción" />
    ),
    cell: ({ row }) => {
      const fechaAccion = row.getValue("fechaAccion");
      return fechaAccion && typeof fechaAccion === "string" ? (
        <div>{format(new Date(fechaAccion), "dd/MM/yyyy")}</div>
      ) : (
        <div>-</div>
      );
    },
  },
  {
    accessorKey: "estado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => <StatusCell row={row} />,
  },
];

const ActionCell = ({ row }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const accion = row.getValue("accion");
  const [equipment, setEquipment] = useState<EquipmentDetail[]>([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const equipmentData = await getEquipment();
        setEquipment(equipmentData);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      }
    };
    fetchEquipment();
  }, []);

  const handleSubmit = async (formData: any) => {
    try {
      const updatedData = {
        ...row.original,
        accion: "Gestionado",
        estado: "Completado",
        fechaAccion: new Date().toISOString(),
        details: JSON.stringify(formData),
      };

      await updateSolicitudExterna(row.original._id, updatedData);

      toast({
        title: "Solicitud Actualizada",
        description: "La solicitud se ha gestionado correctamente.",
      });

      setModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al gestionar la solicitud.",
        variant: "destructive",
      });
    }
  };

  if (accion === "Sin gestionar") {
    return (
      <>
        <Button
          variant="link"
          className="text-green-600 underline"
          onClick={() => setModalOpen(true)}
        >
          {accion}
        </Button>
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <ServiceForm
            equipment={equipment}
            initialData={{
              codigoActivo: row.getValue("codigoActivo"),
              regional: row.getValue("regional"),
              nombrePersona: row.getValue("nombrePersona"),
              ticket: row.getValue("ticket"),
              observaciones: row.original.observaciones || "",
            }}
            onSubmit={handleSubmit}
          />
        </Modal>
      </>
    );
  }

  return <div className="text-gray-500">Gestionado</div>;
};

const StatusCell = ({ row }) => {
  const [currentStatus, setCurrentStatus] = useState(() =>
    statuses.find((status) => status.value === row.getValue("estado"))
  );

  const handleStatusChange = async (newStatus) => {
    try {
      const formattedData = {
        ...row.original,
        estado: newStatus,
      };

      await updateSolicitudExterna(row.original._id, formattedData);
      toast({
        title: "Estado Actualizado",
        description:
          "El estado de la solicitud se ha actualizado correctamente.",
      });

      setCurrentStatus(statuses.find((status) => status.value === newStatus));
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el estado.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          {currentStatus ? currentStatus.label : row.getValue("estado")}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {statuses.map((status) => (
          <DropdownMenuItem
            key={status.value}
            onSelect={() => handleStatusChange(status.value)}
          >
            {status.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
