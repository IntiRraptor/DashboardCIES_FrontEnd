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

export default function FormularioMantenimientoIncubadora({
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
    tipo: "Incubadora",
    sucursal: "",
    regional: "",
    lugar: "",
    fecha: "",
    inspeccionVisual: {
      dañosFisicos: false,
      dañosCarro: false,
      etiquetaRemovida: false,
      puertosConectoresDanados: false,
      limpiezaDeficiente: false,
      acumulacionPolvo: false,
      policarbonatosBuenEstado: false,
      conductoresExpuestos: false,
    },
    inspeccionElectrica: {
      equipoCuentaBateria: false,
      voltajeBateria: "",
      modeloBateria: "",
      resistenciaInterna: "",
      potenciaTuboUV: "",
      tamanoTuboUV: "",
      resistenciaInternaBuenEstado: false,
      fusiblesBuenEstado: false,
      cablePoderBuenEstado: false,
      continuidadCablePoder: false,
      iluminacionUVBuenEstado: false,
    },
    inspeccionFuncional: {
      encendidoInicializacion: false,
      reconocimientoAccesorios: false,
      alarmasSonidoCorrecto: false,
      almacenamientoPacientes: false,
      movimientoPerillaBotones: false,
      controlTemperatura: false,
      controlHumedad: false,
      controlIluminacion: false,
      riseTimeTemp: "",
      nivelLumenes: "",
    },
    inspeccionAccesorios: {
      cantidadAccesorios: "1",
      accesorios: [
        {
          modelo: "",
          ns: "",
          pruebaFuncionamiento: false,
          interfazSinDaños: false,
          cableConexionSinDaños: false,
          conectorSinDaños: false,
          limpiezaAdecuada: false,
          sensorSinDaños: false,
        },
      ],
    },
    limpieza: {
      memoriaLimpieza: false,
      contactoresElectricos: false,
      panelesControlTeclado: false,
      desenpolvarChasis: false,
      desenpolvamientoInterno: false,
      revisionModulosTarjetas: false,
      revisionRuedasFrenos: false,
      contenedorAgua: false,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "inspeccionAccesorios.cantidadAccesorios") {
      const numAccesorios = Math.max(1, Math.min(6, parseInt(value) || 1));
      const newAccesorios = [...formData.inspeccionAccesorios.accesorios];
      while (newAccesorios.length < numAccesorios) {
        newAccesorios.push({
          modelo: "",
          ns: "",
          pruebaFuncionamiento: false,
          interfazSinDaños: false,
          cableConexionSinDaños: false,
          conectorSinDaños: false,
          limpiezaAdecuada: false,
          sensorSinDaños: false,
        });
      }
      setFormData(prevState => ({
        ...prevState,
        inspeccionAccesorios: {
          ...prevState.inspeccionAccesorios,
          cantidadAccesorios: numAccesorios.toString(),
          accesorios: newAccesorios.slice(0, numAccesorios),
        },
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
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

  const handleAccesorioChange = (index: number, field: string, value: any) => {
    setFormData(prevState => ({
      ...prevState,
      inspeccionAccesorios: {
        ...prevState.inspeccionAccesorios,
        accesorios: prevState.inspeccionAccesorios.accesorios.map((acc, i) => 
          i === index ? { ...acc, [field]: value } : acc
        ),
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
      typeForm: "Protocolo de Mantenimiento Incubadora ServoCuna Fototerapia",
      inspeccionAccesorios: {
        ...formData.inspeccionAccesorios,
        accesorios: formData.inspeccionAccesorios.accesorios.slice(
          0,
          parseInt(formData.inspeccionAccesorios.cantidadAccesorios)
        ),
      },
    };
    onSubmit(submittedData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <Image src={logoCies} alt="Logo CIES" width={100} height={50} />
        <div className="text-center flex-grow">
          <h1 className="text-2xl font-bold">COMPROBANTE DE MANTENIMIENTO PREVENTIVO PLANIFICADO</h1>
          <h2 className="text-xl font-semibold">INCUBADORA - SERVOCUNA - FOTOTERAPIA</h2>
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
        <h2 className="text-lg font-semibold mb-2">DATOS DEL EQUIPO:</h2>
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
              onChange={(value) => handleCheckboxChange('garantia', '', value)}
            />
          </div>
          <div>
            <Label htmlFor="tipo">Tipo:</Label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="Incubadora">Incubadora</option>
              <option value="Servocuna">Servocuna</option>
              <option value="Fototerapia">Fototerapia</option>
            </select>
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
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="cantidadAccesorios">Cantidad de accesorios:</Label>
            <Input
              id="cantidadAccesorios"
              name="inspeccionAccesorios.cantidadAccesorios"
              type="number"
              min="1"
              max="6"
              value={formData.inspeccionAccesorios.cantidadAccesorios}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {formData.inspeccionAccesorios.accesorios.slice(0, parseInt(formData.inspeccionAccesorios.cantidadAccesorios)).map((accesorio, index) => (
          <div key={index} className="border p-4 mb-4 rounded">
            <h3 className="font-semibold mb-2">ACCESORIO {index + 1}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`accesorio-${index}-modelo`}>Modelo:</Label>
                <Input
                  id={`accesorio-${index}-modelo`}
                  value={accesorio.modelo}
                  onChange={(e) => handleAccesorioChange(index, 'modelo', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`accesorio-${index}-ns`}>N/S:</Label>
                <Input
                  id={`accesorio-${index}-ns`}
                  value={accesorio.ns}
                  onChange={(e) => handleAccesorioChange(index, 'ns', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {Object.entries(accesorio).map(([key, value]) => {
                if (typeof value === 'boolean') {
                  return (
                    <div key={key} className="flex justify-between items-center">
                      <Label htmlFor={`accesorio-${index}-${key}`}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Label>
                  <YesNoOptions
                        id={`accesorio-${index}-${key}`}
                        value={value}
                        onChange={(newValue) => handleAccesorioChange(index, key, newValue)}
                  />
                </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">5. LIMPIEZA (Solo si fuese necesario) (2da Columna mantenimiento anual)</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData.limpieza).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <Label htmlFor={`limpieza-${key}`}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Label>
              <YesNoOptions
                id={`limpieza-${key}`}
                value={value}
                onChange={(newValue) => handleCheckboxChange('limpieza', key, newValue)}
              />
            </div>
          ))}
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
