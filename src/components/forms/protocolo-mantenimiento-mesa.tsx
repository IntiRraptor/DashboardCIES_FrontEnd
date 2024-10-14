"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { findEquipmentByCode } from "@/utils/equipmentUtils";

// Componente reutilizable para opciones de "Sí" y "No"
const YesNoOptions = ({ id, defaultValue }: { id: string, defaultValue: string }) => (
  <div className="flex space-x-4">
    <div className="flex items-center space-x-2">
      <input type="radio" id={`${id}-si`} name={id} value="si" defaultChecked={defaultValue === "si"} />
      <label htmlFor={`${id}-si`}>Sí</label>
    </div>
    <div className="flex items-center space-x-2">
      <input type="radio" id={`${id}-no`} name={id} value="no" defaultChecked={defaultValue === "no"} />
      <label htmlFor={`${id}-no`}>No</label>
    </div>
  </div>
);

export default function FormularioMantenimientoMesaQuirurgica({
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
  const [observaciones, setObservaciones] = useState("");
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const [garantia, setGarantia] = useState("no");
  const [tipo, setTipo] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [regional, setRegional] = useState("");
  const [visualInspection, setVisualInspection] = useState([]);
  const [electricalInspection, setElectricalInspection] = useState([]);
  const [functionalInspection, setFunctionalInspection] = useState([]);

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
      setVisualInspection(details.visualInspection || []);
      setElectricalInspection(details.electricalInspection || []);
      setFunctionalInspection(details.functionalInspection || []);
      setObservaciones(details.observaciones || "");
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

    const visualInspection = getInspectionData("visual", [
      "El equipo presenta daños físicos notables",
      "Limpieza deficiente",
      "Los accesorios presentan daños físicos notables",
      "Acumulación de Polvo",
      "La etiqueta ha sido removida",
      "Piezas en estado de oxidación",
      "Hay conductores expuestos",
      "Aceite derramado",
      "Los puertos y conectores presentan daños",
    ]);

    const electricalInspection = getInspectionData("electrica", [
      "Fusibles en buen estado",
      "Cable de Poder en buen estado",
      "Continuidad en cable de Poder",
      "Conexión de Video Funcional",
      "Interfaz de Enchufes correcto",
      "Conexión de Monitor Funcional",
    ]);

    const functionalInspection = getInspectionData("funcional", [
      "Encendido e inicialización correcto",
      "Sujeción firme",
      "Funcionamiento de ambos satélites",
      "Articulaciones funcionales",
      "Funcionamiento de todos los movimientos",
      "DVR en buen estado",
      "Graduación del nivel de iluminación correcto",
      "Control cableado en buen estado",
      "Tipo de Fuente de alimentación",
      "Control inalámbrico en buen estado",
      "Accesorios Completos",
      "LEDs Quemados",
    ]);

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
      typeForm: "Protocolo de Mantenimiento Mesa QX y Lamp Cialitica",
      visualInspection,
      electricalInspection,
      functionalInspection,
    };
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sistema de Gestión de Calidad</h1>
        <h2 className="text-xl text-gray-600">Comprobante de Mantenimiento Preventivo Planificado Mesa Quirúrgica / Lámpara Cialítica</h2>
        <div className="mt-4 flex justify-between text-sm">
          <div>CÓDIGO: SGC-Apoyo-M-1-hhh3</div>
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
            <Label htmlFor="tipo">Tipo</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Seleccione el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mesa-qx">Mesa Qx</SelectItem>
                <SelectItem value="l-cialitica">Lámpara Cialítica</SelectItem>
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
          <div>
            <Label htmlFor="lugar">Lugar</Label>
            <Input
              id="lugar"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">1. Inspección Visual</h3>
        <div className="space-y-2">
          {[
            "El equipo presenta daños físicos notables",
            "Limpieza deficiente",
            "Los accesorios presentan daños físicos notables",
            "Acumulación de Polvo",
            "La etiqueta ha sido removida",
            "Piezas en estado de oxidación",
            "Hay conductores expuestos",
            "Aceite derramado",
            "Los puertos y conectores presentan daños",
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`visual-${index}`}>{item}</Label>
              <YesNoOptions
                id={`visual-${index}`}
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
        <h3 className="text-lg font-semibold mb-2">2. Inspección Eléctrica</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="equipoCuentaBateria">El equipo cuenta con baterías</Label>
            <YesNoOptions id="equipoCuentaBateria" defaultValue="no" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="voltajeLinea">Voltaje Línea</Label>
              <Input id="voltajeLinea" type="number" />
            </div>
            <div>
              <Label htmlFor="voltajeBaterias">Voltaje de Baterías</Label>
              <Input id="voltajeBaterias" type="number" />
            </div>
            <div>
              <Label htmlFor="cantidadBaterias">Cantidad de Baterías</Label>
              <Input id="cantidadBaterias" type="number" />
            </div>
            <div>
              <Label htmlFor="tipoFusibles">Tipo de Fusibles</Label>
              <Input id="tipoFusibles" />
            </div>
          </div>
          {[
            "Fusibles en buen estado",
            "Cable de Poder en buen estado",
            "Continuidad en cable de Poder",
            "Conexión de Video Funcional",
            "Interfaz de Enchufes correcto",
            "Conexión de Monitor Funcional",
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`electrica-${index}`}>{item}</Label>
              <YesNoOptions
                id={`electrica-${index}`}
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
        <h3 className="text-lg font-semibold mb-2">3. Inspección Funcional</h3>
        <div className="space-y-2">
          {[
            "Encendido e inicialización correcto",
            "Sujeción firme",
            "Funcionamiento de ambos satélites",
            "Articulaciones funcionales",
            "Funcionamiento de todos los movimientos",
            "DVR en buen estado",
            "Graduación del nivel de iluminación correcto",
            "Control cableado en buen estado",
            "Tipo de Fuente de alimentación",
            "Control inalámbrico en buen estado",
            "Accesorios Completos",
            "LEDs Quemados",
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`funcional-${index}`}>{item}</Label>
              {item === "Tipo de Fuente de alimentación" ? (
                <Select>
                  <SelectTrigger id={`funcional-${index}`}>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v">V</SelectItem>
                    <SelectItem value="a">A</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <YesNoOptions
                  id={`funcional-${index}`}
                  defaultValue={
                    functionalInspection[index]
                      ? (functionalInspection[index] as any).value
                        ? "si"
                        : "no"
                      : "no"
                  }
                />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">4. Inspección Accesorios</h3>
        <div>
          <Label htmlFor="cantidadAccesorios">Cantidad de Accesorios:</Label>
          <Input id="cantidadAccesorios" type="number" className="w-20" />
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">5. Limpieza (Solo si fuese necesario) (2da Columna mantenimiento anual)</h3>
        <div className="space-y-2">
          {[
            "Limpieza de memoria (si fuese necesario)",
            "Desempolvamiento interno",
            "Limpieza de contactores eléctricos",
            "Revisión de módulos y tarjetas",
            "Limpieza de Paneles de Control y Teclado",
            "Revisión de Ruedas y Frenos",
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`limpieza-${index}`}>{item}</Label>
              <YesNoOptions id={`limpieza-${index}`} defaultValue="no" />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">6. Conexión para Transmisión Externa</h3>
        <div className="space-y-2">
          {[
            "Conexión cableada",
            "Funcionamiento HDMI",
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`transmision-${index}`}>{item}</Label>
              <YesNoOptions id={`transmision-${index}`} defaultValue="no" />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Label htmlFor="detallesConexion">Detalles de Conexión:</Label>
          <Input id="detallesConexion" />
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Observaciones</h3>
        <Textarea 
          value={observaciones} 
          onChange={(e) => setObservaciones(e.target.value)}
          className="w-full h-32"
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
          Guardar Formulario
        </Button>
      </div>
    </div>
  );
}