"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { findEquipmentByCode } from "@/utils/equipmentUtils";
import * as QRCode from "qrcode.react";
import { v4 as uuidv4 } from 'uuid';

export function TrainingFormComponent({
  equipment,
  onSubmit,
  initialData,
  isEditMode = false,
}: {
  equipment: EquipmentDetail[];
  onSubmit: (data: any) => void;
  initialData?: Partial<any>;
  isEditMode: boolean;
}) {
  const [formData, setFormData] = useState({
    id: initialData?.id || uuidv4(),
    date: initialData?.date || "",
    regional: initialData?.regional || "",
    serviceType: initialData?.serviceType || "",
    trainingTitle: initialData?.title || "",
    medicalEquipment: initialData?.medicalEquipment || "",
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    series: initialData?.series || "",
  });

  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!isEditMode) {
      const foundEquipment = findEquipmentByCode(
        equipment,
        formData.medicalEquipment
      );
      if (foundEquipment) {
        setFormData((prev) => ({
          ...prev,
          brand: foundEquipment.nombreaf,
          model: foundEquipment.descaf,
          series: foundEquipment.aux1,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          brand: "",
          model: "",
          series: "",
        }));
      }
    }
  }, [equipment, formData.medicalEquipment, isEditMode]);

  useEffect(() => {
    // Generate attendance URL for QR code
    const attendanceUrl = `${window.location.origin}/attendance/${formData.id}`;
    setQrCodeUrl(attendanceUrl);
  }, [formData.id]);

  const handleSubmit = () => {
    const submittedData = {
      tipo: "Capacitación",
      equipo: formData.medicalEquipment,
      estado: "Programado",
      costo: 0,
      typeForm: "Formulario de Capacitación",
      regional: formData.regional,
      ubicacion: formData.serviceType,
      details: JSON.stringify({
        id: formData.id,
        title: formData.trainingTitle,
        date: formData.date,
        regional: formData.regional,
        serviceType: formData.serviceType,
        medicalEquipment: formData.medicalEquipment,
        brand: formData.brand,
        model: formData.model,
        series: formData.series,
        qrCodeUrl: qrCodeUrl,
        attendanceCount: 0,
        submissions: [],
        status: 'scheduled'
      })
    };
    console.log('Form data being submitted:', submittedData);
    onSubmit(submittedData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos para el formulario de capacitación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha de capacitación</Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regional">Regional</Label>
              <Input
                id="regional"
                name="regional"
                value={formData.regional}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Tipo de Servicio</Label>
              <Input
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingTitle">Título de capacitación</Label>
              <Input
                id="trainingTitle"
                name="trainingTitle"
                value={formData.trainingTitle}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalEquipment">Equipo médico</Label>
              <Input
                id="medicalEquipment"
                name="medicalEquipment"
                value={formData.medicalEquipment}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" name="brand" value={formData.brand} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" name="model" value={formData.model} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="series">Serie</Label>
              <Input id="series" name="series" value={formData.series} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      {!isEditMode && qrCodeUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Código QR para registro de asistencia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <QRCode.QRCodeSVG value={qrCodeUrl} size={200} />
              <p className="text-sm text-muted-foreground">
                Escanee este código QR para registrar su asistencia
              </p>
              <Button
                onClick={() => window.open(qrCodeUrl, '_blank')}
                variant="outline"
              >
                Abrir enlace de asistencia
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ejemplo de invitación</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            En fecha <span className="font-semibold">{formData.date}</span> en la
            Regional de <span className="font-semibold">{formData.regional}</span>{" "}
            Servicio de{" "}
            <span className="font-semibold">{formData.serviceType}</span> se
            efectuará la capacitación de{" "}
            <span className="font-semibold">{formData.trainingTitle}</span> del
            equipo médico{" "}
            <span className="font-semibold">{formData.medicalEquipment}</span> de
            Marca <span className="font-semibold">{formData.brand}</span> Modelo{" "}
            <span className="font-semibold">{formData.model}</span> Serie{" "}
            <span className="font-semibold">{formData.series}</span>.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Por favor escanee el código QR proporcionado para registrar su asistencia.
          </p>
        </CardContent>
      </Card>

      <Button type="button" onClick={handleSubmit} disabled={loading}>
        {loading ? "Guardando..." : isEditMode ? "Actualizar" : "Guardar"}
      </Button>
    </div>
  );
}
