import { z } from "zod";

export const maintenanceSchema = z.object({
  _id: z.string(),
  type: z.enum(["Preventivo", "Correctivo", "Instalación", "Capacitación"]),
  regional: z.string(),
  date: z.string(),
  fechaInicio: z.string(),
  fechaFin: z.string(),
  assetCode: z.string(),
  repairCost: z.string(),
  status: z.string(),
  tipo: z.string(),
  typeForm: z.string(),
  details: z.any(),
});

export type Maintenance = z.infer<typeof maintenanceSchema>;

export const trainingFormSchema = z.object({
  date: z.string().nonempty("La fecha es requerida"),
  regional: z.string().nonempty("La regional es requerida"),
  serviceType: z.string().nonempty("El tipo de servicio es requerido"),
  trainingTitle: z.string().nonempty("El título de capacitación es requerido"),
  medicalEquipment: z.string().nonempty("El equipo médico es requerido"),
  brand: z.string().nonempty("La marca es requerida"),
  model: z.string().nonempty("El modelo es requerido"),
  series: z.string().nonempty("La serie es requerida"),
  dynamicFields: z
    .array(
      z.object({
        id: z.number(),
        name: z.string().nonempty("El nombre del campo es requerido"),
        value: z.string().nonempty("El valor del campo es requerido"),
      })
    )
    .min(1, "Debe agregar al menos un campo dinámico"),
});

export type TrainingForm = z.infer<typeof trainingFormSchema>;
