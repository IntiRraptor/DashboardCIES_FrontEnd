"use client";
  
import { EquipmentDetail } from "../../equipos-medicos/data/schema";
import { MaintenanceScheduleForm } from "@/components/forms/maintenance-schedule-form";
import { getEquipment } from "@/lib/apiService";
import { useEffect, useState } from "react";

export default function MaintenanceSchedulePage() {
  const [equipment, setEquipment] = useState<EquipmentDetail[]>([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      const data = await getEquipment();
      setEquipment(data);
    };

    fetchEquipment();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Programar Mantenimiento</h1>
      <MaintenanceScheduleForm equipment={equipment} />
    </div>
  );
}
