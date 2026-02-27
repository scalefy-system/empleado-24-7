"use client";

import { useState, useEffect, useCallback } from "react";
import { getClientes } from "@/lib/api";
import { Cliente } from "@/lib/tipos";
import ClienteLista from "@/components/admin/ClienteLista";
import ClienteFicha from "@/components/admin/ClienteFicha";

export default function CRMPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchClientes = useCallback(async () => {
    try {
      const data = await getClientes();
      const clientesConTurnos = data.filter(
        (c) => (c.turnos && c.turnos.length > 0) || c.estado === "cliente"
      );
      setClientes(clientesConTurnos);
      if (clientesConTurnos.length > 0) {
        setClienteSeleccionado((prev) => prev || clientesConTurnos[0]);
      }
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleClienteActualizado = (clienteActualizado: Cliente) => {
    setClientes((prev) =>
      prev.map((c) =>
        c.id === clienteActualizado.id ? clienteActualizado : c
      )
    );
    setClienteSeleccionado(clienteActualizado);
  };

  const getMetricas = () => {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    const clientesConTurnos = clientes.filter(
      (c) => c.turnos && c.turnos.length > 0
    );

    const turnosEsteMes = clientesConTurnos.reduce((acc, c) => {
      return (
        acc +
        (c.turnos?.filter((t) => new Date(t.fecha) >= inicioMes).length || 0)
      );
    }, 0);

    const servicioMasSolicitado = clientesConTurnos.reduce(
      (acc, c) => {
        c.turnos?.forEach((t) => {
          acc[t.servicio] = (acc[t.servicio] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>
    );

    const masSolicitado = Object.entries(servicioMasSolicitado).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return {
      clientesTotales: clientesConTurnos.length,
      turnosEsteMes,
      servicioMasSolicitado: masSolicitado ? masSolicitado[0] : "-",
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray">Cargando...</p>
      </div>
    );
  }

  const metricas = getMetricas();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">CRM</h1>
        <p className="text-gray mt-1">Gestión de clientas</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-card p-4 shadow-card">
          <p className="text-sm text-gray">Clientas totales</p>
          <p className="text-2xl font-medium text-charcoal">
            {metricas.clientesTotales}
          </p>
        </div>
        <div className="bg-white rounded-card p-4 shadow-card">
          <p className="text-sm text-gray">Turnos este mes</p>
          <p className="text-2xl font-medium text-charcoal">
            {metricas.turnosEsteMes}
          </p>
        </div>
        <div className="bg-white rounded-card p-4 shadow-card col-span-2">
          <p className="text-sm text-gray">Servicio más solicitado</p>
          <p className="text-xl font-medium text-charcoal truncate">
            {metricas.servicioMasSolicitado}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-6">
        <ClienteLista
          clientes={clientes}
          clienteSeleccionado={clienteSeleccionado}
          onSeleccionar={setClienteSeleccionado}
        />
        {clienteSeleccionado ? (
          <ClienteFicha
            cliente={clienteSeleccionado}
            onActualizado={handleClienteActualizado}
          />
        ) : (
          <div className="bg-white rounded-card shadow-card flex items-center justify-center h-96">
            <p className="text-gray">Selecciona una clienta para ver sus datos</p>
          </div>
        )}
      </div>
    </div>
  );
}
