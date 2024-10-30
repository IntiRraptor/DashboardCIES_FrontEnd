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

export default function FormularioProtocoloMantenimientoAspiradorNebulizador({
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
    tipoEquipo: "Aspirador",
    sucursal: "",
    regional: region,
    lugar: ubicacion,
    fecha: "",
    visualInspection: {
      dañosFisicos: false,
      dañosContenedor: false,
      dañosPaneles: false,
      conductoresExpuestos: false,
      puertosConectoresDanados: false,
      limpiezaDeficiente: false,
      filtroHidrofobo: false,
      manoVacuometro: false,
      pedalBuenEstado: false,
      empaquesOrings: false,
    },
    electricalInspection: {
      interfazEnchufe: false,
      botonesControl: false,
      cablePoder: false,
      fusibles: false,
      tiposFusibles: false,
    },
    functionalInspection: {
      encendidoInicializacion: false,
      generacionPresion: false,
      nivelRuido: false,
      cambioPuerto: false,
      regulador: false,
      funcionamientoPedal: false,
    },
    replacementInspection: {
      limpiezaInterna: false,
      limpiezaContactores: false,
      limpiezaPaneles: false,
      desenpolvamientoInterno: false,
      revisionModulos: false,
      reemplazoFiltros: false,
    },
    observaciones: "",
    firmaOperador: "",
    firmaEncargado: "",
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

  const handleSubmit = async () => {
    if (!isFormValid) {
      alert(
        "Por favor, complete todos los campos requeridos antes de enviar el formulario."
      );
      return;
    }

    const submittedData = {
      ...formData,
      tipo: "Preventivo",
      equipo: formData.codigoActivo,
      costo: 0,
      estado: "Programado",
      typeForm: "Protocolo de Mantenimiento Aspirador Nebulizador",
      regional: region,
      ubicacion: ubicacion,
    };
    await onSubmit(submittedData);
    handlePrint();
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const fechaVigencia = format(addMonths(new Date(), 1), "dd/MM/yyyy", {
      locale: es,
    });

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Protocolo de Mantenimiento - Aspirador Nebulizador</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px;
                line-height: 1.6;
              }
              .header {
                display: flex;
                justify-content: space-between;
                align-items: start;
                margin-bottom: 20px;
              }
              .logo {
                width: 100px;
              }
              .title {
                text-align: center;
                flex-grow: 1;
                margin: 0 20px;
              }
              .date-info {
                text-align: right;
              }
              .section {
                margin-bottom: 20px;
              }
              .section-title {
                font-weight: bold;
                margin-bottom: 10px;
                background-color: #f5f5f5;
                padding: 5px;
              }
              .grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
              }
              .item {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #eee;
                padding: 5px 0;
              }
              .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 50px;
              }
              .signature-line {
                width: 200px;
                text-align: center;
                border-top: 1px solid black;
                padding-top: 5px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="${logoCies.src}" alt="Logo CIES" class="logo" />
              <div class="title">
                <h1>COMPROBANTE DE MANTENIMIENTO PREVENTIVO PLANIFICADO</h1>
                <h2>ASPIRADOR NEBULIZADOR</h2>
                <p>Vigencia desde: ${fechaVigencia}</p>
              </div>
              <div class="date-info">
                <p>Lugar: ${formData.lugar}</p>
                <p>Fecha: ${formData.fecha}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-title">DATOS DEL EQUIPO</div>
              <div class="grid">
                <div class="item">
                  <span>Código de Activo:</span>
                  <span>${formData.codigoActivo}</span>
                </div>
                <div class="item">
                  <span>Marca:</span>
                  <span>${formData.marca}</span>
                </div>
                <div class="item">
                  <span>Modelo:</span>
                  <span>${formData.modelo}</span>
                </div>
                <div class="item">
                  <span>N/S:</span>
                  <span>${formData.ns}</span>
                </div>
                <div class="item">
                  <span>Garantía:</span>
                  <span>${formData.garantia ? "Sí" : "No"}</span>
                </div>
                <div class="item">
                  <span>Tipo:</span>
                  <span>${formData.tipoEquipo}</span>
                </div>
                <div class="item">
                  <span>Sucursal:</span>
                  <span>${formData.sucursal}</span>
                </div>
                <div class="item">
                  <span>Regional:</span>
                  <span>${formData.regional}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">1. INSPECCIÓN VISUAL</div>
              <div class="grid">
                ${Object.entries(formData.visualInspection)
                  .map(
                    ([key, value]) => `
                  <div class="item">
                    <span>${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</span>
                    <span>${value ? "Sí" : "No"}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div class="section">
              <div class="section-title">2. INSPECCIÓN ELÉCTRICA</div>
              <div class="grid">
                ${Object.entries(formData.electricalInspection)
                  .map(
                    ([key, value]) => `
                  <div class="item">
                    <span>${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</span>
                    <span>${value ? "Sí" : "No"}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div class="section">
              <div class="section-title">3. INSPECCIÓN FUNCIONAL</div>
              <div class="grid">
                ${Object.entries(formData.functionalInspection)
                  .map(
                    ([key, value]) => `
                  <div class="item">
                    <span>${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</span>
                    <span>${value ? "Sí" : "No"}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div class="section">
              <div class="section-title">4. REEMPLAZO DE EMPAQUES, MEMBRANAS Y COJINETE</div>
              <div class="grid">
                ${Object.entries(formData.replacementInspection)
                  .map(
                    ([key, value]) => `
                  <div class="item">
                    <span>${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</span>
                    <span>${value ? "Sí" : "No"}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div class="section">
              <div class="section-title">OBSERVACIONES</div>
              <p>${formData.observaciones}</p>
            </div>

            <div class="signatures">
              <div class="signature-line">
                <p>${formData.firmaOperador}</p>
                <p>Firma del Operador</p>
              </div>
              <div class="signature-line">
                <p>${formData.firmaEncargado}</p>
                <p>Firma del Encargado del Equipo</p>
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
        <div>
          <Image
            src={logoCies}
            height={50}
            width={100}
            alt="Logo de la Compañía"
            className="h-12 w-auto"
          />
        </div>
        <div className="text-center flex-grow">
          <h1 className="text-2xl font-bold">
            RECIBO DE MANTENIMIENTO PREVENTIVO PLANIFICADO
          </h1>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <Label htmlFor="lugar" className="flex items-center">
              Lugar: <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="lugar"
              name="lugar"
              className="w-40"
              value={formData.lugar}
              onChange={(e) =>
                setFormData({ ...formData, lugar: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="fecha" className="flex items-center">
              Fecha: <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="fecha"
              name="fecha"
              type="date"
              className="w-40"
              value={formData.fecha}
              onChange={(e) =>
                setFormData({ ...formData, fecha: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Datos del Equipo</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="codigoActivo" className="flex items-center">
              Código de Activo: <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="codigoActivo"
              name="codigoActivo"
              value={formData.codigoActivo}
              onChange={(e) =>
                setFormData({ ...formData, codigoActivo: e.target.value })
              }
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
              onChange={(value) =>
                setFormData({ ...formData, garantia: value })
              }
            />
          </div>
          <div>
            <Label htmlFor="tipoEquipo">Tipo:</Label>
            <select
              id="tipoEquipo"
              name="tipoEquipo"
              value={formData.tipoEquipo}
              onChange={(e) =>
                setFormData({ ...formData, tipoEquipo: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="Aspirador">Aspirador</option>
              <option value="Nebulizador">Nebulizador</option>
            </select>
          </div>
          <div>
            <Label htmlFor="sucursal">Sucursal:</Label>
            <Input
              id="sucursal"
              name="sucursal"
              value={formData.sucursal}
              onChange={(e) =>
                setFormData({ ...formData, sucursal: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="regional">Regional:</Label>
            <Input
              id="regional"
              name="regional"
              value={formData.regional}
              readOnly
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">1. Inspección Visual</h2>
        <div className="space-y-2">
          {Object.entries(formData.visualInspection).map(([key, value]) => (
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
                  handleCheckboxChange("visualInspection", key, newValue)
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">2. Inspección Eléctrica</h2>
        <div className="space-y-2">
          {Object.entries(formData.electricalInspection).map(([key, value]) => (
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
                  handleCheckboxChange("electricalInspection", key, newValue)
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">3. Inspección Funcional</h2>
        <div className="space-y-2">
          {Object.entries(formData.functionalInspection).map(([key, value]) => (
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
                  handleCheckboxChange("functionalInspection", key, newValue)
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          4. Remplazo de Empaques, Membranas y Cojinete (Solo si fuese
          necesario)
        </h2>
        <div className="space-y-2">
          {Object.entries(formData.replacementInspection).map(([key, value]) => (
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
                  handleCheckboxChange("replacementInspection", key, newValue)
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Observaciones</h2>
        <Textarea
          placeholder="Ingrese cualquier observación adicional aquí (opcional)"
          className="w-full h-24"
          name="observaciones"
          value={formData.observaciones}
          onChange={(e) =>
            setFormData({ ...formData, observaciones: e.target.value })
          }
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
            onChange={(e) =>
              setFormData({ ...formData, firmaOperador: e.target.value })
            }
          />
        </div>
        <div className="w-1/2 pl-2">
          <Label htmlFor="firmaEncargado" className="flex items-center">
            Firma del Encargado del Equipo:{" "}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="firmaEncargado"
            name="firmaEncargado"
            className="mt-1"
            value={formData.firmaEncargado}
            onChange={(e) =>
              setFormData({ ...formData, firmaEncargado: e.target.value })
            }
          />
        </div>
      </section>

      <div className="mt-6 text-center space-x-4">
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
