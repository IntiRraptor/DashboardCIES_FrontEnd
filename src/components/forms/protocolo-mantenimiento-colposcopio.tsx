"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { findEquipmentByCode } from "@/utils/equipmentUtils";
import logoCies from "../../../public/icon.png";

const YesNoOptions = ({ id, value, onChange }: { id: string; value: boolean; onChange: (value: boolean) => void }) => (
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
      <label htmlFor={`${id}-si`} className="radio-label">Sí</label>
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
      <label htmlFor={`${id}-no`} className="radio-label">No</label>
    </div>
  </div>
);

export default function FormularioMantenimientoColposcopio({
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
  const [formData, setFormData] = useState({
    codigoActivo: "",
    marca: "",
    modelo: "",
    ns: "",
    garantia: false,
    swVer: "",
    sucursal: "",
    regional: "",
    lugar: "",
    fecha: "",
    inspeccionVisual: {
      equipoDanosFisicos: false,
      carroDanosFisicos: false,
      etiquetaRemovida: false,
      conductoresExpuestos: false,
      camaraPresentaDanos: false,
      limpiezaDeficiente: false,
      acumulacionPolvo: false,
      sistemaAjusteCamara: false,
    },
    inspeccionElectrica: {
      equipoConectadoUPS: false,
      voltajeLinea: "",
      voltajeUPSConectado: "",
      voltajeUPSDesconect: "",
      voltajeNT: "",
      voltajeFT: "",
      marcaUPS: "",
      fusiblesBuenEstado: false,
      resistenciaFusibles: "",
      cablePoderBuenEstado: false,
      continuidadCablePoder: false,
      interfazEnchufesCorrecto: false,
      conexionWorkstationBuenEstado: false,
    },
    inspeccionFuncional: {
      encendidoInicializacion: false,
      reconocimientoCamara: false,
      coloresPantalla: false,
      almacenamientoPacientes: false,
      versionSO: "",
      claveSoftware: "",
      medicionesCorrectas: false,
      adquisicionImagenesCorrecta: false,
      generacionReportesCorrecta: false,
      salidaImagenComplacencia: false,
      tecladoFuncional: false,
      mouseFuncional: false,
    },
    inspeccionAccesorios: {
      impresora: {
        codigo: "",
        modelo: "",
        ns: "",
        impresionOptima: false,
        calidadAlta: false,
        tipoPapelUtilizado: "",
        tintaContinua: false,
        conexion: "",
      },
      computadora: {
        codigo: "",
        modelo: "",
        ns: "",
        funcionamientoOptimo: false,
        nivelBrillo: "",
        nivelContraste: "",
        conexion: "",
      },
    },
    observaciones: "",
    firmaMantenimiento: "",
    firmaOperador: "",
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      const details = JSON.parse(initialData.details);
      setFormData(prevState => ({
        ...prevState,
        ...details,
        codigoActivo: details.equipo || "",
      }));
    }
  }, [initialData, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      const foundEquipment = findEquipmentByCode(equipment, formData.codigoActivo);
      if (foundEquipment) {
        setFormData(prevState => ({
          ...prevState,
          marca: foundEquipment.nombreaf,
          modelo: foundEquipment.descaf,
          ns: foundEquipment.aux1,
        }));
      }
    }
  }, [equipment, formData.codigoActivo, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (section: string, field: string, value: boolean) => {
    setFormData(prevState => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value,
      },
    }));
  };

  const handleAccesorioChange = (accesorio: string, field: string, value: any) => {
    setFormData(prevState => ({
      ...prevState,
      inspeccionAccesorios: {
        ...prevState.inspeccionAccesorios,
        [accesorio]: {
          ...prevState.inspeccionAccesorios[accesorio],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = () => {
    const submittedData = {
      ...formData,
      tipo: "Preventivo",
      equipo: formData.codigoActivo,
      costo: 0,
      estado: "Programado",
      typeForm: "Protocolo de Mantenimiento Video Colposcopio",
    };
    onSubmit(submittedData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <Image src={logoCies} alt="Logo CIES" width={100} height={50} />
        <div className="text-center flex-grow">
          <h1 className="text-2xl font-bold">COMPROBANTE DE MANTENIMIENTO PREVENTIVO PLANIFICADO</h1>
          <h2 className="text-xl font-semibold">VIDEO COLPOSCOPIO</h2>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <Label htmlFor="lugar">Lugar:</Label>
            <Input
              id="lugar"
              name="lugar"
              className="w-40"
              value={formData.lugar}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="fecha">Fecha:</Label>
            <Input
              id="fecha"
              name="fecha"
              type="date"
              className="w-40"
              value={formData.fecha}
              onChange={handleInputChange}
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
              name="codigoActivo"
              value={formData.codigoActivo}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="marca">Marca:</Label>
            <Input id="marca" name="marca" value={formData.marca} readOnly />
          </div>
          <div>
            <Label htmlFor="modelo">Modelo:</Label>
            <Input id="modelo" name="modelo" value={formData.modelo} readOnly />
          </div>
          <div>
            <Label htmlFor="ns">N/S:</Label>
            <Input id="ns" name="ns" value={formData.ns} readOnly />
          </div>
          <div>
            <Label>Garantía:</Label>
            <YesNoOptions
              id="garantia"
              value={formData.garantia}
              onChange={(value) => handleCheckboxChange('', 'garantia', value)}
            />
          </div>
          <div>
            <Label htmlFor="swVer">SW/Ver.:</Label>
            <Input
              id="swVer"
              name="swVer"
              value={formData.swVer}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="sucursal">Sucursal:</Label>
            <Input
              id="sucursal"
              name="sucursal"
              value={formData.sucursal}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="regional">Regional:</Label>
            <Input
              id="regional"
              name="regional"
              value={formData.regional}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">1. INSPECCIÓN VISUAL</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData.inspeccionVisual).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Label>
              <YesNoOptions
                id={key}
                value={value}
                onChange={(newValue) => handleCheckboxChange('inspeccionVisual', key, newValue)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">2. INSPECCIÓN ELÉCTRICA</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData.inspeccionElectrica).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Label>
              {typeof value === 'boolean' ? (
                <YesNoOptions
                  id={key}
                  value={value}
                  onChange={(newValue) => handleCheckboxChange('inspeccionElectrica', key, newValue)}
                />
              ) : (
                <Input
                  id={key}
                  name={`inspeccionElectrica.${key}`}
                  value={value}
                  onChange={(e) => handleCheckboxChange('inspeccionElectrica', key, e.target.checked)}
                  className="w-40"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">3. INSPECCIÓN FUNCIONAL</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData.inspeccionFuncional).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Label>
              {typeof value === 'boolean' ? (
                <YesNoOptions
                  id={key}
                  value={value}
                  onChange={(newValue) => handleCheckboxChange('inspeccionFuncional', key, newValue)}
                />
              ) : (
                <Input
                  id={key}
                  name={`inspeccionFuncional.${key}`}
                  value={value}
                  onChange={(e) => handleCheckboxChange('inspeccionFuncional', key, e.target.checked)}
                  className="w-40"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">4. INSPECCIÓN ACCESORIOS</h2>
        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-2">IMPRESORA</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.inspeccionAccesorios.impresora).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <Label htmlFor={`impresora-${key}`}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Label>
                {typeof value === 'boolean' ? (
                  <YesNoOptions
                    id={`impresora-${key}`}
                    value={value}
                    onChange={(newValue) => handleAccesorioChange('impresora', key, newValue)}
                  />
                ) : (
                  <Input
                    id={`impresora-${key}`}
                    value={value}
                    onChange={(e) => handleAccesorioChange('impresora', key, e.target.value)}
                    className="w-40"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-2">COMPUTADORA O LAPTOP</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.inspeccionAccesorios.computadora).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <Label htmlFor={`computadora-${key}`}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Label>
                {typeof value === 'boolean' ? (
                  <YesNoOptions
                    id={`computadora-${key}`}
                    value={value}
                    onChange={(newValue) => handleAccesorioChange('computadora', key, newValue)}
                  />
                ) : (
                  <Input
                    id={`computadora-${key}`}
                    value={value}
                    onChange={(e) => handleAccesorioChange('computadora', key, e.target.value)}
                    className="w-40"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">OBSERVACIONES:</h2>
        <Textarea
          placeholder="Ingrese sus observaciones aquí"
          className="w-full h-24"
          name="observaciones"
          value={formData.observaciones}
          onChange={handleInputChange}
        />
      </section>

      <section className="flex justify-between">
        <div className="w-1/2 pr-2">
          <Label htmlFor="firmaMantenimiento">Firma y Sello Mantenimiento:</Label>
          <Input
            id="firmaMantenimiento"
            name="firmaMantenimiento"
            className="mt-1"
            value={formData.firmaMantenimiento}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-1/2 pl-2">
          <Label htmlFor="firmaOperador">Firma y Sello Operador o encargado:</Label>
          <Input
            id="firmaOperador"
            name="firmaOperador"
            className="mt-1"
            value={formData.firmaOperador}
            onChange={handleInputChange}
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
