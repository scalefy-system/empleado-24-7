"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StepperHeader from "@/components/reservar/StepperHeader";
import PasoServicio from "@/components/reservar/PasoServicio";
import PasoFechaHora from "@/components/reservar/PasoFechaHora";
import PasoDatosCliente from "@/components/reservar/PasoDatosCliente";
import Confirmacion from "@/components/reservar/Confirmacion";
import { ToastProvider } from "@/components/ui/Toast";
import { Servicio, Turno } from "@/lib/tipos";
import { SERVICIOS } from "@/lib/constantes";

function ReservarContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null);
  const [fecha, setFecha] = useState<string>("");
  const [hora, setHora] = useState<string>("");
  const [turnoConfirmado, setTurnoConfirmado] = useState<Turno | null>(null);

  useEffect(() => {
    const servicioId = searchParams.get("servicio");
    if (servicioId) {
      const servicio = SERVICIOS.find((s: Servicio) => s.id === servicioId);
      if (servicio) {
        setServicioSeleccionado(servicio);
      }
    }
  }, [searchParams]);

  const handleServicioSelect = (servicio: Servicio) => {
    setServicioSeleccionado(servicio);
  };

  const handleFechaHoraSelect = (fecha: string, hora: string) => {
    setFecha(fecha);
    setHora(hora);
  };

  const handleConfirmarTurno = (turno: Turno) => {
    setTurnoConfirmado(turno);
    setStep(4);
  };

  const handleVolver = () => {
    setStep(1);
    setServicioSeleccionado(null);
    setFecha("");
    setHora("");
    setTurnoConfirmado(null);
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <StepperHeader step={step} />

          {step === 1 && (
            <PasoServicio
              servicioSeleccionado={servicioSeleccionado}
              onSelect={handleServicioSelect}
              onSiguiente={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <PasoFechaHora
              fecha={fecha}
              hora={hora}
              onSelect={handleFechaHoraSelect}
              onSiguiente={() => setStep(3)}
              onAtras={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <PasoDatosCliente
              servicio={servicioSeleccionado!}
              fecha={fecha}
              hora={hora}
              onConfirmar={handleConfirmarTurno}
              onAtras={() => setStep(2)}
            />
          )}

          {step === 4 && turnoConfirmado && (
            <Confirmacion
              turno={turnoConfirmado}
              onVolver={handleVolver}
            />
          )}
        </div>
    </div>
  );
}

export default function ReservarPage() {
  return (
    <ToastProvider>
      <Suspense fallback={<div className="min-h-screen bg-cream pt-24 flex items-center justify-center"><span className="text-gray">Cargando...</span></div>}>
        <ReservarContent />
      </Suspense>
    </ToastProvider>
  );
}
