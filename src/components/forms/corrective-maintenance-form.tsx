"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { findEquipmentByCode } from "@/utils/equipmentUtils";

export function CorrectiveMaintenanceFormComponent({
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
  const [ticketNumber, setTicketNumber] = useState(() =>
    Math.floor(100000 + Math.random() * 900000).toString()
  );
  const [formData, setFormData] = useState({
    codigoActivo: "",
    marca: "",
    modelo: "",
    serie: "",
    tipoServicio: "",
    regional: "",
    costoReparacion: "",
    encargadoResponsable: "",
    observaciones: "",
    hojaVida: "",
  });

  useEffect(() => {
    if (isEditMode) {
      const details = JSON.parse(initialData.details);
      setFormData({
        codigoActivo: details.codigoActivo || "",
        marca: details.marca || "",
        modelo: details.modelo || "",
        serie: details.serie || "",
        tipoServicio: details.tipoServicio || "",
        regional: details.regional || "",
        costoReparacion: details.costoReparacion || "",
        encargadoResponsable: details.encargadoResponsable || "",
        observaciones: details.observaciones || "",
        hojaVida: details.hojaVida || "",
      });
    }
  }, [initialData, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      const foundEquipment = findEquipmentByCode(
        equipment,
        formData.codigoActivo
      );
      if (foundEquipment) {
        setFormData((prev) => ({
          ...prev,
          marca: foundEquipment.nombreaf,
          modelo: foundEquipment.descaf,
          serie: foundEquipment.aux1,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          marca: "",
          modelo: "",
          serie: "",
        }));
      }
    }
  }, [equipment, formData.codigoActivo, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = (formData: any) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Informe de Mantenimiento Correctivo - Código Activo: ${formData.codigoActivo}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Informe de Mantenimiento Correctivo</h1>
            <table>
              <tr><th>Código Activo</th><td>${formData.codigoActivo}</td></tr>
              <tr><th>Marca</th><td>${formData.marca}</td></tr>
              <tr><th>Modelo</th><td>${formData.modelo}</td></tr>
              <tr><th>Serie</th><td>${formData.serie}</td></tr>
              <tr><th>Tipo Servicio</th><td>${formData.tipoServicio}</td></tr>
              <tr><th>Regional</th><td>${formData.regional}</td></tr>
              <tr><th>Costo de Reparación</th><td>${formData.costoReparacion}</td></tr>
              <tr><th>Encargado Responsable</th><td>${formData.encargadoResponsable}</td></tr>
              <tr><th>Observaciones</th><td>${formData.observaciones}</td></tr>
              <tr><th>Hoja de Vida</th><td>${formData.hojaVida}</td></tr>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSubmit = () => {
    const data = {
      ...formData,
      tipo: "Correctivo",
      typeForm: "Mantenimiento Correctivo",
      equipo: formData.codigoActivo,
      estado: "Programado",
      ticketNumber,
      costo: parseFloat(formData.costoReparacion),
    };
    console.log("data: ", data);
    onSubmit(data);
    handlePrint(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Formulario de Mantenimiento Correctivo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Características Equipos
          </h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="codigoActivo">Código Activo</Label>
              <Input
                id="codigoActivo"
                name="codigoActivo"
                value={formData.codigoActivo}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                name="marca"
                value={formData.marca}
                readOnly
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                name="modelo"
                value={formData.modelo}
                readOnly
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="serie">Serie</Label>
              <Input
                id="serie"
                name="serie"
                value={formData.serie}
                readOnly
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Servicio</h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="tipoServicio">Tipo Servicio</Label>
              <Input
                id="tipoServicio"
                name="tipoServicio"
                value={formData.tipoServicio}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="regional">Regional</Label>
              <Input
                id="regional"
                name="regional"
                value={formData.regional}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ticket">Nº de Ticket</Label>
              <Input
                id="ticket"
                value={ticketNumber}
                readOnly
                className="mt-1 bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="costoReparacion">Costo de Reparación (Bs)</Label>
          <Input
            id="costoReparacion"
            name="costoReparacion"
            type="number"
            value={formData.costoReparacion}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="encargadoResponsable">Encargado Responsable</Label>
          <Input
            id="encargadoResponsable"
            name="encargadoResponsable"
            value={formData.encargadoResponsable}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
      </div>

      <div className="mb-6">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          name="observaciones"
          value={formData.observaciones}
          onChange={handleInputChange}
          className="mt-1"
          rows={4}
        />
      </div>

      <div className="mb-6">
        <Label htmlFor="hojaVida">Hoja de Vida</Label>
        <Textarea
          id="hojaVida"
          name="hojaVida"
          value={formData.hojaVida}
          onChange={handleInputChange}
          className="mt-1"
          rows={4}
        />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Firmas</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-100">Fecha</th>
              <th className="border p-2 bg-gray-100">Firma</th>
              <th className="border p-2 bg-gray-100">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">
                <Input type="date" />
              </td>
              <td className="border p-2">Firma Conformidad de Servicio</td>
              <td className="border p-2">
                <Input />
              </td>
            </tr>
            <tr>
              <td className="border p-2">
                <Input type="date" />
              </td>
              <td className="border p-2">Firma Responsable de Mantenimiento</td>
              <td className="border p-2">
                <Input />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-lg font-semibold transition duration-300"
      >
        Enviar e Imprimir
      </Button>
    </form>
  );
}
