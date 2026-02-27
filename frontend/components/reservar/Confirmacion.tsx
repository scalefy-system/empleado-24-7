"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import Button from "@/components/ui/Button";
import { Turno } from "@/lib/tipos";

interface Props {
  turno: Turno;
  onVolver: () => void;
}

export default function Confirmacion({ turno, onVolver }: Props) {
  const fechaFormateada = format(parse(turno.fecha, "yyyy-MM-dd", new Date()), "EEEE d 'de' MMMM", { locale: es });

  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/15 mb-6">
        <Check className="w-12 h-12 text-success" />
      </div>

      <h2 className="font-serif text-4xl text-charcoal mb-6">
        ¡Turno confirmado!
      </h2>

      <div className="max-w-md mx-auto bg-cream-dark rounded-card p-6 mb-8 text-left">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray">Servicio:</span>
            <span className="text-charcoal font-medium">{turno.servicio}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray">Fecha:</span>
            <span className="text-charcoal font-medium capitalize">{fechaFormateada}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray">Hora:</span>
            <span className="text-charcoal font-medium">{turno.hora}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray">Cliente:</span>
            <span className="text-charcoal font-medium">{turno.clienteNombre}</span>
          </div>
        </div>
      </div>

      <p className="text-gray mb-8">
        Te esperamos el {fechaFormateada} a las {turno.hora}. ¡Gracias por elegirnos!
      </p>

      <Link href="/">
        <Button onClick={onVolver}>Volver al inicio</Button>
      </Link>
    </div>
  );
}
