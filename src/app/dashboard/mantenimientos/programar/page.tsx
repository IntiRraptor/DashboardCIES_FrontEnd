import { MaintenanceScheduleForm } from "@/components/forms/maintenance-schedule-form";
import { getEquipment } from "@/lib/apiService";

export default async function MaintenanceSchedulePage() {
  const equipment = await getEquipment()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Programar Mantenimiento</h1>
      <MaintenanceScheduleForm equipment={equipment} />
    </div>
  );
}
