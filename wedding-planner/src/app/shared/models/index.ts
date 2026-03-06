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

// ============================================
// MÓDULO FINANCIERO
// ============================================

// Clientes
export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  whatsapp?: string;
  direccion?: string;
  ciudad?: string;
  notas?: string;
  estado: EstadoCliente;
  createdAt: Date;
  updatedAt: Date;
}

export type EstadoCliente = 'activo' | 'inactivo' | 'potencial';

export interface ClienteActivo extends Cliente {
  eventosActivos: number;
  saldoPendienteTotal: number;
  proximoEvento?: {
    id: string;
    nombre: string;
    fecha: Date;
  };
  ultimoContacto?: Date;
}

// Pagos
export interface Pago {
  id: string;
  eventoId: string;
  clienteId: string;
  clienteNombre?: string;
  eventoNombre?: string;
  monto: number;
  metodoPago: MetodoPago;
  estado: EstadoPago;
  referenciaBancaria?: string;
  comprobante?: string;
  fechaPago: Date;
  fechaValidacion?: Date;
  validadoPor?: string;
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta' | 'deposito';
export type EstadoPago = 'pendiente' | 'validando' | 'completado' | 'rechazado';

// Comprobantes
export interface Comprobante {
  id: string;
  pagoId: string;
  tipo: 'imagen' | 'pdf';
  nombreArchivo: string;
  url: string;
  tamaño: number;
  subidoPor: string;
  fechaSubida: Date;
  verificado: boolean;
}

// Balance
export interface BalanceEvento {
  eventoId: string;
  clienteId: string;
  eventoNombre: string;
  presupuestoTotal: number;
  totalPagado: number;
  descuentosAplicados: number;
  cargosAdicionales: number;
  saldoPendiente: number;
  porcentajePagado: number;
  proximoPago?: {
    monto: number;
    fechaLimite: Date;
  };
}

export interface ResumenCliente {
  clienteId: string;
  clienteNombre: string;
  totalEventos: number;
  saldoTotalPendiente: number;
  eventosConSaldo: BalanceEvento[];
}

// ============================================
// MÓDULO DE VENTAS / COTIZACIONES
// ============================================

// Cotizaciones
export interface Cotizacion {
  id: string;
  numero: string;
  clienteId: string;
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
  };
  evento: {
    tipo: TipoEvento;
    fecha: Date;
    lugar?: string;
    numPersonas: number;
  };
  servicios: ServicioCotizado[];
  subtotal: number;
  descuento: number;
  total: number;
  promocionId?: string;
  promocionNombre?: string;
  estado: EstadoCotizacion;
  validaHasta: Date;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EstadoCotizacion = 'borrador' | 'enviada' | 'vista' | 'aceptada' | 'rechazada' | 'expirada';

export interface ServicioCotizado {
  servicioId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

// Solicitudes (CRM)
export interface SolicitudCotizacion {
  id: string;
  numero: string;
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
    fuente: FuenteSolicitud;
  };
  evento: {
    tipo: TipoEvento;
    fecha: Date;
    numPersonas: number;
    lugar?: string;
    serviciosInteres: string[];
  };
  estado: EstadoSolicitud;
  cotizacionId?: string;
  cotizacionMonto?: number;
  seguimientos: Seguimiento[];
  asignadoA?: string;
  razonPerdida?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FuenteSolicitud = 'web' | 'whatsapp' | 'telefono' | 'referido' | 'redes';
export type EstadoSolicitud = 'nueva' | 'contactada' | 'cotizada' | 'negociando' | 'cerrada' | 'perdida';

export interface Seguimiento {
  id: string;
  fecha: Date;
  tipo: TipoSeguimiento;
  descripcion: string;
  resultado: string;
  proximaAccion?: {
    fecha: Date;
    descripcion: string;
  };
  registradoPor: string;
}

export type TipoSeguimiento = 'llamada' | 'email' | 'whatsapp' | 'reunion' | 'nota';

// Promociones
export interface Promocion {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: TipoPromocion;
  valor: number;
  condiciones: CondicionPromocion[];
  fechaInicio: Date;
  fechaFin: Date;
  usoMaximo?: number;
  usosActuales: number;
  activa: boolean;
  prioridad: number;
  acumulable: boolean;
}

export type TipoPromocion = 'porcentaje' | 'monto_fijo' | 'servicio_gratis';

export interface CondicionPromocion {
  campo: 'numPersonas' | 'tipoEvento' | 'fechaEvento' | 'montoMinimo';
  operador: 'igual' | 'mayor' | 'menor' | 'entre' | 'contiene';
  valor: any;
}

// Tarifas de servicios
export interface TarifaServicio {
  id: string;
  nombre: string;
  categoria: string;
  tipoCalculo: 'por_persona' | 'fijo' | 'escalonado';
  precioBase: number;
  escala?: EscalaPrecio[];
  minPersonas?: number;
  maxPersonas?: number;
  activo: boolean;
}

export interface EscalaPrecio {
  desde: number;
  hasta: number;
  precioPorPersona: number;
  descuentoPorcentaje?: number;
}
