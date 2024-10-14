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

export default function FormularioMantenimientoMonitor({
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
  const [cantidadAccesorios, setCantidadAccesorios] = useState(6);
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const [garantia, setGarantia] = useState("no");
  const [tipoMonitor, setTipoMonitor] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [regional, setRegional] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [accessoryInspections, setAccessoryInspections] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      const details = JSON.parse(initialData.details);
      const foundEquipment = findEquipmentByCode(equipment, details.equipo);
      setMarca(foundEquipment?.nombreaf || "");
      setCodigoActivo(details.equipo || "");
      setModelo(foundEquipment?.descaf || "");
      setNumeroSerie(foundEquipment?.aux1 || "");
      setLugar(details.lugar || "");
      setFecha(details.fecha || "");
      setGarantia(details.garantia || "no");
      setTipoMonitor(details.tipoMonitor || "");
      setSucursal(details.sucursal || "");
      setRegional(details.regional || "");
      setObservaciones(details.observaciones || "");
      setCantidadAccesorios(details.accessoryInspections?.length || 6);
      setAccessoryInspections(details.accessoryInspections || []);
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
      tipoMonitor,
      sucursal,
      regional,
      observaciones,
      tipoMantenimiento: "Preventivo",
      equipo: codigoActivo,
      costo: 0,
      estado: "Programado",
      typeForm: "Protocolo de Mantenimiento Monitores_Fetal_ECG",
      accessoryInspections,
    };
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold">Comprobante de Mantenimiento Preventivo Planificado</h1>
        <h2 className="text-xl text-gray-600">Monitor Multiparámetro / Fetal / ECG</h2>
        <div className="mt-4 flex justify-between text-sm">
          <div>VIGENCIA DESDE: 30/10/2018</div>
        </div>
      </header>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Datos del Equipo</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="codigoActivo">Código de Activo</Label>
            <Input
              id="codigoActivo"
              value={codigoActivo}
              onChange={(e) => setCodigoActivo(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="marca">Marca</Label>
            <Input id="marca" value={marca} readOnly />
          </div>
          <div>
            <Label htmlFor="modelo">Modelo</Label>
            <Input id="modelo" value={modelo} readOnly />
          </div>
          <div>
            <Label htmlFor="ns">N/S</Label>
            <Input id="ns" value={numeroSerie} readOnly />
          </div>
          <div>
            <Label>Garantía</Label>
            <YesNoOptions id="garantia" defaultValue={garantia} />
          </div>
          <div>
            <Label htmlFor="tipoMonitor">Monitor</Label>
            <Select value={tipoMonitor} onValueChange={setTipoMonitor}>
              <SelectTrigger id="tipoMonitor">
                <SelectValue placeholder="Seleccione el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="signosVitales">Signos Vitales</SelectItem>
                <SelectItem value="fetal">Fetal</SelectItem>
                <SelectItem value="ecg">ECG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sucursal">Sucursal</Label>
            <Input
              id="sucursal"
              value={sucursal}
              onChange={(e) => setSucursal(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="regional">Regional</Label>
            <Input
              id="regional"
              value={regional}
              onChange={(e) => setRegional(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">1. Inspección Visual</h3>
        <div className="space-y-2">
          {[
            "El equipo presenta daños físicos notables.",
            "El carro presenta daños físicos notables",
            "La etiqueta ha sido removida.",
            "Hay conductores expuestos.",
            "Los puertos y conectores presentan daños.",
            "Limpieza deficiente.",
            "Acumulación de Polvo.",
            "Pantalla en buenas condiciones.",
            "Teclado/botones funcionales.",
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`visual-${index}`}>{item}</Label>
              <YesNoOptions id={`visual-${index}`} defaultValue="no" />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">2. Inspección Eléctrica</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="equipoCuentaBateria">El equipo cuenta con batería</Label>
            <YesNoOptions id="equipoCuentaBateria" defaultValue="no" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="voltajeBateria">Voltaje Batería</Label>
              <Input id="voltajeBateria" />
            </div>
            <div>
              <Label htmlFor="modeloBateria">Modelo de Batería</Label>
              <Input id="modeloBateria" />
            </div>
          </div>
          <div className="space-y-2">
            {[
              "Fusibles en buen estado.",
              "Cable de Poder en buen estado.",
              "Continuidad en cable de Poder.",
              "Interfaz de Enchufes correcto.",
              "Iluminación LED en el Ambiente.",
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
        <h3 className="text-lg font-semibold mb-2">3. Inspección Funcional</h3>
        <div className="space-y-2">
          {[
            "Encendido e inicialización correcto.",
            "Reconocimiento de todos los accesorios.",
            "Colores de Pantalla Correctos.",
            "Almacenamiento de pacientes correcto.",
            "Impresión correcta",
            "Alarmas y Sonido correcto.",
            "Teclado Funcional.",
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`funcional-${index}`}>{item}</Label>
              <YesNoOptions id={`funcional-${index}`} defaultValue="no" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tamanoPapel">Tamaño de papel</Label>
              <Input id="tamanoPapel" placeholder="mm." />
            </div>
            <div>
              <Label htmlFor="versionSO">Versión de S.O.</Label>
              <Input id="versionSO" />
            </div>
            <div>
              <Label htmlFor="claveSoftware">Clave de Software</Label>
              <Input id="claveSoftware" />
            </div>
            <div>
              <Label htmlFor="verificacionMediciones">Verificación Mediciones</Label>
              <Input id="verificacionMediciones" />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">4. Inspección Accesorios</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="cantidadAccesorios">Cantidad de accesorios</Label>
            <Input 
              id="cantidadAccesorios" 
              type="number" 
              min="1" 
              max="6" 
              value={cantidadAccesorios} 
              onChange={(e) => setCantidadAccesorios(parseInt(e.target.value))} 
            />
          </div>
          <div>
            <Label htmlFor="cantidadPuertos">Cantidad de Puertos</Label>
            <Input id="cantidadPuertos" />
          </div>
        </div>
        {[...Array(cantidadAccesorios)].map((_, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <h3 className="font-semibold mb-2">ACCESORIO {index + 1}:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`modeloAccesorio${index + 1}`}>Modelo</Label>
                <Input
                  id={`modeloAccesorio${index + 1}`}
                  defaultValue={
                    (accessoryInspections as any)[index]?.modelo || ""
                  }
                />
              </div>
              <div>
                <Label htmlFor={`nsAccesorio${index + 1}`}>N/S</Label>
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
                <div key={itemIndex} className="flex items-center justify-between">
                  <Label htmlFor={`accesorio${index + 1}-${itemIndex}`}>{item}</Label>
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
        <h3 className="text-lg font-semibold mb-2">5. Limpieza: (Solo si fuese necesario)</h3>
        <div className="space-y-2">
          {[
            "Limpieza de memoria (si fuese necesario).",
            "Limpieza de contactores eléctricos.",
            "Limpieza de Paneles de Control y Teclado.",
            "Desempolvar Chasis (externo).",
            "Desempolvamiento interno.",
            "Revisión de módulos y tarjetas.",
            "Revisión de Interfaces.",
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`limpieza-${index}`}>{item}</Label>
              <YesNoOptions id={`limpieza-${index}`} defaultValue="no" />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Observaciones</h3>
        <Textarea 
          placeholder="Ingrese sus observaciones aquí" 
          className="w-full h-24" 
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </section>

      <footer className="flex justify-between mt-8">
        <div>
          <Label htmlFor="firmaMantenimiento">Firma y Sello Mantenimiento</Label>
          <Input id="firmaMantenimiento" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="firmaOperador">Firma y Sello Operador o encargado</Label>
          <Input id="firmaOperador" className="mt-1" />
        </div>
      </footer>

      <div className="mt-8 text-center">
        <Button type="button" onClick={handleSubmit}>
          Enviar Formulario de Mantenimiento
        </Button>
      </div>
    </div>
  );
}