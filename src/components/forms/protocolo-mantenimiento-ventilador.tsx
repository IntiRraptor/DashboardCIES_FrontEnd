"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { findEquipmentByCode } from "@/utils/equipmentUtils";

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

export default function FormularioMantenimientoVentiladorCPAP({
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
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const [garantia, setGarantia] = useState("no");
  const [tipo, setTipo] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [regional, setRegional] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [vaporizerInspections, setVaporizerInspections] = useState([]);
  const [cantidadVaporizadores, setCantidadVaporizadores] = useState(1);

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
      setCantidadVaporizadores(details.vaporizerInspections?.length || 1);
      setVaporizerInspections(details.vaporizerInspections || []);
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

    const vaporizerInspections = Array.from(
      { length: cantidadVaporizadores },
      (_, index) => {
        const vaporizerNumber = index + 1;
        return {
          modelo: (document.getElementById(`vaporizador-${vaporizerNumber}-modelo`) as HTMLInputElement)?.value || "",
          numeroSerie: (document.getElementById(`vaporizador-${vaporizerNumber}-ns`) as HTMLInputElement)?.value || "",
          inspections: getInspectionData(`vaporizador-${vaporizerNumber}`, [
            "Perilla de Ajuste en funcionamiento",
            "Indicador de Nivel en buen estado",
            "Empaques de conexión en buen estado",
            "Puerto de carga en buen estado",
            "Perilla de sujeción en buen estado",
            "Puerto de descarga en buen estado",
            "Prueba de calentamiento satisfactoria",
            "Botones, perilla en buen estado",
            "Sensor de temperatura",
            "Cámara de hum en buen estado",
            "Conexión eléctrica segura",
            "Prueba de fugas satisfactoria",
            "Conectores de Salida en buen estado",
            "Filtros de aire limpios",
            "Cable de conexión sin daños",
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
      typeForm: "Protocolo de Mantenimiento MaqAnes Vent CPAP.",
      vaporizerInspections,
    };
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold">Sistema de Gestión de Calidad</h1>
        <h2 className="text-xl text-gray-600">
          Comprobante de Mantenimiento Preventivo Planificado: Anestesia
          Ventilador CPAP
        </h2>
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
            <Input
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            />
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
            "El carro presenta daños físicos notables",
            "La etiqueta ha sido removida",
            "Hay conductores expuestos",
            "Los puertos y conectores presentan daños",
            "Pulmón de Prueba en buen estado",
            "Válvulas y mangueras en buen estado",
            "Limpieza deficiente",
            "Humidificador en buen estado",
            "Presión de Oxígeno/Aire correcta",
            "Sensor de Flujo en buen estado",
            "Uso de filtros antibacteriales",
            "Sensor de Oxígeno en buen estado",
            "Manómetros en buen estado",
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="equipoConectadoUPS">
              El equipo está conectado a un UPS
            </Label>
            <YesNoOptions id="equipoConectadoUPS" defaultValue="no" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="voltajeLinea">Voltaje Línea</Label>
              <Input id="voltajeLinea" type="number" />
            </div>
            <div>
              <Label htmlFor="voltajeUPS">Voltaje con UPS</Label>
              <Input id="voltajeUPS" type="number" />
            </div>
            <div>
              <Label htmlFor="tipoFusibles">Tipos de Fusibles</Label>
              <Input id="tipoFusibles" />
            </div>
          </div>
          {[
            "Baterías del equipo en buen estado",
            "Cable de Poder en buen estado",
            "Usa transformador eléctrico",
            "Interfaz de Enchufes correcto",
            "Accesorios en buen estado",
            "Filtros en buen estado",
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`electrica-${index}`}>{item}</Label>
              <YesNoOptions id={`electrica-${index}`} defaultValue="no" />
            </div>
          ))}
          <div>
            <Label htmlFor="cantidadBaterias">Ctd de Bat.</Label>
            <Input id="cantidadBaterias" type="number" className="w-20" />
          </div>
          <div>
            <Label htmlFor="tipoBateria">Tipo de bat.</Label>
            <Input id="tipoBateria" className="w-40" />
          </div>
          <div>
            <Label htmlFor="fechaReemplazo">Fecha de reemplazo de Bat.</Label>
            <Input id="fechaReemplazo" type="date" />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">3. Inspección Funcional</h3>
        <div className="space-y-2">
          {[
            "Encendido e inicialización correcto",
            "Ventilación x Presión Correcta",
            "Autotest de Fallas y Fugas satisfactorio",
            "Ventilación x Volumn Correcta",
            "Controles touch, botones y perilla funcionales",
            "Ventilación Manual Correcta",
            "Flujómetros Funcionales",
            "Ventilación CPAP Correcta",
            "Horas de Uso",
            "Mezcla Aire/Oxígeno correcta",
            "Sonido de alarmas Audible",
            "Dosis Vaporizadores Correcta",
            "Suministro de cilindro de O2 con manómetro",
            "PAW y PEEP funcionales",
            "Suministro de cilindro de Aire con manómetro",
            "Limitador de Presión funcional",
            "Suministro Eléctrico con transformador",
            "Alarma de baja presión funcional",
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`funcional-${index}`}>{item}</Label>
              {item === "Horas de Uso" ? (
                <Input
                  id={`funcional-${index}`}
                  type="number"
                  className="w-20"
                />
              ) : (
                <YesNoOptions id={`funcional-${index}`} defaultValue="no" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">4. Inspección Accesorios</h3>
        <div>
          <Label htmlFor="cantidadVaporizadores">
            Cantidad de vaporizadores:
          </Label>
          <Input
            id="cantidadVaporizadores"
            type="number"
            className="w-20"
            min="1"
            max="6"
            value={cantidadVaporizadores}
            onChange={(e) => setCantidadVaporizadores(parseInt(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="humidificadorActivo">Humidificador activo:</Label>
          <YesNoOptions id="humidificadorActivo" defaultValue="no" />
        </div>
        {[...Array(cantidadVaporizadores)].map((_, index) => (
          <div key={index} className="mt-4 p-4 border rounded">
            <h4 className="font-semibold">{`VAPORIZADOR ${index + 1}`}</h4>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <Label htmlFor={`vaporizador-${index + 1}-modelo`}>
                  Modelo:
                </Label>
                <Input
                  id={`vaporizador-${index + 1}-modelo`}
                  defaultValue={
                    (vaporizerInspections as any)[index]?.modelo || ""
                  }
                />
              </div>
              <div>
                <Label htmlFor={`vaporizador-${index + 1}-ns`}>N/S:</Label>
                <Input
                  id={`vaporizador-${index + 1}-ns`}
                  defaultValue={
                    (vaporizerInspections as any)[index]?.numeroSerie || ""
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              {[
                "Perilla de Ajuste en funcionamiento",
                "Indicador de Nivel en buen estado",
                "Empaques de conexión en buen estado",
                "Puerto de carga en buen estado",
                "Perilla de sujeción en buen estado",
                "Puerto de descarga en buen estado",
                "Prueba de calentamiento satisfactoria",
                "Botones, perilla en buen estado",
                "Sensor de temperatura",
                "Cámara de hum en buen estado",
                "Conexión eléctrica segura",
                "Prueba de fugas satisfactoria",
                "Conectores de Salida en buen estado",
                "Filtros de aire limpios",
                "Cable de conexión sin daños",
              ].map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center justify-between"
                >
                  <Label htmlFor={`vaporizador-${index + 1}-${itemIndex}`}>
                    {item}
                  </Label>
                  <YesNoOptions
                    id={`vaporizador-${index + 1}-${itemIndex}`}
                    defaultValue={
                      (vaporizerInspections as any)[index]?.inspections?.[itemIndex]
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
        {["HUMIDIFICADOR", "COMPRESOR"].map((accesorio, index) => (
          <div key={index} className="mt-4 p-4 border rounded">
            <h4 className="font-semibold">{accesorio}</h4>
            <div className="space-y-2">
              {[
                "Prueba de funcionamiento satisfactoria",
                "Interfaz sin daños",
                "Cable de conexión sin daños",
                "Conector sin daños",
                "Limpieza adecuada",
                "Sensor sin daños",
              ].map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center justify-between"
                >
                  <Label htmlFor={`${accesorio.toLowerCase()}-${itemIndex}`}>
                    {item}
                  </Label>
                  <YesNoOptions
                    id={`${accesorio.toLowerCase()}-${itemIndex}`}
                    defaultValue="no"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          5. Calibración y Reemplazo de Empaques (Columna mantenimiento anual)
        </h3>
        <div className="space-y-2">
          {[
            "Calibración de flujos",
            "Desempolvamiento interno",
            "Calibración de Presiones",
            "Revisión de módulos y tarjetas",
            "Calibración de Volúmenes",
            "Revisión de Interfaces",
            "Ajustes de la interfaz",
            "Revisión de Manómetros",
            "Calibración de Válvulas",
            "Revisión de Flujómetros",
            "Limpieza de contactores eléctricos",
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label htmlFor={`calibracion-${index}`}>{item}</Label>
              <YesNoOptions id={`calibracion-${index}`} defaultValue="no" />
            </div>
          ))}
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
          <Label htmlFor="firmaMantenimiento">
            Firma y Sello Mantenimiento
          </Label>
          <Input id="firmaMantenimiento" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="firmaOperador">
            Firma y Sello Operador o encargado
          </Label>
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