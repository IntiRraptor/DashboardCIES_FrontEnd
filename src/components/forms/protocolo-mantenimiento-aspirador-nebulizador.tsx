"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { findEquipmentByCode } from "@/utils/equipmentUtils";

const YesNoOptions = ({
  id,
  defaultValue,
}: {
  id: string;
  defaultValue: string;
}) => (
  <div className="flex space-x-4">
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={`${id}-si`}
        name={id}
        value="si"
        className="radio-input"
        defaultChecked={defaultValue === "si"}
      />
      <label htmlFor={`${id}-si`} className="radio-label">
        Sí
      </label>
    </div>
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={`${id}-no`}
        name={id}
        value="no"
        className="radio-input"
        defaultChecked={defaultValue === "no"}
      />
      <label htmlFor={`${id}-no`} className="radio-label">
        No
      </label>
    </div>
  </div>
);

export default function FormularioProtocoloMantenimientoAspiradorNebulizador({
  equipment,
  onSubmit,
  initialData,
  isEditMode = false,
}: {
  equipment: EquipmentDetail[];
  onSubmit: (data: any) => void;
  initialData: any;
  isEditMode: boolean;
}) {
  const [tipoEquipo, setTipoEquipo] = useState("Aspiradora");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [codigoActivo, setCodigoActivo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [fecha, setFecha] = useState("");
  const [garantia, setGarantia] = useState("no");
  const [sucursal, setSucursal] = useState("");
  const [oficinaRegional, setOficinaRegional] = useState("");
  const [visualInspection, setVisualInspection] = useState([]);
  const [electricalInspection, setElectricalInspection] = useState([]);
  const [functionalInspection, setFunctionalInspection] = useState([]);
  const [replacementInspection, setReplacementInspection] = useState([]);
  const [observaciones, setObservaciones] = useState("");
  const [firmaOperador, setFirmaOperador] = useState("");
  const [firmaEncargado, setFirmaEncargado] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const details = JSON.parse(initialData.details);
      const foundEquipment = findEquipmentByCode(equipment, details.equipo);

      setCodigoActivo(details.equipo || "");
      setMarca(foundEquipment?.nombreaf || "");
      setModelo(foundEquipment?.descaf || "");
      setNumeroSerie(foundEquipment?.aux1 || "");
      setTipoEquipo(details.tipoEquipo || "Aspiradora");
      setUbicacion(details.ubicacion || "");
      setFecha(details.fecha || "");
      setGarantia(details.garantia || "no");
      setSucursal(details.sucursal || "");
      setOficinaRegional(details.oficinaRegional || "");
      setVisualInspection(details.visualInspection || []);
      setElectricalInspection(details.electricalInspection || []);
      setFunctionalInspection(details.functionalInspection || []);
      setReplacementInspection(details.replacementInspection || []);
      setObservaciones(details.observaciones || "");
      setFirmaOperador(details.firmaOperador || "");
      setFirmaEncargado(details.firmaEncargado || "");
    }
  }, [initialData, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      const foundEquipment = findEquipmentByCode(equipment, codigoActivo);
      if (foundEquipment) {
        setMarca(foundEquipment.nombreaf);
        setModelo(foundEquipment.descaf);
        setNumeroSerie(foundEquipment.aux1);
      } else {
        setMarca("");
        setModelo("");
        setNumeroSerie("");
      }
    }
  }, [equipment, codigoActivo, isEditMode]);

  const visualInspectionItems = [
    "El equipo presenta daños físicos notables.",
    "El contenedor presenta daños físicos notables.",
    "Los paneles de control presentan daños físicos.",
    "Hay conductores expuestos.",
    "Los puertos y conectores presentan daños.",
    "Limpieza deficiente.",
    "Filtro hidrófobo en buen estado.",
    "Manómetro/Vacuómetro en buen estado.",
    "Pedal en buen estado.",
    "Empaques/O-rings en buen estado.",
  ];

  const handleSubmit = () => {
    const getInspectionData = (prefix: string, items: string[]) => {
      return items.map((item, index) => {
        const input = document.querySelector(
          `input[name="${prefix}-${index}"]:checked`
        ) as HTMLInputElement;
        return {
          label: item,
          value: input ? input.value === "si" : false,
        };
      });
    };

    const visualInspection = getInspectionData("visual", visualInspectionItems);
    const electricalInspection = getInspectionData("estado", [
      "Fusibles en buen estado",
      "Cable de alimentación en buen estado",
      "Botón de encendido en buen estado",
    ]);
    const functionalInspection = getInspectionData("cambio", [
      "Cambio de potencia funciona correctamente",
      "Nivel de ruido aceptable",
    ]);
    const replacementInspection = getInspectionData("reemplazo", [
      "Empaques reemplazados",
      "Membranas reemplazadas",
      "Rodamientos reemplazados",
    ]);

    const formData = {
      ubicacion,
      fecha,
      garantia,
      tipo: "Preventivo",
      sucursal,
      oficinaRegional,
      equipo: codigoActivo,
      costo: 0,
      estado: "Programado",
      typeForm: "Protocolo de Mantenimiento Aspirador Nebulizador",
      visualInspection,
      electricalInspection,
      functionalInspection,
      replacementInspection,
      observaciones,
      firmaOperador,
      firmaEncargado,
    };
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Image
            src="/placeholder.svg"
            height={50}
            width={100}
            alt="Logo de la Compañía"
            className="h-12 w-auto"
          />
        </div>
        <div className="text-center flex-grow">
          <h1 className="text-2xl font-bold">
            RECIBO DE MANTENIMIENTO PREVENTIVO PLANIFICADO
          </h1>
          <div className="flex justify-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="aspiradora"
                name="tipoEquipo"
                value="Aspiradora"
                checked={tipoEquipo === "Aspiradora"}
                onChange={() => setTipoEquipo("Aspiradora")}
              />
              <label htmlFor="aspiradora">Aspiradora</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="nebulizador"
                name="tipoEquipo"
                value="Nebulizador"
                checked={tipoEquipo === "Nebulizador"}
                onChange={() => setTipoEquipo("Nebulizador")}
              />
              <label htmlFor="nebulizador">Nebulizador</label>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <Label htmlFor="ubicacion">Ubicación:</Label>
            <Input
              id="ubicacion"
              className="w-40"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fecha">Fecha:</Label>
            <Input
              id="fecha"
              type="date"
              className="w-40"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Datos del Equipo</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="codigoActivo">Código de Activo:</Label>
            <Input
              id="codigoActivo"
              value={codigoActivo}
              onChange={(e) => setCodigoActivo(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="marca">Marca:</Label>
            <Input id="marca" value={marca} readOnly />
          </div>
          <div>
            <Label htmlFor="modelo">Modelo:</Label>
            <Input id="modelo" value={modelo} readOnly />
          </div>
          <div>
            <Label htmlFor="numeroSerie">N/S:</Label>
            <Input id="numeroSerie" value={numeroSerie} readOnly />
          </div>
          <div>
            <Label>Garantía:</Label>
            <YesNoOptions id="garantia" defaultValue={garantia} />
          </div>
          <div>
            <Label>Tipo:</Label>
            <div className="text-sm">{tipoEquipo}</div>
          </div>
          <div>
            <Label htmlFor="sucursal">Sucursal:</Label>
            <Input
              id="sucursal"
              value={sucursal}
              onChange={(e) => setSucursal(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="oficinaRegional">Oficina Regional:</Label>
            <Input
              id="oficinaRegional"
              value={oficinaRegional}
              onChange={(e) => setOficinaRegional(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">1. Inspección Visual</h2>
        <div className="space-y-2">
          {visualInspectionItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`visual-${index}`}>{item}</Label>
              <YesNoOptions
                id={`visual-${index}`}
                defaultValue={
                  visualInspection[index]
                    ? (visualInspection[index] as any).value
                      ? "si"
                      : "no"
                    : "no"
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Inspección Eléctrica</h2>
        <div className="space-y-2">
          {[
            { id: "estadoFusibles", label: "Fusibles en buen estado" },
            {
              id: "estadoCableAlimentacion",
              label: "Cable de alimentación en buen estado",
            },
            {
              id: "estadoBotonEncendido",
              label: "Botón de encendido en buen estado",
            },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={item.id}>{item.label}</Label>
              <YesNoOptions
                id={item.id}
                defaultValue={
                  electricalInspection[index]
                    ? (electricalInspection[index] as any).value
                      ? "si"
                      : "no"
                    : "no"
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Inspección Funcional</h2>
        <div className="space-y-2">
          {[
            {
              id: "cambioPotencia",
              label: "Cambio de potencia funciona correctamente",
            },
            { id: "nivelRuido", label: "Nivel de ruido aceptable" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={item.id}>{item.label}</Label>
              <YesNoOptions
                id={item.id}
                defaultValue={
                  functionalInspection[index]
                    ? (functionalInspection[index] as any).value
                      ? "si"
                      : "no"
                    : "no"
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Reemplazo de Empaques, Membranas y Rodamientos
        </h2>
        <div className="space-y-2">
          {[
            { id: "reemplazoEmpaques", label: "Empaques reemplazados" },
            { id: "reemplazoMembranas", label: "Membranas reemplazadas" },
            { id: "reemplazoRodamientos", label: "Rodamientos reemplazados" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={item.id}>{item.label}</Label>
              <YesNoOptions
                id={item.id}
                defaultValue={
                  replacementInspection[index]
                    ? (replacementInspection[index] as any).value
                      ? "si"
                      : "no"
                    : "no"
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Observaciones</h2>
        <Textarea
          placeholder="Ingrese cualquier observación adicional aquí"
          className="w-full h-24"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </section>

      <section className="flex justify-between">
        <div className="w-1/2 pr-2">
          <Label htmlFor="firmaOperador">Firma del Operador:</Label>
          <Input
            id="firmaOperador"
            className="mt-1"
            value={firmaOperador}
            onChange={(e) => setFirmaOperador(e.target.value)}
          />
        </div>
        <div className="w-1/2 pl-2">
          <Label htmlFor="firmaEncargado">
            Firma del Encargado del Equipo:
          </Label>
          <Input
            id="firmaEncargado"
            className="mt-1"
            value={firmaEncargado}
            onChange={(e) => setFirmaEncargado(e.target.value)}
          />
        </div>
      </section>

      <div className="mt-6 text-center">
        <Button type="button" onClick={handleSubmit}>
          Enviar Formulario de Mantenimiento
        </Button>
      </div>
    </div>
  );
}