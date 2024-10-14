"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { findEquipmentByCode } from "@/utils/equipmentUtils";

export function TrainingFormComponent({
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
  const [formData, setFormData] = useState({
    date: "",
    regional: "",
    serviceType: "",
    trainingTitle: "",
    medicalEquipment: "",
    brand: "",
    model: "",
    series: "",
  });

  const [dynamicFields, setDynamicFields] = useState<
    { id: number; name: string; value: string }[]
  >([]);
  const [nextId, setNextId] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicFieldChange = (id: number, value: string) => {
    setDynamicFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };

  const addDynamicField = () => {
    setDynamicFields((prev) => [
      ...prev,
      { id: nextId, name: `Campo ${nextId}`, value: "" },
    ]);
    setNextId((prev) => prev + 1);
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
    if (isEditMode) {
      const details = JSON.parse(initialData.details);
      setFormData({
        date: details.date || "",
        regional: details.regional || "",
        serviceType: details.serviceType || "",
        trainingTitle: details.trainingTitle || "",
        medicalEquipment: details.medicalEquipment || "",
        brand: details.brand || "",
        model: details.model || "",
        series: details.series || "",
      });
      setDynamicFields(
        details.dynamicFields.map((value: string, index: number) => ({
          id: index + 1,
          name: `Campo ${index + 1}`,
          value,
        }))
      );
      setNextId(details.dynamicFields.length + 1);
    }
  }, [initialData, isEditMode]);

  const handleSubmit = () => {
    const data = {
      ...formData,
      tipo: "Capacitación",
      typeForm: "Capacitacion",
      equipo: formData.medicalEquipment,
      estado: "Programado",
      dynamicFields: dynamicFields.map((field) => field.value),
    };

    console.log("data: ", data);

    onSubmit(data);
  };

  const createGoogleForm = () => {
    // setLoading(true);
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regional">Regional</Label>
              <Input
                id="regional"
                name="regional"
                value={formData.regional}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Tipo de Servicio</Label>
              <Input
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingTitle">Título de capacitación</Label>
              <Input
                id="trainingTitle"
                name="trainingTitle"
                value={formData.trainingTitle}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalEquipment">Equipo médico</Label>
              <Input
                id="medicalEquipment"
                name="medicalEquipment"
                value={formData.medicalEquipment}
                onChange={handleInputChange}
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

      {!isEditMode && (
        <Card>
          <CardHeader>
            <CardTitle>
              Datos para Generar URL de asistencia de participantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dynamicFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={`dynamic-${field.id}`}>{field.name}</Label>
                <Input
                  id={`dynamic-${field.id}`}
                  value={field.value}
                  onChange={(e) =>
                    handleDynamicFieldChange(field.id, e.target.value)
                  }
                  placeholder="Valor del campo"
                />
              </div>
            ))}
            <div className="flex space-x-4">
              <Button type="button" onClick={addDynamicField}>
                Añadir otro campo
              </Button>
              <Button
                type="button"
                onClick={createGoogleForm}
                disabled={loading}
              >
                {loading ? "Creando..." : "Generar URL"}
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
            En fecha <span className="font-semibold">{formData.date}</span> en
            la Regional de{" "}
            <span className="font-semibold">{formData.regional}</span> Servicio
            de <span className="font-semibold">{formData.serviceType}</span> se
            efectuará la capacitación de{" "}
            <span className="font-semibold">{formData.trainingTitle}</span> del
            equipo médico{" "}
            <span className="font-semibold">{formData.medicalEquipment}</span>{" "}
            de Marca <span className="font-semibold">{formData.brand}</span>{" "}
            Modelo <span className="font-semibold">{formData.model}</span> Serie{" "}
            <span className="font-semibold">{formData.series}</span>.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Por favor confirmar su participación ingresando a la siguiente URL y
            llenar los datos correspondientes.
          </p>
        </CardContent>
      </Card>

      <Button type="button" onClick={handleSubmit} disabled={loading}>
        {loading ? "Creando..." : isEditMode ? "Actualizar" : "Guardar"}
      </Button>
    </div>
  );
}
