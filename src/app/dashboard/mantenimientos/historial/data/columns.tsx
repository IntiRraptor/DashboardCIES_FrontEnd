"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Maintenance } from "../data/schema";
import { maintenanceTypes, regionals, statuses } from "../data/data";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { PreventivoForm } from "@/components/forms/preventivo-form";
import { TrainingFormComponent } from "@/components/forms/training-form";
import { CorrectiveMaintenanceFormComponent } from "@/components/forms/corrective-maintenance-form";
import FormularioProtocoloMantenimientoAspiradorNebulizador from "@/components/forms/protocolo-mantenimiento-aspirador-nebulizador";
import Modal from "@/components/ui/Modal";
import FormularioMantenimientoEcografo from "@/components/forms/protocolo-mantenimiento-ecografos";
import FormularioMantenimientoColoscopio from "@/components/forms/protocolo-mantenimiento-colposcopio";
import FormularioMantenimientoLaparoscopia from "@/components/forms/protocolo-mantenimiento-laparoscopia";
import FormularioMantenimientoMesaQuirurgica from "@/components/forms/protocolo-mantenimiento-mesa";
import FormularioMantenimientoElectrobisturi from "@/components/forms/protocolo-mantenimiento-electrobisturi";
import FormularioMantenimientoIncubadora from "@/components/forms/protocolo-mantenimiento-incubadora";
import FormularioMantenimientoVentiladorCPAP from "@/components/forms/protocolo-mantenimiento-ventilador";
import FormularioMantenimientoMonitor from "@/components/forms/protocolo-mantenimiento-monitor";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { getEquipment, updateMantenimiento } from "@/lib/apiService";
import { findEquipmentByCode } from "@/utils/equipmentUtils";
import { toast } from "@/components/ui/use-toast";

export const columns: ColumnDef<Maintenance>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "tipo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de Mantenimiento" />
    ),
    cell: ({ row }) => {
      const type = maintenanceTypes.find(
        (type) => type.value === row.getValue("tipo")
      );
      return <div>{type ? type.label : row.getValue("tipo")}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Regional" />
    ),
    cell: ({ row }) => {
      const regional = regionals.find(
        (regional) => regional.value === row.getValue("region")
      );
      return <div>{regional ? regional.label : row.getValue("region")}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "fechaInicio",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha Inicio" />
    ),
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("fechaInicio")), "dd/MM/yyyy")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "fechaFin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha Fin" />
    ),
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("fechaFin")), "dd/MM/yyyy")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "equipo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código de Activo" />
    ),
    cell: ({ row }) => {
      const equipo = row.getValue("equipo") as string | undefined;
      return <div>{equipo ? equipo : "No Asignado"}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "costo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Costo de Reparación" />
    ),
    cell: ({ row }) => {
      const costo = row.getValue("costo") as number;
      return <div>{`Bs. ${costo.toFixed(2)}`}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "estado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("estado")
      );
      return <div>{status ? status.label : row.getValue("estado")}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellComponent row={row} />,
  },
];

