"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Search, UserPlus, Phone, Mail, MessageCircle } from "lucide-react";
import { getClientes, actualizarNotasCliente } from "@/lib/api";
import { Cliente } from "@/lib/tipos";

type TabFiltro = "todos" | "leads" | "clientes";

const ORIGENES = [
  { value: "web", label: "Web" },
  { value: "instagram", label: "Instagram" },
  { value: "referido", label: "Referido" },
  { value: "facebook", label: "Facebook" },
  { value: "google", label: "Google" },
  { value: "otro", label: "Otro" },
];

export default function LeadsPage() {
  const [todosLosClientes, setTodosLosClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [leadEditando, setLeadEditando] = useState<Cliente | null>(null);
  const [tabActivo, setTabActivo] = useState<TabFiltro>("todos");

  const fetchLeads = useCallback(async () => {
    try {
      const data = await getClientes();
      setTodosLosClientes(data);
    } catch (error) {
      console.error("Error al cargar leads:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const getClientesFiltrados = () => {
    let clientes = todosLosClientes;

    if (tabActivo === "leads") {
      clientes = clientes.filter((c) => c.estado === "lead" || !c.turnos || c.turnos.length === 0);
    } else if (tabActivo === "clientes") {
      clientes = clientes.filter((c) => c.estado === "cliente" || (c.turnos && c.turnos.length > 0));
    }

    return clientes.filter(
      (l) =>
        l.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        l.email.toLowerCase().includes(busqueda.toLowerCase()) ||
        l.telefono.includes(busqueda)
    );
  };

  const getMetricas = () => {
    const leads = todosLosClientes.filter((c) => c.estado === "lead" || !c.turnos || c.turnos.length === 0);
    const clientes = todosLosClientes.filter((c) => c.estado === "cliente" || (c.turnos && c.turnos.length > 0));
    
    return {
      total: todosLosClientes.length,
      leads: leads.length,
      clientes: clientes.length,
    };
  };

  const getIniciales = (nombre: string) => {
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const esCliente = (cliente: Cliente) => {
    return cliente.estado === "cliente" || (cliente.turnos && cliente.turnos.length > 0);
  };

  const handleActualizarOrigen = async (lead: Cliente, nuevoOrigen: string) => {
    try {
      await actualizarNotasCliente(lead.id, lead.notasInternas);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/clientes/${lead.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ origen: nuevoOrigen }),
        }
      );
      
      if (response.ok) {
        setTodosLosClientes((prev) =>
          prev.map((l) => (l.id === lead.id ? { ...l, origen: nuevoOrigen } : l))
        );
        if (leadEditando?.id === lead.id) {
          setLeadEditando({ ...lead, origen: nuevoOrigen });
        }
      }
    } catch (error) {
      console.error("Error al actualizar origen:", error);
    }
  };

  const metricas = getMetricas();
  const clientesFiltrados = getClientesFiltrados();

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
        <h1 className="font-serif text-3xl text-charcoal">Contacts</h1>
        <p className="text-gray mt-1">
          Gestión de leads y clientes
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setTabActivo("todos")}
          className={`p-4 rounded-card shadow-card text-left transition-all ${
            tabActivo === "todos" 
              ? "bg-rose text-white" 
              : "bg-white hover:bg-cream-dark"
          }`}
        >
          <p className={`text-sm ${tabActivo === "todos" ? "text-white/80" : "text-gray"}`}>Total</p>
          <p className={`text-2xl font-medium ${tabActivo === "todos" ? "text-white" : "text-charcoal"}`}>
            {metricas.total}
          </p>
        </button>
        <button
          onClick={() => setTabActivo("leads")}
          className={`p-4 rounded-card shadow-card text-left transition-all ${
            tabActivo === "leads" 
              ? "bg-warning text-white" 
              : "bg-white hover:bg-cream-dark"
          }`}
        >
          <p className={`text-sm ${tabActivo === "leads" ? "text-white/80" : "text-gray"}`}>Leads</p>
          <p className={`text-2xl font-medium ${tabActivo === "leads" ? "text-white" : "text-charcoal"}`}>
            {metricas.leads}
          </p>
        </button>
        <button
          onClick={() => setTabActivo("clientes")}
          className={`p-4 rounded-card shadow-card text-left transition-all ${
            tabActivo === "clientes" 
              ? "bg-success text-white" 
              : "bg-white hover:bg-cream-dark"
          }`}
        >
          <p className={`text-sm ${tabActivo === "clientes" ? "text-white/80" : "text-gray"}`}>Clientes</p>
          <p className={`text-2xl font-medium ${tabActivo === "clientes" ? "text-white" : "text-charcoal"}`}>
            {metricas.clientes}
          </p>
        </button>
      </div>

      <div className="bg-white rounded-card shadow-card mb-6">
        <div className="p-4 border-b border-cream-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-cream border border-cream-border rounded-lg text-sm focus:outline-none focus:border-rose"
            />
          </div>
        </div>

        {clientesFiltrados.length > 0 ? (
          <div className="divide-y divide-cream-border">
            {clientesFiltrados.map((lead) => {
              const esClienteRegulado = esCliente(lead);

              return (
                <div
                  key={lead.id}
                  className="p-4 hover:bg-cream-dark/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      esClienteRegulado ? "bg-success/20" : "bg-warning/20"
                    }`}>
                      <span className={`font-medium ${esClienteRegulado ? "text-success" : "text-warning"}`}>
                        {getIniciales(lead.nombre)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-charcoal">{lead.nombre}</h3>
                        {esClienteRegulado ? (
                          <span className="px-2 py-0.5 bg-success/20 text-success text-xs rounded">
                            Cliente
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-warning/20 text-warning text-xs rounded">
                            Lead
                          </span>
                        )}
                        {lead.turnos && lead.turnos.length > 0 && (
                          <span className="px-2 py-0.5 bg-rose/20 text-rose text-xs rounded">
                            {lead.turnos.length} turno{lead.turnos.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray mb-2">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {lead.telefono}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray">Origen:</span>
                          <select
                            value={lead.origen || "web"}
                            onChange={(e) => handleActualizarOrigen(lead, e.target.value)}
                            className="text-sm bg-cream border border-cream-border rounded px-2 py-1 focus:outline-none focus:border-rose"
                          >
                            {ORIGENES.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <span className="text-xs text-gray">
                          Creado: {format(new Date(lead.creadoEn), "d MMM yyyy", { locale: es })}
                        </span>
                      </div>

                      {lead.notasInternas && (
                        <p className="text-sm text-gray mt-2 italic">
                          &quot;{lead.notasInternas}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <a
                        href={`https://wa.me/${lead.telefono}?text=Hola%20${encodeURIComponent(lead.nombre)}%2C%20te%20contactamos%20de%20Lumina%20Est%C3%A9tica`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-success text-white text-sm rounded-lg hover:bg-success/90 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${lead.telefono}`}
                        className="flex items-center gap-2 px-3 py-2 bg-charcoal text-white text-sm rounded-lg hover:bg-charcoal/90 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Llamar
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <UserPlus className="w-12 h-12 text-gray mx-auto mb-3" />
            <p className="text-gray">No hay contactos</p>
            <p className="text-sm text-gray mt-1">
              Los contactos aparecerán aquí cuando alguien Reserve desde la web
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
