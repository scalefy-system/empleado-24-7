"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Cliente } from "@/lib/tipos";

interface Props {
  clientes: Cliente[];
  clienteSeleccionado: Cliente | null;
  onSeleccionar: (cliente: Cliente) => void;
}

export default function ClienteLista({
  clientes,
  clienteSeleccionado,
  onSeleccionar,
}: Props) {
  const [busqueda, setBusqueda] = useState("");

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getIniciales = (nombre: string) => {
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getTurnosCount = (cliente: Cliente) => {
    return cliente.turnos?.length || 0;
  };

  const getUltimoTurno = (cliente: Cliente) => {
    if (!cliente.turnos || cliente.turnos.length === 0) return null;
    return cliente.turnos.sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    )[0];
  };

  return (
    <div className="bg-white rounded-card shadow-card h-full flex flex-col">
      <div className="p-4 border-b border-cream-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cream border border-cream-border rounded-lg text-sm focus:outline-none focus:border-rose"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {clientesFiltrados.map((cliente) => {
          const ultimoTurno = getUltimoTurno(cliente);
          const turnosCount = getTurnosCount(cliente);
          const isSelected = clienteSeleccionado?.id === cliente.id;

          return (
            <button
              key={cliente.id}
              onClick={() => onSeleccionar(cliente)}
              className={`w-full p-4 flex items-start gap-3 border-b border-cream-border last:border-b-0 transition-colors ${
                isSelected ? "bg-rose/10" : "hover:bg-cream-dark"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isSelected ? "bg-rose text-white" : "bg-cream-dark text-rose"
                }`}
              >
                <span className="text-sm font-medium">
                  {getIniciales(cliente.nombre)}
                </span>
              </div>

              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-charcoal truncate">
                  {cliente.nombre}
                </p>
                {ultimoTurno && (
                  <p className="text-xs text-gray truncate">
                    {ultimoTurno.servicio}
                  </p>
                )}
                <div className="mt-1">
                  {turnosCount <= 1 ? (
                    <span className="inline-block px-2 py-0.5 bg-gold/20 text-gold text-xs rounded">
                      Nuevo
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 bg-rose/20 text-rose text-xs rounded">
                      Recurrente
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