const CellComponent = ({ row }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [equipment, setEquipment] = useState<EquipmentDetail[]>([]);

    useEffect(() => {
        const fetchEquipment = async () => {
            const equipmentData = await getEquipment();
            setEquipment(equipmentData);
        };
        fetchEquipment();
    }, []);

    const initialData = row.original;

    const type = row.original.tipo;
    const details = JSON.parse(row.original.details);

    const handleSubmitEdition = async (formData: any) => {
        try {
            console.log("Form Data:", formData);

            if (!formData) {
                throw new Error("No se ha enviado ningún formulario");
            }

            const formattedData = {
                tipo: formData.tipo,
                fechaInicio: row.original.fechaInicio,
                fechaFin: row.original.fechaFin,
                hora: formData.time,
                region: formData.region,
                equipo: formData.equipo,
                estado: formData.estado,
                costo: formData.costo && formData.costo > 0 ? formData.costo : 0,
                details: JSON.stringify(formData),
            };

            console.log("Formatted Data Maintenance:", formattedData);

            const response = await updateMantenimiento(row.original._id, formattedData);
            toast({
                title: "Mantenimiento Actualizado",
                description: "El mantenimiento se ha actualizado correctamente.",
            });
            setModalOpen(false);
            window.location.reload(); // Recarga la página actual
        } catch (error) {
            console.error("Error al actualizar mantenimiento:", error);
            toast({
                title: "Error",
                description: "Hubo un problema al actualizar el mantenimiento.",
                variant: "destructive",
            });
        }
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const renderForm = () => {
        if (type === "Capacitación") {
            return (
                <TrainingFormComponent
                    equipment={equipment}
                    onSubmit={handleSubmitEdition}
                    initialData={initialData}
                    isEditMode={true}
                />
            );
        } else if (type === "Correctivo") {
            return (
                <CorrectiveMaintenanceFormComponent
                    equipment={equipment}
                    onSubmit={handleSubmitEdition}
                    initialData={initialData}
                    isEditMode={true}
                />
            );
        } else if (type === "Preventivo") {
            switch (details.typeForm) {
                case "Protocolo de Mantenimiento Criocauterio Termoablación":
                    return (
                        <PreventivoForm
                            equipment={equipment}
                            onSubmit={handleSubmitEdition}
                            initialData={initialData}
                            isEditMode={true}
                        />
                    );
                case "Protocolo de Mantenimiento Aspirador Nebulizador":
                    return (
                        <FormularioProtocoloMantenimientoAspiradorNebulizador
                            equipment={equipment}
                            onSubmit={handleSubmitEdition}
                            initialData={initialData}
                            isEditMode={true}
                        />
                    );
                case "Protocolo de Mantenimiento Ecografos":
                    return (
                        <FormularioMantenimientoEcografo
                            equipment={equipment}
                            onSubmit={handleSubmitEdition}
                            initialData={initialData}
                            isEditMode={true}
                        />
                    );
                case "Protocolo de Mantenimiento Video Colposcopio":
                    return (
                        <FormularioMantenimientoColoscopio
                            equipment={equipment}
                            onSubmit={handleSubmitEdition}
                            initialData={initialData}
                            isEditMode={true}
                        />
                    );
                case "Protocolo Mantenimiento Torre Laparoscopia":
                    return (
                        <FormularioMantenimientoLaparoscopia
                            equipment={equipment}
                            onSubmit={handleSubmitEdition}
                            initialData={initialData}
                            isEditMode={true}
                        />
                    );
                case "Protocolo de Mantenimiento Electrobisturi":
                    return (
                        <FormularioMantenimientoElectrobisturi
                            equipment={equipment}
                            onSubmit={handleSubmitEdition}
                            initialData={initialData}
                            isEditMode={true}
                        />
                    );
                case "Protocolo de Mantenimiento Mesa QX y Lamp Cialitica":
                    return (
                        <FormularioMantenimientoMesaQuirurgica
                            equipment={equipment}
                            onSubmit={handleSubmitEdition}
                            initialData={initialData}
                            isEditMode={true}
                        />
                    );
                case "Protocolo de Mantenimiento Incubadora ServoCuna Fototerapia":
                    return (
                        <FormularioMantenimientoIncubadora
                            equipment={equipment}
                            onSubmit={handleSubmitEdition}
                            initialData={initialData}
                            isEditMode={true}
                        />
                    );
                case "Protocolo de Mantenimiento MaqAnes Vent CPAP.":
                    return (
                        <FormularioMantenimientoVentiladorCPAP
                            equipment={equipment}
                            onSubmit={handleSubmitEdition}
                            initialData={initialData}
                            isEditMode={true}
                        />
                    );
                case "Protocolo de Mantenimiento Monitores_Fetal_ECG":
                    return (
                        <FormularioMantenimientoMonitor
                            equipment={equipment}
                            onSubmit={handleSubmitEdition}
                            initialData={initialData}
                            isEditMode={true}
                        />
                    );
                default:
                    return null;
            }
        }
        return null;
    };

    return (
        <>
            <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={handleOpenModal}
            >
                Ver más
            </Button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {renderForm()}
            </Modal>
        </>
    );
};
