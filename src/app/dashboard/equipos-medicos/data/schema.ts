import { z } from "zod"

export const equipmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  model: z.string(),
  assetCode: z.string(),
  category: z.string(),
})

export type Equipment = z.infer<typeof equipmentSchema>

export const equipmentDetailSchema = z.object({
  codigoaf: z.string(),
  codigoaf1: z.string(),
  codigoaf2: z.string().nullable(),
  nombreaf: z.string(),
  descaf: z.string(),
  aux1: z.string(),
})

export type EquipmentDetail = z.infer<typeof equipmentDetailSchema>
