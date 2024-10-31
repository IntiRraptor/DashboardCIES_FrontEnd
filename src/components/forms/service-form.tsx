"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { findEquipmentByCode } from "@/utils/equipmentUtils";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";

interface ServiceFormProps {
  equipment: EquipmentDetail[];
  initialData: {
    codigoActivo: string;
    regional: string;
    nombrePersona: string;
    ticket: string;
    observaciones: string;
  };
  onSubmit: (data: any) => void;
}

export default function ServiceForm({
  equipment,
  initialData,
  onSubmit,
}: ServiceFormProps) {
  const [formData, setFormData] = useState({
    codigoActivo: initialData.codigoActivo || "",
    marca: "",
    modelo: "",
    serie: "",
    tipoServicio: "",
    regional: initialData.regional || "",
    numeroTicket: initialData.ticket || "",
    costoReparacion: "",
    encargadoResponsable: initialData.nombrePersona || "",
    observaciones: initialData.observaciones || "",
    hojaVida: "",
    fecha: format(new Date(), "yyyy-MM-dd"),
    firma: "",
    firmaConformidad: "",
    firmaMantenimiento: "",
    observacionesFirma: "",
  });

  useEffect(() => {
    if (formData.codigoActivo) {
      const foundEquipment = findEquipmentByCode(
        equipment,
        formData.codigoActivo
      );
      if (foundEquipment) {
        setFormData((prev) => ({
          ...prev,
          marca: foundEquipment.nombreaf || "",
          modelo: foundEquipment.descaf || "",
          serie: foundEquipment.aux1 || "",
        }));
      }
    }
  }, [equipment, formData.codigoActivo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container mx-auto p-4 space-y-6 max-w-4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Características Equipos */}
        <Card>
          <CardHeader>
            <CardTitle>Características Equipos</CardTitle>
            <p className="text-sm text-muted-foreground">
              Llenar todos los campos
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codigoActivo">Código Activo</Label>
              <Input
                id="codigoActivo"
                value={formData.codigoActivo}
                onChange={(e) =>
                  setFormData({ ...formData, codigoActivo: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={formData.marca}
                onChange={(e) =>
                  setFormData({ ...formData, marca: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={formData.modelo}
                onChange={(e) =>
                  setFormData({ ...formData, modelo: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serie">Serie</Label>
              <Input
                id="serie"
                value={formData.serie}
                onChange={(e) =>
                  setFormData({ ...formData, serie: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Servicio */}
        <Card>
          <CardHeader>
            <CardTitle>Servicio</CardTitle>
            <p className="text-sm text-muted-foreground">
              Llenar todos los campos
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipoServicio">Tipo Servicio</Label>
              <Input
                id="tipoServicio"
                value={formData.tipoServicio}
                onChange={(e) =>
                  setFormData({ ...formData, tipoServicio: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regional">Regional</Label>
              <Input
                id="regional"
                value={formData.regional}
                onChange={(e) =>
                  setFormData({ ...formData, regional: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroTicket">N° Ticket (Autogenerado)</Label>
              <Input
                id="numeroTicket"
                value={formData.numeroTicket}
                onChange={(e) =>
                  setFormData({ ...formData, numeroTicket: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Costo y Encargado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="costoReparacion">Costo de Reparación (Bs)</Label>
              <Input
                id="costoReparacion"
                type="number"
                value={formData.costoReparacion}
                onChange={(e) =>
                  setFormData({ ...formData, costoReparacion: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="encargadoResponsable">
                Encargado Responsable
              </Label>
              <Input
                id="encargadoResponsable"
                value={formData.encargadoResponsable}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    encargadoResponsable: e.target.value,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observaciones y Hoja de Vida */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              placeholder="Escribe sus observaciones lo más detallado posible"
              className="min-h-[100px]"
              value={formData.observaciones}
              onChange={(e) =>
                setFormData({ ...formData, observaciones: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hojaVida">Hoja de Vida</Label>
            <Textarea
              id="hojaVida"
              placeholder="Por favor escribe todos los detalles del equipo que sean convenientes"
              className="min-h-[100px]"
              value={formData.hojaVida}
              onChange={(e) =>
                setFormData({ ...formData, hojaVida: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Firmas */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">FECHA</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) =>
                  setFormData({ ...formData, fecha: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firma">FIRMA</Label>
              <Input
                id="firma"
                value={formData.firma}
                onChange={(e) =>
                  setFormData({ ...formData, firma: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacionesFirma">OBSERVACIONES</Label>
              <Input
                id="observacionesFirma"
                value={formData.observacionesFirma}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    observacionesFirma: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="firmaConformidad">
                FIRMA CONFORMIDAD DE SERVICIO
              </Label>
              <Input
                id="firmaConformidad"
                value={formData.firmaConformidad}
                onChange={(e) =>
                  setFormData({ ...formData, firmaConformidad: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firmaMantenimiento">
                FIRMA RESPONSABLE DE MANTENIMIENTO
              </Label>
              <Input
                id="firmaMantenimiento"
                value={formData.firmaMantenimiento}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    firmaMantenimiento: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Enviar e Imprimir
        </Button>
      </div>
    </form>
  );
}
