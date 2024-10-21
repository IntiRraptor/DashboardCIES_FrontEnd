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
import logoCies from "../../../public/icon.png";

const formSchema = z.object({
  codigoActivo: z.string().min(1, "El código activo es requerido"),
  marca: z.string().min(1, "La marca es requerida"),
  modelo: z.string().min(1, "El modelo es requerido"),
  serie: z.string().min(1, "La serie es requerida"),
  garantia: z.boolean(),
  tipo: z.enum(["Criocauterio", "Termoablación"]),
  sucursal: z.string().min(1, "La sucursal es requerida"),
  regional: z.string().min(1, "La regional es requerida"),
  inspeccionVisual: z.array(z.object({
    descripcion: z.string(),
    realizado: z.boolean(),
  })),
  inspeccionElectrica: z.array(z.object({
    descripcion: z.string(),
    realizado: z.boolean(),
  })),
  inspeccionFuncional: z.array(z.object({
    descripcion: z.string(),
    realizado: z.boolean(),
  })),
  inspeccionAccesorios: z.object({
    cantidadCabezales: z.string(),
    cantidadBaterias: z.string(),
    cabezales: z.array(z.object({
      modelo: z.string(),
      serie: z.string(),
      recubrimiento: z.boolean(),
      rosca: z.boolean(),
      resistencia: z.boolean(),
      abolladuras: z.boolean(),
    })),
  }),
  observaciones: z.string(),
  firmaOperador: z.string(),
  firmaEncargado: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const YesNoOptions = ({ id, value, onChange }: { id: string, value: boolean, onChange: (value: boolean) => void }) => (
  <div className="flex space-x-4">
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={`${id}-si`}
        name={id}
        checked={value}
        onChange={() => onChange(true)}
        className="radio-input"
      />
      <label htmlFor={`${id}-si`} className="radio-label">Sí</label>
    </div>
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={`${id}-no`}
        name={id}
        checked={!value}
        onChange={() => onChange(false)}
        className="radio-input"
      />
      <label htmlFor={`${id}-no`} className="radio-label">No</label>
    </div>
  </div>
);

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
  const [codigoActivo, setCodigoActivo] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inspeccionVisual: [
        { descripcion: "El equipo presenta daños físicos notables.", realizado: false },
        { descripcion: "Los accesorios presentan daños físicos notables", realizado: false },
      ],
      inspeccionElectrica: [
        { descripcion: "Baterías en buen estado.", realizado: false },
        { descripcion: "Voltaje Batería.", realizado: false },
        { descripcion: "Fusibles en buen estado.", realizado: false },
        { descripcion: "Tipos de Fusibles", realizado: false },
      ],
      inspeccionFuncional: [
        { descripcion: "Encendido e inicialización correcto.", realizado: false },
        { descripcion: "Fugas o derrames presentes.", realizado: false },
        { descripcion: "Temperatura de operación correcta.", realizado: false },
        { descripcion: "Función de enfriamiento adecuada.", realizado: false },
        { descripcion: "Función de calentamiento adecuada.", realizado: false },
        { descripcion: "Función de restablecimiento temp.", realizado: false },
      ],
      inspeccionAccesorios: {
        cantidadCabezales: "1",
        cantidadBaterias: "",
        cabezales: [
          { modelo: "", serie: "", recubrimiento: false, rosca: false, resistencia: false, abolladuras: false },
        ],
      },
    },
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      const details = JSON.parse(initialData.details);
      form.reset(details);
      setCodigoActivo(details.codigoActivo || "");
    }
  }, [initialData, isEditMode, form]);

  useEffect(() => {
    if (!isEditMode) {
      const foundEquipment = findEquipmentByCode(equipment, codigoActivo);
      if (foundEquipment) {
        form.setValue("marca", foundEquipment.nombreaf);
        form.setValue("modelo", foundEquipment.descaf);
        form.setValue("serie", foundEquipment.aux1);
      } else {
        form.setValue("marca", "");
        form.setValue("modelo", "");
        form.setValue("serie", "");
      }
    }
  }, [equipment, codigoActivo, isEditMode, form]);

  useEffect(() => {
    const cantidadCabezales = parseInt(form.watch("inspeccionAccesorios.cantidadCabezales") || "1");
    const cabezalesActuales = form.watch("inspeccionAccesorios.cabezales");
    
    if (cantidadCabezales >= 1 && cantidadCabezales <= 9) {
      const nuevoCabezales = Array(cantidadCabezales).fill(null).map((_, index) => 
        cabezalesActuales[index] || { modelo: "", serie: "", recubrimiento: false, rosca: false, resistencia: false, abolladuras: false }
      );
      form.setValue("inspeccionAccesorios.cabezales", nuevoCabezales);
    }
  }, [form.watch("inspeccionAccesorios.cantidadCabezales")]);

  const handleSubmit = form.handleSubmit((data) => {
    const formData = {
      ...data,
      equipo: codigoActivo,
      tipo: "Preventivo",
      costo: 0,
      estado: "Programado",
      typeForm: "Protocolo de Mantenimiento Criocauterio Termoablación",
      inspeccionAccesorios: {
        ...data.inspeccionAccesorios,
        cabezales: data.inspeccionAccesorios.cabezales.slice(0, parseInt(data.inspeccionAccesorios.cantidadCabezales))
      }
    };
    onSubmit(formData);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-start mb-6">
          <Image src={logoCies} height={50} width={100} alt="Logo de la Compañía" className="h-12 w-auto" />
          <div className="text-center flex-grow">
            <h1 className="text-2xl font-bold">
              COMPROBANTE DE MANTENIMIENTO PREVENTIVO PLANIFICADO CRIOCAUTERIO/TERMOABLACIÓN
            </h1>
          </div>
          <div className="text-right">
            <FormField
              control={form.control}
              name="sucursal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sucursal:</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-40" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regional:</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-40" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <FormField
            control={form.control}
            name="codigoActivo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Activo:</FormLabel>
                <FormControl>
                  <Input {...field} onChange={(e) => {
                    setCodigoActivo(e.target.value);
                    field.onChange(e);
                  }} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marca"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca:</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="modelo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo:</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>N/S:</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="garantia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Garantía:</FormLabel>
                <FormControl>
                  <YesNoOptions id="garantia" value={field.value} onChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo:</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded">
                    <option value="Criocauterio">Criocauterio</option>
                    <option value="Termoablación">Termoablación</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">1. Inspección Visual</h2>
            {form.watch("inspeccionVisual").map((item, index) => (
              <div key={index} className="flex items-center justify-between mb-2">
                <span>{item.descripcion}</span>
                <YesNoOptions
                  id={`inspeccionVisual-${index}`}
                  value={item.realizado}
                  onChange={(value) => form.setValue(`inspeccionVisual.${index}.realizado`, value)}
                />
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">2. Inspección Eléctrica</h2>
            {form.watch("inspeccionElectrica").map((item, index) => (
              <div key={index} className="flex items-center justify-between mb-2">
                <span>{item.descripcion}</span>
                <YesNoOptions
                  id={`inspeccionElectrica-${index}`}
                  value={item.realizado}
                  onChange={(value) => form.setValue(`inspeccionElectrica.${index}.realizado`, value)}
                />
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">3. Inspección Funcional</h2>
            {form.watch("inspeccionFuncional").map((item, index) => (
              <div key={index} className="flex items-center justify-between mb-2">
                <span>{item.descripcion}</span>
                <YesNoOptions
                  id={`inspeccionFuncional-${index}`}
                  value={item.realizado}
                  onChange={(value) => form.setValue(`inspeccionFuncional.${index}.realizado`, value)}
                />
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">4. Inspección Accesorios</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="inspeccionAccesorios.cantidadCabezales"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad de cabezales:</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="1" 
                        max="9"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || (parseInt(value) >= 1 && parseInt(value) <= 9)) {
                            field.onChange(value);
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "" || parseInt(e.target.value) < 1) {
                            field.onChange("1");
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inspeccionAccesorios.cantidadBaterias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad de Baterías</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {form.watch("inspeccionAccesorios.cabezales").map((cabezal, index) => (
              <div key={index} className="border p-4 mb-4 rounded">
                <h3 className="font-semibold mb-2">Cabezal {index + 1}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`inspeccionAccesorios.cabezales.${index}.modelo`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo:</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`inspeccionAccesorios.cabezales.${index}.serie`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>N/S:</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <span>Recubrimiento del cabezal en buen estado</span>
                    <YesNoOptions
                      id={`cabezal-${index}-recubrimiento`}
                      value={cabezal.recubrimiento}
                      onChange={(value) => form.setValue(`inspeccionAccesorios.cabezales.${index}.recubrimiento`, value)}
                    />
                  </div>
                  <div>
                    <span>Rosca y conector sin daños</span>
                    <YesNoOptions
                      id={`cabezal-${index}-rosca`}
                      value={cabezal.rosca}
                      onChange={(value) => form.setValue(`inspeccionAccesorios.cabezales.${index}.rosca`, value)}
                    />
                  </div>
                  <div>
                    <span>Resistencia del cabezal adecuado</span>
                    <YesNoOptions
                      id={`cabezal-${index}-resistencia`}
                      value={cabezal.resistencia}
                      onChange={(value) => form.setValue(`inspeccionAccesorios.cabezales.${index}.resistencia`, value)}
                    />
                  </div>
                  <div>
                    <span>Abolladuras o raspaduras</span>
                    <YesNoOptions
                      id={`cabezal-${index}-abolladuras`}
                      value={cabezal.abolladuras}
                      onChange={(value) => form.setValue(`inspeccionAccesorios.cabezales.${index}.abolladuras`, value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="observaciones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones:</FormLabel>
              <FormControl>
                <textarea {...field} className="w-full p-2 border rounded" rows={4} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4 mt-6">
          <FormField
            control={form.control}
            name="firmaOperador"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firma del Operador:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firmaEncargado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firma del Encargado del Equipo:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="mt-6 text-center">
          <Button type="button" onClick={handleSubmit}>Enviar Formulario de Mantenimiento</Button>
        </div>
      </form>
    </Form>
  );
}

export default PreventivoForm;
