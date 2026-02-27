import { Turno, Cliente, Message } from "./tipos";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const TIMEOUT_MS = 10000;

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function getTurnos(): Promise<Turno[]> {
  const res = await fetchWithTimeout(`${API_URL}/api/turnos`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener turnos");
  return res.json();
}

export async function getTurnosDisponibles(fecha: string): Promise<string[]> {
  const res = await fetchWithTimeout(`${API_URL}/api/turnos/disponibles?fecha=${fecha}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Error al obtener turnos disponibles");
  return res.json();
}

export async function crearTurno(data: {
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  servicio: string;
  servicioId: string;
  fecha: string;
  hora: string;
  notas?: string;
}): Promise<Turno> {
  const res = await fetchWithTimeout(`${API_URL}/api/turnos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear turno");
  return res.json();
}

export async function actualizarEstadoTurno(
  id: string,
  estado: "pendiente" | "confirmado" | "cancelado"
): Promise<Turno> {
  const res = await fetchWithTimeout(`${API_URL}/api/turnos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw new Error("Error al actualizar turno");
  return res.json();
}

export async function getClientes(): Promise<Cliente[]> {
  const res = await fetchWithTimeout(`${API_URL}/api/clientes`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener clientes");
  return res.json();
}

export async function getCliente(id: string): Promise<Cliente> {
  const res = await fetchWithTimeout(`${API_URL}/api/clientes/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener cliente");
  return res.json();
}

export async function actualizarCliente(
  id: string,
  data: {
    notasInternas?: string;
    origen?: string;
    valorTotalManual?: number;
  }
): Promise<Cliente> {
  const res = await fetchWithTimeout(`${API_URL}/api/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar cliente");
  return res.json();
}

export async function actualizarNotasCliente(
  id: string,
  notasInternas: string
): Promise<Cliente> {
  return actualizarCliente(id, { notasInternas });
}

export async function enviarMensajeChat(
  messages: Message[],
  onChunk: (texto: string) => void
): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Error al conectar con el chat");
    }

    if (!response.body) {
      throw new Error("No hay cuerpo de respuesta");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || "";
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data && data !== '[DONE]') {
            onChunk(data);
          }
        }
      }
    }
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

