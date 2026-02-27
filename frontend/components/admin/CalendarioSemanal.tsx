"use client";

import { useMemo } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Turno } from "@/lib/tipos";
import { HORARIOS } from "@/lib/constantes";

interface Props {
  turnos: Turno[];
  onTurnoClick: (turno: Turno) => void;
}

export default function CalendarioSemanal({ turnos, onTurnoClick }: Props) {
  const fechaActual = new Date();
  const inicioSemana = startOfWeek(fechaActual, { weekStartsOn: 1 });
  const dias = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i)),
    [inicioSemana]
  );

  const getTurnoEnHorario = (dia: Date, hora: string) => {
    const fechaStr = format(dia, "yyyy-MM-dd");
    return turnos.find((t) => t.fecha === fechaStr && t.hora === hora);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "confirmado":
        return "bg-success/20 border-success/50 text-success hover:bg-success/30";
      case "pendiente":
        return "bg-warning/20 border-warning/50 text-warning hover:bg-warning/30";
      case "cancelado":
        return "bg-danger/20 border-danger/50 text-danger hover:bg-danger/30";
      default:
        return "bg-gray/20 border-gray/50 text-gray hover:bg-gray/30";
    }
  };

  const esHoy = (dia: Date) => isSameDay(dia, new Date());

  return (
    <div className="bg-white rounded-card shadow-card overflow-hidden w-full">
      <div className="overflow-x-auto">
        <div className="min-w-[800px] max-h-[500px] overflow-y-auto grid grid-cols-[80px_repeat(7,1fr)]">
          {/* Encabezado */}
          <div className="p-4 text-center text-sm font-medium text-gray border-b border-r border-cream-border bg-gradient-to-r from-cream to-white sticky top-0 z-10">
            Horario
          </div>
          {dias.map((dia) => (
            <div
              key={dia.toISOString()}
              className={`p-3 text-center text-sm font-medium text-gray border-b border-r border-cream-border sticky top-0 z-10 ${
                esHoy(dia) ? "bg-rose/10" : "bg-gradient-to-r from-cream to-white"
              }`}
            >
              <p className="text-xs text-gray uppercase font-medium">
                {format(dia, "EEE", { locale: es })}
              </p>
              <p
                className={`text-xl font-semibold mt-1 ${
                  esHoy(dia) ? "text-rose" : "text-charcoal"
                }`}
              >
                {format(dia, "d")}
              </p>
              {esHoy(dia) && (
                <div className="w-1.5 h-1.5 bg-rose rounded-full mx-auto mt-1" />
              )}
            </div>
          ))}

          {/* Filas de horarios */}
          {HORARIOS.map((hora) => (
            <>
              <div className="p-3 text-xs text-gray border-b border-r border-cream-border flex items-center justify-center font-medium bg-cream/20">
                {hora}
              </div>
              {dias.map((dia) => {
                const turno = getTurnoEnHorario(dia, hora);
                return (
                  <div
                    key={`${dia.toISOString()}-${hora}`}
                    className="p-1 border-b border-r border-cream-border min-h-[70px]"
                  >
                    {turno && (
                      <button
                        onClick={() => onTurnoClick(turno)}
                        className={`w-full h-full p-2 rounded-lg text-left text-xs border-l-3 transition-all duration-200 hover:scale-[1.02] cursor-pointer ${getEstadoColor(
                          turno.estado
                        )}`}
                        aria-label={`Turno de ${turno.clienteNombre} - ${turno.servicio} - ${turno.estado}`}
                      >
                        <p className="font-semibold truncate">{turno.clienteNombre}</p>
                        <p className="truncate opacity-80 text-[11px]">{turno.servicio}</p>
                      </button>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
