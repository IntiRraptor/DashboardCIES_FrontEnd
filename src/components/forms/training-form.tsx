"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { findEquipmentByCode } from "@/utils/equipmentUtils";
import * as QRCode from "qrcode.react";
import { createSession } from "@/lib/api/training";
import { toast } from "react-hot-toast";

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
    title: initialData?.title || "",
    date: initialData?.date || "",
    regional: initialData?.regional || "",
    serviceType: initialData?.serviceType || "",
    medicalEquipment: initialData?.medicalEquipment || "",
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    series: initialData?.series || "",
  });

  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) newErrors.title = "El título es requerido";
    if (!formData.date) newErrors.date = "La fecha es requerida";
    if (!formData.regional) newErrors.regional = "La regional es requerida";
    if (!formData.serviceType) newErrors.serviceType = "El tipo de servicio es requerido";
    if (!formData.medicalEquipment) newErrors.medicalEquipment = "El equipo es requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const foundEquipment = findEquipmentByCode(equipment, formData.medicalEquipment);
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    try {
      setLoading(true);

      // Primero creamos los datos del mantenimiento
      const maintenanceData = {
        ...formData,
        tipo: "Capacitación",
        equipo: formData.medicalEquipment,
        estado: "Programado",
        region: region,
        ubicacion: ubicacion,
        costo: 0,
        typeForm: "Formulario de Capacitación",
      };

      // Enviamos los datos del mantenimiento
      onSubmit(maintenanceData);

      // Luego creamos la sesión de capacitación
      const response = await createSession(formData);
      
      if (response) {
        toast.success("Capacitación creada exitosamente");
      }
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
              <Label htmlFor="title" className="flex items-center">
                Título de capacitación <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center">
                Fecha <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
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
                <p className="text-red-500 text-sm">{errors.medicalEquipment}</p>
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
              <Input id="series" name="series" value={formData.series} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

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
