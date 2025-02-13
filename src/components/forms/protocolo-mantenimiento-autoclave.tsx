"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { findEquipmentByCode } from "@/utils/equipmentUtils";
import logoCies from "../../../public/icon.png";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CheckItemProps {
  label: string;
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const CheckItem = ({ label, name, value, onChange }: CheckItemProps) => {
  return (
    <div className="flex items-center justify-between gap-4 border p-3 rounded-lg">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id={`${name}-si`}
            name={name}
            checked={value}
            onChange={() => onChange(true)}
            className="radio-input"
          />
          <label htmlFor={`${name}-si`} className="radio-label">
            Sí
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id={`${name}-no`}
            name={name}
            checked={!value}
            onChange={() => onChange(false)}
            className="radio-input"
          />
          <label htmlFor={`${name}-no`} className="radio-label">
            No
          </label>
        </div>
      </div>
    </div>
  );
};

const YesNoOptions = ({
  id,
  value,
  onChange,
}: {
  id: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) => (
  <div className="flex space-x-4">
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={`${id}-si`}
        name={id}
        checked={value}
        onChange={() => onChange(true)}
        className="radio-input"
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
        checked={!value}
        onChange={() => onChange(false)}
        className="radio-input"
      />
      <label htmlFor={`${id}-no`} className="radio-label">
        No
      </label>
    </div>
  </div>
);

export default function FormularioMantenimientoAutoclave({
  equipment,
  onSubmit,
  initialData,
  isEditMode = false,
  region,
  ubicacion,
}: {
  equipment: EquipmentDetail[];
  onSubmit: (data: any) => void;
  initialData?: any;
  isEditMode: boolean;
  region: string;
  ubicacion: string;
}) {
  const [formData, setFormData] = useState({
    tipo: "Preventivo",
    typeForm: "Protocolo de Mantenimiento Autoclave",
    lugar: ubicacion || "",
    fecha: format(new Date(), "yyyy-MM-dd"),
    codigoActivo: "",
    marca: "",
    modelo: "",
    ns: "",
    anioEntrega: "",
    capacidad: "",
    sucursal: ubicacion || "",
    regional: region || "",
    garantia: false,
    inspeccionVisual: {
      danosNotables: false,
      danosPuerta: false,
      danosEmpaque: false,
      danosControles: false,
      conexionesAguaVapor: false,
      estructuraExterna: false,
      camaraInterna: false,
      limpiezaDeficiente: false
    },
    inspeccionElectrica: {
      conexionTrifasica: false,
      voltajeNominal: "",
      voltajeEntreFases: "",
      cableadoBuenEstado: false,
      disyuntoresBuenEstado: false,
      amperajeDisyuntores: "",
      cableadoInternoBuenEstado: false,
      valoresResistencias: {
        r1: "",
        r2: "",
        r3: ""
      },
      medicionCorrientesFuga: ""
    },
    inspeccionFuncional: {
      encendidoCorrecto: false,
      autotest: false,
      controlesFuncionales: false,
      manometrosFuncionales: false,
      horasUso: "",
      sonidoAlarmas: false,
      suministroAgua: false,
      sensoresTemperatura: false,
      valvulasSolenoidales: false,
      lubricacionPiezas: false,
      limpiezaTanqueAgua: false,
      limpiezaSensoresNivel: false,
      cambioFiltros: false,
      fugasVapor: false,
      fugasAgua: false,
      salidaVapor: false,
      cicloEsterilizacion: false,
      valvulaSeguridad: false,
      ventilacionFuncional: false,
      sensoresPresion: false,
      impresionTermica: false,
      revisionSellos: false,
      limpiezaTanqueCalentador: false,
      cambioValvulas: false
    },
    observaciones: "",
    firmaMantenimiento: "",
    firmaOperador: "",
  });

  useEffect(() => {
    if (initialData) {
      // Si initialData es un string (JSON), parsearlo
      const parsedData = typeof initialData === 'string' ? JSON.parse(initialData) : initialData;
      setFormData(prevData => ({
        ...prevData,
        ...parsedData,
        // Asegurarse de que las secciones de inspección existan
        inspeccionVisual: {
          ...prevData.inspeccionVisual,
          ...(parsedData.inspeccionVisual || {})
        },
        inspeccionElectrica: {
          ...prevData.inspeccionElectrica,
          ...(parsedData.inspeccionElectrica || {})
        },
        inspeccionFuncional: {
          ...prevData.inspeccionFuncional,
          ...(parsedData.inspeccionFuncional || {})
        }
      }));
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field, subfield] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: subfield 
            ? { ...prev[section][field], [subfield]: value }
            : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleVisualInspectionChange = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      inspeccionVisual: {
        ...prev.inspeccionVisual,
        [field]: value,
      },
    }));
  };

  const handleElectricalInspectionChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      inspeccionElectrica: {
        ...prev.inspeccionElectrica,
        [field]: value,
      },
    }));
  };

  const handleFunctionalInspectionChange = (field: string, value: boolean | string) => {
    setFormData((prev) => ({
      ...prev,
      inspeccionFuncional: {
        ...prev.inspeccionFuncional,
        [field]: value,
      },
    }));
  };

  const handleEquipmentSelect = (code: string) => {
    const selectedEquipment = findEquipmentByCode(equipment, code);
    if (selectedEquipment) {
      setFormData((prev) => ({
        ...prev,
        codigoActivo: selectedEquipment.codigoaf || "",
        marca: selectedEquipment.aux1 || "", // Using aux1 field instead of marca
        modelo: selectedEquipment.descaf || "", // Using descaf field instead of modelo
        ns: selectedEquipment.nombreaf || "", // Using nombreaf field instead of numeroSerie
        anioEntrega: selectedEquipment.codigoaf1 || "", // Using codigoaf1 field instead of anioFabricacion
      }));
    }
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      tipo: "Preventivo",
      equipo: formData.codigoActivo,
      estado: "Programado",
      costo: 0,
      typeForm: "Protocolo de Mantenimiento Autoclave",
      modeloFormulario: "autoclave",
      fechaProximoMantenimiento: format(
        new Date(formData.fecha),
        "yyyy-MM-dd"
      ),
    };
    onSubmit(submitData);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-1 border-b">
          <div className="flex items-center gap-4">
            <Image
              src={logoCies}
              alt="Logo CIES"
              width={100}
              height={50}
              className="object-contain"
            />
            <div className="flex-1">
              <CardTitle className="text-xl text-center">
                SISTEMA DE GESTION DE CALIDAD
              </CardTitle>
              <p className="text-center font-semibold mt-2">
                COMPROBANTE DE MANTENIMIENTO PREVENTIVO PLANIFICADO
                <br />
                AUTOCLAVE
              </p>
            </div>
            <div className="text-sm space-y-1">
              <p>CODIGO-SGC-Apoyo-M-1-hhh3</p>
              <p>VIGENCIA DESDE: 30/10/2018</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Label>Lugar:</Label>
              <Input
                name="lugar"
                value={formData.lugar}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Fecha:</Label>
              <Input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Equipment Data */}
          <section>
            <h3 className="font-semibold mb-4">DATOS DEL EQUIPO:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Código de Activo:</Label>
                <Input
                  name="codigoActivo"
                  value={formData.codigoActivo}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleEquipmentSelect(e.target.value);
                  }}
                />
              </div>
              <div>
                <Label>Marca:</Label>
                <Input
                  name="marca"
                  value={formData.marca}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Modelo:</Label>
                <Input
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>N/S:</Label>
                <Input
                  name="ns"
                  value={formData.ns}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Año de entrega/fabricación:</Label>
                <Input
                  name="anioEntrega"
                  value={formData.anioEntrega}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Capacidad:</Label>
                <Input
                  name="capacidad"
                  value={formData.capacidad}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Sucursal:</Label>
                <Input
                  name="sucursal"
                  value={formData.sucursal}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Regional:</Label>
                <Input
                  name="regional"
                  value={formData.regional}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </section>

          {/* Visual Inspection */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">1. INSPECCIÓN VISUAL</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.inspeccionVisual).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <Label htmlFor={key}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </Label>
                  <YesNoOptions
                    id={key}
                    value={value}
                    onChange={(newValue) =>
                      handleVisualInspectionChange(key, newValue)
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Electrical Inspection */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">2. INSPECCIÓN ELÉCTRICA</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.inspeccionElectrica)
                .filter(([key]) => key !== "valoresResistencias")
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <Label htmlFor={key}>
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      :
                    </Label>
                    {typeof value === "boolean" ? (
                      <YesNoOptions
                        id={key}
                        value={value}
                        onChange={(newValue) =>
                          handleElectricalInspectionChange(key, newValue)
                        }
                      />
                    ) : (
                      <Input
                        id={key}
                        name={`inspeccionElectrica.${key}`}
                        value={value as string}
                        onChange={handleInputChange}
                        className="w-40"
                      />
                    )}
                  </div>
                ))}
              <div className="flex justify-between items-center">
                <Label>Valores Resistencias:</Label>
                <div className="flex gap-2">
                  <Input
                    id="r1"
                    name="inspeccionElectrica.valoresResistencias.r1"
                    value={formData.inspeccionElectrica.valoresResistencias.r1}
                    onChange={handleInputChange}
                    className="w-20"
                  />
                  <Input
                    id="r2"
                    name="inspeccionElectrica.valoresResistencias.r2"
                    value={formData.inspeccionElectrica.valoresResistencias.r2}
                    onChange={handleInputChange}
                    className="w-20"
                  />
                  <Input
                    id="r3"
                    name="inspeccionElectrica.valoresResistencias.r3"
                    value={formData.inspeccionElectrica.valoresResistencias.r3}
                    onChange={handleInputChange}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Functional Inspection */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">3. INSPECCIÓN FUNCIONAL</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.inspeccionFuncional).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <Label htmlFor={key}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </Label>
                  {typeof value === "boolean" ? (
                    <YesNoOptions
                      id={key}
                      value={value}
                      onChange={(newValue) =>
                        handleFunctionalInspectionChange(key, newValue)
                      }
                    />
                  ) : (
                    <Input
                      id={key}
                      name={`inspeccionFuncional.${key}`}
                      value={value}
                      onChange={handleInputChange}
                      className="w-40"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Observations */}
          <section>
            <h3 className="font-semibold mb-4">OBSERVACIONES:</h3>
            <Textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange}
              className="min-h-[100px]"
            />
          </section>

          {/* Signatures */}
          <section className="flex justify-between">
            <div className="w-1/2 pr-2">
              <Label htmlFor="firmaMantenimiento" className="flex items-center">
                Firma y Sello Mantenimiento:{" "}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="firmaMantenimiento"
                name="firmaMantenimiento"
                className="mt-1"
                value={formData.firmaMantenimiento}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2 pl-2">
              <Label htmlFor="firmaOperador" className="flex items-center">
                Firma y Sello Operador o encargado:{" "}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="firmaOperador"
                name="firmaOperador"
                className="mt-1"
                value={formData.firmaOperador}
                onChange={handleInputChange}
              />
            </div>
          </section>

          <div className="flex justify-end space-x-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.print()}
            >
              Imprimir
            </Button>
            <Button type="button" onClick={handleSubmit}>
              {isEditMode ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}