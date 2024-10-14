"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { findEquipmentByCode } from "@/utils/equipmentUtils";

// Componente reutilizable para opciones de "Sí" y "No"
const YesNoOptions = ({ id, defaultValue }: { id: string, defaultValue: string }) => (
  <div className="flex space-x-4">
    <div className="flex items-center space-x-2">
      <input type="radio" id={`${id}-si`} name={id} value="si" defaultChecked={defaultValue === "si"} />
      <label htmlFor={`${id}-si`}>Sí</label>
    </div>
    <div className="flex items-center space-x-2">
      <input type="radio" id={`${id}-no`} name={id} value="no" defaultChecked={defaultValue === "no"} />
      <label htmlFor={`${id}-no`}>No</label>
    </div>
  </div>
);

export default function FormularioMantenimientoEcografo({
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
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [codigoActivo, setCodigoActivo] = useState("");
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const [garantia, setGarantia] = useState("no");
  const [swVersion, setSwVersion] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [regional, setRegional] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [firmaMantenimiento, setFirmaMantenimiento] = useState("");
  const [firmaOperador, setFirmaOperador] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const details = JSON.parse(initialData.details);
      const foundEquipment = findEquipmentByCode(equipment, details.equipo);
      setCodigoActivo(details.equipo || "");
      setMarca(foundEquipment?.nombreaf || "");
      setModelo(foundEquipment?.descaf || "");
      setNumeroSerie(foundEquipment?.aux1 || "");
      setLugar(details.lugar || "");
      setFecha(details.fecha || "");
      setGarantia(details.garantia || "no");
      setSwVersion(details.swVersion || "");
      setSucursal(details.sucursal || "");
      setRegional(details.regional || "");
      setObservaciones(details.observaciones || "");
      setFirmaMantenimiento(details.firmaMantenimiento || "");
      setFirmaOperador(details.firmaOperador || "");
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

  const handleSubmit = () => {
    const formData = {
      lugar,
      fecha,
      garantia,
      swVersion,
      sucursal,
      regional,
      observaciones,
      firmaMantenimiento,
      firmaOperador,
      tipo: "Preventivo",
      equipo: codigoActivo,
      costo: 0,
      estado: "Programado",
      typeForm: "Protocolo de Mantenimiento Ecografos",
    };
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <Image src="/placeholder.svg" alt="Logo CIES" width={50} height={50} className="h-12 w-auto mr-4" />
          <h1 className="text-xl font-bold">COMPROBANTE DE MANTENIMIENTO PREVENTIVO PLANIFICADO</h1>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <Label htmlFor="vigencia">VIGENCIA DESDE: 30/10/2018</Label>
          </div>
          <div className="mb-2">
            <Label htmlFor="lugar">Lugar:</Label>
            <Input
              id="lugar"
              className="w-40"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
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

      <div className="mb-4">
        <h2 className="text-lg font-semibold">ECÓGRAFO</h2>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">DATOS DEL EQUIPO:</h2>
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
            <Label htmlFor="ns">N/S:</Label>
            <Input id="ns" value={numeroSerie} readOnly />
          </div>
          <div>
            <Label>Garantía:</Label>
            <YesNoOptions id="garantia" defaultValue={garantia} />
          </div>
          <div>
            <Label htmlFor="swVersion">SW/Versión:</Label>
            <Input
              id="swVersion"
              value={swVersion}
              onChange={(e) => setSwVersion(e.target.value)}
            />
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
            <Label htmlFor="regional">Regional:</Label>
            <Input
              id="regional"
              value={regional}
              onChange={(e) => setRegional(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">OBSERVACIONES:</h2>
        <Textarea
          placeholder="Ingrese sus observaciones aquí"
          className="w-full h-24"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </section>

      <section className="flex justify-between">
        <div className="w-1/2 pr-2">
          <Label htmlFor="firmaMantenimiento">Firma y Sello Mantenimiento:</Label>
          <Input
            id="firmaMantenimiento"
            className="mt-1"
            value={firmaMantenimiento}
            onChange={(e) => setFirmaMantenimiento(e.target.value)}
          />
        </div>
        <div className="w-1/2 pl-2">
          <Label htmlFor="firmaOperador">Firma y Sello Operador o encargado:</Label>
          <Input
            id="firmaOperador"
            className="mt-1"
            value={firmaOperador}
            onChange={(e) => setFirmaOperador(e.target.value)}
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