"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { useState } from "react";
import { createMantenimiento } from "@/lib/apiService";  // Importar la función del servicio
import React from "react";

// Esquema de validación de Zod
const formSchema = z.object({
    trainingDate: z.string({
      required_error: "La fecha de capacitación es requerida",
    }),
    region: z.string({
      required_error: "La región es requerida",
    }),
    serviceType: z.string({
      required_error: "El tipo de servicio es requerido",
    }),
    trainingTitle: z.string({
      required_error: "El título de capacitación es requerido",
    }),
    medicalEquipment: z.string({
      required_error: "El equipo médico es requerido",
    }),
    brand: z.string({
      required_error: "La marca es requerida",
    }),
    model: z.string({
      required_error: "El modelo es requerido",
    }),
    series: z.string({
      required_error: "La serie es requerida",
    }),
    participants: z.array(
      z.object({
        email: z.string({
          required_error: "El correo es requerido",
        }).email("Debe ser un correo válido"),
        name: z.string({
          required_error: "El nombre es requerido",
        }),
      })
    ),
  });

type FormValues = z.infer<typeof formSchema>;

export function MaintenanceTrainingForm() {
  const [url, setUrl] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    name: "participants",
    control: form.control,
  });

  async function onSubmit(data: FormValues) {
    try {
      // Aquí podrías hacer algo con los datos antes de enviarlos
      const response = await createMantenimiento(data);
      setUrl("forms.google.com/39428Cies/capacitación/elalto");
      toast({
        title: "Formulario enviado",
        description: "Los datos se han guardado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar los datos.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="trainingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de capacitación</FormLabel>
                <FormControl>
                  <Input placeholder="Fecha de capacitación" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regional</FormLabel>
                <FormControl>
                  <Input placeholder="Regional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Servicio</FormLabel>
                <FormControl>
                  <Input placeholder="Tipo de Servicio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trainingTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título de capacitación</FormLabel>
                <FormControl>
                  <Input placeholder="Título de capacitación" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="medicalEquipment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipo médico</FormLabel>
                <FormControl>
                  <Input placeholder="Equipo médico" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Marca" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <FormControl>
                  <Input placeholder="Modelo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="series"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serie</FormLabel>
                <FormControl>
                  <Input placeholder="Serie" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <FormLabel>Datos para Generar URL de asistencia de participantes</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <FormField
                  control={form.control}
                  name={`participants.${index}.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Correo Electrónico" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`participants.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" onClick={() => append({ email: "", name: "" })}>
            Añadir otro campo
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Button type="submit">Generar URL</Button>
          {url && (
            <span>
              URL:{" "}
              <a href={url} className="text-blue-600">
                {url}
              </a>
            </span>
          )}
        </div>
      </form>
    </Form>
  );
}
