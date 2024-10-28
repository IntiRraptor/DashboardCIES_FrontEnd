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

export default function FormularioMantenimientoEcografo({
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
    swVer: "",
    sucursal: "",
    regional: region,
    lugar: "",
    fecha: "",
    inspeccionVisual: {
      dañosFisicos: false,
      dañosCarro: false,
      etiquetaRemovida: false,
      conductoresExpuestos: false,
      puertosConectoresDanados: false,
      limpiezaDeficiente: false,
      acumulacionPolvo: false,
      gelDerramado: false,
    },
    inspeccionElectrica: {
      conectadoUPS: false,
      voltajeLinea: "",
      voltajeUPSConectado: "",
      voltajeUPSDesconectado: "",
      voltajeNT: "",
      voltajeFT: "",
      marcaUPS: "",
      fusiblesBuenEstado: false,
      resistenciaFusibles: "",
      cablePoder: false,
      continuidadCablePoder: false,
      interfazEnchufe: false,
      iluminacionLED: false,
    },
    inspeccionFuncional: {
      encendidoInicializacion: false,
      reconocimientoTransductores: false,
      coloresPantalla: false,
      almacenamientoPacientes: false,
      estadoAlmacenamiento: "",
      movimientoTrackball: false,
      touchPanelSensibilidad: false,
      touchPanelProtegido: false,
      tecladoFuncional: false,
      versionSO: "",
      claveSoftware: "",
      funcionModoB: false,
      funcionModoC: false,
      funcionModoPD: false,
      funcionModoPW: false,
      funcionModoCW: false,
      funcionModo3D: false,
      funcionModo4D: false,
      medicionesCorrectas: false,
      bodyMarksCorrectos: false,
      insercionTexto: false,
      sonidoAudible: false,
    },
    inspeccionAccesorios: {
      cantidadTransductores: "1",
      cantidadImpresoras: "1",
      cantidadPuertos: "",
      transductores: [
        {
          modelo: "",
          ns: "",
          ca: "",
          pruebasCeldas: false,
          conectorSinDaños: false,
          interfazGoma: false,
          limpiezaAdecuada: false,
          cableConexion: false,
        },
      ],
      impresoras: [
        {
          codigo: "",
          modelo: "",
          ns: "",
          impresionOptima: false,
          nivelBrillo: "",
          nivelContraste: "",
          tipoPapel: "",
          conexion: "",
          feedActivado: false,
        },
      ],
    },
    limpieza: {
      memoriaLimpieza: false,
      contactoresElectricos: false,
      panelesControlTeclado: false,
      transductoresPorta: false,
      trackBall: false,
      desenpolvarChasis: false,
      desenpolvamientoInterno: false,
      revisionModulosTarjetas: false,
      revisionInterfaces: false,
      revisionRuedasFrenos: false,
      revisionSoportesTransductor: false,
    },
    conexionDicom: {
      conexionCableada: false,
      funcionamientoWorklist: false,
      funcionamientoAlmacenamiento: false,
      funcionamientoImpresion: false,
      detallesConexion: "",
      ipEquipo: "",
      ipAlmacenamiento: "",
      ipWorklist: "",
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
        inspeccionAccesorios: {
          ...details.inspeccionAccesorios,
          cantidadTransductores:
            details.inspeccionAccesorios.cantidadTransductores || "1",
          cantidadImpresoras:
            details.inspeccionAccesorios.cantidadImpresoras || "1",
          transductores: details.inspeccionAccesorios.transductores || [
            {
              modelo: "",
              ns: "",
              ca: "",
              pruebasCeldas: false,
              conectorSinDaños: false,
              interfazGoma: false,
              limpiezaAdecuada: false,
              cableConexion: false,
            },
          ],
          impresoras: details.inspeccionAccesorios.impresoras || [
            {
              codigo: "",
              modelo: "",
              ns: "",
              impresionOptima: false,
              nivelBrillo: "",
              nivelContraste: "",
              tipoPapel: "",
              conexion: "",
              feedActivado: false,
            },
          ],
        },
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "inspeccionAccesorios.cantidadTransductores") {
      const numTransductores = Math.max(1, Math.min(9, parseInt(value) || 1));
      const newTransductores = [...formData.inspeccionAccesorios.transductores];
      while (newTransductores.length < numTransductores) {
        newTransductores.push({
          modelo: "",
          ns: "",
          ca: "",
          pruebasCeldas: false,
          conectorSinDaños: false,
          interfazGoma: false,
          limpiezaAdecuada: false,
          cableConexion: false,
        });
      }
      setFormData((prevState) => ({
        ...prevState,
        inspeccionAccesorios: {
          ...prevState.inspeccionAccesorios,
          cantidadTransductores: numTransductores.toString(),
          transductores: newTransductores.slice(0, numTransductores),
        },
      }));
    } else if (name === "inspeccionAccesorios.cantidadImpresoras") {
      const numImpresoras = Math.max(1, Math.min(9, parseInt(value) || 1));
      const newImpresoras = [...formData.inspeccionAccesorios.impresoras];
      while (newImpresoras.length < numImpresoras) {
        newImpresoras.push({
          codigo: "",
          modelo: "",
          ns: "",
          impresionOptima: false,
          nivelBrillo: "",
          nivelContraste: "",
          tipoPapel: "",
          conexion: "",
          feedActivado: false,
        });
      }
      setFormData((prevState) => ({
        ...prevState,
        inspeccionAccesorios: {
          ...prevState.inspeccionAccesorios,
          cantidadImpresoras: numImpresoras.toString(),
          impresoras: newImpresoras.slice(0, numImpresoras),
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

  const handleTransductorChange = (
    index: number,
    field: string,
    value: any
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      inspeccionAccesorios: {
        ...prevState.inspeccionAccesorios,
        transductores: prevState.inspeccionAccesorios.transductores.map(
          (t, i) => (i === index ? { ...t, [field]: value } : t)
        ),
      },
    }));
  };

  const handleImpresoraChange = (index: number, field: string, value: any) => {
    setFormData((prevState) => ({
      ...prevState,
      inspeccionAccesorios: {
        ...prevState.inspeccionAccesorios,
        impresoras: prevState.inspeccionAccesorios.impresoras.map((imp, i) =>
          i === index ? { ...imp, [field]: value } : imp
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
      typeForm: "Protocolo de Mantenimiento Ecografos",
      inspeccionAccesorios: {
        ...formData.inspeccionAccesorios,
        transductores: formData.inspeccionAccesorios.transductores.slice(
          0,
          parseInt(formData.inspeccionAccesorios.cantidadTransductores)
        ),
        impresoras: formData.inspeccionAccesorios.impresoras.slice(
          0,
          parseInt(formData.inspeccionAccesorios.cantidadImpresoras)
        ),
      },
    };
    onSubmit(submittedData);
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
            <title>Protocolo de Mantenimiento - Ecógrafo</title>
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
                <h2>ECÓGRAFO</h2>
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
            </div>

            <div class="section">
              <div class="section-title">2. INSPECCIÓN ELÉCTRICA</div>
              <div class="grid">
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
            </div>

            <div class="section">
              <div class="section-title">3. INSPECCIÓN FUNCIONAL</div>
              <div class="grid">
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
          <h2 className="text-xl font-semibold">ECÓGRAFO</h2>
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
            <Label htmlFor="swVer">SW/Ver.:</Label>
            <Input
              id="swVer"
              name="swVer"
              value={formData.swVer}
              onChange={handleInputChange}
            />
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
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="cantidadTransductores">
              Cantidad de transductores:
            </Label>
            <Input
              id="cantidadTransductores"
              name="inspeccionAccesorios.cantidadTransductores"
              type="number"
              min="1"
              max="9"
              value={formData.inspeccionAccesorios.cantidadTransductores}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="cantidadImpresoras">Cantidad de Impresoras:</Label>
            <Input
              id="cantidadImpresoras"
              name="inspeccionAccesorios.cantidadImpresoras"
              type="number"
              min="1"
              max="9"
              value={formData.inspeccionAccesorios.cantidadImpresoras}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="cantidadPuertos">Cantidad de Puertos:</Label>
            <Input
              id="cantidadPuertos"
              name="inspeccionAccesorios.cantidadPuertos"
              value={formData.inspeccionAccesorios.cantidadPuertos}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {formData.inspeccionAccesorios.transductores
          .slice(
            0,
            parseInt(formData.inspeccionAccesorios.cantidadTransductores)
          )
          .map((transductor, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <h3 className="font-semibold mb-2">TRANSDUCTOR {index + 1}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`transductor-${index}-modelo`}>Modelo:</Label>
                  <Input
                    id={`transductor-${index}-modelo`}
                    value={transductor.modelo}
                    onChange={(e) =>
                      handleTransductorChange(index, "modelo", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`transductor-${index}-ns`}>N/S:</Label>
                  <Input
                    id={`transductor-${index}-ns`}
                    value={transductor.ns}
                    onChange={(e) =>
                      handleTransductorChange(index, "ns", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`transductor-${index}-ca`}>C.A.:</Label>
                  <Input
                    id={`transductor-${index}-ca`}
                    value={transductor.ca}
                    onChange={(e) =>
                      handleTransductorChange(index, "ca", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {Object.entries(transductor).map(([key, value]) => {
                  if (typeof value === "boolean") {
                    return (
                      <div
                        key={key}
                        className="flex justify-between items-center"
                      >
                        <Label htmlFor={`transductor-${index}-${key}`}>
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                          :
                        </Label>
                        <YesNoOptions
                          id={`transductor-${index}-${key}`}
                          value={value}
                          onChange={(newValue) =>
                            handleTransductorChange(index, key, newValue)
                          }
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        {formData.inspeccionAccesorios.impresoras
          .slice(0, parseInt(formData.inspeccionAccesorios.cantidadImpresoras))
          .map((impresora, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <h3 className="font-semibold mb-2">IMPRESORA {index + 1}</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(impresora).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={`impresora-${index}-${key}`}>
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      :
                    </Label>
                    {typeof value === "boolean" ? (
                      <YesNoOptions
                        id={`impresora-${index}-${key}`}
                        value={value}
                        onChange={(newValue) =>
                          handleImpresoraChange(index, key, newValue)
                        }
                      />
                    ) : (
                      <Input
                        id={`impresora-${index}-${key}`}
                        value={value}
                        onChange={(e) =>
                          handleImpresoraChange(index, key, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
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
        <h2 className="text-lg font-semibold mb-2">6. CONEXIÓN DICOM</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData.conexionDicom).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <Label htmlFor={`conexionDicom-${key}`}>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </Label>
              {typeof value === "boolean" ? (
                <YesNoOptions
                  id={`conexionDicom-${key}`}
                  value={value}
                  onChange={(newValue) =>
                    handleCheckboxChange("conexionDicom", key, newValue)
                  }
                />
              ) : (
                <Input
                  id={`conexionDicom-${key}`}
                  name={`conexionDicom.${key}`}
                  value={value}
                  onChange={(e) =>
                    handleCheckboxChange("conexionDicom", key, e.target.checked)
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
          Enviar Formulario de Mantenimiento
        </Button>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Los campos marcados con <span className="text-red-500">*</span> son
        obligatorios
      </div>
    </div>
  );
}
