"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CalendarDateRangePicker } from "../dashboard/date-range-picker";
import { toast } from "../ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { createMantenimiento } from "@/lib/apiService";
import { PreventivoForm } from "./preventivo-form";
import FormularioProtocoloMantenimientoAspiradorNebulizador from "./protocolo-mantenimiento-aspirador-nebulizador";
import FormularioMantenimientoEcografo from "./protocolo-mantenimiento-ecografos";
import FormularioMantenimientoColoscopio from "./protocolo-mantenimiento-colposcopio";
import FormularioMantenimientoLaparoscopia from "./protocolo-mantenimiento-laparoscopia";
import FormularioMantenimientoElectrobisturi from "./protocolo-mantenimiento-electrobisturi";
import FormularioMantenimientoMesaQuirurgica from "./protocolo-mantenimiento-mesa";
import FormularioMantenimientoIncubadora from "./protocolo-mantenimiento-incubadora";
import FormularioMantenimientoVentiladorCPAP from "./protocolo-mantenimiento-ventilador";
import FormularioMantenimientoMonitor from "./protocolo-mantenimiento-monitor";
import FormularioMantenimientoAutoclave from "./protocolo-mantenimiento-autoclave";
import { TrainingFormComponent } from "./training-form";
import { EquipmentDetail } from "@/app/dashboard/equipos-medicos/data/schema";
import { CorrectiveMaintenanceFormComponent } from "./corrective-maintenance-form";

// Esquema de validación de Zod
const maintenanceFormSchema = z.object({
  dateRange: z.object({
    from: z.date({
      required_error: "La fecha de inicio es requerida",
    }),
    to: z.date({
      required_error: "La fecha de fin es requerida",
    }),
  }),
  time: z.string({
    required_error: "La hora es requerida",
  }),
  region: z.string({
    required_error: "La región es requerida",
  }),
  maintenanceItems: z
    .array(
      z.object({
        type: z.string({
          required_error: "El tipo de mantenimiento es requerido",
        }),
        model: z.string({
          required_error: "El modelo de formulario es requerido",
        }),
        quantity: z.string({
          required_error: "La cantidad es requerida",
        }),
      })
    )
    .min(1, "Debe agregar al menos un item de mantenimiento"),
});

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

const defaultValues: Partial<MaintenanceFormValues> = {
  maintenanceItems: [{ type: "Preventivo", model: "Ecógrafo", quantity: "1" }],
};

