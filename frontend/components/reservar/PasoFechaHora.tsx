"use client";

import { useState, useEffect, useRef } from "react";
import "react-day-picker/dist/style.css";
import { format, startOfDay, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import Button from "@/components/ui/Button";
import { getTurnosDisponibles } from "@/lib/api";
import { HORARIOS } from "@/lib/constantes";

const DIAS_ESPAÑOL = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const WEEKDAYS_LONG = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

interface Props {
  fecha: string;
  hora: string;
  onSelect: (fecha: string, hora: string) => void;
  onSiguiente: () => void;
  onAtras: () => void;
}

export default function PasoFechaHora({ fecha, hora, onSelect, onSiguiente, onAtras }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const today = startOfDay(new Date());

  useEffect(() => {
    if (selectedDate) {
      const fechaStr = format(selectedDate, "yyyy-MM-dd");
      setLoading(true);
      getTurnosDisponibles(fechaStr)
        .then(setHorariosDisponibles)
        .catch(() => setHorariosDisponibles([]))
        .finally(() => setLoading(false));
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const fechaStr = format(date, "yyyy-MM-dd");
      onSelect(fechaStr, "");
    }
  };

  const handleHoraSelect = (hora: string) => {
    if (fecha) {
      onSelect(fecha, hora);
    }
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, today) || date.getDay() === 0 || date.getDay() === 6;
  };

  const isFinDeSemana = selectedDate ? selectedDate.getDay() === 0 || selectedDate.getDay() === 6 : false;

  return (
    <div>
      <h2 className="font-serif text-3xl text-charcoal text-center mb-8">
        Elegí fecha y horario
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-card p-6 shadow-card">
          <div className="flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              locale={es}
              weekStartsOn={1}
              className="rdp"
              formatters={{
                formatWeekdayName: (date) => {
                  const day = date.getDay();
                  return DIAS_ESPAÑOL[day === 0 ? 6 : day - 1];
                }
              }}
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium text-charcoal mb-4">
            {selectedDate
              ? `Horarios disponibles para el ${format(selectedDate, "d 'de' MMMM", { locale: es })}`
              : "Seleccioná una fecha primero"}
          </h3>

          {loading ? (
            <div className="text-gray text-center py-8">Cargando horarios...</div>
          ) : selectedDate ? (
            isFinDeSemana ? (
              <div className="text-gray text-center py-8 bg-cream-dark rounded-lg">
                No atendemos los fines de semana. Seleccioná otro día entre lunes y viernes.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {HORARIOS.map((h) => {
                  const isAvailable = horariosDisponibles.includes(h);
                  const isSelected = hora === h;

                  return (
                    <button
                      key={h}
                      onClick={() => isAvailable && handleHoraSelect(h)}
                      disabled={!isAvailable}
                      className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? "bg-rose text-white"
                          : isAvailable
                          ? "bg-cream-dark text-charcoal hover:bg-rose-light hover:text-rose"
                          : "bg-gray-light/30 text-gray-light cursor-not-allowed"
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            <div className="text-gray text-center py-8 bg-cream-dark rounded-lg">
              Seleccioná una fecha para ver los horarios disponibles
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onAtras}>
          Atrás
        </Button>
        <Button onClick={onSiguiente} disabled={!fecha || !hora}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
