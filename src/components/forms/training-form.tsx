"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { findEquipmentByCode } from "@/utils/equipmentUtils";
import * as QRCode from "qrcode.react";
import { v4 as uuidv4 } from "uuid";
import { createSession } from "@/lib/api/training";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIPOS_MANTENIMIENTO = ["Capacitación"] as const;
const ESTADOS_MANTENIMIENTO = [
  "Programado",
  "En proceso",
  "Completado",
] as const;

export function TrainingFormComponent({
  equipment,
  onSubmit,
  initialData,
  isEditMode = false,
  region,
  ubicacion,
}: {
  equipment: EquipmentDetail[];
  onSubmit: (data: any) => void;
  initialData?: Partial<any>;
  isEditMode: boolean;
  region: string;
  ubicacion: string;
}) {
  const [formData, setFormData] = useState({
    id: initialData?.id || uuidv4(),
    date: initialData?.date || "",
    fechaInicio: initialData?.fechaInicio || "",
    fechaFin: initialData?.fechaFin || "",
    hora: initialData?.hora || "",
    regional: initialData?.regional || "",
    serviceType: initialData?.serviceType || "",
    trainingTitle: initialData?.title || "",
    medicalEquipment: initialData?.medicalEquipment || "",
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    series: initialData?.series || "",
    tipo: "Capacitación",
    estado: "Programado",
    costo: 0,
  });

  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fechaInicio)
      newErrors.fechaInicio = "La fecha de inicio es requerida";
    if (!formData.fechaFin) newErrors.fechaFin = "La fecha de fin es requerida";
    if (!formData.hora) newErrors.hora = "La hora es requerida";
    if (!formData.regional) newErrors.regional = "La regional es requerida";
    if (!formData.medicalEquipment)
      newErrors.medicalEquipment = "El equipo es requerido";
    if (!formData.trainingTitle)
      newErrors.trainingTitle = "El título es requerido";
    if (!formData.serviceType)
      newErrors.serviceType = "El tipo de servicio es requerido";

    // Validar que fecha fin sea después de fecha inicio
    if (formData.fechaInicio && formData.fechaFin) {
      const inicio = new Date(formData.fechaInicio);
      const fin = new Date(formData.fechaFin);
      if (fin < inicio) {
        newErrors.fechaFin =
          "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
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
    const attendanceUrl = `${window.location.origin}/attendance/${formData.id}`;
    setQrCodeUrl(attendanceUrl);
  }, [formData.id]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log("Error en el formulario");
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    try {
      setLoading(true);
      // Primero creamos los datos de la sesión de entrenamiento
      const trainingSessionData = {
        _id: formData.id,
        id: formData.id,
        title: formData.trainingTitle,
        status: "scheduled" as const,
        date: formData.fechaInicio,
        regional: formData.regional,
        serviceType: formData.serviceType,
        medicalEquipment: {
          code: formData.medicalEquipment,
          brand: formData.brand,
          model: formData.model,
          series: formData.series,
        },
        qrCodeUrl: qrCodeUrl,
        attendeeCount: 0,
        submissions: [],
        trainingSessionId: formData.id,
      };

      // Luego creamos los datos del mantenimiento siguiendo el formato de protocolo-mantenimiento
      const maintenanceData = {
        ...formData,
        tipo: "Capacitación",
        equipo: formData.medicalEquipment,
        estado: "Programado",
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        hora: formData.hora,
        region: region,
        ubicacion: ubicacion,
        costo: 0,
        typeForm: "Formulario de Capacitación",
      };

      await onSubmit(maintenanceData);
      await createSession(trainingSessionData);
      toast.success("Capacitación creada exitosamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al crear la capacitación");
    } finally {
      setLoading(false);
    }
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
              <Label htmlFor="fechaInicio" className="flex items-center">
                Fecha de inicio <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                type="datetime-local"
                id="fechaInicio"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleInputChange}
                required
                className={errors.fechaInicio ? "border-red-500" : ""}
              />
              {errors.fechaInicio && (
                <p className="text-red-500 text-sm">{errors.fechaInicio}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFin" className="flex items-center">
                Fecha de fin <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                type="datetime-local"
                id="fechaFin"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleInputChange}
                required
                className={errors.fechaFin ? "border-red-500" : ""}
              />
              {errors.fechaFin && (
                <p className="text-red-500 text-sm">{errors.fechaFin}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora" className="flex items-center">
                Hora <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                type="time"
                id="hora"
                name="hora"
                value={formData.hora}
                onChange={handleInputChange}
                required
                className={errors.hora ? "border-red-500" : ""}
              />
              {errors.hora && (
                <p className="text-red-500 text-sm">{errors.hora}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="regional" className="flex items-center">
                Regional <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="regional"
                name="regional"
                value={formData.regional}
                onChange={handleInputChange}
                required
                className={errors.regional ? "border-red-500" : ""}
              />
              {errors.regional && (
                <p className="text-red-500 text-sm">{errors.regional}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType" className="flex items-center">
                Tipo de Servicio <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                required
                className={errors.serviceType ? "border-red-500" : ""}
              />
              {errors.serviceType && (
                <p className="text-red-500 text-sm">{errors.serviceType}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingTitle" className="flex items-center">
                Título de capacitación{" "}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="trainingTitle"
                name="trainingTitle"
                value={formData.trainingTitle}
                onChange={handleInputChange}
                required
                className={errors.trainingTitle ? "border-red-500" : ""}
              />
              {errors.trainingTitle && (
                <p className="text-red-500 text-sm">{errors.trainingTitle}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalEquipment" className="flex items-center">
                Equipo médico <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="medicalEquipment"
                name="medicalEquipment"
                value={formData.medicalEquipment}
                onChange={handleInputChange}
                required
                className={errors.medicalEquipment ? "border-red-500" : ""}
              />
              {errors.medicalEquipment && (
                <p className="text-red-500 text-sm">
                  {errors.medicalEquipment}
                </p>
              )}
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
              <Input
                id="series"
                name="series"
                value={formData.series}
                readOnly
              />
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
                onClick={() => window.open(qrCodeUrl, "_blank")}
                variant="outline"
              >
                Abrir enlace de asistencia
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Guardando..." : isEditMode ? "Actualizar" : "Guardar"}
      </Button>

      <div className="text-sm text-gray-500 text-center">
        Los campos marcados con <span className="text-red-500">*</span> son
        obligatorios
      </div>
    </div>
  );
}
