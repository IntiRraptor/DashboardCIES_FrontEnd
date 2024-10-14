"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
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

export default function FormularioMantenimientoElectrobisturi({
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
  const [cantidadPedales, setCantidadPedales] = useState(1);
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const [garantia, setGarantia] = useState("no");
  const [sucursal, setSucursal] = useState("");
  const [regional, setRegional] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [firmaMantenimiento, setFirmaMantenimiento] = useState("");
  const [firmaOperador, setFirmaOperador] = useState("");
  const [pedalInspections, setPedalInspections] = useState([]);

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
      setSucursal(details.sucursal || "");
      setRegional(details.regional || "");
      setObservaciones(details.observaciones || "");
      setFirmaMantenimiento(details.firmaMantenimiento || "");
      setFirmaOperador(details.firmaOperador || "");
      setCantidadPedales(details.pedalInspections?.length || 1);
      setPedalInspections(details.pedalInspections || []);
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

    const pedalInspections = Array.from(
      { length: cantidadPedales },
      (_, index) => {
        const pedalNumber = index + 1;
        return {
          modelo: (document.getElementById(`modeloPedal${pedalNumber}`) as HTMLInputElement)?.value || "",
          numeroSerie: (document.getElementById(`nsPedal${pedalNumber}`) as HTMLInputElement)?.value || "",
          inspections: getInspectionData(`pedal${pedalNumber}`, [
            "Prueba de pedal satisfactoria.",
            "Cable de conexión sin daños.",
            "Conector sin daños.",
            "Limpieza adecuada.",
          ]),
        };
      }
    );

    const formData = {
      lugar,
      fecha,
      garantia,
      sucursal,
      regional,
      observaciones,
      tipo: "Preventivo",
      equipo: codigoActivo,
      costo: 0,
      estado: "Programado",
      typeForm: "Protocolo de Mantenimiento Electrobisturi",
      pedalInspections,
      firmaMantenimiento,
      firmaOperador,
    };
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Sistema de Gestión de Calidad
        </h1>
        <h2 className="text-xl text-gray-600">
          Comprobante de Mantenimiento Preventivo Planificado Electrobisturi
        </h2>
        <div className="mt-4 flex justify-between text-sm">
          <div>CÓDIGO: SGC-Apoyo-M-1-hhh3</div>
          <div>VIGENCIA DESDE: {new Date().toLocaleDateString()}</div>
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
        <h3 className="text-lg font-semibold mb-2">INSPECCIÓN ACCESORIOS</h3>
        <div>
          <Label htmlFor="cantidadPedales">Cantidad de Pedales</Label>
          <Input
            id="cantidadPedales"
            type="number"
            min="1"
            value={cantidadPedales}
            onChange={(e) => setCantidadPedales(Number(e.target.value))}
          />
        </div>
        {Array.from({ length: cantidadPedales }, (_, index) => index + 1).map(
          (num) => (
            <div key={num} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold mb-2">Pedal {num}:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`modeloPedal${num}`}>Modelo:</Label>
                  <Input
                    id={`modeloPedal${num}`}
                    defaultValue={
                      (pedalInspections as any)[num - 1]?.modelo || ""
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`nsPedal${num}`}>N/S:</Label>
                  <Input
                    id={`nsPedal${num}`}
                    defaultValue={
                      (pedalInspections as any)[num - 1]?.numeroSerie || ""
                    }
                  />
                </div>
              </div>
              <div className="space-y-2 mt-2">
                {[
                  "Prueba de pedal satisfactoria.",
                  "Cable de conexión sin daños.",
                  "Conector sin daños.",
                  "Limpieza adecuada.",
                ].map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between"
                  >
                    <Label htmlFor={`pedal${num}-${itemIndex}`}>{item}</Label>
                    <YesNoOptions
                      id={`pedal${num}-${itemIndex}`}
                      defaultValue={
                        (pedalInspections as any)[num - 1]?.inspections?.[itemIndex]
                          ?.value
                          ? "si"
                          : "no"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Observaciones</h3>
        <Textarea
          placeholder="Ingrese cualquier observación adicional aquí"
          className="w-full h-32"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </section>

      <footer className="flex justify-between mt-8">
        <div>
          <Label htmlFor="firmaMantenimiento">
            Firma y Sello Mantenimiento
          </Label>
          <Input
            id="firmaMantenimiento"
            className="mt-1"
            value={firmaMantenimiento}
            onChange={(e) => setFirmaMantenimiento(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="firmaOperador">
            Firma y Sello Operador o encargado
          </Label>
          <Input
            id="firmaOperador"
            className="mt-1"
            value={firmaOperador}
            onChange={(e) => setFirmaOperador(e.target.value)}
          />
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