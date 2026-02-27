"use client";

import { useState } from "react";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Servicio, Turno } from "@/lib/tipos";
import { crearTurno } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface Props {
  servicio: Servicio;
  fecha: string;
  hora: string;
  onConfirmar: (turno: Turno) => void;
  onAtras: () => void;
}

export default function PasoDatosCliente({ servicio, fecha, hora, onConfirmar, onAtras }: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    notas: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email inválido";
    if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es requerido";
    else if (!/^598\d{8,9}$/.test(formData.telefono.replace(/\D/g, "")))
      newErrors.telefono = "Teléfono inválido (ej: +598 9X XXX XXX)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const turno = await crearTurno({
        clienteNombre: formData.nombre,
        clienteEmail: formData.email,
        clienteTelefono: formData.telefono.replace(/\D/g, ""),
        servicio: servicio.nombre,
        servicioId: servicio.id,
        fecha,
        hora,
        notas: formData.notas,
      });

      showToast("Turno reservado exitosamente!", "success");
      onConfirmar(turno);
    } catch {
      showToast("Error al reservar el turno. Intentalo de nuevo.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fechaFormateada = format(parse(fecha, "yyyy-MM-dd", new Date()), "EEEE d 'de' MMMM", { locale: es });

  return (
    <div>
      <h2 className="font-serif text-3xl text-charcoal text-center mb-8">
        Tus datos
      </h2>

      <div className="max-w-xl mx-auto">
        <div className="bg-cream-dark rounded-card p-6 mb-8">
          <h3 className="font-medium text-charcoal mb-4">Resumen del turno</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray">Servicio:</span>
              <span className="text-charcoal font-medium">{servicio.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray">Fecha:</span>
              <span className="text-charcoal font-medium capitalize">{fechaFormateada}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray">Hora:</span>
              <span className="text-charcoal font-medium">{hora}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray">Duración:</span>
              <span className="text-charcoal font-medium">{servicio.duracion} minutos</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre completo"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            error={errors.nombre}
            placeholder="Tu nombre"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="tu@email.com"
          />

          <Input
            label="Teléfono"
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            error={errors.telefono}
            placeholder="+598 9X XXX XXX"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-charcoal">
              Notas adicionales (opcional)
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              placeholder="Alguna consulta o información adicional..."
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-cream-border rounded-lg text-charcoal placeholder:text-gray focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-all duration-300 resize-none"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="ghost" onClick={onAtras}>
              Atrás
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Reservando..." : "Confirmar mi turno"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
