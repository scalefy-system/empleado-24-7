"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Save, DollarSign } from "lucide-react";
import { Cliente } from "@/lib/tipos";
import { actualizarCliente } from "@/lib/api";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface Props {
  cliente: Cliente;
  onActualizado: (cliente: Cliente) => void;
}

const ORIGENES = [
  { value: "web", label: "Web" },
  { value: "instagram", label: "Instagram" },
  { value: "referido", label: "Referido" },
  { value: "facebook", label: "Facebook" },
  { value: "google", label: "Google" },
  { value: "otro", label: "Otro" },
];

export default function ClienteFicha({ cliente, onActualizado }: Props) {
  const [notas, setNotas] = useState(cliente.notasInternas || "");
  const [origen, setOrigen] = useState(cliente.origen || "web");
  const [valorTotalManual, setValorTotalManual] = useState(
    cliente.valorTotalManual || 0
  );
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setNotas(cliente.notasInternas || "");
    setOrigen(cliente.origen || "web");
    setValorTotalManual(cliente.valorTotalManual || 0);
  }, [cliente]);

  const handleGuardar = async () => {
    setLoading(true);
    try {
      const clienteActualizado = await actualizarCliente(cliente.id, {
        notasInternas: notas,
        origen,
        valorTotalManual,
      });
      onActualizado(clienteActualizado);
      showToast("Cambios guardados correctamente", "success");
    } catch {
      showToast("Error al guardar los cambios", "error");
    } finally {
      setLoading(false);
    }
  };

  const getIniciales = (nombre: string) => {
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getBadgeEstado = (estado: string) => {
    switch (estado) {
      case "confirmado":
        return <Badge variant="confirmado">Confirmado</Badge>;
      case "pendiente":
        return <Badge variant="pendiente">Pendiente</Badge>;
      case "cancelado":
        return <Badge variant="cancelado">Cancelado</Badge>;
      default:
        return null;
    }
  };

  const getPrimerTurno = () => {
    if (!cliente.turnos || cliente.turnos.length === 0) return null;
    return cliente.turnos.sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    )[0];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const primerTurno = getPrimerTurno();
  const tieneCambios =
    notas !== cliente.notasInternas ||
    origen !== (cliente.origen || "web") ||
    valorTotalManual !== (cliente.valorTotalManual || 0);

  return (
    <div className="bg-white rounded-card shadow-card h-full flex flex-col">
      <div className="p-6 border-b border-cream-border">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center">
            <span className="text-2xl font-medium text-rose">
              {getIniciales(cliente.nombre)}
            </span>
          </div>
          <div>
            <h3 className="font-serif text-2xl text-charcoal">
              {cliente.nombre}
            </h3>
            <p className="text-sm text-gray">{cliente.email}</p>
            <p className="text-sm text-gray">{cliente.telefono}</p>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-cream-border">
        <h4 className="font-medium text-charcoal mb-4">Estadísticas</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-cream-dark rounded-lg p-3">
            <p className="text-xs text-gray uppercase">Total de turnos</p>
            <p className="text-2xl font-medium text-charcoal">
              {cliente.turnos?.length || 0}
            </p>
          </div>
          <div className="bg-cream-dark rounded-lg p-3">
            <p className="text-xs text-gray uppercase">Primer turno</p>
            <p className="text-sm font-medium text-charcoal">
              {primerTurno
                ? format(parseISO(primerTurno.fecha), "dd/MM/yyyy")
                : "-"}
            </p>
          </div>
          <div className="bg-rose/10 rounded-lg p-3 col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray uppercase">Valor total</p>
                <p className="text-2xl font-medium text-rose">
                  {formatCurrency(cliente.valorTotal || 0)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-rose/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-rose" />
              </div>
            </div>
            {cliente.valorTotalCalculado !== cliente.valorTotal && (
              <p className="text-xs text-gray mt-1">
                Calculado: {formatCurrency(cliente.valorTotalCalculado || 0)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-cream-border flex-1 overflow-y-auto">
        <h4 className="font-medium text-charcoal mb-4">Historial de Turnos</h4>
        {cliente.turnos && cliente.turnos.length > 0 ? (
          <div className="space-y-3">
            {cliente.turnos
              .sort(
                (a, b) =>
                  new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
              )
              .map((turno) => (
                <div
                  key={turno.id}
                  className="flex items-center justify-between p-3 bg-cream-dark rounded-lg"
                >
                  <div>
                    <p className="font-medium text-charcoal text-sm">
                      {turno.servicio}
                    </p>
                    <p className="text-xs text-gray">
                      {format(parseISO(turno.fecha), "dd/MM/yyyy")} -{" "}
                      {turno.hora}
                    </p>
                  </div>
                  {getBadgeEstado(turno.estado)}
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray text-sm">No hay turnos registrados</p>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Origen
            </label>
            <select
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
              className="w-full px-4 py-2 bg-cream border border-cream-border rounded-lg text-charcoal focus:outline-none focus:border-rose"
            >
              {ORIGENES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Valor total
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray">$</span>
              <input
                type="number"
                value={valorTotalManual || ""}
                onChange={(e) => setValorTotalManual(Number(e.target.value))}
                placeholder="0"
                className="w-full pl-7 pr-4 py-2 bg-cream border border-cream-border rounded-lg text-charcoal placeholder:text-gray focus:outline-none focus:border-rose"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Notas Internas
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder=" el cliente..."
            rows={3}
            className="w-full px-4 py-2 bg-cream border border-cream-border rounded-lg text-charcoal placeholder:text-gray focus:outline-none focus:border-rose resize-none"
          />
        </div>

        <Button
          onClick={handleGuardar}
          disabled={loading || !tieneCambios}
          className="w-full flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
