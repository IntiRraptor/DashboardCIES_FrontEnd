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
import { format } from "date-fns";
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

export default function FormularioInstalacionEquipo({
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
    tipo: "",
    sucursal: "",
    regional: region,
    lugar: ubicacion,
    fecha: "",
    suministrosElectricos: {
      voltajeLinea: "",
      voltajeRequerido: "",
      frecuenciaRequerida: "",
      capacidadRequerida: "",
      tipoConexion: "Monofasica",
      tomasCorrienteDisponibles: false,
      sistemaPuestaATierra: false,
      proteccionSobrecarga: false,
      respaldoUPS: false,
      interfazEnchufesCorrecto: false,
    },
    suministroGases: {
      conexionCentralGases: false,
      oxigeno: {
        activo: false,
        presion: "",
      },
      aireMedicinal: {
        activo: false,
        presion: "",
      },
      vacioSuccion: {
        activo: false,
        presion: "",
      },
      dioxidoCarbono: {
        activo: false,
        presion: "",
      },
      estadoConexionGasesAdecuado: false,
      verificacionFugasConexion: false,
      etiquetadoColorimetria: false,
      manometrosBuenEstado: false,
      sistemaEvacuacionCorrecto: false,
      valvulasSeguridadCorrectas: false,
      normasTomaCompatibles: false,
    },
    suministroAgua: {
      tanqueIndependiente: false,
      aguaPotable: {
        activo: false,
        presion: "",
      },
      sistemaDesmineralizador: {
        activo: false,
        presion: "",
      },
      sistemaFiltrador: {
        activo: false,
        presion: "",
      },
      presionEntradaEquipo: "",
      presionRequeridaEquipo: "",
      caudalIngresoEquipo: "",
      caudalMinimoRequerido: "",
      verificacionFugasConexion: false,
      etiquetadoColorimetria: false,
      manometrosBuenEstado: false,
      sistemaEvacuacionCorrecto: false,
      valvulasSeguridadCorrectas: false,
      normasTomaCompatibles: false,
      desagueAdecuado: false,
      ventilacionVaporAdecuado: false,
    },
    inspeccionVisual: {
      dañosFisicos: false,
      etiquetaRemovida: false,
      conductoresExpuestos: false,
      puertosConectoresDanados: false,
      limpiezaDeficiente: false,
      acumulacionPolvo: false,
      accesoriosCompletos: false,
      manualesCompletos: false,
    },
    inspeccionElectrica: {
      voltajeAlimentacion: "",
      corrienteNominal: "",
      potenciaNominal: "",
      fusiblesBuenEstado: false,
      cablePoderBuenEstado: false,
      tomaCorrienteAdecuado: false,
      conexionTierraBuenEstado: false,
      proteccionElectricaAdecuada: false,
    },
    inspeccionFuncional: {
      encendidoInicializacion: false,
      reconocimientoAccesorios: false,
      funcionamientoAlarmas: false,
      funcionamientoSensores: false,
      funcionamientoControles: false,
      funcionamientoIndicadores: false,
      funcionamientoGeneral: false,
    },
    condicionesAmbientales: {
      temperaturaAmbiente: "",
      humedadRelativa: "",
      ventilacionAdecuada: false,
      estufasAmbiente: false,
      controlPolvoParticulas: false,
      aireAcondicionado: false,
    },
    capacitacionPersonal: {
      operacionBasica: false,
      operacionAvanzada: false,
      limpiezaMantenimiento: false,
      solucionProblemas: false,
      medidasSeguridad: false,
      documentacionEntregada: false,
    },
    condicionesInfraestructura: {
      espacioFisicoSuficiente: false,
      superficieNivelada: false,
      iluminacionSuficiente: false,
      señalizacionesSeguridad: false,
    },
    pruebasVerificacion: {
      pruebasEncendido: false,
      verificacionAlarmas: false,
      calibracionAjustes: false,
      integracionSistemas: false,
    },
    observaciones: "",
    firmaOperador: "",
    firmaEncargado: "",
    firmaInstalador: "",
    firmaResponsable: "",
    firmaMantenimiento: "",
    entregaCapacitacion: {
      manualUsuarioEntregado: false,
      entregaResponsable: false,
      capacitacionRealizada: false,
      equipoFuncional: false,
    },
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
        formData.firmaOperador &&
        formData.firmaEncargado
    );
    setIsFormValid(isValid);
  }, [formData]);

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

  const handleSubmit = () => {
    const submittedData = {
      ...formData,
      tipo: "Instalación",
      equipo: formData.codigoActivo,
      costo: 0,
      estado: "Programado",
      typeForm: "Comprobante de Instalación de Equipo Médico",
      regional: region,
      ubicacion: ubicacion,
    };
    onSubmit(submittedData);
    handlePrint();
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
            COMPROBANTE DE INSTALACIÓN DE EQUIPO MÉDICO
          </h1>
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
            <Label htmlFor="tipo">Tipo:</Label>
            <Input
              id="tipo"
              name="tipo"
              value={formData.tipo}
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
            <Input id="regional" name="regional" value={region} readOnly />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">1. SUMINISTROS ELÉCTRICOS</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="voltajeLinea">Voltaje Línea:</Label>
            <Input
              id="voltajeLinea"
              name="suministrosElectricos.voltajeLinea"
              value={formData.suministrosElectricos.voltajeLinea}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="voltajeRequerido">Voltaje Requerido (Voltios):</Label>
            <Input
              id="voltajeRequerido"
              name="suministrosElectricos.voltajeRequerido"
              value={formData.suministrosElectricos.voltajeRequerido}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="frecuenciaRequerida">Frecuencia Requerida (Hz):</Label>
            <Input
              id="frecuenciaRequerida"
              name="suministrosElectricos.frecuenciaRequerida"
              value={formData.suministrosElectricos.frecuenciaRequerida}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="capacidadRequerida">Capacidad Requerida (VA):</Label>
            <Input
              id="capacidadRequerida"
              name="suministrosElectricos.capacidadRequerida"
              value={formData.suministrosElectricos.capacidadRequerida}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <div>
            <Label>Tipo de Conexión:</Label>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="monofasica"
                  name="tipoConexion"
                  checked={formData.suministrosElectricos.tipoConexion === "Monofasica"}
                  onChange={() => setFormData(prevState => ({
                    ...prevState,
                    suministrosElectricos: {
                      ...prevState.suministrosElectricos,
                      tipoConexion: "Monofasica"
                    }
                  }))}
                  className="radio-input"
                />
                <label htmlFor="monofasica">Monofásica</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="trifasica"
                  name="tipoConexion"
                  checked={formData.suministrosElectricos.tipoConexion === "Trifasica"}
                  onChange={() => setFormData(prevState => ({
                    ...prevState,
                    suministrosElectricos: {
                      ...prevState.suministrosElectricos,
                      tipoConexion: "Trifasica"
                    }
                  }))}
                  className="radio-input"
                />
                <label htmlFor="trifasica">Trifásica</label>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Label>Tomas de corriente disponibles:</Label>
            <YesNoOptions
              id="tomasCorriente"
              value={formData.suministrosElectricos.tomasCorrienteDisponibles}
              onChange={(value) =>
                handleCheckboxChange("suministrosElectricos", "tomasCorrienteDisponibles", value)
              }
            />
          </div>
          <div className="flex justify-between items-center">
            <Label>Sistema de puesta a tierra instalado:</Label>
            <YesNoOptions
              id="sistemaPuestaATierra"
              value={formData.suministrosElectricos.sistemaPuestaATierra}
              onChange={(value) =>
                handleCheckboxChange("suministrosElectricos", "sistemaPuestaATierra", value)
              }
            />
          </div>
          <div className="flex justify-between items-center">
            <Label>Protección contra sobrecarga:</Label>
            <YesNoOptions
              id="proteccionSobrecarga"
              value={formData.suministrosElectricos.proteccionSobrecarga}
              onChange={(value) =>
                handleCheckboxChange("suministrosElectricos", "proteccionSobrecarga", value)
              }
            />
          </div>
          <div className="flex justify-between items-center">
            <Label>Respaldo con UPS:</Label>
            <YesNoOptions
              id="respaldoUPS"
              value={formData.suministrosElectricos.respaldoUPS}
              onChange={(value) =>
                handleCheckboxChange("suministrosElectricos", "respaldoUPS", value)
              }
            />
          </div>
          <div className="flex justify-between items-center">
            <Label>Interfaz de Enchufes correcto:</Label>
            <YesNoOptions
              id="interfazEnchufesCorrecto"
              value={formData.suministrosElectricos.interfazEnchufesCorrecto}
              onChange={(value) =>
                handleCheckboxChange("suministrosElectricos", "interfazEnchufesCorrecto", value)
              }
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">2. SUMINISTRO DE GASES</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <Label>Conexión central de gases:</Label>
            <YesNoOptions
              id="conexionCentralGases"
              value={formData.suministroGases.conexionCentralGases}
              onChange={(value) =>
                handleCheckboxChange("suministroGases", "conexionCentralGases", value)
              }
            />
          </div>
          
          <div className="col-span-2 grid grid-cols-2 gap-4 border p-4 rounded">
            <div className="flex justify-between items-center">
              <Label>Oxígeno O2:</Label>
              <YesNoOptions
                id="oxigenoActivo"
                value={formData.suministroGases.oxigeno.activo}
                onChange={(value) =>
                  handleCheckboxChange("suministroGases.oxigeno", "activo", value)
                }
              />
            </div>
            <div>
              <Label>Presión O2:</Label>
              <Input
                name="suministroGases.oxigeno.presion"
                value={formData.suministroGases.oxigeno.presion}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-4 border p-4 rounded">
            <div className="flex justify-between items-center">
              <Label>Aire Medicinal:</Label>
              <YesNoOptions
                id="aireMedicinalActivo"
                value={formData.suministroGases.aireMedicinal.activo}
                onChange={(value) =>
                  handleCheckboxChange("suministroGases.aireMedicinal", "activo", value)
                }
              />
            </div>
            <div>
              <Label>Presión Aire:</Label>
              <Input
                name="suministroGases.aireMedicinal.presion"
                value={formData.suministroGases.aireMedicinal.presion}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-4 border p-4 rounded">
            <div className="flex justify-between items-center">
              <Label>Vacío o Succión:</Label>
              <YesNoOptions
                id="vacioSuccionActivo"
                value={formData.suministroGases.vacioSuccion.activo}
                onChange={(value) =>
                  handleCheckboxChange("suministroGases.vacioSuccion", "activo", value)
                }
              />
            </div>
            <div>
              <Label>Presión Vacío:</Label>
              <Input
                name="suministroGases.vacioSuccion.presion"
                value={formData.suministroGases.vacioSuccion.presion}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-4 border p-4 rounded">
            <div className="flex justify-between items-center">
              <Label>Dióxido Carbónico CO2:</Label>
              <YesNoOptions
                id="dioxidoCarbonoActivo"
                value={formData.suministroGases.dioxidoCarbono.activo}
                onChange={(value) =>
                  handleCheckboxChange("suministroGases.dioxidoCarbono", "activo", value)
                }
              />
            </div>
            <div>
              <Label>Presión CO2:</Label>
              <Input
                name="suministroGases.dioxidoCarbono.presion"
                value={formData.suministroGases.dioxidoCarbono.presion}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Label>Estado de conexión de gases adecuado:</Label>
            <YesNoOptions
              id="estadoConexionGasesAdecuado"
              value={formData.suministroGases.estadoConexionGasesAdecuado}
              onChange={(value) =>
                handleCheckboxChange("suministroGases", "estadoConexionGasesAdecuado", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Verificaciones de Fugas en conexión:</Label>
            <YesNoOptions
              id="verificacionFugasConexion"
              value={formData.suministroGases.verificacionFugasConexion}
              onChange={(value) =>
                handleCheckboxChange("suministroGases", "verificacionFugasConexion", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Etiquetado y colorimetría conexión:</Label>
            <YesNoOptions
              id="etiquetadoColorimetria"
              value={formData.suministroGases.etiquetadoColorimetria}
              onChange={(value) =>
                handleCheckboxChange("suministroGases", "etiquetadoColorimetria", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Manómetros en buen estado:</Label>
            <YesNoOptions
              id="manometrosBuenEstado"
              value={formData.suministroGases.manometrosBuenEstado}
              onChange={(value) =>
                handleCheckboxChange("suministroGases", "manometrosBuenEstado", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Sistema de Evacuación correcto:</Label>
            <YesNoOptions
              id="sistemaEvacuacionCorrecto"
              value={formData.suministroGases.sistemaEvacuacionCorrecto}
              onChange={(value) =>
                handleCheckboxChange("suministroGases", "sistemaEvacuacionCorrecto", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Válvulas de Seguridad correctas:</Label>
            <YesNoOptions
              id="valvulasSeguridadCorrectas"
              value={formData.suministroGases.valvulasSeguridadCorrectas}
              onChange={(value) =>
                handleCheckboxChange("suministroGases", "valvulasSeguridadCorrectas", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Normas de toma compatibles:</Label>
            <YesNoOptions
              id="normasTomaCompatibles"
              value={formData.suministroGases.normasTomaCompatibles}
              onChange={(value) =>
                handleCheckboxChange("suministroGases", "normasTomaCompatibles", value)
              }
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">3. SUMINISTRO DE AGUA</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <Label>Tanque de suministro independiente:</Label>
            <YesNoOptions
              id="tanqueIndependiente"
              value={formData.suministroAgua.tanqueIndependiente}
              onChange={(value) =>
                handleCheckboxChange("suministroAgua", "tanqueIndependiente", value)
              }
            />
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-4 border p-4 rounded">
            <div className="flex justify-between items-center">
              <Label>Agua Potable:</Label>
              <YesNoOptions
                id="aguaPotableActivo"
                value={formData.suministroAgua.aguaPotable.activo}
                onChange={(value) =>
                  handleCheckboxChange("suministroAgua.aguaPotable", "activo", value)
                }
              />
            </div>
            <div>
              <Label>Presión:</Label>
              <Input
                name="suministroAgua.aguaPotable.presion"
                value={formData.suministroAgua.aguaPotable.presion}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-4 border p-4 rounded">
            <div className="flex justify-between items-center">
              <Label>Sistema desmineralizador:</Label>
              <YesNoOptions
                id="sistemaDesmineralizadorActivo"
                value={formData.suministroAgua.sistemaDesmineralizador.activo}
                onChange={(value) =>
                  handleCheckboxChange("suministroAgua.sistemaDesmineralizador", "activo", value)
                }
              />
            </div>
            <div>
              <Label>Presión:</Label>
              <Input
                name="suministroAgua.sistemaDesmineralizador.presion"
                value={formData.suministroAgua.sistemaDesmineralizador.presion}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-4 border p-4 rounded">
            <div className="flex justify-between items-center">
              <Label>Sistema Filtrador:</Label>
              <YesNoOptions
                id="sistemaFiltradorActivo"
                value={formData.suministroAgua.sistemaFiltrador.activo}
                onChange={(value) =>
                  handleCheckboxChange("suministroAgua.sistemaFiltrador", "activo", value)
                }
              />
            </div>
            <div>
              <Label>Presión:</Label>
              <Input
                name="suministroAgua.sistemaFiltrador.presion"
                value={formData.suministroAgua.sistemaFiltrador.presion}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label>Presión de agua en la entrada equipo:</Label>
            <Input
              name="suministroAgua.presionEntradaEquipo"
              value={formData.suministroAgua.presionEntradaEquipo}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Presión"
            />
          </div>

          <div>
            <Label>Presión requerida por el equipo:</Label>
            <Input
              name="suministroAgua.presionRequeridaEquipo"
              value={formData.suministroAgua.presionRequeridaEquipo}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Presión"
            />
          </div>

          <div>
            <Label>Caudal de Ingreso al equipo (L/min):</Label>
            <Input
              name="suministroAgua.caudalIngresoEquipo"
              value={formData.suministroAgua.caudalIngresoEquipo}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div>
            <Label>Caudal Mínimo requerido por equipo (L/min):</Label>
            <Input
              name="suministroAgua.caudalMinimoRequerido"
              value={formData.suministroAgua.caudalMinimoRequerido}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Verificaciones de Fugas en conexión:</Label>
            <YesNoOptions
              id="verificacionFugasConexionAgua"
              value={formData.suministroAgua.verificacionFugasConexion}
              onChange={(value) =>
                handleCheckboxChange("suministroAgua", "verificacionFugasConexion", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Etiquetado y colorimetría conexión:</Label>
            <YesNoOptions
              id="etiquetadoColorimetriaAgua"
              value={formData.suministroAgua.etiquetadoColorimetria}
              onChange={(value) =>
                handleCheckboxChange("suministroAgua", "etiquetadoColorimetria", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Manómetros en buen estado:</Label>
            <YesNoOptions
              id="manometrosBuenEstadoAgua"
              value={formData.suministroAgua.manometrosBuenEstado}
              onChange={(value) =>
                handleCheckboxChange("suministroAgua", "manometrosBuenEstado", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Sistema de Evacuación correcto:</Label>
            <YesNoOptions
              id="sistemaEvacuacionCorrectoAgua"
              value={formData.suministroAgua.sistemaEvacuacionCorrecto}
              onChange={(value) =>
                handleCheckboxChange("suministroAgua", "sistemaEvacuacionCorrecto", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Válvulas de Seguridad correctas:</Label>
            <YesNoOptions
              id="valvulasSeguridadCorrectasAgua"
              value={formData.suministroAgua.valvulasSeguridadCorrectas}
              onChange={(value) =>
                handleCheckboxChange("suministroAgua", "valvulasSeguridadCorrectas", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Normas de toma compatibles:</Label>
            <YesNoOptions
              id="normasTomaCompatiblesAgua"
              value={formData.suministroAgua.normasTomaCompatibles}
              onChange={(value) =>
                handleCheckboxChange("suministroAgua", "normasTomaCompatibles", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Desagüe adecuado:</Label>
            <YesNoOptions
              id="desagueAdecuado"
              value={formData.suministroAgua.desagueAdecuado}
              onChange={(value) =>
                handleCheckboxChange("suministroAgua", "desagueAdecuado", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Ventilación de Vapor adecuado:</Label>
            <YesNoOptions
              id="ventilacionVaporAdecuado"
              value={formData.suministroAgua.ventilacionVaporAdecuado}
              onChange={(value) =>
                handleCheckboxChange("suministroAgua", "ventilacionVaporAdecuado", value)
              }
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">4. CONDICIONES AMBIENTALES</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Temperatura del Ambiente (°Celsius):</Label>
            <Input
              name="condicionesAmbientales.temperaturaAmbiente"
              value={formData.condicionesAmbientales.temperaturaAmbiente}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div>
            <Label>Humedad Relativa (%):</Label>
            <Input
              name="condicionesAmbientales.humedadRelativa"
              value={formData.condicionesAmbientales.humedadRelativa}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Ventilación Adecuada:</Label>
            <YesNoOptions
              id="ventilacionAdecuada"
              value={formData.condicionesAmbientales.ventilacionAdecuada}
              onChange={(value) =>
                handleCheckboxChange("condicionesAmbientales", "ventilacionAdecuada", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Estufas en el ambiente:</Label>
            <YesNoOptions
              id="estufasAmbiente"
              value={formData.condicionesAmbientales.estufasAmbiente}
              onChange={(value) =>
                handleCheckboxChange("condicionesAmbientales", "estufasAmbiente", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Control de Polvo y partículas:</Label>
            <YesNoOptions
              id="controlPolvoParticulas"
              value={formData.condicionesAmbientales.controlPolvoParticulas}
              onChange={(value) =>
                handleCheckboxChange("condicionesAmbientales", "controlPolvoParticulas", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Aire Acondicionado:</Label>
            <YesNoOptions
              id="aireAcondicionado"
              value={formData.condicionesAmbientales.aireAcondicionado}
              onChange={(value) =>
                handleCheckboxChange("condicionesAmbientales", "aireAcondicionado", value)
              }
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">5. CONDICIONES DE INFRAESTRUCTURA</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <Label>Espacio Físico suficiente para la operación:</Label>
            <YesNoOptions
              id="espacioFisicoSuficiente"
              value={formData.condicionesInfraestructura.espacioFisicoSuficiente}
              onChange={(value) =>
                handleCheckboxChange("condicionesInfraestructura", "espacioFisicoSuficiente", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Iluminación Suficiente y adecuada:</Label>
            <YesNoOptions
              id="iluminacionSuficiente"
              value={formData.condicionesInfraestructura.iluminacionSuficiente}
              onChange={(value) =>
                handleCheckboxChange("condicionesInfraestructura", "iluminacionSuficiente", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Superficie Nivelada:</Label>
            <YesNoOptions
              id="superficieNivelada"
              value={formData.condicionesInfraestructura.superficieNivelada}
              onChange={(value) =>
                handleCheckboxChange("condicionesInfraestructura", "superficieNivelada", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Señalizaciones de Seguridad:</Label>
            <YesNoOptions
              id="señalizacionesSeguridad"
              value={formData.condicionesInfraestructura.señalizacionesSeguridad}
              onChange={(value) =>
                handleCheckboxChange("condicionesInfraestructura", "señalizacionesSeguridad", value)
              }
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">6. PRUEBAS Y VERIFICACIÓN DE FUNCIONAMIENTO</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <Label>Pruebas de encendido y funcionamiento inicial:</Label>
            <YesNoOptions
              id="pruebasEncendido"
              value={formData.pruebasVerificacion.pruebasEncendido}
              onChange={(value) =>
                handleCheckboxChange("pruebasVerificacion", "pruebasEncendido", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Calibración y ajustes iniciales:</Label>
            <YesNoOptions
              id="calibracionAjustes"
              value={formData.pruebasVerificacion.calibracionAjustes}
              onChange={(value) =>
                handleCheckboxChange("pruebasVerificacion", "calibracionAjustes", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Verificación de Alarmas y Alertas:</Label>
            <YesNoOptions
              id="verificacionAlarmas"
              value={formData.pruebasVerificacion.verificacionAlarmas}
              onChange={(value) =>
                handleCheckboxChange("pruebasVerificacion", "verificacionAlarmas", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Integración con otros sistemas:</Label>
            <YesNoOptions
              id="integracionSistemas"
              value={formData.pruebasVerificacion.integracionSistemas}
              onChange={(value) =>
                handleCheckboxChange("pruebasVerificacion", "integracionSistemas", value)
              }
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">7. ENTREGA Y CAPACITACIÓN</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <Label>Manual de Usuario entregado:</Label>
            <YesNoOptions
              id="manualUsuarioEntregado"
              value={formData.entregaCapacitacion?.manualUsuarioEntregado || false}
              onChange={(value) =>
                handleCheckboxChange("entregaCapacitacion", "manualUsuarioEntregado", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Entrega al Responsable del servicio:</Label>
            <YesNoOptions
              id="entregaResponsable"
              value={formData.entregaCapacitacion?.entregaResponsable || false}
              onChange={(value) =>
                handleCheckboxChange("entregaCapacitacion", "entregaResponsable", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Capacitación al personal realizada:</Label>
            <YesNoOptions
              id="capacitacionRealizada"
              value={formData.entregaCapacitacion?.capacitacionRealizada || false}
              onChange={(value) =>
                handleCheckboxChange("entregaCapacitacion", "capacitacionRealizada", value)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Equipo funcional y completo:</Label>
            <YesNoOptions
              id="equipoFuncional"
              value={formData.entregaCapacitacion?.equipoFuncional || false}
              onChange={(value) =>
                handleCheckboxChange("entregaCapacitacion", "equipoFuncional", value)
              }
            />
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
          <Label htmlFor="firmaOperador" className="flex items-center">
            Firma del Operador: <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="firmaOperador"
            name="firmaOperador"
            className="mt-1"
            value={formData.firmaOperador}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-1/2 pl-2">
          <Label htmlFor="firmaEncargado" className="flex items-center">
            Firma del Encargado del Equipo: <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="firmaEncargado"
            name="firmaEncargado"
            className="mt-1"
            value={formData.firmaEncargado}
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
          Enviar e Imprimir Formulario de Instalación
        </Button>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Los campos marcados con <span className="text-red-500">*</span> son
        obligatorios
      </div>
    </div>
  );
} 