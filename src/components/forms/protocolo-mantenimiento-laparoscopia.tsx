"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { findEquipmentByCode } from "@/utils/equipmentUtils";

// Componente reutilizable para opciones de "Sí" y "No"
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
        defaultChecked={defaultValue === "si"}
      />
      <label htmlFor={`${id}-si`}>Sí</label>
    </div>
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={`${id}-no`}
        name={id}
        value="no"
        defaultChecked={defaultValue === "no"}
      />
      <label htmlFor={`${id}-no`}>No</label>
    </div>
  </div>
);

export default function FormularioMantenimientoLaparoscopia({
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
  const [swVer, setSwVer] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [regional, setRegional] = useState("");
  const [voltajeLinea, setVoltajeLinea] = useState("");
  const [voltajeUPSDesconect, setVoltajeUPSDesconect] = useState("");
  const [marcaUPS, setMarcaUPS] = useState("");
  const [observaciones, setObservaciones] = useState("");

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
      setSwVer(details.swVer || "");
      setSucursal(details.sucursal || "");
      setRegional(details.regional || "");
      setVoltajeLinea(details.voltajeLinea || "");
      setVoltajeUPSDesconect(details.voltajeUPSDesconect || "");
      setMarcaUPS(details.marcaUPS || "");
      setObservaciones(details.observaciones || "");
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
    "El equipo presenta daños físicos notables",
    "Puerto/conector en buenas condic.",
    "El carro presenta daños físicos notables",
    "Limpieza deficiente",
    "La etiqueta ha sido removida",
    "Acumulación de Polvo",
    "Hay conductores expuestos",
    "Conexión a CO2 adecuada",
  ];

  const electricalInspectionItems = [
    "Fusibles en buen estado",
    "Tipo de Fusibles",
    "Cable de Poder en buen estado",
    "Continuidad en cable de Poder",
    "Interfaz de Enchufes correcto",
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
    const electricalInspection = getInspectionData(
      "electrica",
      electricalInspectionItems
    );

    const formData = {
      lugar,
      fecha,
      garantia,
      swVer,
      sucursal,
      regional,
      voltajeLinea,
      voltajeUPSDesconect,
      marcaUPS,
      observaciones,
      tipo: "Preventivo",
      equipo: codigoActivo,
      costo: 0,
      estado: "Programado",
      typeForm: "Protocolo de Mantenimiento Torre Laparoscopia",
      visualInspection,
      electricalInspection,
    };
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Sistema de Gestión de Calidad
        </h1>
        <h2 className="text-xl text-gray-600">
          Comprobante de Mantenimiento Preventivo Planificado Torre de
          Laparoscopia
        </h2>
        <div className="mt-4 flex justify-between text-sm">
          <div>CÓDIGO: SGC-Apoyo-M-1-hhh3</div>
          <div>VIGENCIA DESDE: {new Date().toLocaleDateString()}</div>
        </div>
      </header>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Datos del Equipo</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="codigoActivo">Código de Activo</Label>
            <Input
              id="codigoActivo"
              value={codigoActivo}
              onChange={(e) => setCodigoActivo(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="marca">Marca</Label>
            <Input id="marca" value={marca} readOnly />
          </div>
          <div>
            <Label htmlFor="modelo">Modelo</Label>
            <Input id="modelo" value={modelo} readOnly />
          </div>
          <div>
            <Label htmlFor="ns">N/S</Label>
            <Input id="ns" value={numeroSerie} readOnly />
          </div>
          <div>
            <Label>Garantía</Label>
            <YesNoOptions id="garantia" defaultValue={garantia} />
          </div>
          <div>
            <Label htmlFor="swVer">SW/Ver.</Label>
            <Input
              id="swVer"
              value={swVer}
              onChange={(e) => setSwVer(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sucursal">Sucursal</Label>
            <Input
              id="sucursal"
              value={sucursal}
              onChange={(e) => setSucursal(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="regional">Regional</Label>
            <Input
              id="regional"
              value={regional}
              onChange={(e) => setRegional(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lugar">Lugar</Label>
            <Input
              id="lugar"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">1. Inspección Visual</h3>
        <div className="space-y-2">
          {visualInspectionItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`visual-${index}`}>{item}</Label>
              <YesNoOptions
                id={`visual-${index}`}
                defaultValue={
                  visualInspectionItems[index]
                    ? (visualInspectionItems[index] as any).value
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
        <h3 className="text-lg font-semibold mb-2">2. Inspección Eléctrica</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="equipoConectadoUPS">
              El equipo está conectado a un UPS
            </Label>
            <YesNoOptions id="equipoConectadoUPS" defaultValue="no" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="voltajeLinea">Voltaje Línea</Label>
              <Input
                id="voltajeLinea"
                type="number"
                value={voltajeLinea}
                onChange={(e) => setVoltajeLinea(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="voltajeUPSDesconect">
                Voltaje UPS desconect.
              </Label>
              <Input
                id="voltajeUPSDesconect"
                type="number"
                value={voltajeUPSDesconect}
                onChange={(e) => setVoltajeUPSDesconect(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="marcaUPS">Marca UPS</Label>
              <Input
                id="marcaUPS"
                value={marcaUPS}
                onChange={(e) => setMarcaUPS(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="transformadorElectrico">
                Transformador Eléctrico a 110V
              </Label>
              <YesNoOptions id="transformadorElectrico" defaultValue="no" />
            </div>
          </div>
          {electricalInspectionItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`electrica-${index}`}>{item}</Label>
              <YesNoOptions
                id={`electrica-${index}`}
                defaultValue={
                  electricalInspectionItems[index]
                    ? (electricalInspectionItems[index] as any).value
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
        <h3 className="text-lg font-semibold mb-2">Observaciones</h3>
        <Textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="w-full h-32"
        />
      </section>

      <footer className="flex justify-between mt-8">
        <div>
          <Label htmlFor="firmaMantenimiento">
            Firma y Sello Mantenimiento
          </Label>
          <Input id="firmaMantenimiento" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="firmaOperador">
            Firma y Sello Operador o encargado
          </Label>
          <Input id="firmaOperador" className="mt-1" />
        </div>
      </footer>

      <div className="mt-8 text-center">
        <Button type="button" onClick={handleSubmit}>
          Guardar Formulario
        </Button>
      </div>
    </div>
  );
}
