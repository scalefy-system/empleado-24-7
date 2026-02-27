"use client";

import { Check } from "lucide-react";
import { Sparkles, Zap, Droplets, Wind, Activity, Eye } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { SERVICIOS } from "@/lib/constantes";
import { Servicio } from "@/lib/tipos";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Zap,
  Droplets,
  Wind,
  Activity,
  Eye,
};

interface Props {
  servicioSeleccionado: Servicio | null;
  onSelect: (servicio: Servicio) => void;
  onSiguiente: () => void;
}

export default function PasoServicio({ servicioSeleccionado, onSelect, onSiguiente }: Props) {
  return (
    <div>
      <h2 className="font-serif text-3xl text-charcoal text-center mb-8">
        ¿Qué tratamiento te interesa?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {SERVICIOS.map((servicio) => {
          const Icon = iconMap[servicio.icono] || Sparkles;
          const isSelected = servicioSeleccionado?.id === servicio.id;

          return (
            <Card
              key={servicio.id}
              onClick={() => onSelect(servicio)}
              className={`cursor-pointer relative transition-all duration-300 ${
                isSelected
                  ? "ring-2 ring-rose bg-rose-light/30"
                  : "hover:shadow-card-hover"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="w-10 h-10 rounded-full bg-rose-light flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-rose" />
              </div>

              <h3 className="font-serif text-lg text-charcoal mb-1">
                {servicio.nombre}
              </h3>

              <p className="text-gray text-sm mb-3">{servicio.descripcion}</p>

              <div className="flex items-center justify-between">
                <span className="text-gold font-medium text-sm">
                  Desde ${servicio.precio.toLocaleString("es-AR")}
                </span>
                <span className="text-gray text-xs">{servicio.duracion} min</span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button onClick={onSiguiente} disabled={!servicioSeleccionado}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
