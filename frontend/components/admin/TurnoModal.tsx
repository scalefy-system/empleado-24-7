"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { X, Check, Ban, RotateCcw } from "lucide-react";
import { Turno } from "@/lib/tipos";
import { actualizarEstadoTurno } from "@/lib/api";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface Props {
  turno: Turno;
  onClose: () => void;
  onActualizado: (turno: Turno) => void;
}

export default function TurnoModal({ turno, onClose, onActualizado }: Props) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleCambiarEstado = async (
    nuevoEstado: "pendiente" | "confirmado" | "cancelado"
  ) => {
    setLoading(true);
    try {
      const turnoActualizado = await actualizarEstadoTurno(turno.id, nuevoEstado);
      onActualizado(turnoActualizado);
      showToast(
        nuevoEstado === "confirmado" 
          ? "Turno confirmado" 
          : nuevoEstado === "cancelado" 
            ? "Turno cancelado" 
            : "Turno restaurado",
        "success"
      );
    } catch {
      showToast("Error al actualizar el turno", "error");
    } finally {
      setLoading(false);
    }
  };

  const fechaFormateada = format(
    parseISO(turno.fecha),
    "EEEE d 'de' MMMM 'de' yyyy",
    { locale: es }
  );

  const getBadgeEstado = () => {
    switch (turno.estado) {
      case "confirmado":
        return <Badge variant="confirmado">Confirmado</Badge>;
      case "pendiente":
        return <Badge variant="pendiente">Pendiente</Badge>;
      case "cancelado":
        return <Badge variant="cancelado">Cancelado</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-card shadow-card-hover w-full max-w-md p-6 mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-cream-dark rounded"
        >
          <X className="w-5 h-5 text-gray" />
        </button>

        <h3 className="font-serif text-2xl text-charcoal mb-4">
          Detalle del Turno
        </h3>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray uppercase mb-1">Cliente</p>
            <p className="font-medium text-charcoal">{turno.clienteNombre}</p>
          </div>

          <div>
            <p className="text-xs text-gray uppercase mb-1">Teléfono</p>
            <p className="text-charcoal">{turno.clienteTelefono}</p>
          </div>

          <div>
            <p className="text-xs text-gray uppercase mb-1">Email</p>
            <p className="text-charcoal">{turno.clienteEmail}</p>
          </div>

          <div>
            <p className="text-xs text-gray uppercase mb-1">Servicio</p>
            <p className="font-medium text-charcoal">{turno.servicio}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray uppercase mb-1">Fecha</p>
              <p className="text-charcoal capitalize">{fechaFormateada}</p>
            </div>
            <div>
              <p className="text-xs text-gray uppercase mb-1">Hora</p>
              <p className="text-charcoal">{turno.hora}</p>
            </div>
          </div>

          {turno.notas && (
            <div>
              <p className="text-xs text-gray uppercase mb-1">Notas</p>
              <p className="text-charcoal">{turno.notas}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-gray uppercase mb-2">Estado</p>
            {getBadgeEstado()}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {turno.estado === "pendiente" && (
            <>
              <Button
                onClick={() => handleCambiarEstado("confirmado")}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Confirmar
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleCambiarEstado("cancelado")}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 text-danger hover:bg-danger/10"
              >
                <Ban className="w-4 h-4" />
                Cancelar
              </Button>
            </>
          )}
          {turno.estado === "confirmado" && (
            <Button
              variant="ghost"
              onClick={() => handleCambiarEstado("cancelado")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-danger hover:bg-danger/10"
            >
              <Ban className="w-4 h-4" />
              Cancelar turno
            </Button>
          )}
          {turno.estado === "cancelado" && (
            <Button
              onClick={() => handleCambiarEstado("pendiente")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Restaurar como pendiente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
