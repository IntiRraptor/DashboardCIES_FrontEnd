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

export default function FormularioMantenimientoLaparoscopia({
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
    lugar: ubicacion,
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
      typeForm: "Protocolo Mantenimiento Torre Laparoscopia",
      regional: region,
      ubicacion: ubicacion,
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
            <title>Protocolo de Mantenimiento - Torre Laparoscopia</title>
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
              }
              .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 40px;
              }
              .signature-line {
                text-align: center;
                border-top: 1px solid #000;
                width: 45%;
                padding-top: 5px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="${logoCies}" alt="Logo CIES" class="logo" />
              <div class="title">
                <h1>COMPROBANTE DE MANTENIMIENTO PREVENTIVO PLANIFICADO</h1>
                <h2>TORRE DE LAPAROSCOPIA</h2>
              </div>
              <div class="date-info">
                <p>Lugar: ${formData.lugar}</p>
                <p>Fecha: ${formData.fecha}</p>
                <p>Vigencia: ${fechaVigencia}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-title">DATOS DEL EQUIPO</div>
              <div class="grid">
                <div class="item"><span>Código de Activo:</span><span>${formData.codigoActivo}</span></div>
                <div class="item"><span>Marca:</span><span>${formData.marca}</span></div>
                <div class="item"><span>Modelo:</span><span>${formData.modelo}</span></div>
                <div class="item"><span>N/S:</span><span>${formData.ns}</span></div>
                <div class="item"><span>Garantía:</span><span>${formData.garantia ? "Sí" : "No"}</span></div>
                <div class="item"><span>Sucursal:</span><span>${formData.sucursal}</span></div>
                <div class="item"><span>Regional:</span><span>${formData.regional}</span></div>
                <div class="item"><span>Ubicación:</span><span>${formData.lugar}</span></div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">1. INSPECCIÓN VISUAL</div>
              <div class="grid">
                ${Object.entries(formData.inspeccionVisual)
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
                ${Object.entries(formData.inspeccionElectrica)
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
                ${Object.entries(formData.inspeccionFuncional)
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
              <div class="section-title">4. INSPECCIÓN ACCESORIOS</div>
              <div class="grid">
                ${Object.entries(formData.inspeccionAccesorios)
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
              <div class="section-title">5. LIMPIEZA</div>
              <div class="grid">
                ${Object.entries(formData.limpieza)
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
              <div class="section-title">6. CONEXIÓN AUDITORIO</div>
              <div class="grid">
                ${Object.entries(formData.conexionAuditorio)
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
        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-2">CÁMARA</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.inspeccionAccesorios.camara).map(
              ([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <Label htmlFor={`camara-${key}`}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </Label>
                  {typeof value === "boolean" ? (
                    <YesNoOptions
                      id={`camara-${key}`}
                      value={value}
                      onChange={(newValue) =>
                        handleAccesorioChange("camara", key, newValue)
                      }
                    />
                  ) : (
                    <Input
                      id={`camara-${key}`}
                      value={value}
                      onChange={(e) =>
                        handleAccesorioChange("camara", key, e.target.value)
                      }
                      className="w-40"
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-2">VIDEO PROCESADOR</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.inspeccionAccesorios.videoProcesador).map(
              ([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <Label htmlFor={`videoProcesador-${key}`}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </Label>
                  {typeof value === "boolean" ? (
                    <YesNoOptions
                      id={`videoProcesador-${key}`}
                      value={value}
                      onChange={(newValue) =>
                        handleAccesorioChange(
                          "videoProcesador",
                          key,
                          newValue
                        )
                      }
                    />
                  ) : (
                    <Input
                      id={`videoProcesador-${key}`}
                      value={value}
                      onChange={(e) =>
                        handleAccesorioChange(
                          "videoProcesador",
                          key,
                          e.target.value
                        )
                      }
                      className="w-40"
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-2">FUENTE DE LUZ</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.inspeccionAccesorios.fuenteLuz).map(
              ([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <Label htmlFor={`fuenteLuz-${key}`}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </Label>
                  {typeof value === "boolean" ? (
                    <YesNoOptions
                      id={`fuenteLuz-${key}`}
                      value={value}
                      onChange={(newValue) =>
                        handleAccesorioChange("fuenteLuz", key, newValue)
                      }
                    />
                  ) : (
                    <Input
                      id={`fuenteLuz-${key}`}
                      value={value}
                      onChange={(e) =>
                        handleAccesorioChange("fuenteLuz", key, e.target.value)
                      }
                      className="w-40"
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-2">INSUFLADOR</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.inspeccionAccesorios.insuflador).map(
              ([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <Label htmlFor={`insuflador-${key}`}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </Label>
                  {typeof value === "boolean" ? (
                    <YesNoOptions
                      id={`insuflador-${key}`}
                      value={value}
                      onChange={(newValue) =>
                        handleAccesorioChange("insuflador", key, newValue)
                      }
                    />
                  ) : (
                    <Input
                      id={`insuflador-${key}`}
                      value={value}
                      onChange={(e) =>
                        handleAccesorioChange("insuflador", key, e.target.value)
                      }
                      className="w-40"
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-2">GRABADOR</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.inspeccionAccesorios.grabador).map(
              ([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <Label htmlFor={`grabador-${key}`}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </Label>
                  {typeof value === "boolean" ? (
                    <YesNoOptions
                      id={`grabador-${key}`}
                      value={value}
                      onChange={(newValue) =>
                        handleAccesorioChange("grabador", key, newValue)
                      }
                    />
                  ) : (
                    <Input
                      id={`grabador-${key}`}
                      value={value}
                      onChange={(e) =>
                        handleAccesorioChange("grabador", key, e.target.value)
                      }
                      className="w-40"
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-2">MONITOR 1</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.inspeccionAccesorios.monitor1).map(
              ([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <Label htmlFor={`monitor1-${key}`}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </Label>
                  {typeof value === "boolean" ? (
                    <YesNoOptions
                      id={`monitor1-${key}`}
                      value={value}
                      onChange={(newValue) =>
                        handleAccesorioChange("monitor1", key, newValue)
                      }
                    />
                  ) : (
                    <Input
                      id={`monitor1-${key}`}
                      value={value}
                      onChange={(e) =>
                        handleAccesorioChange("monitor1", key, e.target.value)
                      }
                      className="w-40"
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-2">MONITOR 2</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.inspeccionAccesorios.monitor2).map(
              ([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <Label htmlFor={`monitor2-${key}`}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </Label>
                  {typeof value === "boolean" ? (
                    <YesNoOptions
                      id={`monitor2-${key}`}
                      value={value}
                      onChange={(newValue) =>
                        handleAccesorioChange("monitor2", key, newValue)
                      }
                    />
                  ) : (
                    <Input
                      id={`monitor2-${key}`}
                      value={value}
                      onChange={(e) =>
                        handleAccesorioChange("monitor2", key, e.target.value)
                      }
                      className="w-40"
                    />
                  )}
                </div>
              )
            )}
          </div>
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
