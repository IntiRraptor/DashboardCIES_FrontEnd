import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";

export function findEquipmentByCode(
  equipment: EquipmentDetail[],
  codigoAct: string
): EquipmentDetail | null {
  return equipment.find(
    (equipo) => equipo.codigoaf === codigoAct.toString()
  ) || null;
}
