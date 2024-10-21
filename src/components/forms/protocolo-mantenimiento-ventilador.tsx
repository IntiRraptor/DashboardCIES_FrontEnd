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

export default function FormularioMantenimientoVentiladorCPAP({
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
    anoEntrega: "",
    tipo: "Anestesia",
    garantia: false,
    sucursal: "",
    regional: "",
    lugar: "",
    fecha: "",
    inspeccionVisual: {
      dañosFisicos: false,
      dañosCarro: false,
      etiquetaRemovida: false,
      conductoresExpuestos: false,
      puertosConectoresDanados: false,
      pulmonPruebaBuenEstado: false,
      valvulasManguerasBuenEstado: false,
      limpiezaDeficiente: false,
      humidificadorBuenEstado: false,
      presionOxigenoAireCorrecta: false,
      sensorFlujoBuenEstado: false,
      usoFiltrosAntibacteriales: false,
      sensorOxigenoBuenEstado: false,
      manometrosBuenEstado: false,
    },
    inspeccionElectrica: {
      equipoConectadoUPS: false,
      voltajeLinea: "",
      voltajeUPS: "",
      bateriasEquipoBuenEstado: false,
      cablePoder: false,
      usaTransformador: false,
      interfazEnchufe: false,
      accesoriosBuenEstado: false,
      filtrosBuenEstado: false,
      cantidadBaterias: "",
      tipoBateria: "",
      fechaReemplazoBateria: "",
    },
    inspeccionFuncional: {
      encendidoInicializacion: false,
      ventilacionPresionCorrecta: false,
      autotestFallasFugas: false,
      ventilacionVolumenCorrecta: false,
      controlesFuncionales: false,
      ventilacionManualCorrecta: false,
      flujometrosFuncionales: false,
      ventilacionCPAPCorrecta: false,
      horasUso: "",
      mezclaAireOxigeno: false,
      sonidoAlarmas: false,
      dosisVaporizadores: false,
      suministroCilindroO2: false,
      pawPeepFuncionales: false,
      suministroCilindroAire: false,
      limitadorPresion: false,
      suministroElectrico: false,
      alarmaBajaPresion: false,
    },
    inspeccionAccesorios: {
      cantidadVaporizadores: "1",
      humidificadorActivo: false,
      vaporizadores: [
        {
          modelo: "",
          ns: "",
          perillaAjuste: false,
          indicadorNivel: false,
          empaquesConexion: false,
          puertoCarga: false,
          perillaSujecion: false,
          puertoDescarga: false,
        },
      ],
      humidificador: {
        modelo: "",
        ns: "",
        pruebaCalentamiento: false,
        botonesBuenEstado: false,
        sensorTemperatura: false,
        camaraHumBuenEstado: false,
        conexionElectrica: false,
      },
      compresor: {
        modelo: "",
        ns: "",
        pruebaFugas: false,
        botonesBuenEstado: false,
        conectoresSalida: false,
        filtrosAireLimpios: false,
        cableConexion: false,
      },
    },
    calibracionReemplazo: {
      calibracionFlujos: false,
      desempolvamientoInterno: false,
      calibracionPresiones: false,
      revisionModulosTarjetas: false,
      calibracionVolumenes: false,
      revisionInterfaces: false,
      ajustesInterfaz: false,
      revisionManometros: false,
      calibracionValvulas: false,
      revisionFlujometros: false,
      limpiezaContactores: false,
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
    if (name === "inspeccionAccesorios.cantidadVaporizadores") {
      const numVaporizadores = Math.max(1, Math.min(9, parseInt(value) || 1));
      const newVaporizadores = [...formData.inspeccionAccesorios.vaporizadores];
      while (newVaporizadores.length < numVaporizadores) {
        newVaporizadores.push({
          modelo: "",
          ns: "",
          perillaAjuste: false,
          indicadorNivel: false,
          empaquesConexion: false,
          puertoCarga: false,
          perillaSujecion: false,
          puertoDescarga: false,
        });
      }
      setFormData(prevState => ({
        ...prevState,
        inspeccionAccesorios: {
          ...prevState.inspeccionAccesorios,
          cantidadVaporizadores: numVaporizadores.toString(),
          vaporizadores: newVaporizadores.slice(0, numVaporizadores),
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

  const handleVaporizadorChange = (index: number, field: string, value: any) => {
    setFormData(prevState => ({
      ...prevState,
      inspeccionAccesorios: {
        ...prevState.inspeccionAccesorios,
        vaporizadores: prevState.inspeccionAccesorios.vaporizadores.map((v, i) => 
          i === index ? { ...v, [field]: value } : v
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
      typeForm: "Protocolo de Mantenimiento Anestesia Ventilador CPAP",
    };
    onSubmit(submittedData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <Image src={logoCies} alt="Logo CIES" width={100} height={50} />
        <div className="text-center flex-grow">
          <h1 className="text-2xl font-bold">COMPROBANTE DE MANTENIMIENTO PREVENTIVO PLANIFICADO</h1>
          <h2 className="text-xl font-semibold">ANESTESIA VENTILADOR CPAP</h2>
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
            <Label htmlFor="anoEntrega">Año de entrega/fabricación:</Label>
            <Input
              id="anoEntrega"
              name="anoEntrega"
              value={formData.anoEntrega}
              onChange={handleInputChange}
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
              <option value="Anestesia">Anestesia</option>
              <option value="Ventilador">Ventilador</option>
              <option value="CPAP">CPAP</option>
            </select>
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
            <Label htmlFor="cantidadVaporizadores">Cantidad de vaporizadores:</Label>
            <Input
              id="cantidadVaporizadores"
              name="inspeccionAccesorios.cantidadVaporizadores"
              type="number"
              min="1"
              max="9"
              value={formData.inspeccionAccesorios.cantidadVaporizadores}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label>Humidificador activo:</Label>
            <YesNoOptions
              id="humidificadorActivo"
              value={formData.inspeccionAccesorios.humidificadorActivo}
              onChange={(value) => handleCheckboxChange('inspeccionAccesorios', 'humidificadorActivo', value)}
            />
          </div>
        </div>
        {formData.inspeccionAccesorios.vaporizadores.slice(0, parseInt(formData.inspeccionAccesorios.cantidadVaporizadores)).map((vaporizador, index) => (
          <div key={index} className="border p-4 mb-4 rounded">
            <h3 className="font-semibold mb-2">VAPORIZADOR {index + 1}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`vaporizador-${index}-modelo`}>Modelo:</Label>
                <Input
                  id={`vaporizador-${index}-modelo`}
                  value={vaporizador.modelo}
                  onChange={(e) => handleVaporizadorChange(index, 'modelo', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`vaporizador-${index}-ns`}>N/S:</Label>
                <Input
                  id={`vaporizador-${index}-ns`}
                  value={vaporizador.ns}
                  onChange={(e) => handleVaporizadorChange(index, 'ns', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {Object.entries(vaporizador).map(([key, value]) => {
                if (typeof value === 'boolean') {
                  return (
                    <div key={key} className="flex justify-between items-center">
                      <Label htmlFor={`vaporizador-${index}-${key}`}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Label>
                      <YesNoOptions
                        id={`vaporizador-${index}-${key}`}
                        value={value}
                        onChange={(newValue) => handleVaporizadorChange(index, key, newValue)}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-2">HUMIDIFICADOR</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="humidificador-modelo">Modelo:</Label>
              <Input
                id="humidificador-modelo"
                value={formData.inspeccionAccesorios.humidificador.modelo}
                onChange={(e) => handleCheckboxChange('inspeccionAccesorios.humidificador', 'modelo', e.target.checked)}
              />
            </div>
            <div>
              <Label htmlFor="humidificador-ns">N/S:</Label>
              <Input
                id="humidificador-ns"
                value={formData.inspeccionAccesorios.humidificador.ns}
                onChange={(e) => handleCheckboxChange('inspeccionAccesorios.humidificador', 'ns', e.target.checked)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {Object.entries(formData.inspeccionAccesorios.humidificador).map(([key, value]) => {
              if (typeof value === 'boolean') {
                return (
                  <div key={key} className="flex justify-between items-center">
                    <Label htmlFor={`humidificador-${key}`}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Label>
                    <YesNoOptions
                      id={`humidificador-${key}`}
                      value={value}
                      onChange={(newValue) => handleCheckboxChange('inspeccionAccesorios.humidificador', key, newValue)}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-2">COMPRESOR</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="compresor-modelo">Modelo:</Label>
              <Input
                id="compresor-modelo"
                value={formData.inspeccionAccesorios.compresor.modelo}
                onChange={(e) => handleCheckboxChange('inspeccionAccesorios.compresor', 'modelo', e.target.checked)}
              />
            </div>
            <div>
              <Label htmlFor="compresor-ns">N/S:</Label>
              <Input
                id="compresor-ns"
                value={formData.inspeccionAccesorios.compresor.ns}
                onChange={(e) => handleCheckboxChange('inspeccionAccesorios.compresor', 'ns', e.target.checked)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {Object.entries(formData.inspeccionAccesorios.compresor).map(([key, value]) => {
              if (typeof value === 'boolean') {
                return (
                  <div key={key} className="flex justify-between items-center">
                    <Label htmlFor={`compresor-${key}`}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Label>
                    <YesNoOptions
                      id={`compresor-${key}`}
                      value={value}
                      onChange={(newValue) => handleCheckboxChange('inspeccionAccesorios.compresor', key, newValue)}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">5. CALIBRACIÓN Y REEMPLAZO DE EMPAQUES (Columna mantenimiento anual)</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData.calibracionReemplazo).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <Label htmlFor={`calibracionReemplazo-${key}`}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Label>
              <YesNoOptions
                id={`calibracionReemplazo-${key}`}
                value={value}
                onChange={(newValue) => handleCheckboxChange('calibracionReemplazo', key, newValue)}
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
