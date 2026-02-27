"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Users, DollarSign, TrendingUp, ArrowRight, UserPlus } from "lucide-react";
import { getTurnos, getClientes } from "@/lib/api";
import { Turno, Cliente } from "@/lib/tipos";
import { SERVICIOS } from "@/lib/constantes";

export default function AdminDashboard() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const getPrecioServicio = (servicioNombre: string) => {
    const servicio = SERVICIOS.find((s) => s.nombre === servicioNombre);
    return servicio?.precio || 0;
  };

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

  const hoy = new Date();
  const hoyStr = format(hoy, "yyyy-MM-dd");

  const turnosHoy = turnos.filter((t) => t.fecha === hoyStr);
  const turnosConfirmadosHoy = turnosHoy.filter((t) => t.estado === "confirmado");
  const turnosPendientes = turnos.filter((t) => t.estado === "pendiente");

  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const clientesNuevosEsteMes = clientes.filter(
    (c) => new Date(c.creadoEn) >= inicioMes
  ).length;

  const leadsActivos = clientes.filter((c) => c.estado === "lead").length;

  const turnosConfirmados = turnos.filter((t) => t.estado === "confirmado");
  const ingresosEsteMes = turnosConfirmados
    .filter((t) => new Date(t.fecha) >= inicioMes)
    .reduce((sum, t) => sum + getPrecioServicio(t.servicio), 0);

  const proximosTurnos = turnos
    .filter((t) => t.fecha === hoyStr && t.estado === "confirmado")
    .sort((a, b) => a.hora.localeCompare(b.hora))
    .slice(0, 5);

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
        <h1 className="font-serif text-3xl text-charcoal">
          Bienvenida de nuevo
        </h1>
        <p className="text-gray mt-1">
          {format(hoy, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-rose" />
            </div>
            <span className="text-sm text-gray">Ingresos del mes</span>
          </div>
          <p className="text-2xl font-medium text-charcoal">
            {formatCurrency(ingresosEsteMes)}
          </p>
        </div>

        <div className="bg-white rounded-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gold" />
            </div>
            <span className="text-sm text-gray">Turnos hoy</span>
          </div>
          <p className="text-2xl font-medium text-charcoal">
            {turnosConfirmadosHoy.length} / {turnosHoy.length}
          </p>
          <p className="text-xs text-gray mt-1">
            {turnosPendientes.length} pendientes
          </p>
        </div>

        <div className="bg-white rounded-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-gray">Clientes nuevos</span>
          </div>
          <p className="text-2xl font-medium text-charcoal">
            {clientesNuevosEsteMes}
          </p>
          <p className="text-xs text-gray mt-1">este mes</p>
        </div>

        <div className="bg-white rounded-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-warning" />
            </div>
            <span className="text-sm text-gray">Leads activos</span>
          </div>
          <p className="text-2xl font-medium text-charcoal">{leadsActivos}</p>
          <p className="text-xs text-gray mt-1">sin atender</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <Link
          href="/admin/facturacion"
          className="bg-white rounded-card p-6 shadow-card hover:shadow-card-hover transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-charcoal">Facturación</h3>
              <p className="text-sm text-gray">Ver ingresos y métricas</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/agenda"
          className="bg-white rounded-card p-6 shadow-card hover:shadow-card-hover transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-charcoal">Agenda</h3>
              <p className="text-sm text-gray">Gestionar turnos</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/crm"
          className="bg-white rounded-card p-6 shadow-card hover:shadow-card-hover transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-charcoal">CRM</h3>
              <p className="text-sm text-gray">Mis clientas</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/leads"
          className="bg-white rounded-card p-6 shadow-card hover:shadow-card-hover transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-warning flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-charcoal">Contacts</h3>
              <p className="text-sm text-gray">Todos los contactos</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-card shadow-card">
        <div className="p-5 border-b border-cream-border">
          <h2 className="font-medium text-charcoal">Próximos turnos</h2>
        </div>
        {proximosTurnos.length > 0 ? (
          <div className="divide-y divide-cream-border">
            {proximosTurnos.map((turno) => (
              <div
                key={turno.id}
                className="p-4 flex items-center justify-between hover:bg-cream-dark/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-charcoal">{turno.clienteNombre}</p>
                  <p className="text-sm text-gray">{turno.servicio}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-charcoal">{turno.hora}</p>
                  <p className="text-xs text-gray">
                    {turno.estado === "confirmado" ? (
                      <span className="text-success">Confirmado</span>
                    ) : (
                      <span className="text-warning">Pendiente</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray">No hay turnos confirmados para hoy</p>
          </div>
        )}
      </div>
    </div>
  );
}
