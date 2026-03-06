// Citas
export interface Cita {
  id: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  fecha: Date;
  hora: string;
  tipoEvento: TipoEvento;
  estado: EstadoCita;
  notas?: string;
  createdAt: Date;
}

export type TipoEvento = 'boda' | 'quinceanos' | 'bautizo' | 'corporativo' | 'viaje' | 'otro';
export type EstadoCita = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

// Proveedores
export interface Proveedor {
  id: string;
  nombre: string;
  categoria: CategoriaProveedor;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  calificacion: number;
  precioBase: number;
  descripcion: string;
  servicios: string[];
  activo: boolean;
}

export type CategoriaProveedor =
  | 'catering'
  | 'fotografia'
  | 'musica'
  | 'decoracion'
  | 'floreria'
  | 'salon'
  | 'hotel'
  | 'transporte'
  | 'vestimenta'
  | 'pasteleria';

// Planeador / Eventos
export interface Evento {
  id: string;
  nombre: string;
  tipo: TipoEvento;
  fecha: Date;
  cliente: string;
  presupuesto: number;
  presupuestoGastado: number;
  ubicacion: string;
  estado: EstadoEvento;
  invitados: number;
  proveedores: ProveedorAsignado[];
  tareas: Tarea[];
  notas?: string;
}

export type EstadoEvento = 'planificacion' | 'en_progreso' | 'completado' | 'cancelado';

export interface ProveedorAsignado {
  proveedorId: string;
  servicio: string;
  costo: number;
  confirmado: boolean;
}

export interface Tarea {
  id: string;
  descripcion: string;
  completada: boolean;
  fechaLimite?: Date;
}

// Hoteles y Viajes
export interface Hotel {
  id: string;
  nombre: string;
  ciudad: string;
  pais: string;
  estrellas: number;
  precioNoche: number;
  imagen: string;
  amenidades: string[];
  disponible: boolean;
}

export interface ReservaHotel {
  id: string;
  hotelId: string;
  clienteNombre: string;
  fechaEntrada: Date;
  fechaSalida: Date;
  habitaciones: number;
  huespedes: number;
  total: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
}
