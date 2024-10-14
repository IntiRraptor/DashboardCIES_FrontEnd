"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { findEquipmentByCode } from "@/utils/equipmentUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from 'next/image';

// Componente reutilizable para opciones de "Sí" y "No"
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
        defaultChecked={defaultValue === "si"}
      />
      <label htmlFor={`${id}-si`}>Sí</label>
    </div>
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={`${id}-no`}
        name={id}
        value="no"
        defaultChecked={defaultValue === "no"}
      />
      <label htmlFor={`${id}-no`}>No</label>
    </div>
  </div>
);

export default function FormularioMantenimientoIncubadora({
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
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [codigoActivo, setCodigoActivo] = useState("");
  const [cantidadAccesorios, setCantidadAccesorios] = useState(1);
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const [garantia, setGarantia] = useState("no");
  const [tipo, setTipo] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [regional, setRegional] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [accessoryInspections, setAccessoryInspections] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      const details = JSON.parse(initialData.details);
      const foundEquipment = findEquipmentByCode(equipment, details.equipo);
      setCodigoActivo(details.equipo || "");
      setMarca(foundEquipment?.nombreaf || "");
      setModelo(foundEquipment?.descaf || "");
      setNumeroSerie(foundEquipment?.aux1 || "");
      setLugar(details.lugar || "");
      setFecha(details.fecha || "");
      setGarantia(details.garantia || "no");
      setTipo(details.tipo || "");
      setSucursal(details.sucursal || "");
      setRegional(details.regional || "");
      setObservaciones(details.observaciones || "");
      setCantidadAccesorios(details.accessoryInspections?.length || 1);
      setAccessoryInspections(details.accessoryInspections || []);
    }
  }, [initialData, isEditMode, equipment]);

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

  const handleSubmit = () => {
    const getInspectionData = (prefix: string, items: string[]) => {
      return items.map((item, index) => {
        const input = document.querySelector(
          `input[name="${prefix}-${index}"]:checked`
        ) as HTMLInputElement;
        return {
          label: item,
          value: input ? input.value === "si" : false,
        };
      });
    };

    const accessoryInspections = Array.from(
      { length: cantidadAccesorios },
      (_, index) => {
        const accessoryNumber = index + 1;
        return {
          modelo: (document.getElementById(`modeloAccesorio${accessoryNumber}`) as HTMLInputElement)?.value || "",
          numeroSerie: (document.getElementById(`nsAccesorio${accessoryNumber}`) as HTMLInputElement)?.value || "",
          inspections: getInspectionData(`accesorio${accessoryNumber}`, [
            "Prueba de funcionamiento satisfactoria.",
            "Interfaz sin daños.",
            "Cable de conexión sin daños.",
            "Conector sin daños.",
            "Limpieza adecuada.",
            "Sensor sin daños.",
          ]),
        };
      }
    );

    const formData = {
      lugar,
      fecha,
      garantia,
      tipo,
      sucursal,
      regional,
      observaciones,
      tipoMantenimiento: "Preventivo",
      equipo: codigoActivo,
      costo: 0,
      estado: "Programado",
      typeForm: "Protocolo de Mantenimiento Incubadora ServoCuna Fototerapia",
      accessoryInspections,
    };
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <Image src="/placeholder.svg" alt="Logo CIES" width={50} height={50} className="h-12 w-auto mr-4" />
          <h1 className="text-xl font-bold">
            COMPROBANTE DE MANTENIMIENTO PREVENTIVO PLANIFICADO
          </h1>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <Label htmlFor="vigencia">VIGENCIA DESDE: 30/10/2018</Label>
          </div>
          <div className="mb-2">
            <Label htmlFor="lugar">Lugar:</Label>
            <Input
              id="lugar"
              className="w-40"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fecha">Fecha:</Label>
            <Input
              id="fecha"
              type="date"
              className="w-40"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          INCUBADORA - SERVOCUNA - FOTOTERAPIA
        </h2>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">DATOS DEL EQUIPO:</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="codigoActivo">Código de Activo:</Label>
            <Input
              id="codigoActivo"
              value={codigoActivo}
              onChange={(e) => setCodigoActivo(e.target.value)}
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
            <Label htmlFor="ns">N/S:</Label>
            <Input id="ns" value={numeroSerie} readOnly />
          </div>
          <div>
            <Label>Garantía:</Label>
            <YesNoOptions id="garantia" defaultValue={garantia} />
          </div>
          <div>
            <Label htmlFor="tipo">Tipo:</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="incubadora">Incubadora</SelectItem>
                <SelectItem value="servocuna">Servocuna</SelectItem>
                <SelectItem value="fototerapia">Fototerapia</SelectItem>
              </SelectContent>
            </Select>
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
            <Input
              id="regional"
              value={regional}
              onChange={(e) => setRegional(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">1. INSPECCIÓN VISUAL:</h2>
        <div className="space-y-2">
          {[
            "El equipo presenta daños físicos notables.",
            "El carro presenta daños físicos notables",
            "La etiqueta ha sido removida.",
            "Los puertos y conectores presentan daños.",
            "Limpieza deficiente.",
            "Acumulación de Polvo.",
            "Policarbonatos en buen estado.",
            "Hay conductores expuestos.",
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`visual-${index}`}>{item}</Label>
              <YesNoOptions id={`visual-${index}`} defaultValue="no" />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">2. INSPECCIÓN ELÉCTRICA:</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="equipoCuentaBateria">
              El equipo cuenta con batería:
            </Label>
            <YesNoOptions id="equipoCuentaBateria" defaultValue="no" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="voltajeBateria">Voltaje Batería:</Label>
              <Input id="voltajeBateria" />
            </div>
            <div>
              <Label htmlFor="modeloBateria">Modelo de Batería:</Label>
              <Input id="modeloBateria" />
            </div>
            <div>
              <Label htmlFor="resistenciaInterna">Resistencia Interna:</Label>
              <Input id="resistenciaInterna" />
            </div>
            <div>
              <Label htmlFor="potenciaTuboUV">Potencia/Tamaño Tubo UV:</Label>
              <div className="flex space-x-2">
                <Input id="potenciaTuboUV" placeholder="W" className="w-1/2" />
                <Input id="tamanoTuboUV" placeholder="cm" className="w-1/2" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              "Resistencia Interna en buen estado",
              "Fusibles en buen estado.",
              "Cable de Poder en buen estado.",
              "Continuidad en cable de Poder.",
              "Iluminación UV en buen estado.",
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <Label htmlFor={`electrica-${index}`}>{item}</Label>
                <YesNoOptions id={`electrica-${index}`} defaultValue="no" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">3. INSPECCIÓN FUNCIONAL:</h2>
        <div className="space-y-2">
          {[
            "Encendido e inicialización correcto.",
            "Reconocimiento de todos los accesorios.",
            "Alarmas y sonido correcto.",
            "Almacenamiento de pacientes correcto.",
            "Movimiento de perilla y botones correcto.",
            "Control de Temperatura correcta",
            "Control de Humedad correcta",
            "Control de Iluminación correcto",
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`funcional-${index}`}>{item}</Label>
              <YesNoOptions id={`funcional-${index}`} defaultValue="no" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="riseTimeTemp">Rise time Temp 37 C:</Label>
              <Input id="riseTimeTemp" placeholder="min." />
            </div>
            <div>
              <Label htmlFor="nivelLumenes">Nivel de Lúmenes:</Label>
              <Input id="nivelLumenes" placeholder="Lm." />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          4. INSPECCIÓN ACCESORIOS:
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="cantidadAccesorios">Cantidad de accesorios:</Label>
            <Input
              id="cantidadAccesorios"
              type="number"
              min="1"
              max="6"
              value={cantidadAccesorios}
              onChange={(e) => {
                let value = parseInt(e.target.value);
                if (isNaN(value)) {
                  value = 1;
                }
                value = Math.max(1, Math.min(value, 6));
                setCantidadAccesorios(value);
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setCantidadAccesorios(0);
                }
              }}
            />
          </div>
        </div>
        {[...Array(cantidadAccesorios)].map((_, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <h3 className="font-semibold mb-2">ACCESORIO {index + 1}:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`modeloAccesorio${index + 1}`}>Modelo:</Label>
                <Input
                  id={`modeloAccesorio${index + 1}`}
                  defaultValue={
                    (accessoryInspections as any)[index]?.modelo || ""
                  }
                />
              </div>
              <div>
                <Label htmlFor={`nsAccesorio${index + 1}`}>N/S:</Label>
                <Input
                  id={`nsAccesorio${index + 1}`}
                  defaultValue={
                    (accessoryInspections as any)[index]?.numeroSerie || ""
                  }
                />
              </div>
            </div>
            <div className="space-y-2 mt-2">
              {[
                "Prueba de funcionamiento satisfactoria.",
                "Interfaz sin daños.",
                "Cable de conexión sin daños.",
                "Conector sin daños.",
                "Limpieza adecuada.",
                "Sensor sin daños.",
              ].map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center justify-between"
                >
                  <Label htmlFor={`accesorio${index + 1}-${itemIndex}`}>
                    {item}
                  </Label>
                  <YesNoOptions
                    id={`accesorio${index + 1}-${itemIndex}`}
                    defaultValue={
                      (accessoryInspections as any)[index]?.inspections?.[itemIndex]
                        ?.value
                        ? "si"
                        : "no"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          5. LIMPIEZA: (Solo si fuese necesario) (2da Columna mantenimiento
          anual)
        </h2>
        <div className="space-y-2">
          {[
            "Limpieza de memoria (si fuese necesario).",
            "Limpieza de contactores eléctricos.",
            "Limpieza de Paneles de Control y Teclado.",
            "Desempolvar Chasis (externo).",
            "Desempolvamiento interno.",
            "Revisión de módulos y tarjetas.",
            "Revisión de Ruedas y Frenos.",
            "Contenedor de Agua.",
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`limpieza-${index}`}>{item}</Label>
              <YesNoOptions id={`limpieza-${index}`} defaultValue="no" />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">OBSERVACIONES:</h2>
        <Textarea
          placeholder="Ingrese sus observaciones aquí"
          className="w-full h-24"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </section>

      <section className="flex justify-between">
        <div className="w-1/2 pr-2">
          <Label htmlFor="firmaMantenimiento">
            Firma y Sello Mantenimiento:
          </Label>
          <Input id="firmaMantenimiento" className="mt-1" />
        </div>
        <div className="w-1/2 pl-2">
          <Label htmlFor="firmaOperador">
            Firma y Sello Operador o encargado:
          </Label>
          <Input id="firmaOperador" className="mt-1" />
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