// Define el esquema de validación basado en los datos que recibes
import { z } from "zod";

// Define el esquema de validación basado en los datos que recibes
export const equipmentSchema = z.object({
  codigoaf: z.string(),
  codigoaf1: z.string().nullable(), // Puede ser null
  codigoaf2: z.string().nullable(), // Puede ser null
  nombreaf: z.string(), // Debería ser string según los datos
  descaf: z.string(), // Debería ser string según los datos
  aux1: z.string(), // También parece ser string, pero verifica si puede ser null
});