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

export default function FormularioMantenimientoMesaQuirurgica({
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
    tipo: "Mesa Qx",
    sucursal: "",
    regional: region,
    lugar: ubicacion,
    fecha: "",
    inspeccionVisual: {
      dañosFisicos: false,
      accesoriosDanados: false,
      etiquetaRemovida: false,
      conductoresExpuestos: false,
      puertosConectoresDanados: false,
      limpiezaDeficiente: false,
      acumulacionPolvo: false,
      piezasOxidadas: false,
      aceiteDerramado: false,
    },
    inspeccionElectrica: {
      equipoCuentaBaterias: false,
      voltajeLinea: "",
      voltajeBaterias: "",
      cantidadBaterias: "",
      conexionVideoFuncional: false,
      conexionMonitorFuncional: false,
      fusiblesBuenEstado: false,
      tipoFusibles: "",
      cablePoderBuenEstado: false,
      continuidadCablePoder: false,
      interfazEnchufesCorrecto: false,
    },
    inspeccionFuncional: {
      encendidoInicializacion: false,
      funcionamientoSatelites: false,
      funcionamientoMovimientos: false,
      graduacionIluminacion: false,
      tipoFuenteAlimentacion: "",
      accesoriosCompletos: false,
      cantidadAccesorios: "",
      sujecionFirme: false,
      articulacionesFuncionales: false,
      dvrBuenEstado: false,
      controlCableadoBuenEstado: false,
      controlEmpotradoBuenEstado: false,
      ledsQuemados: false,
    },
    inspeccionAccesorios: {
      cantidadAccesorios: "",
    },
    limpieza: {
      memoriaLimpieza: false,
      contactoresElectricos: false,
      panelesControlTeclado: false,
      desenpolvarChasis: false,
      desenpolvamientoInterno: false,
      revisionModulosTarjetas: false,
      revisionRuedasFrenos: false,
    },
    conexionTransmision: {
      conexionCableada: false,
      funcionamientoHDMI: false,
      detallesConexion: "",
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      tipo: "Preventivo",
      equipo: formData.codigoActivo,
      costo: 0,
      estado: "Programado",
      typeForm: "Protocolo de Mantenimiento Mesa QX y Lamp Cialitica",
      regional: region,
      ubicacion: ubicacion,
    };
    onSubmit(submittedData);
    handlePrint();
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Formulario de Mantenimiento</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1, h2 { text-align: center; }
              .section { margin-bottom: 20px; }
              .section-title { font-weight: bold; margin-bottom: 10px; }
              .item { display: flex; justify-content: space-between; }
              .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
              .signature-line { text-align: center; }
            </style>
          </head>
          <body>
            <img src="${logoCies}" alt="Logo CIES" style="width: 100px; display: block; margin: 0 auto;" />
            <h1>COMPROBANTE DE MANTENIMIENTO PREVENTIVO PLANIFICADO</h1>
            <h2>MESA QUIRÚRGICA / LÁMPARA CIALÍTICA</h2>
            <div class="section">
              <div class="section-title">DATOS DEL EQUIPO</div>
              <div class="item"><span>Código de Activo:</span><span>${
                formData.codigoActivo
              }</span></div>
              <div class="item"><span>Marca:</span><span>${
                formData.marca
              }</span></div>
              <div class="item"><span>Modelo:</span><span>${
                formData.modelo
              }</span></div>
              <div class="item"><span>N/S:</span><span>${
                formData.ns
              }</span></div>
              <div class="item"><span>Garantía:</span><span>${
                formData.garantia ? "Sí" : "No"
              }</span></div>
              <div class="item"><span>Tipo:</span><span>${
                formData.tipo
              }</span></div>
              <div class="item"><span>Sucursal:</span><span>${
                formData.sucursal
              }</span></div>
              <div class="item"><span>Regional:</span><span>${
                formData.regional
              }</span></div>
              <div class="item"><span>Ubicación:</span><span>${
                formData.lugar
              }</span></div>
            </div>
            <div class="section">
              <div class="section-title">1. INSPECCIÓN VISUAL</div>
              ${Object.entries(formData.inspeccionVisual)
                .map(
                  ([key, value]) => `
                <div class="item">
                  <span>${key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}:</span>
                  <span>${value ? "Sí" : "No"}</span>
                </div>
              `
                )
                .join("")}
            </div>
            <div class="section">
              <div class="section-title">2. INSPECCIÓN ELÉCTRICA</div>
              ${Object.entries(formData.inspeccionElectrica)
                .map(
                  ([key, value]) => `
                <div class="item">
                  <span>${key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}:</span>
                  <span>${value ? "Sí" : "No"}</span>
                </div>
              `
                )
                .join("")}
            </div>
            <div class="section">
              <div class="section-title">3. INSPECCIÓN FUNCIONAL</div>
              ${Object.entries(formData.inspeccionFuncional)
                .map(
                  ([key, value]) => `
                <div class="item">
                  <span>${key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}:</span>
                  <span>${value ? "Sí" : "No"}</span>
                </div>
              `
                )
                .join("")}
            </div>
            <div class="section">
              <div class="section-title">4. INSPECCIÓN ACCESORIOS</div>
              <div class="item"><span>Cantidad de Accesorios:</span><span>${
                formData.inspeccionAccesorios.cantidadAccesorios
              }</span></div>
            </div>
            <div class="section">
              <div class="section-title">5. LIMPIEZA</div>
              ${Object.entries(formData.limpieza)
                .map(
                  ([key, value]) => `
                <div class="item">
                  <span>${key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}:</span>
                  <span>${value ? "Sí" : "No"}</span>
                </div>
              `
                )
                .join("")}
            </div>
            <div class="section">
              <div class="section-title">6. CONEXIÓN PARA TRANSMISIÓN EXTERNA</div>
              ${Object.entries(formData.conexionTransmision)
                .map(
                  ([key, value]) => `
                <div class="item">
                  <span>${key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}:</span>
                  <span>${value ? "Sí" : "No"}</span>
                </div>
              `
                )
                .join("")}
            </div>
            <div class="section">
              <div class="section-title">OBSERVACIONES</div>
              <p>${formData.observaciones}</p>
            </div>
            <div class="signatures">
              <div class="signature-line">
                <p>${formData.firmaMantenimiento}</p>
                <p>Firma y Sello Mantenimiento</p>
              </div>
              <div class="signature-line">
                <p>${formData.firmaOperador}</p>
                <p>Firma y Sello Operador o encargado</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <Image src={logoCies} alt="Logo CIES" width={100} height={50} />
        <div className="text-center flex-grow">
          <h1 className="text-2xl font-bold">
            COMPROBANTE DE MANTENIMIENTO PREVENTIVO PLANIFICADO
          </h1>
          <h2 className="text-xl font-semibold">
            MESA QUIRÚRGICA / LÁMPARA CIALÍTICA
          </h2>
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
            <Label htmlFor="codigoActivo" className="flex items-center">
              Código de Activo: <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="codigoActivo"
              name="codigoActivo"
              value={formData.codigoActivo}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="marca" className="flex items-center">
              Marca: <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input id="marca" name="marca" value={formData.marca} readOnly />
          </div>
          <div>
            <Label htmlFor="modelo" className="flex items-center">
              Modelo: <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input id="modelo" name="modelo" value={formData.modelo} readOnly />
          </div>
          <div>
            <Label htmlFor="ns" className="flex items-center">
              N/S: <span className="text-red-500 ml-1">*</span>
            </Label>
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
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="Mesa Qx">Mesa Qx</option>
              <option value="L.Cialitica">L.Cialitica</option>
            </select>
          </div>
          <div>
            <Label htmlFor="sucursal" className="flex items-center">
              Sucursal: <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="sucursal"
              name="sucursal"
              value={formData.sucursal}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="regional" className="flex items-center">
              Regional: <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input id="regional" name="regional" value={region} readOnly />
          </div>
          <div>
            <Label htmlFor="ubicacion" className="flex items-center">
              Ubicación: <span className="text-red-500 ml-1">*</span>
            </Label>
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
        <div>
          <Label htmlFor="cantidadAccesorios">Cantidad de Accesorios:</Label>
          <Input
            id="cantidadAccesorios"
            name="inspeccionAccesorios.cantidadAccesorios"
            value={formData.inspeccionAccesorios.cantidadAccesorios}
            onChange={handleInputChange}
            className="w-40"
          />
        </div>
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
        <h2 className="text-lg font-semibold mb-2">
          6. CONEXIÓN PARA TRANSMISIÓN EXTERNA
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData.conexionTransmision).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <Label htmlFor={`conexionTransmision-${key}`}>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </Label>
              {typeof value === "boolean" ? (
                <YesNoOptions
                  id={`conexionTransmision-${key}`}
                  value={value}
                  onChange={(newValue) =>
                    handleCheckboxChange("conexionTransmision", key, newValue)
                  }
                />
              ) : (
                <Input
                  id={`conexionTransmision-${key}`}
                  name={`conexionTransmision.${key}`}
                  value={value}
                  onChange={handleInputChange}
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
