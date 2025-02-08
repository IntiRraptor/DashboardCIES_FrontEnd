"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrainingSession, AttendanceSubmission } from "@/types/attendance";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DownloadIcon, EyeIcon } from "lucide-react";

export default function AsistenciaPage() {
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(
    null
  );

  // TODO: Replace with actual API call
  const trainingSessions: TrainingSession[] = [];

  const exportToCSV = (session: TrainingSession) => {
    const headers = ["Nombre", "Cargo", "Teléfono", "Email", "Fecha y Hora"];
    const data = session.submissions.map((submission) => [
      submission.fullName,
      submission.role,
      submission.phone,
      submission.email,
      format(new Date(submission.submissionDateTime), "PPpp", { locale: es }),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...data.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `asistencia_${session.title}_${format(
        new Date(session.date),
        "yyyy-MM-dd"
      )}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Registro de Asistencia</CardTitle>
            <CardDescription>
              Gestione los registros de asistencia de las capacitaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Regional</TableHead>
                  <TableHead>Participantes</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      {format(new Date(session.date), "PPP", { locale: es })}
                    </TableCell>
                    <TableCell>{session.title}</TableCell>
                    <TableCell>{session.regional}</TableCell>
                    <TableCell>{session.submissions.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedSession(session)}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>
                                Asistentes - {session.title}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Cargo</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Fecha y Hora</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {session.submissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                      <TableCell>{submission.fullName}</TableCell>
                                      <TableCell>{submission.role}</TableCell>
                                      <TableCell>{submission.phone}</TableCell>
                                      <TableCell>{submission.email}</TableCell>
                                      <TableCell>
                                        {format(
                                          new Date(submission.submissionDateTime),
                                          "PPpp",
                                          { locale: es }
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => exportToCSV(session)}
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 