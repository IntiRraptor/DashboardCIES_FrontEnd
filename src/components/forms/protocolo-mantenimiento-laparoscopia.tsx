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
      equipoDañosFisicos: false,
      puertoConectorBuenasCondiciones: false,
      carroDañosFisicos: false,
      limpiezaDeficiente: false,
      etiquetaRemovida: false,
      acumulacionPolvo: false,
      conductoresExpuestos: false,
      conexionCO2Adecuada: false,
    },
    inspeccionElectrica: {
      equipoConectadoUPS: false,
      voltajeLinea: "",
      voltajeUPSDesconect: "",
      marcaUPS: "",
      transformadorElectrico110V: false,
      fusiblesBuenEstado: false,
      tipoFusibles: "",
      cablePoderBuenEstado: false,
      continuidadCablePoder: false,
      interfazEnchufesCorrecto: false,
    },
    inspeccionFuncional: {
      encendidoInicializacionCorrecto: false,
      reconocimientoCamaraMonitor: false,
      coloresPantallaCorrecto: false,
      almacenamientoVideosCorrecto: false,
      estadoAlmacenamiento: "",
      funcionamientoCorrectoInsuflador: false,
      funcionamientoCorrectoMonitor: false,
      funcionamientoCorrectoFuenteLuz: false,
      funcionamientoCorrectoCamara: false,
      funcionamientoCorrectoVideoProcesador: false,
      funcionamientoCorrectoGrabadora: false,
    },
    inspeccionAccesorios: {
      cantidadEquiposAccesorios: "",
      camara: {
        modelo: "",
        ns: "",
        funcionamientoCorrecto: false,
        balanceBlancosCorrecto: false,
        interfazCableBuenasCondiciones: false,
        coloresCorrectos: false,
        cableConexionSinDaños: false,
        estabilidadImagenCorrecta: false,
      },
      videoProcesador: {
        modelo: "",
        ns: "",
        videoDesplegarPantallaAdecuado: false,
        conexionGrabadorCorrecta: false,
        conexionDigitalCableadaDVI: false,
        limpiezaAdecuada: false,
        conexionDigitalInalambrica: false,
        pantallaTactilFuncional: false,
      },
      fuenteLuz: {
        modelo: "",
        ns: "",
        potenciaLuzAdecuada: false,
        fibraOpticaBuenEstado: false,
        colorLuzAdecuado: false,
        interfazInstrumentacionCorrecta: false,
        temperaturaFuncionamientoCorrecta: false,
        pantallaTactilFuncional: false,
      },
      insuflador: {
        modelo: "",
        ns: "",
        verificacionFlujoSatisfactoria: false,
        interfazCO2Correcta: false,
        verificacionPresionSatisfactoria: false,
        limpiezaAdecuada: false,
        verificacionAlarmaBajaPresion: false,
        conectoresSiliconadosAdecuados: false,
      },
      grabador: {
        modelo: "",
        ns: "",
        sistemaGestionPacientesCorrecta: false,
        pantallaTactilFuncional: false,
        memoriaBuenEstado: false,
        limpiezaAdecuada: false,
        cableConexionSinDaños: false,
      },
      monitor1: {
        ca: "",
        modelo: "",
        ns: "",
        imagenOptima: false,
        nivelBrillo: "",
        posicionAjustable: false,
        nivelContraste: "",
        conexion: "",
      },
      monitor2: {
        codigo: "",
        modelo: "",
        ns: "",
        imagenOptima: false,
        nivelBrillo: "",
        posicionAjustable: false,
        nivelContraste: "",
        conexion: "",
      },
    },
    limpieza: {
      memoriaLimpieza: false,
      contactoresElectricos: false,
      panelesControl: false,
      accesorioPortaAccesorio: false,
      desenpolvarChasis: false,
      revisionSoporteMonitor: false,
    },
    conexionAuditorio: {
      conexionCableada: false,
      funcionamientoNube: false,
      funcionamientoAudio: false,
      detallesConexion: "",
    },
    observaciones: "",
    firmaMantenimiento: "",
    firmaOperador: "",
  });

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
    accesorio: string,
    field: string,
    value: any
  ) => {
    setFormData((prevState) => ({
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
      typeForm: "Protocolo de Mantenimiento Torre Laparoscopia",
    };
    onSubmit(submittedData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <Image src={logoCies} alt="Logo CIES" width={100} height={50} />
        <div className="text-center flex-grow">
          <h1 className="text-2xl font-bold">
            COMPROBANTE DE MANTENIMIENTO PREVENTIVO PLANIFICADO
          </h1>
          <h2 className="text-xl font-semibold">TORRE DE LAPAROSCOPIA</h2>
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
                  onChange={(e) =>
                    handleCheckboxChange(
                      "inspeccionElectrica",
                      key,
                      e.target.checked
                    )
                  }
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
                  onChange={(e) =>
                    handleCheckboxChange(
                      "inspeccionFuncional",
                      key,
                      e.target.checked
                    )
                  }
                  className="w-40"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">4. INSPECCIÓN ACCESORIOS</h2>
        <div>
          <Label htmlFor="cantidadEquiposAccesorios">
            Cantidad de equipos/accesorios:
          </Label>
          <Input
            id="cantidadEquiposAccesorios"
            name="inspeccionAccesorios.cantidadEquiposAccesorios"
            value={formData.inspeccionAccesorios.cantidadEquiposAccesorios}
            onChange={(e) =>
              handleCheckboxChange(
                "inspeccionAccesorios",
                "cantidadEquiposAccesorios",
                e.target.checked
              )
            }
            className="w-40"
          />
        </div>
        {[
          "camara",
          "videoProcesador",
          "fuenteLuz",
          "insuflador",
          "grabador",
          "monitor1",
          "monitor2",
        ].map((accesorio) => (
          <div key={accesorio} className="border p-4 mb-4 rounded">
            <h3 className="font-semibold mb-2">{accesorio.toUpperCase()}</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.inspeccionAccesorios[accesorio]).map(
                ([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <Label htmlFor={`${accesorio}-${key}`}>
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      :
                    </Label>
                    {typeof value === "boolean" ? (
                      <YesNoOptions
                        id={`${accesorio}-${key}`}
                        value={value}
                        onChange={(newValue) =>
                          handleAccesorioChange(accesorio, key, newValue)
                        }
                      />
                    ) : (
                      <Input
                        id={`${accesorio}-${key}`}
                        value={
                          value as
                            | string
                            | number
                            | readonly string[]
                            | undefined
                        }
                        onChange={(e) =>
                          handleAccesorioChange(accesorio, key, e.target.value)
                        }
                        className="w-40"
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          5. LIMPIEZA (Solo si fuese necesario) (2da Columna mantenimiento
          anual)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData.limpieza).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <Label htmlFor={`limpieza-${key}`}>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </Label>
              <YesNoOptions
                id={`limpieza-${key}`}
                value={value}
                onChange={(newValue) =>
                  handleCheckboxChange("limpieza", key, newValue)
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">6. CONEXIÓN AUDITORIO</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData.conexionAuditorio).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <Label htmlFor={`conexionAuditorio-${key}`}>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </Label>
              {typeof value === "boolean" ? (
                <YesNoOptions
                  id={`conexionAuditorio-${key}`}
                  value={value}
                  onChange={(newValue) =>
                    handleCheckboxChange("conexionAuditorio", key, newValue)
                  }
                />
              ) : (
                <Input
                  id={`conexionAuditorio-${key}`}
                  name={`conexionAuditorio.${key}`}
                  value={value}
                  onChange={(e) =>
                    handleCheckboxChange(
                      "conexionAuditorio",
                      key,
                      e.target.checked
                    )
                  }
                  className="w-full"
                />
              )}
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
          <Label htmlFor="firmaMantenimiento">
            Firma y Sello Mantenimiento:
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
          <Label htmlFor="firmaOperador">
            Firma y Sello Operador o encargado:
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
        <Button type="button" onClick={handleSubmit}>
          Enviar Formulario de Mantenimiento
        </Button>
      </div>
    </div>
  );
}
