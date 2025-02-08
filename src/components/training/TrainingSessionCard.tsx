import { TrainingSession } from "@/types/training";
import { StatusBadge } from "./StatusBadge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { QRCodeSVG } from "qrcode.react";
import { PencilIcon, TrashIcon, UsersIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface TrainingSessionCardProps {
  session: TrainingSession;
  onDelete?: (id: string) => void;
}

export function TrainingSessionCard({ session, onDelete }: TrainingSessionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{session.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {format(new Date(session.date), "PPP", { locale: es })}
            </p>
          </div>
          <StatusBadge status={session.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Regional</p>
            <p>{session.regional}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tipo de Servicio</p>
            <p>{session.serviceType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Equipo Médico</p>
            <p>{session.medicalEquipment}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Marca/Modelo</p>
            <p>{session.brand} / {session.model}</p>
          </div>
        </div>

        {session.qrCodeUrl && (
          <div className="flex justify-center pt-4">
            <div className="flex flex-col items-center space-y-2">
              <QRCodeSVG value={session.qrCodeUrl} size={150} />
              <p className="text-sm text-muted-foreground">
                Escanee para registrar asistencia
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Link href={`/training-sessions/${session.id}/edit`} passHref>
            <Button variant="outline" size="sm">
              <PencilIcon className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Link href={`/training-sessions/${session.id}/attendance`} passHref>
            <Button variant="outline" size="sm">
              <UsersIcon className="h-4 w-4 mr-2" />
              Asistencia
            </Button>
          </Link>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(session.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 