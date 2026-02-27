"use client";

import { useState, useEffect, useMemo } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { DollarSign, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { getTurnos, getClientes } from "@/lib/api";
import { Turno, Cliente } from "@/lib/tipos";
import { SERVICIOS } from "@/lib/constantes";

export default function FacturacionPage() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [turnosData, clientesData] = await Promise.all([
          getTurnos(),
          getClientes(),
        ]);
        setTurnos(turnosData);
        setClientes(clientesData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getPrecioServicio = (servicioNombre: string) => {
    const servicio = SERVICIOS.find((s) => s.nombre === servicioNombre);
    return servicio?.precio || 0;
  };

  const metricas = useMemo(() => {
    const hoy = new Date();
    const inicioMes = startOfMonth(hoy);
    const finMes = endOfMonth(hoy);
    const inicioMesPasado = startOfMonth(subMonths(hoy, 1));
    const finMesPasado = endOfMonth(subMonths(hoy, 1));
    const inicioAño = new Date(hoy.getFullYear(), 0, 1);

    const turnosConfirmados = turnos.filter((t) => t.estado === "confirmado");

    const ingresosEsteMes = turnosConfirmados
      .filter((t) => {
        const fecha = new Date(t.fecha);
        return fecha >= inicioMes && fecha <= finMes;
      })
      .reduce((sum, t) => sum + getPrecioServicio(t.servicio), 0);

    const ingresosMesPasado = turnosConfirmados
      .filter((t) => {
        const fecha = new Date(t.fecha);
        return fecha >= inicioMesPasado && fecha <= finMesPasado;
      })
      .reduce((sum, t) => sum + getPrecioServicio(t.servicio), 0);

    const ingresosAño = turnosConfirmados
      .filter((t) => new Date(t.fecha) >= inicioAño)
      .reduce((sum, t) => sum + getPrecioServicio(t.servicio), 0);

    const totalTurnosConfirmados = turnosConfirmados.length;
    const ticketPromedio =
      totalTurnosConfirmados > 0
        ? Math.round(ingresosEsteMes / totalTurnosConfirmados)
        : 0;

    const variacion =
      ingresosMesPasado > 0
        ? ((ingresosEsteMes - ingresosMesPasado) / ingresosMesPasado) * 100
        : 0;

    return {
      ingresosEsteMes,
      ingresosMesPasado,
      ingresosAño,
      ticketPromedio,
      variacion,
    };
  }, [turnos]);

  const serviciosVendidos = useMemo(() => {
    const counts: Record<string, { cantidad: number; ingresos: number }> = {};

    const turnosConfirmados = turnos.filter(
      (t) => t.estado === "confirmado" && new Date(t.fecha) >= startOfMonth(new Date())
    );

    turnosConfirmados.forEach((t) => {
      const precio = getPrecioServicio(t.servicio);
      if (!counts[t.servicio]) {
        counts[t.servicio] = { cantidad: 0, ingresos: 0 };
      }
      counts[t.servicio].cantidad += 1;
      counts[t.servicio].ingresos += precio;
    });

    return Object.entries(counts)
      .map(([servicio, data]) => ({
        servicio,
        cantidad: data.cantidad,
        ingresos: data.ingresos,
      }))
      .sort((a, b) => b.ingresos - a.ingresos);
  }, [turnos]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray">Cargando...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Facturación</h1>
        <p className="text-gray mt-1">
          {format(new Date(), "MMMM yyyy", { locale: es })}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-rose" />
            </div>
            <span className="text-sm text-gray">Este mes</span>
          </div>
          <p className="text-2xl font-medium text-charcoal">
            {formatCurrency(metricas.ingresosEsteMes)}
          </p>
          <div className="flex items-center gap-1 mt-2">
            {metricas.variacion >= 0 ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-danger" />
            )}
            <span
              className={`text-xs ${
                metricas.variacion >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {metricas.variacion >= 0 ? "+" : ""}
              {metricas.variacion.toFixed(1)}% vs mes pasado
            </span>
          </div>
        </div>

        <div className="bg-white rounded-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gold" />
            </div>
            <span className="text-sm text-gray">Mes pasado</span>
          </div>
          <p className="text-2xl font-medium text-charcoal">
            {formatCurrency(metricas.ingresosMesPasado)}
          </p>
        </div>

        <div className="bg-white rounded-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-gray">Este año</span>
          </div>
          <p className="text-2xl font-medium text-charcoal">
            {formatCurrency(metricas.ingresosAño)}
          </p>
        </div>

        <div className="bg-white rounded-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-charcoal/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-charcoal" />
            </div>
            <span className="text-sm text-gray">Ticket promedio</span>
          </div>
          <p className="text-2xl font-medium text-charcoal">
            {formatCurrency(metricas.ticketPromedio)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card">
        <div className="p-5 border-b border-cream-border">
          <h2 className="font-medium text-charcoal">
            Servicios más vendidos este mes
          </h2>
        </div>
        {serviciosVendidos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-border">
                  <th className="px-5 py-3 text-left text-sm font-medium text-gray">
                    Servicio
                  </th>
                  <th className="px-5 py-3 text-center text-sm font-medium text-gray">
                    Cantidad
                  </th>
                  <th className="px-5 py-3 text-right text-sm font-medium text-gray">
                    Ingresos
                  </th>
                </tr>
              </thead>
              <tbody>
                {serviciosVendidos.map((item, index) => (
                  <tr
                    key={item.servicio}
                    className="border-b border-cream-border last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-rose font-medium">
                          {index + 1}.
                        </span>
                        <span className="text-charcoal">{item.servicio}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center text-charcoal">
                      {item.cantidad}
                    </td>
                    <td className="px-5 py-4 text-right text-charcoal font-medium">
                      {formatCurrency(item.ingresos)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-cream-dark/50">
                  <td className="px-5 py-4 font-medium text-charcoal">Total</td>
                  <td className="px-5 py-4 text-center font-medium text-charcoal">
                    {serviciosVendidos.reduce((sum, s) => sum + s.cantidad, 0)}
                  </td>
                  <td className="px-5 py-4 text-right font-medium text-charcoal">
                    {formatCurrency(
                      serviciosVendidos.reduce((sum, s) => sum + s.ingresos, 0)
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray">No hay servicios vendidos este mes</p>
          </div>
        )}
      </div>
    </div>
  );
}
