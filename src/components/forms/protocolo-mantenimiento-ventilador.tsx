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
import { format, addMonths } from "date-fns";
import { es } from "date-fns/locale";

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

export default function FormularioMantenimientoVentiladorCPAP({
  equipment,
  onSubmit,
  initialData,
  isEditMode = false,
  region,
  ubicacion,
}: {
  equipment: EquipmentDetail[];
  onSubmit: (data: any) => void;
  initialData: any;
  isEditMode: boolean;
  region: string;
  ubicacion: string;
}) {
  const [formData, setFormData] = useState({
    codigoActivo: "",
    marca: "",
    modelo: "",
    ns: "",
    garantia: false,
    tipo: "Ventilador CPAP",
    sucursal: "",
    regional: region,
    lugar: ubicacion,
    fecha: "",
    inspeccionVisual: {
      dañosFisicos: false,
      etiquetaRemovida: false,
      conductoresExpuestos: false,
      puertosConectoresDanados: false,
      limpiezaDeficiente: false,
      acumulacionPolvo: false,
      pantallaBuenEstado: false,
      botonesBuenEstado: false,
      manguerasConexionesBuenEstado: false,
      filtrosLimpios: false,
      sensoresIntactos: false,
    },
    inspeccionElectrica: {
      equipoCuentaBateria: false,
      voltajeBateria: "",
      modeloBateria: "",
      fusiblesBuenEstado: false,
      cablePoderBuenEstado: false,
      continuidadCablePoder: false,
      interfazEnchufesCorrecto: false,
      voltajeOperacionCorrecto: false,
      consumoCorrienteCorrecto: false,
    },
    inspeccionFuncional: {
      encendidoInicializacion: false,
      reconocimientoAccesorios: false,
      alarmasSonido: false,
      controlPresion: false,
      controlFlujo: false,
      controlVolumen: false,
      controlOxigeno: false,
      medicionPresion: "",
      medicionFlujo: "",
      medicionVolumen: "",
      medicionOxigeno: "",
      calibracionSensores: false,
      pruebaFugasCircuito: false,
    },
    inspeccionAccesorios: {
      cantidadVaporizadores: "2",
      humidificadorActivo: false,
      vaporizadores: [
        {
          modelo: "",
          ns: "",
          perillaAjusteFuncionamiento: false,
          indicadorNivelBuenEstado: false,
          empaquesConexionBuenEstado: false,
          puertoCargaBuenEstado: false,
          perillaSujecionBuenEstado: false,
          puertoDescargaBuenEstado: false,
        },
        {
          modelo: "",
          ns: "",
          perillaAjusteFuncionamiento: false,
          indicadorNivelBuenEstado: false,
          empaquesConexionBuenEstado: false,
          puertoCargaBuenEstado: false,
          perillaSujecionBuenEstado: false,
          puertoDescargaBuenEstado: false,
        }
      ],
      humidificador: {
        modelo: "",
        ns: "",
        ca: "",
        pruebaCalentamientoSatisfactoria: false,
        botonerillasBuenEstado: false,
        sensorTemperatura: false,
        camaraHumBuenEstado: false,
        conexionElectricaSegura: false,
      },
      compresor: {
        modelo: "",
        ns: "",
        ca: "",
        pruebaFugasSatisfactoria: false,
        botonerillasBuenEstado: false,
        conectoresSalidaBuenEstado: false,
        filtrosAireLimpios: false,
        cableConexionSinDanos: false,
      }
    },
    calibracionReemplazoEmpaques: {
      calibracionFlujos: false,
      desenpolvamientoInterno: false,
      calibracionPresiones: false,
      revisionModulosTarjetas: false,
      calibracionVolumenes: false,
      revisionInterfaces: false,
      ajustesInterfaz: false,
      revisionManometros: false,
      calibracionValvulas: false,
      revisionFlujometros: false,
      limpiezaContactoresElectricos: false,
    },
    observaciones: "",
    firmaMantenimiento: "",
    firmaOperador: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (isEditMode && initialData) {
      const details = JSON.parse(initialData.details);
      setFormData((prevState) => ({
        ...prevState,
        ...details,
        codigoActivo: details.equipo || "",
      }));
    }
  }, [initialData, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      const foundEquipment = findEquipmentByCode(
        equipment,
        formData.codigoActivo
      );
      if (foundEquipment) {
        setFormData((prevState) => ({
          ...prevState,
          marca: foundEquipment.nombreaf,
          modelo: foundEquipment.descaf,
          ns: foundEquipment.aux1,
        }));
      }
    }
  }, [equipment, formData.codigoActivo, isEditMode]);

  useEffect(() => {
    const isValid = Boolean(
      formData.codigoActivo &&
        formData.marca &&
        formData.modelo &&
        formData.ns &&
        formData.sucursal &&
        formData.regional &&
        formData.lugar &&
        formData.firmaMantenimiento &&
        formData.firmaOperador
    );
    setIsFormValid(isValid);
  }, [formData]);

  useEffect(() => {
    const cantidadVaporizadores = parseInt(formData.inspeccionAccesorios.cantidadVaporizadores) || 2;
    if (cantidadVaporizadores >= 1 && cantidadVaporizadores <= 9) {
      const vaporizadoresActuales = formData.inspeccionAccesorios.vaporizadores;
      const nuevoVaporizadores = Array(cantidadVaporizadores).fill(null).map((_, index) => 
        vaporizadoresActuales[index] || {
          modelo: "",
          ns: "",
          perillaAjusteFuncionamiento: false,
          indicadorNivelBuenEstado: false,
          empaquesConexionBuenEstado: false,
          puertoCargaBuenEstado: false,
          perillaSujecionBuenEstado: false,
          puertoDescargaBuenEstado: false,
        }
      );
      setFormData(prevState => ({
        ...prevState,
        inspeccionAccesorios: {
          ...prevState.inspeccionAccesorios,
          vaporizadores: nuevoVaporizadores
        }
      }));
    }
  }, [formData.inspeccionAccesorios.cantidadVaporizadores]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (
    section: string,
    field: string,
    value: boolean
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value,
      },
    }));
  };

  const handleAccesorioChange = (
    index: number | string,
    field: string,
    value: string | boolean
  ) => {
    setFormData((prevState) => {
      if (typeof index === 'number') {
        // Manejar cambios en vaporizadores
        const vaporizadoresActualizados = [...prevState.inspeccionAccesorios.vaporizadores];
        vaporizadoresActualizados[index] = {
          ...vaporizadoresActualizados[index],
          [field]: value,
        };
        return {
          ...prevState,
          inspeccionAccesorios: {
            ...prevState.inspeccionAccesorios,
            vaporizadores: vaporizadoresActualizados,
          },
        };
      } else if (index === 'humidificador' || index === 'compresor') {
        // Manejar cambios en humidificador o compresor
        return {
          ...prevState,
          inspeccionAccesorios: {
            ...prevState.inspeccionAccesorios,
            [index]: {
              ...prevState.inspeccionAccesorios[index],
              [field]: value,
            },
          },
        };
      }
      return prevState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSubmit = {
      ...formData,
      equipo: formData.codigoActivo,
      fecha: format(new Date(), "yyyy-MM-dd"),
      proximaFecha: format(addMonths(new Date(), 6), "yyyy-MM-dd"),
    };
    onSubmit(formDataToSubmit);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <Image src={logoCies} alt="Logo CIES" width={100} height={50} />
        <div className="text-center flex-grow">
          <h1 className="text-2xl font-bold">
            COMPROBANTE DE MANTENIMIENTO PREVENTIVO PLANIFICADO
          </h1>
          <h2 className="text-xl font-semibold">VENTILADOR CPAP</h2>
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
              onChange={(value) => handleCheckboxChange("garantia", "", value)}
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
            <Input id="regional" name="regional" value={region} readOnly />
          </div>
          <div>
            <Label htmlFor="ubicacion">Ubicación:</Label>
            <Input id="ubicacion" name="ubicacion" value={ubicacion} readOnly />
          </div>
        </div>
      </section>

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
                  handleCheckboxChange("inspeccionVisual", key, newValue)
                }
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
                    handleCheckboxChange("inspeccionElectrica", key, newValue)
                  }
                />
              ) : (
                <Input
                  id={key}
                  name={`inspeccionElectrica.${key}`}
                  value={value}
                  onChange={handleInputChange}
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
                    handleCheckboxChange("inspeccionFuncional", key, newValue)
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
              onChange={(value) =>
                handleCheckboxChange("inspeccionAccesorios", "humidificadorActivo", value)
              }
            />
          </div>
        </div>

        {formData.inspeccionAccesorios.vaporizadores
          .slice(0, parseInt(formData.inspeccionAccesorios.cantidadVaporizadores))
          .map((vaporizador, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <h3 className="font-semibold mb-2">VAPORIZADOR {index + 1}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`vaporizador-${index}-modelo`}>Modelo:</Label>
                  <Input
                    id={`vaporizador-${index}-modelo`}
                    value={vaporizador.modelo}
                    onChange={(e) =>
                      handleAccesorioChange(index, "modelo", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`vaporizador-${index}-ns`}>N/S:</Label>
                  <Input
                    id={`vaporizador-${index}-ns`}
                    value={vaporizador.ns}
                    onChange={(e) =>
                      handleAccesorioChange(index, "ns", e.target.value)
                    }
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Label>Perilla de Ajuste en funcionamiento:</Label>
                  <YesNoOptions
                    id={`vaporizador-${index}-perillaAjuste`}
                    value={vaporizador.perillaAjusteFuncionamiento}
                    onChange={(value) =>
                      handleAccesorioChange(index, "perillaAjusteFuncionamiento", value)
                    }
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Label>Indicador de Nivel en buen estado:</Label>
                  <YesNoOptions
                    id={`vaporizador-${index}-indicadorNivel`}
                    value={vaporizador.indicadorNivelBuenEstado}
                    onChange={(value) =>
                      handleAccesorioChange(index, "indicadorNivelBuenEstado", value)
                    }
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Label>Empaques de conexión en buen estado:</Label>
                  <YesNoOptions
                    id={`vaporizador-${index}-empaquesConexion`}
                    value={vaporizador.empaquesConexionBuenEstado}
                    onChange={(value) =>
                      handleAccesorioChange(index, "empaquesConexionBuenEstado", value)
                    }
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Label>Puerto de carga en buen estado:</Label>
                  <YesNoOptions
                    id={`vaporizador-${index}-puertoCarga`}
                    value={vaporizador.puertoCargaBuenEstado}
                    onChange={(value) =>
                      handleAccesorioChange(index, "puertoCargaBuenEstado", value)
                    }
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Label>Perilla de sujeción en buen estado:</Label>
                  <YesNoOptions
                    id={`vaporizador-${index}-perillaSujecion`}
                    value={vaporizador.perillaSujecionBuenEstado}
                    onChange={(value) =>
                      handleAccesorioChange(index, "perillaSujecionBuenEstado", value)
                    }
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Label>Puerto de descarga buen estado:</Label>
                  <YesNoOptions
                    id={`vaporizador-${index}-puertoDescarga`}
                    value={vaporizador.puertoDescargaBuenEstado}
                    onChange={(value) =>
                      handleAccesorioChange(index, "puertoDescargaBuenEstado", value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}

        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-2">HUMIDIFICADOR</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Modelo:</Label>
              <Input
                value={formData.inspeccionAccesorios.humidificador.modelo}
                onChange={(e) =>
                  handleAccesorioChange("humidificador", "modelo", e.target.value)
                }
              />
            </div>
            <div>
              <Label>N/S:</Label>
              <Input
                value={formData.inspeccionAccesorios.humidificador.ns}
                onChange={(e) =>
                  handleAccesorioChange("humidificador", "ns", e.target.value)
                }
              />
            </div>
            <div>
              <Label>C.A.:</Label>
              <Input
                value={formData.inspeccionAccesorios.humidificador.ca}
                onChange={(e) =>
                  handleAccesorioChange("humidificador", "ca", e.target.value)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <Label>Prueba de calentamiento satisfactoria:</Label>
              <YesNoOptions
                id="humidificador-calentamiento"
                value={formData.inspeccionAccesorios.humidificador.pruebaCalentamientoSatisfactoria}
                onChange={(value) =>
                  handleAccesorioChange("humidificador", "pruebaCalentamientoSatisfactoria", value)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <Label>Botones, perilla en buen estado:</Label>
              <YesNoOptions
                id="humidificador-botones"
                value={formData.inspeccionAccesorios.humidificador.botonerillasBuenEstado}
                onChange={(value) =>
                  handleAccesorioChange("humidificador", "botonerillasBuenEstado", value)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <Label>Sensor de temperatura:</Label>
              <YesNoOptions
                id="humidificador-sensor"
                value={formData.inspeccionAccesorios.humidificador.sensorTemperatura}
                onChange={(value) =>
                  handleAccesorioChange("humidificador", "sensorTemperatura", value)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <Label>Cámara de hum en buen estado:</Label>
              <YesNoOptions
                id="humidificador-camara"
                value={formData.inspeccionAccesorios.humidificador.camaraHumBuenEstado}
                onChange={(value) =>
                  handleAccesorioChange("humidificador", "camaraHumBuenEstado", value)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <Label>Conexión eléctrica segura:</Label>
              <YesNoOptions
                id="humidificador-conexion"
                value={formData.inspeccionAccesorios.humidificador.conexionElectricaSegura}
                onChange={(value) =>
                  handleAccesorioChange("humidificador", "conexionElectricaSegura", value)
                }
              />
            </div>
          </div>
        </div>

        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-2">COMPRESOR</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Modelo:</Label>
              <Input
                value={formData.inspeccionAccesorios.compresor.modelo}
                onChange={(e) =>
                  handleAccesorioChange("compresor", "modelo", e.target.value)
                }
              />
            </div>
            <div>
              <Label>N/S:</Label>
              <Input
                value={formData.inspeccionAccesorios.compresor.ns}
                onChange={(e) =>
                  handleAccesorioChange("compresor", "ns", e.target.value)
                }
              />
            </div>
            <div>
              <Label>C.A.:</Label>
              <Input
                value={formData.inspeccionAccesorios.compresor.ca}
                onChange={(e) =>
                  handleAccesorioChange("compresor", "ca", e.target.value)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <Label>Prueba de fugas satisfactoria:</Label>
              <YesNoOptions
                id="compresor-fugas"
                value={formData.inspeccionAccesorios.compresor.pruebaFugasSatisfactoria}
                onChange={(value) =>
                  handleAccesorioChange("compresor", "pruebaFugasSatisfactoria", value)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <Label>Botones, perilla en buen estado:</Label>
              <YesNoOptions
                id="compresor-botones"
                value={formData.inspeccionAccesorios.compresor.botonerillasBuenEstado}
                onChange={(value) =>
                  handleAccesorioChange("compresor", "botonerillasBuenEstado", value)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <Label>Conectores de Salida en buen estado:</Label>
              <YesNoOptions
                id="compresor-conectores"
                value={formData.inspeccionAccesorios.compresor.conectoresSalidaBuenEstado}
                onChange={(value) =>
                  handleAccesorioChange("compresor", "conectoresSalidaBuenEstado", value)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <Label>Filtros de aire limpios:</Label>
              <YesNoOptions
                id="compresor-filtros"
                value={formData.inspeccionAccesorios.compresor.filtrosAireLimpios}
                onChange={(value) =>
                  handleAccesorioChange("compresor", "filtrosAireLimpios", value)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <Label>Cable de conexión sin daños:</Label>
              <YesNoOptions
                id="compresor-cable"
                value={formData.inspeccionAccesorios.compresor.cableConexionSinDanos}
                onChange={(value) =>
                  handleAccesorioChange("compresor", "cableConexionSinDanos", value)
                }
              />
            </div>
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

      <div className="mt-6 text-center">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
        >
          Enviar e Imprimir Formulario de Mantenimiento
        </Button>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Los campos marcados con <span className="text-red-500">*</span> son
        obligatorios
      </div>
    </div>
  );
}
