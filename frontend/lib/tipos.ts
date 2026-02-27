export interface Turno {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  servicio: string;
  servicioId: string;
  fecha: string;
  hora: string;
  estado: "pendiente" | "confirmado" | "cancelado";
  notas: string;
  creadoEn: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  notasInternas: string;
  creadoEn: string;
  estado: "lead" | "cliente";
  origen: string;
  valorTotalManual: number;
  valorTotalCalculado?: number;
  valorTotal?: number;
  turnos?: Turno[];
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  icono: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}
