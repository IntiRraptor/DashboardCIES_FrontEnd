"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

const ActionButton = ({ actionValue }: { actionValue: string }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    if (mounted) {
      // Redirigir a la página de mantenimiento_correctivo
      router.push("/dashboard/mantenimientos/solicitudes-externas/forms/mantenimiento_correctivo");
    }
  };

  return (
    <Button variant="link" className="p-0" onClick={handleClick}>
      {actionValue ? actionValue : "Gestionar"}
    </Button>
  );
};

export default ActionButton;
