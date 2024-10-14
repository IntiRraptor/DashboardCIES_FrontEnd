import { z } from "zod"

export const externalRequestSchema = z.object({
  _id: z.string(), // Convertir el ObjectId a string
  nombrePersona: z.string(),
  region: z.string(),
  fechaLlegada: z.string(), // o z.date() si quieres manejarlo como Date
  codigoActivo: z.string(),
  ticket: z.string(),
  estado: z.string(),
  archivos: z.array(z.string()), // Si 'archivos' es un array de strings (rutas de archivos)
})
export type ExternalRequest = z.infer<typeof externalRequestSchema>
