"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { findEquipmentByCode } from "@/utils/equipmentUtils";

// Esquema de validación de Zod
const formSchema = z.object({
  codigoActivo: z.string({
    required_error: "El código activo es requerido",
  }),
  marca: z.string({
    required_error: "La marca es requerida",
  }),
  modelo: z.string({
    required_error: "El modelo es requerido",
  }),
  serie: z.string({
    required_error: "La serie es requerida",
  }),
  tipoServicio: z.string({
    required_error: "El tipo de servicio es requerido",
  }),
  region: z.string({
    required_error: "La región es requerida",
  }),
  nroInventario: z.string({
    required_error: "El número de inventario es requerido",
  }),
  servicioUbicacion: z.string({
    required_error: "El servicio/ubicación es requerido",
  }),
  inspecciones: z.array(
    z.object({
      descripcion: z.string(),
      realizado: z.boolean(),
      observacion: z.string().optional(),
    })
  ),
  conexionesEspeciales: z.object({
    oxigeno: z.boolean(),
    aireMedicional: z.boolean(),
    vacio: z.boolean(),
  }),
  codigo: z.string({
    required_error: "El código es requerido",
  }),
  ubicacion: z.string({
    required_error: "La ubicación es requerida",
  }),
  observaciones: z.string().optional(),
  hojaDeVida: z.array(
    z.object({
      fecha: z.string({
        required_error: "La fecha es requerida",
      }),
      firmaConformidad: z.string().optional(),
      firmaResponsable: z.string().optional(),
      observaciones: z.string().optional(),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

export function PreventivoForm({
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

  useEffect(() => {
    if (isEditMode) {
      const details = JSON.parse(initialData.details);
      const foundEquipment = findEquipmentByCode(equipment, details.equipo);

      setCodigoActivo(details.equipo || "");
      setMarca(foundEquipment?.nombreaf || "");
      setModelo(foundEquipment?.descaf || "");
      setNumeroSerie(foundEquipment?.aux1 || "");
      form.setValue("inspecciones", details.inspecciones || []);
      form.setValue("conexionesEspeciales", details.conexionesEspeciales || {});
      form.setValue("hojaDeVida", details.hojaDeVida || []);
      form.setValue("ubicacion", details.ubicacion || "");
      form.setValue("observaciones", details.observaciones || "");
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      inspecciones: [{ descripcion: "", realizado: false, observacion: "" }],
      conexionesEspeciales: {
        oxigeno: false,
        aireMedicional: false,
        vacio: false,
      },
      hojaDeVida: [
        {
          fecha: "",
          firmaConformidad: "",
          firmaResponsable: "",
          observaciones: "",
        },
      ],
    },
  });

  const handlePrint = (formData: any) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Informe de Mantenimiento Preventivo</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Informe de Mantenimiento Preventivo</h1>
            <table>
              <tr><th>Ubicación</th><td>${formData.ubicacion}</td></tr>
              <tr><th>Fecha</th><td>${formData.fecha}</td></tr>
              <tr><th>Tipo</th><td>${formData.tipo}</td></tr>
              <tr><th>Equipo</th><td>${formData.equipo}</td></tr>
              <tr><th>Costo</th><td>${formData.costo}</td></tr>
              <tr><th>Estado</th><td>${formData.estado}</td></tr>
              <tr><th>Inspección General</th><td>${formData.inspeccionGeneral
                .map(
                  (insp) => `${insp.descripcion}: ${insp.observacion || "N/A"}`
                )
                .join("<br>")}</td></tr>
              <tr><th>Conexiones Especiales</th><td>Oxígeno: ${
                formData.conexionesEspeciales.oxigeno ? "Sí" : "No"
              }, Aire Medicinal: ${
        formData.conexionesEspeciales.aireMedicional ? "Sí" : "No"
      }, Vacío: ${formData.conexionesEspeciales.vacio ? "Sí" : "No"}</td></tr>
              <tr><th>Hoja de Vida</th><td>${formData.hojaDeVida
                .map(
                  (entry) =>
                    `Fecha: ${entry.fecha}, Firma Conformidad: ${
                      entry.firmaConformidad || "N/A"
                    }, Firma Responsable: ${entry.firmaResponsable || "N/A"}`
                )
                .join("<br>")}</td></tr>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSubmit = () => {
    const formData = {
      ubicacion: form.getValues("ubicacion"),
      fecha: form.getValues("hojaDeVida")[0]?.fecha || "",
      tipo: "Preventivo",
      equipo: codigoActivo,
      costo: 0,
      estado: "Programado",
      inspeccionGeneral: form.getValues("inspecciones").map((insp) => ({
        descripcion: insp.descripcion,
        observacion: insp.observacion,
      })),
      typeForm: "Protocolo de Mantenimiento Criocauterio Termoablación",
      conexionesEspeciales: form.getValues("conexionesEspeciales"),
      hojaDeVida: form.getValues("hojaDeVida").map((entry) => ({
        fecha: entry.fecha,
        firmaConformidad: entry.firmaConformidad,
        firmaResponsable: entry.firmaResponsable,
      })),
    };
    onSubmit(formData);
    handlePrint(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Image
            src="/placeholder.svg"
            height={50}
            width={100}
            alt="Logo de la Compañía"
            className="h-12 w-auto"
          />
        </div>
        <div className="text-center flex-grow">
          <h1 className="text-2xl font-bold">
            RECIBO DE MANTENIMIENTO PREVENTIVO PLANIFICADO
          </h1>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <Label htmlFor="ubicacion">Ubicación:</Label>
            <Input
              id="ubicacion"
              className="w-40"
              value={form.getValues("ubicacion")}
              onChange={(e) => form.setValue("ubicacion", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fecha">Fecha:</Label>
            <Input
              id="fecha"
              type="date"
              className="w-40"
              value={form.getValues("hojaDeVida")[0]?.fecha || ""}
              onChange={(e) =>
                form.setValue("hojaDeVida.0.fecha", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Sección de Características del Equipo y Servicio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="codigoActivo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código Activo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Código Activo"
                  value={codigoActivo}
                  onChange={(e) => setCodigoActivo(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="marca"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca</FormLabel>
              <FormControl>
                <Input id="marca" value={marca} readOnly placeholder="Marca" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="modelo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <FormControl>
                <Input
                  id="modelo"
                  value={modelo}
                  readOnly
                  placeholder="Modelo"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serie</FormLabel>
              <FormControl>
                <Input
                  id="serie"
                  value={numeroSerie}
                  readOnly
                  placeholder="Serie"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Sección de Inspección General */}
      <div className="space-y-6">
        <FormLabel>Inspección General y Observaciones</FormLabel>
        {form.watch("inspecciones")?.map((_, index) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name={`inspecciones.${index}.descripcion`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Descripción" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`inspecciones.${index}.realizado`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`inspecciones.${index}.observacion`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Observación" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>

      {/* Sección de Conexiones Especiales */}
      <div className="space-y-6">
        <FormLabel>Conexiones Especiales</FormLabel>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="conexionesEspeciales.oxigeno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Oxígeno</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="conexionesEspeciales.aireMedicional"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aire Medicinal</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="conexionesEspeciales.vacio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vacío</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Sección de Hoja de Vida */}
      <div className="space-y-6">
        <FormLabel>Hoja de Vida</FormLabel>
        <div className="grid grid-cols-4 gap-4">
          {form.watch("hojaDeVida")?.map((_, index) => (
            <div key={index} className="space-y-2">
              <FormField
                control={form.control}
                name={`hojaDeVida.${index}.fecha`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input placeholder="Fecha" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`hojaDeVida.${index}.firmaConformidad`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firma Conformidad</FormLabel>
                    <FormControl>
                      <Input placeholder="Firma" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`hojaDeVida.${index}.firmaResponsable`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firma Responsable</FormLabel>
                    <FormControl>
                      <Input placeholder="Firma" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botón Final */}
      <div className="flex justify-end">
        <Button type="button" onClick={handleSubmit}>
          Guardar e Imprimir
        </Button>
      </div>
    </div>
  );
}

export default PreventivoForm;