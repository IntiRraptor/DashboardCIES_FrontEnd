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

export default function FormularioMantenimientoMonitor({
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
    monitor: "Signos V.",
    sucursal: "",
    regional: region,
    lugar: ubicacion,
    fecha: "",
    inspeccionVisual: {
      dañosEquipoFisicos: false,
      dañosCarroFisicos: false,
      etiquetaRemovida: false,
      conductoresExpuestos: false,
      puertosConectoresDanados: false,
      limpiezaDeficiente: false,
      acumulacionPolvo: false,
      pantallaBuenasCondiciones: false,
      tecladoBotonesFuncionales: false,
    },
    inspeccionElectrica: {
      equipoCuentaBateria: false,
      voltajeBateria: "",
      modeloBateria: "",
      fusiblesBuenEstado: false,
      cablePoderBuenEstado: false,
      continuidadCablePoder: false,
      interfazEnchufesCorrecto: false,
      iluminacionLEDAmbiente: false,
    },
    inspeccionFuncional: {
      encendidoInicializacion: false,
      reconocimientoAccesorios: false,
      coloresPantalla: false,
      almacenamientoPacientes: false,
      impresionCorrecta: false,
      alarmasSonido: false,
      tecladoFuncional: false,
      tamanoPapel: "",
      versionSO: "",
      claveSoftware: "",
      verificacionMediciones: "",
    },
    inspeccionAccesorios: {
      cantidadAccesorios: "1",
      cantidadPuertos: "",
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
      revisionInterfaces: false,
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

  const handleAccesorioChange = (index: number, field: string, value: any) => {
    setFormData((prevState) => ({
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
      typeForm: "Protocolo de Mantenimiento Monitores_Fetal_ECG",
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
            <h2>MONITOR MULTIPARÁMETRO / FETAL / ECG</h2>
            <div class="section">
              <div class="section-title">DATOS DEL EQUIPO</div>
              <div class="item"><span>Código de Activo:</span><span>${formData.codigoActivo}</span></div>
              <div class="item"><span>Marca:</span><span>${formData.marca}</span></div>
              <div class="item"><span>Modelo:</span><span>${formData.modelo}</span></div>
              <div class="item"><span>N/S:</span><span>${formData.ns}</span></div>
              <div class="item"><span>Garantía:</span><span>${formData.garantia ? "Sí" : "No"}</span></div>
              <div class="item"><span>Monitor:</span><span>${formData.monitor}</span></div>
              <div class="item"><span>Sucursal:</span><span>${formData.sucursal}</span></div>
              <div class="item"><span>Regional:</span><span>${formData.regional}</span></div>
              <div class="item"><span>Ubicación:</span><span>${formData.lugar}</span></div>
              <div class="item"><span>Fecha:</span><span>${formData.fecha}</span></div>
            </div>
            <div class="section">
              <div class="section-title">INSPECCIÓN VISUAL</div>
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
            <div class="section">
              <div class="section-title">INSPECCIÓN ELÉCTRICA</div>
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
            <div class="section">
              <div class="section-title">INSPECCIÓN FUNCIONAL</div>
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
            <div class="section">
              <div class="section-title">INSPECCIÓN ACCESORIOS</div>
              ${formData.inspeccionAccesorios.accesorios
                .map(
                  (accesorio, index) => `
                <div class="item">
                  <span>Accesorio ${index + 1}:</span>
                  <span>${accesorio.modelo} - ${accesorio.ns}</span>
                </div>
                ${Object.entries(accesorio)
                  .map(
                    ([key, value]) => `
                  <div class="item">
                    <span>${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</span>
                    <span>${value ? "Sí" : "No"}</span>
                  </div>
                `
                  )
                  .join("")}
              `
                )
                .join("")}
            </div>
            <div class="section">
              <div class="section-title">LIMPIEZA</div>
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
            MONITOR MULTIPARÁMETRO / FETAL / ECG
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
              onChange={(value) =>
                handleCheckboxChange("garantia", "", value)
              }
            />
          </div>
          <div>
            <Label htmlFor="monitor">Monitor:</Label>
            <select
              id="monitor"
              name="monitor"
              value={formData.monitor}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="Signos V.">Signos V.</option>
              <option value="Fetal">Fetal</option>
              <option value="ECG">ECG</option>
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
        {formData.inspeccionAccesorios.accesorios
          .slice(0, parseInt(formData.inspeccionAccesorios.cantidadAccesorios))
          .map((accesorio, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <h3 className="font-semibold mb-2">ACCESORIO {index + 1}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`accesorio-${index}-modelo`}>Modelo:</Label>
                  <Input
                    id={`accesorio-${index}-modelo`}
                    value={accesorio.modelo}
                    onChange={(e) =>
                      handleAccesorioChange(index, "modelo", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`accesorio-${index}-ns`}>N/S:</Label>
                  <Input
                    id={`accesorio-${index}-ns`}
                    value={accesorio.ns}
                    onChange={(e) =>
                      handleAccesorioChange(index, "ns", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {Object.entries(accesorio).map(([key, value]) => {
                  if (typeof value === "boolean") {
                    return (
                      <div
                        key={key}
                        className="flex justify-between items-center"
                      >
                        <Label htmlFor={`accesorio-${index}-${key}`}>
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                          :
                        </Label>
                        <YesNoOptions
                          id={`accesorio-${index}-${key}`}
                          value={value}
                          onChange={(newValue) =>
                            handleAccesorioChange(index, key, newValue)
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
