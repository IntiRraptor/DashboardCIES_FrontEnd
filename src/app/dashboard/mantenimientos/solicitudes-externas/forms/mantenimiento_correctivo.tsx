"use client";
import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function MaintenanceForm() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  

  const [time, setTime] = useState<string | undefined>()

  return (
    <form className="space-y-8 max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Llenar Solicitud</h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="date-range">1. Seleccionar fecha o rango de fechas*</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-range"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="time">2. Selecciona la hora</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger id="time">
              <SelectValue placeholder="Hora" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                  {`${hour.toString().padStart(2, '0')}:00`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">3. Llenar Formulario de Mantenimiento Correctivo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Características Equipos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Llenar todos los campos</p>
              <Input placeholder="Código Activo" />
              <Input placeholder="Marca" />
              <Input placeholder="Modelo" />
              <Input placeholder="Serie" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Llenar todos los campos</p>
              <Input placeholder="Tipo Servicio" />
              <Input placeholder="Regional" />
              <Input placeholder="N° Ticket" />
              <p className="text-sm text-muted-foreground">(Autogenerado)</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="repair-cost">Costo de Reparación (Bs)</Label>
          <Input id="repair-cost" type="number" />
        </div>
        <div>
          <Label htmlFor="responsible">Encargado Responsable</Label>
          <Input id="responsible" />
        </div>
      </div>

      <div>
        <Label htmlFor="observations">Observaciones</Label>
        <Textarea id="observations" placeholder="Escriba sus observaciones lo más detallado posible" className="h-32" />
      </div>

      <div>
        <Label htmlFor="life-sheet">Hoja de Vida</Label>
        <Textarea id="life-sheet" placeholder="Por favor escriba todos los detalles del equipo que sean convenientes" className="h-32" />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="font-semibold">FECHA</div>
            <div className="font-semibold">FIRMA</div>
            <div className="font-semibold">OBSERVACIONES</div>
          </div>
          <div className="space-y-4">
            <Input placeholder="FIRMA CONFORMIDAD DE SERVICIO" />
            <Input placeholder="FIRMA RESPONSABLE DE MANTENIMIENTO" />
          </div>
        </CardContent>
      </Card>

      <Button className="w-full">Enviar e Imprimir</Button>
    </form>
  )
}