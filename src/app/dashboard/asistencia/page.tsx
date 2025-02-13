"use client";

import { useState, useEffect } from "react";
import {
  deleteSession,
  getAllSessions,
  getSessionAttendance,
} from "@/lib/api/training";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadIcon, EyeIcon, TrashIcon } from "lucide-react";
import { TrainingSession, Attendee, TSS } from "@/types/training";
import * as QRCode from "qrcode.react";

export default function AsistenciaPage() {
  const [trainingSessions, setTrainingSessions] = useState<TSS[]>([]);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainingSessions();
  }, []);

  const loadTrainingSessions = async () => {
    try {
      const data = await getAllSessions();
      setTrainingSessions(data);
    } catch (error) {
      toast.error("Error al cargar las sesiones");
    } finally {
      setLoading(false);
    }
  };

  const loadAttendees = async (sessionId: string) => {
    try {
      const data = await getSessionAttendance(sessionId);
      setAttendees(data);
    } catch (error) {
      toast.error("Error al cargar los asistentes");
    }
  };

  const exportToCSV = (session: TrainingSession) => {
    const headers = ["Nombre", "Cargo", "Teléfono", "Email", "Fecha y Hora"];
    const data = attendees.map((attendee) => [
      attendee.fullName,
      attendee.role,
      attendee.phone,
      attendee.email,
      format(new Date(attendee.submissionDateTime!), "PPpp", { locale: es }),
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

  const generateQrCodeUrl = (sessionId: string) => {
    return `${window.location.origin}/attendance/${sessionId}`;
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta sesión?")) {
      await deleteSession(sessionId);
      loadTrainingSessions();
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Registro de Asistencia</CardTitle>
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
                <TableRow key={session._id}>
                  <TableCell>
                    {format(new Date(session.date), "PPP", { locale: es })}
                  </TableCell>
                  <TableCell>{session.title}</TableCell>
                  <TableCell>{session.regional}</TableCell>
                  <TableCell>{session.attendeeCount || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedSession(session);
                              loadAttendees(session._id!);
                            }}
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
                              {attendees.map((attendee) => (
                                <TableRow key={attendee.id}>
                                  <TableCell>{attendee.fullName}</TableCell>
                                  <TableCell>{attendee.role}</TableCell>
                                  <TableCell>{attendee.phone}</TableCell>
                                  <TableCell>{attendee.email}</TableCell>
                                  <TableCell>
                                    {format(
                                      new Date(attendee.submissionDateTime!),
                                      "PPpp",
                                      { locale: es }
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => exportToCSV(session)}
                      >
                        <DownloadIcon className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            QR
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                          <DialogHeader>
                            <DialogTitle>QR Code - {session.title}</DialogTitle>
                          </DialogHeader>
                          <div className="flex justify-center">
                            <QRCode.QRCodeSVG
                              value={generateQrCodeUrl(session._id!)}
                              size={200}
                            />
                          </div>
                          <div className="mt-4 text-center">
                            <a
                              href={generateQrCodeUrl(session._id!)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              Ir a la URL
                            </a>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSession(session._id!)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
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
  );
}
