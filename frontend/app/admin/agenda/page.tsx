"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { getTurnos } from "@/lib/api";
import { Turno } from "@/lib/tipos";
import CalendarioSemanal from "@/components/admin/CalendarioSemanal";
import TurnoModal from "@/components/admin/TurnoModal";
import { SkeletonTable } from "@/components/ui/Skeleton";

export default function AgendaPage() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<Turno | null>(null);

  const fetchTurnos = async () => {
    try {
      const data = await getTurnos();
      setTurnos(data);
    } catch (error) {
      console.error("Error al cargar turnos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
    
    const interval = setInterval(() => {
      fetchTurnos();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleTurnoActualizado = (turnoActualizado: Turno) => {
    setTurnos((prev) =>
      prev.map((t) => (t.id === turnoActualizado.id ? turnoActualizado : t))
    );
    setTurnoSeleccionado(turnoActualizado);
  };

  const hoy = new Date();
  const turnosHoy = turnos.filter(
    (t) => t.fecha === format(hoy, "yyyy-MM-dd")
  );
  const turnosPendientes = turnos.filter((t) => t.estado === "pendiente");
  const turnosConfirmados = turnos.filter((t) => t.estado === "confirmado");

  const stats = [
    {
      label: "Turnos hoy",
      value: turnosHoy.length,
      icon: Calendar,
      color: "rose",
      bg: "bg-rose/10",
    },
    {
      label: "Pendientes",
      value: turnosPendientes.length,
      icon: AlertCircle,
      color: "warning",
      bg: "bg-warning/10",
    },
    {
      label: "Confirmados",
      value: turnosConfirmados.length,
      icon: CheckCircle,
      color: "success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Agenda</h1>
          <p className="text-gray mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {format(hoy, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-card p-6 shadow-card">
              <div className="animate-pulse flex items-center gap-4">
                <div className="w-12 h-12 bg-cream-dark rounded-xl" />
                <div>
                  <div className="h-4 bg-cream-dark rounded w-24 mb-2" />
                  <div className="h-8 bg-cream-dark rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-card p-6 shadow-card hover:shadow-card-hover transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 text-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-gray text-sm">{stat.label}</p>
                    <p className={`text-3xl font-serif font-semibold text-charcoal`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {loading ? (
        <SkeletonTable />
      ) : (
        <CalendarioSemanal
          turnos={turnos}
          onTurnoClick={setTurnoSeleccionado}
        />
      )}

      {turnoSeleccionado && (
        <TurnoModal
          turno={turnoSeleccionado}
          onClose={() => setTurnoSeleccionado(null)}
          onActualizado={handleTurnoActualizado}
        />
      )}
    </div>
  );
}