export function MaintenanceScheduleForm({
  equipment,
}: {
  equipment: EquipmentDetail[];
}) {
  const [step, setStep] = useState(1);
  const [formTabs, setFormTabs] = useState<
    { id: string; label: string; type: string; model: string }[]
  >([]);
  const [formDataMap, setFormDataMap] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<string>("");

  const maintenanceTypes = [
    "Preventivo",
    "Correctivo",
    "Instalación",
    "Capacitación",
  ];

  const preventiveFormOptions = [
    "Protocolo de Mantenimiento Aspirador Nebulizador",
    "Protocolo de Mantenimiento Criocauterio Termoablación",
    "Protocolo de Mantenimiento Ecografos",
    "Protocolo de Mantenimiento Video Colposcopio",
    "Protocolo Mantenimiento Torre Laparoscopia",
    "Protocolo de Mantenimiento Electrobisturi",
    "Protocolo de Mantenimiento Mesa QX y Lamp Cialitica",
    "Protocolo de Mantenimiento Incubadora ServoCuna Fototerapia",
    "Protocolo de Mantenimiento MaqAnes Vent CPAP.",
    "Protocolo de Mantenimiento Monitores_Fetal_ECG",
    "Protocolo de Mantenimiento Autoclave",
  ];

  const locations = [
    "LPZ - Tumusla",
    "LPZ - Villa Adela",
    "LPZ - Terminal",
    "LPZ - Chasquipampa",
    "LPZ - Villa Fatima",
    "LPZ - Miraflores",
    "LPZ - San Pedro",
    "Cbba - Uruguay",
    "Cbba - Clínica",
    "SCZ - La Ramada",
    "SCZ - Alemana",
    "TJA - Mercado",
    "La Paz",
    "Tarija",
    "Riberalta",
    "Sucre",
    "Potosi",
    "Uyuni",
    "Oruro",
    "Umosas",
    "Oficina nacional",
    "Ceja",
    "Argentina",
    "El Alto",
    "Umosa",
  ];

  const getFormOptions = (type: string) => {
    console.log("GetFormOptions:", type);
    switch (type) {
      case "Preventivo":
        return preventiveFormOptions;
      case "Correctivo":
        return ["Correctivo 1"];
      case "Instalación":
        return ["Instalación 1"];
      case "Capacitación":
        return ["Capacitación 1"];
      default:
        return [];
    }
  };

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "maintenanceItems",
    control: form.control,
  });

  const generateTabs = (data: MaintenanceFormValues) => {
    const tabs: { id: string; label: string; type: string; model: string }[] =
      [];

    data.maintenanceItems.forEach((item, index) => {
      for (let i = 1; i <= parseInt(item.quantity); i++) {
        let label = `${item.type} ${i}`;

        if (item.type === "Preventivo") {
          // Extraer el nombre del equipo del modelo de formulario
          const equipmentName = item.model
            .replace("Protocolo de Mantenimiento ", "")
            .split(" ")[0];
          label = `${equipmentName} ${i}`;
        }

        tabs.push({
          id: `${item.type}-${index + 1}-${i}`,
          label: label,
          type: item.type,
          model: item.model,
        });
      }
    });

    setFormTabs(tabs);
  };

  const handleTypeChange = (value: string, index: number) => {
    form.setValue(`maintenanceItems.${index}.type`, value);

    if (value === "Capacitación") {
      form.setValue(`maintenanceItems.${index}.model`, "Capacitación 1");
      form.setValue(`maintenanceItems.${index}.quantity`, "1");
    } else if (value === "Preventivo") {
      form.setValue(
        `maintenanceItems.${index}.model`,
        preventiveFormOptions[0]
      );
      form.setValue(`maintenanceItems.${index}.quantity`, "1");
    } else if (value === "Correctivo") {
      form.setValue(`maintenanceItems.${index}.model`, "Correctivo 1");
    } else if (value === "Instalación") {
      form.setValue(`maintenanceItems.${index}.model`, "Instalación 1");
      form.setValue(`maintenanceItems.${index}.quantity`, "1");
    } else {
      form.setValue(`maintenanceItems.${index}.model`, "");
      form.setValue(`maintenanceItems.${index}.quantity`, "");
    }
  };

  const handleFormSubmit = async (formData: any, tabId: string) => {
    const data: MaintenanceFormValues = form.getValues();

    try {
      if (!formData) {
        throw new Error("No se ha enviado ningún formulario");
      }

      const formattedData = {
        tipo: formData.tipo,
        fechaInicio: data.dateRange.from.toISOString(),
        fechaFin: data.dateRange.to.toISOString(),
        hora: data.time,
        region: data.region,
        equipo: formData.equipo,
        estado: formData.estado,
        costo: formData.costo && formData.costo > 0 ? formData.costo : 0,
        details: JSON.stringify(formData),
      };

      const response = await createMantenimiento(formattedData);
      toast({
        title: "Mantenimiento Programado",
        description: "El mantenimiento se ha programado correctamente.",
      });

      setFormTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
      setFormDataMap((prevData) => {
        const newData = { ...prevData };
        delete newData[tabId];
        return newData;
      });

      if (formTabs.length === 1) {
        form.reset(defaultValues);
        setStep(1);
      }
    } catch (error) {
      console.error("Error al programar mantenimiento:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al programar el mantenimiento.",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (tabId: string) => {
    if (activeTab) {
      setFormDataMap((prevData) => ({
        ...prevData,
        [activeTab]: form.getValues(),
      }));
    }
    setActiveTab(tabId);
    form.reset(formDataMap[tabId] || {});
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => handleFormSubmit(data, formTabs[0].id))}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>1. Seleccionar fecha o rango de fechas</FormLabel>
              <FormControl>
                <CalendarDateRangePicker
                  date={{
                    from: field.value?.from || new Date(),
                    to: field.value?.to || null,
                  }}
                  setDate={(newDate) => {
                    field.onChange(newDate);
                    if (newDate?.from && newDate?.to) setStep(2);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {step >= 2 && (
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>2. Selecciona la hora</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setStep(3);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecciona una hora" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                      <SelectItem
                        key={hour}
                        value={`${hour.toString().padStart(2, "0")}:00`}
                      >
                        {`${hour.toString().padStart(2, "0")}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {step >= 3 && (
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>3. Selecciona la ubicación</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setStep(4);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Selecciona una ubicación" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {step >= 4 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <FormLabel>
                4. Selecciona el tipo de mantenimiento, el modelo y la cantidad
                de dicho modelo
              </FormLabel>
              <Button
                type="button"
                onClick={() => generateTabs(form.getValues())}
              >
                Cargar formularios
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Mantenimiento</TableHead>
                  <TableHead>Modelo de Formulario</TableHead>
                  <TableHead>N° Formularios</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`maintenanceItems.${index}.type`}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) =>
                              handleTypeChange(value, index)
                            }
                            value={field.value}
                          >
                            <SelectTrigger className="w-[250px]">
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {maintenanceTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`maintenanceItems.${index}.model`}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-[250px]">
                              <SelectValue placeholder="Modelo" />
                            </SelectTrigger>
                            <SelectContent>
                              {getFormOptions(
                                form.getValues(`maintenanceItems.${index}.type`)
                              ).map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`maintenanceItems.${index}.quantity`}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-[250px]">
                              <SelectValue placeholder="Cantidad" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                        >
                          Eliminar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ type: "", model: "", quantity: "" })}
            >
              Agregar
            </Button>
          </div>
        )}

        {formTabs.length > 0 && (
          <Tabs
            defaultValue={formTabs[0].id}
            onValueChange={handleTabChange}
          >
            <div className="w-full overflow-x-auto">
              <TabsList className="flex-nowrap">
                {formTabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {formTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                {tab.type === "Preventivo" && (
                  <>
                    {tab.model ===
                      "Protocolo de Mantenimiento Aspirador Nebulizador" && (
                      <FormularioProtocoloMantenimientoAspiradorNebulizador
                        equipment={equipment}
                        onSubmit={(data) => handleFormSubmit(data, tab.id)}
                        initialData={formDataMap[tab.id] || []}
                        isEditMode={false}
                        region={form.getValues("region")}
                        ubicacion={form.getValues("region")}
                      />
                    )}
                    {tab.model ===
                      "Protocolo de Mantenimiento Criocauterio Termoablación" && (
                      <PreventivoForm
                        equipment={equipment}
                        onSubmit={(data) => handleFormSubmit(data, tab.id)}
                        initialData={formDataMap[tab.id] || []}
                        isEditMode={false}
                        region={form.getValues("region")}
                        ubicacion={form.getValues("region")}
                      />
                    )}
                    {tab.model === "Protocolo de Mantenimiento Ecografos" && (
                      <FormularioMantenimientoEcografo
                        equipment={equipment}
                        onSubmit={(data) => handleFormSubmit(data, tab.id)}
                        initialData={formDataMap[tab.id] || []}
                        isEditMode={false}
                        region={form.getValues("region")}
                        ubicacion={form.getValues("region")}
                      />
                    )}
                    {tab.model ===
                      "Protocolo de Mantenimiento Video Colposcopio" && (
                      <FormularioMantenimientoColoscopio
                        equipment={equipment}
                        onSubmit={(data) => handleFormSubmit(data, tab.id)}
                        initialData={formDataMap[tab.id] || []}
                        isEditMode={false}
                        region={form.getValues("region")}
                        ubicacion={form.getValues("region")}
                      />
                    )}
                    {tab.model ===
                      "Protocolo Mantenimiento Torre Laparoscopia" && (
                      <FormularioMantenimientoLaparoscopia
                        equipment={equipment}
                        onSubmit={(data) => handleFormSubmit(data, tab.id)}
                        initialData={formDataMap[tab.id] || []}
                        isEditMode={false}
                        region={form.getValues("region")}
                        ubicacion={form.getValues("region")}
                      />
                    )}
                    {tab.model ===
                      "Protocolo de Mantenimiento Electrobisturi" && (
                      <FormularioMantenimientoElectrobisturi
                        equipment={equipment}
                        onSubmit={(data) => handleFormSubmit(data, tab.id)}
                        initialData={formDataMap[tab.id] || []}
                        isEditMode={false}
                        region={form.getValues("region")}
                        ubicacion={form.getValues("region")}
                      />
                    )}
                    {tab.model ===
                      "Protocolo de Mantenimiento Mesa QX y Lamp Cialitica" && (
                      <FormularioMantenimientoMesaQuirurgica
                        equipment={equipment}
                        onSubmit={(data) => handleFormSubmit(data, tab.id)}
                        initialData={formDataMap[tab.id] || []}
                        isEditMode={false}
                        region={form.getValues("region")}
                        ubicacion={form.getValues("region")}
                      />
                    )}
                    {tab.model ===
                      "Protocolo de Mantenimiento Incubadora ServoCuna Fototerapia" && (
                      <FormularioMantenimientoIncubadora
                        equipment={equipment}
                        onSubmit={(data) => handleFormSubmit(data, tab.id)}
                        initialData={formDataMap[tab.id] || []}
                        isEditMode={false}
                        region={form.getValues("region")}
                        ubicacion={form.getValues("region")}
                      />
                    )}
                    {tab.model ===
                      "Protocolo de Mantenimiento MaqAnes Vent CPAP." && (
                      <FormularioMantenimientoVentiladorCPAP
                        equipment={equipment}
                        onSubmit={(data) => handleFormSubmit(data, tab.id)}
                        initialData={formDataMap[tab.id] || []}
                        isEditMode={false}
                        region={form.getValues("region")}
                        ubicacion={form.getValues("region")}
                      />
                    )}
                    {tab.model ===
                      "Protocolo de Mantenimiento Monitores_Fetal_ECG" && (
                      <FormularioMantenimientoMonitor
                        equipment={equipment}
                        onSubmit={(data) => handleFormSubmit(data, tab.id)}
                        initialData={formDataMap[tab.id] || []}
                        isEditMode={false}
                        region={form.getValues("region")}
                        ubicacion={form.getValues("region")}
                      />
                    )}
                    {tab.model === "Protocolo de Mantenimiento Autoclave" && (
                      <FormularioMantenimientoAutoclave
                        equipment={equipment}
                        onSubmit={(data) => handleFormSubmit(data, tab.id)}
                        initialData={formDataMap[tab.id] || []}
                        isEditMode={false}
                        region={form.getValues("region")}
                        ubicacion={form.getValues("region")}
                      />
                    )}
                  </>
                )}
                {tab.type === "Capacitación" && (
                  <TrainingFormComponent
                    equipment={equipment}
                    onSubmit={(data) => handleFormSubmit(data, tab.id)}
                    initialData={formDataMap[tab.id] || []}
                    isEditMode={false}
                    region={form.getValues("region")}
                    ubicacion={form.getValues("region")}
                  />
                )}
                {tab.type === "Correctivo" && (
                  <CorrectiveMaintenanceFormComponent
                    equipment={equipment}
                    onSubmit={(data) => handleFormSubmit(data, tab.id)}
                    initialData={formDataMap[tab.id] || []}
                    isEditMode={false}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </form>
    </Form>
  );
}
