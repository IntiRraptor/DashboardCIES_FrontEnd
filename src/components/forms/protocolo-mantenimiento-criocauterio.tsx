"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

// Componente reutilizable para opciones de "Sí" y "No"
const YesNoOptions = ({ id, defaultValue }: { id: string, defaultValue: string }) => (
  <div className="flex space-x-4">
    <div className="flex items-center space-x-2">
      <input type="radio" id={`${id}-si`} name={id} value="si" defaultChecked={defaultValue === "si"} />
      <label htmlFor={`${id}-si`}>Sí</label>
    </div>
    <div className="flex items-center space-x-2">
      <input type="radio" id={`${id}-no`} name={id} value="no" defaultChecked={defaultValue === "no"} />
      <label htmlFor={`${id}-no`}>No</label>
    </div>
  </div>
);

export default function FormularioMantenimiento() {
  const [tipoEquipo, setTipoEquipo] = useState("criocauterio");

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          {/* Uso de Next.js Image para optimizar la imagen */}
          <Image src="/placeholder.svg" alt="Logo CIES" width={50} height={50} className="h-12 w-auto mr-4" />
          <h1 className="text-xl font-bold">COMPROBANTE DE MANTENIMIENTO PREVENTIVO PLANIFICADO</h1>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <Label htmlFor="vigencia">VIGENCIA DESDE: 30/10/2018</Label>
          </div>
          <div className="mb-2">
            <Label htmlFor="lugar">Lugar:</Label>
            <Input id="lugar" className="w-40" />
          </div>
          <div>
            <Label htmlFor="fecha">Fecha:</Label>
            <Input id="fecha" type="date" className="w-40" />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">CRIOCAUTERIO/TERMOABLACIÓN</h2>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">DATOS DEL EQUIPO:</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="codigoActivo">Código de Activo:</Label>
            <Input id="codigoActivo" />
          </div>
          <div>
            <Label htmlFor="marca">Marca:</Label>
            <Input id="marca" />
          </div>
          <div>
            <Label htmlFor="modelo">Modelo:</Label>
            <Input id="modelo" />
          </div>
          <div>
            <Label htmlFor="ns">N/S:</Label>
            <Input id="ns" />
          </div>
          <div>
            <Label>Garantía:</Label>
            <YesNoOptions id="garantia" defaultValue="no" />
          </div>
          <div>
            <Label>Tipo:</Label>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="criocauterio"
                  name="tipoEquipo"
                  value="criocauterio"
                  checked={tipoEquipo === "criocauterio"}
                  onChange={() => setTipoEquipo("criocauterio")}
                />
                <label htmlFor="criocauterio">Criocauterio</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="termoablacion"
                  name="tipoEquipo"
                  value="termoablacion"
                  checked={tipoEquipo === "termoablacion"}
                  onChange={() => setTipoEquipo("termoablacion")}
                />
                <label htmlFor="termoablacion">Termoablación</label>
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="sucursal">Sucursal:</Label>
            <Input id="sucursal" />
          </div>
          <div>
            <Label htmlFor="regional">Regional:</Label>
            <Input id="regional" />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">OBSERVACIONES:</h2>
        <Textarea placeholder="Ingrese sus observaciones aquí" className="w-full h-24" />
      </section>

      <section className="flex justify-between">
        <div className="w-1/2 pr-2">
          <Label htmlFor="firmaOperador">Firma del Operador:</Label>
          <Input id="firmaOperador" className="mt-1" />
        </div>
        <div className="w-1/2 pl-2">
          <Label htmlFor="firmaEncargado">Firma del Encargado del Equipo:</Label>
          <Input id="firmaEncargado" className="mt-1" />
        </div>
      </section>

      <div className="mt-6 text-center">
        <Button type="submit">Enviar Formulario de Mantenimiento</Button>
      </div>
    </div>
  );
}
