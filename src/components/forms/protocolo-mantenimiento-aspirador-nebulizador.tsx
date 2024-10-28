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
        className="radio-input"
        defaultChecked={defaultValue === "si"}
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
        value="no"
        className="radio-input"
        defaultChecked={defaultValue === "no"}
      />
      <label htmlFor={`${id}-no`} className="radio-label">
        No
      </label>
    </div>
  </div>
);

const inspectionItems = {
  visual: [
    "El equipo presenta daños físicos notables.",
    "El contenedor presenta daños físicos notables.",
    "Paneles de control presenta daños físicos.",
    "Hay conductores expuestos.",
    "Los puertos y conectores presentan daños.",
    "Limpieza deficiente.",
    "Filtro Hidrófobo en buen estado.",
    "Mano/Vacuometro en buen estado",
    "Pedal en buen estado",
    "Empaques/Orings en buen estado",
  ],
  electrical: [
    "Interfaz de enchufe correcto.",
    "Botones de control en buen estado.",
    "Cable de Poder en buen estado.",
    "Fusibles en buen estado.",
    "Tipos de Fusibles",
  ],
  functional: [
    "Encendido e inicialización correcto.",
    "Generación de las presion adecuada.",
    "Nivel de Ruido por vibración adecuado.",
    "Cambio de puerto correcto.",
    "Regulador en buen estado.",
    "Funcionamiento a pedal correcto.",
  ],
  replacement: [
    "Limpieza y desinfeccion interna",
    "Limpieza de contactores electricos.",
    "Limpieza de Paneles de Control y Teclado.",
    "Desenpolvamiento interno.",
    "Revisión de módulos y tarjetas.",
    "Reemplazo de filtros hidrofobos.",
  ],
};

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
  const [tipoEquipo, setTipoEquipo] = useState("Aspiradora");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [location, setLocation] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [codigoActivo, setCodigoActivo] = useState("");
  const [fecha, setFecha] = useState("");
  const [garantia, setGarantia] = useState("no");
  const [sucursal, setSucursal] = useState("");
  const [visualInspection, setVisualInspection] = useState([]);
  const [electricalInspection, setElectricalInspection] = useState([]);
  const [functionalInspection, setFunctionalInspection] = useState([]);
  const [replacementInspection, setReplacementInspection] = useState([]);
  const [observaciones, setObservaciones] = useState("");
  const [firmaOperador, setFirmaOperador] = useState("");
  const [firmaEncargado, setFirmaEncargado] = useState("");

  // Nuevo estado para controlar la validación del formulario
  const [isFormValid, setIsFormValid] = useState(true);

  // Función para validar el formulario
  const validateForm = () => {
    const isValid =
      (location !== "" ? location : ubicacion) !== "" &&
      fecha !== "" &&
      codigoActivo !== "" &&
      marca !== "" &&
      modelo !== "" &&
      numeroSerie !== "" &&
      sucursal !== "" &&
      region !== "" &&
      firmaOperador !== "" &&
      firmaEncargado !== "";

    setIsFormValid(isValid);
    return isValid;
  };

  useEffect(() => {
    validateForm();
    console.log("isFormValid: ", isFormValid);
  }, [
    location,
    fecha,
    codigoActivo,
    marca,
    modelo,
    numeroSerie,
    sucursal,
    region,
    firmaOperador,
    firmaEncargado,
  ]);

  useEffect(() => {
    if (isEditMode) {
      const details = JSON.parse(initialData.details);
      const foundEquipment = findEquipmentByCode(equipment, details.equipo);

      setCodigoActivo(details.equipo || "");
      setMarca(foundEquipment?.nombreaf || "");
      setModelo(foundEquipment?.descaf || "");
      setNumeroSerie(foundEquipment?.aux1 || "");
      setTipoEquipo(details.tipoEquipo || "Aspiradora");
      setLocation(details.ubicacion || "");
      setFecha(details.fecha || "");
      setGarantia(details.garantia || "no");
      setSucursal(details.sucursal || "");
      setVisualInspection(details.visualInspection || []);
      setElectricalInspection(details.electricalInspection || []);
      setFunctionalInspection(details.functionalInspection || []);
      setReplacementInspection(details.replacementInspection || []);
      setObservaciones(details.observaciones || "");
      setFirmaOperador(details.firmaOperador || "");
      setFirmaEncargado(details.firmaEncargado || "");
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Mostrar mensaje de error o feedback al usuario
      alert(
        "Por favor, complete todos los campos requeridos antes de enviar el formulario."
      );
      return;
    }

    const getInspectionData = (items: string[]) => {
      return items.map((item) => {
        const input = document.querySelector(
          `input[name="${item}"]:checked`
        ) as HTMLInputElement;
        return {
          label: item,
          value: input ? input.value === "si" : false,
        };
      });
    };

    const formData = {
      ubicacion,
      fecha,
      garantia,
      tipo: "Preventivo",
      sucursal,
      regional: region,
      equipo: codigoActivo,
      costo: 0,
      estado: "Programado",
      typeForm: "Protocolo de Mantenimiento Aspirador Nebulizador",
      visualInspection: getInspectionData(inspectionItems.visual),
      electricalInspection: getInspectionData(inspectionItems.electrical),
      functionalInspection: getInspectionData(inspectionItems.functional),
      replacementInspection: getInspectionData(inspectionItems.replacement),
      observaciones,
      firmaOperador,
      firmaEncargado,
    };
    await onSubmit(formData);
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
            <title>Protocolo de Mantenimiento - ${tipoEquipo}</title>
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
                <h2>${tipoEquipo.toUpperCase()}</h2>
                <p>Vigencia desde: ${fechaVigencia}</p>
              </div>
              <div class="date-info">
                <p>Lugar: ${location}</p>
                <p>Fecha: ${fecha}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-title">DATOS DEL EQUIPO</div>
              <div class="grid">
                <div class="item">
                  <span>Código de Activo:</span>
                  <span>${codigoActivo}</span>
                </div>
                <div class="item">
                  <span>Marca:</span>
                  <span>${marca}</span>
                </div>
                <div class="item">
                  <span>Modelo:</span>
                  <span>${modelo}</span>
                </div>
                <div class="item">
                  <span>N/S:</span>
                  <span>${numeroSerie}</span>
                </div>
                <div class="item">
                  <span>Garantía:</span>
                  <span>${garantia === "si" ? "Sí" : "No"}</span>
                </div>
                <div class="item">
                  <span>Tipo:</span>
                  <span>${tipoEquipo}</span>
                </div>
                <div class="item">
                  <span>Sucursal:</span>
                  <span>${sucursal}</span>
                </div>
                <div class="item">
                  <span>Regional:</span>
                  <span>${region}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">1. INSPECCIÓN VISUAL</div>
              <div class="grid">
                ${inspectionItems.visual
                  .map(
                    (item) => `
                  <div class="item">
                    <span>${item}</span>
                    <span>${
                      (
                        document.querySelector(
                          `input[name="${item}"]:checked`
                        ) as HTMLInputElement
                      )?.value === "si"
                        ? "Sí"
                        : "No"
                    }</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div class="section">
              <div class="section-title">2. INSPECCIÓN ELÉCTRICA</div>
              <div class="grid">
                ${inspectionItems.electrical
                  .map(
                    (item) => `
                  <div class="item">
                    <span>${item}</span>
                    <span>${
                      (
                        document.querySelector(
                          `input[name="${item}"]:checked`
                        ) as HTMLInputElement
                      )?.value === "si"
                        ? "Sí"
                        : "No"
                    }</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div class="section">
              <div class="section-title">3. INSPECCIÓN FUNCIONAL</div>
              <div class="grid">
                ${inspectionItems.functional
                  .map(
                    (item) => `
                  <div class="item">
                    <span>${item}</span>
                    <span>${
                      (
                        document.querySelector(
                          `input[name="${item}"]:checked`
                        ) as HTMLInputElement
                      )?.value === "si"
                        ? "Sí"
                        : "No"
                    }</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div class="section">
              <div class="section-title">4. REEMPLAZO DE EMPAQUES, MEMBRANAS Y COJINETE</div>
              <div class="grid">
                ${inspectionItems.replacement
                  .map(
                    (item) => `
                  <div class="item">
                    <span>${item}</span>
                    <span>${
                      (
                        document.querySelector(
                          `input[name="${item}"]:checked`
                        ) as HTMLInputElement
                      )?.value === "si"
                        ? "Sí"
                        : "No"
                    }</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div class="section">
              <div class="section-title">OBSERVACIONES</div>
              <p>${observaciones}</p>
            </div>

            <div class="signatures">
              <div class="signature-line">
                <p>${firmaOperador}</p>
                <p>Firma del Operador</p>
              </div>
              <div class="signature-line">
                <p>${firmaEncargado}</p>
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
          <div className="flex justify-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="aspiradora"
                name="tipoEquipo"
                value="Aspiradora"
                checked={tipoEquipo === "Aspiradora"}
                onChange={() => setTipoEquipo("Aspiradora")}
              />
              <label htmlFor="aspiradora">Aspiradora</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="nebulizador"
                name="tipoEquipo"
                value="Nebulizador"
                checked={tipoEquipo === "Nebulizador"}
                onChange={() => setTipoEquipo("Nebulizador")}
              />
              <label htmlFor="nebulizador">Nebulizador</label>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <Label htmlFor="ubicacion" className="flex items-center">
              Ubicación: <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="ubicacion"
              className="w-40"
              value={location !== "" ? location : ubicacion}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="fecha" className="flex items-center">
              Fecha: <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="fecha"
              type="date"
              className="w-40"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
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
              value={codigoActivo}
              onChange={(e) => setCodigoActivo(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="marca">Marca:</Label>
            <Input id="marca" value={marca} readOnly />
          </div>
          <div>
            <Label htmlFor="modelo">Modelo:</Label>
            <Input id="modelo" value={modelo} readOnly />
          </div>
          <div>
            <Label htmlFor="numeroSerie">N/S:</Label>
            <Input id="numeroSerie" value={numeroSerie} readOnly />
          </div>
          <div>
            <Label>Garantía:</Label>
            <YesNoOptions id="garantia" defaultValue={garantia} />
          </div>
          <div>
            <Label>Tipo:</Label>
            <div className="text-sm">{tipoEquipo}</div>
          </div>
          <div>
            <Label htmlFor="sucursal">Sucursal:</Label>
            <Input
              id="sucursal"
              value={sucursal}
              onChange={(e) => setSucursal(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="regional">Regional:</Label>
            <Input id="regional" value={region} readOnly />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">1. Inspección Visual</h2>
        <div className="space-y-2">
          {inspectionItems.visual.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`visual-${index}`}>{item}</Label>
              <YesNoOptions
                id={item}
                defaultValue={
                  visualInspection[index]
                    ? (visualInspection[index] as any).value
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
        <h2 className="text-lg font-semibold mb-2">2. Inspección Eléctrica</h2>
        <div className="space-y-2">
          {inspectionItems.electrical.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`electrical-${index}`}>{item}</Label>
              <YesNoOptions
                id={item}
                defaultValue={
                  electricalInspection[index]
                    ? (electricalInspection[index] as any).value
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
        <h2 className="text-lg font-semibold mb-2">3. Inspección Funcional</h2>
        <div className="space-y-2">
          {inspectionItems.functional.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`functional-${index}`}>{item}</Label>
              <YesNoOptions
                id={item}
                defaultValue={
                  functionalInspection[index]
                    ? (functionalInspection[index] as any).value
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
        <h2 className="text-lg font-semibold mb-2">
          4. Remplazo de Empaques, Membranas y Cojinete (Solo si fuese
          necesario)
        </h2>
        <div className="space-y-2">
          {inspectionItems.replacement.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`replacement-${index}`}>{item}</Label>
              <YesNoOptions
                id={item}
                defaultValue={
                  replacementInspection[index]
                    ? (replacementInspection[index] as any).value
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
        <h2 className="text-lg font-semibold mb-2">Observaciones</h2>
        <Textarea
          placeholder="Ingrese cualquier observación adicional aquí (opcional)"
          className="w-full h-24"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </section>

      <section className="flex justify-between">
        <div className="w-1/2 pr-2">
          <Label htmlFor="firmaOperador" className="flex items-center">
            Firma del Operador: <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="firmaOperador"
            className="mt-1"
            value={firmaOperador}
            onChange={(e) => setFirmaOperador(e.target.value)}
            required
          />
        </div>
        <div className="w-1/2 pl-2">
          <Label htmlFor="firmaEncargado" className="flex items-center">
            Firma del Encargado del Equipo:{" "}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="firmaEncargado"
            className="mt-1"
            value={firmaEncargado}
            onChange={(e) => setFirmaEncargado(e.target.value)}
            required
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

      {/* Mensaje opcional para mostrar campos requeridos */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Los campos marcados con <span className="text-red-500">*</span> son
        obligatorios
      </div>
    </div>
  );
}
