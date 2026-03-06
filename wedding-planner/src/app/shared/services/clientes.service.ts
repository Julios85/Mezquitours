import { Injectable, computed, signal } from '@angular/core';
import { Cliente, ClienteActivo, EstadoCliente } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private _clientes = signal<ClienteActivo[]>([]);

  clientes = this._clientes.asReadonly();

  clientesActivos = computed(() =>
    this._clientes().filter(c => c.estado === 'activo')
  );

  clientesPotenciales = computed(() =>
    this._clientes().filter(c => c.estado === 'potencial')
  );

  totalClientes = computed(() => this._clientes().length);

  totalActivos = computed(() => this.clientesActivos().length);

  saldoPendienteTotal = computed(() =>
    this._clientes().reduce((sum, c) => sum + c.saldoPendienteTotal, 0)
  );

  constructor() {
    this.loadDummyData();
  }

  getClienteById(id: string): ClienteActivo | undefined {
    return this._clientes().find(c => c.id === id);
  }

  buscarClientes(termino: string): ClienteActivo[] {
    const term = termino.toLowerCase();
    return this._clientes().filter(c =>
      c.nombre.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.telefono.includes(term)
    );
  }

  filtrarPorEstado(estado: EstadoCliente | ''): ClienteActivo[] {
    if (!estado) return this._clientes();
    return this._clientes().filter(c => c.estado === estado);
  }

  filtrarConSaldo(): ClienteActivo[] {
    return this._clientes().filter(c => c.saldoPendienteTotal > 0);
  }

  agregarCliente(cliente: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>): void {
    const nuevoCliente: ClienteActivo = {
      ...cliente,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      eventosActivos: 0,
      saldoPendienteTotal: 0
    };
    this._clientes.update(clientes => [...clientes, nuevoCliente]);
  }

  actualizarCliente(id: string, datos: Partial<Cliente>): void {
    this._clientes.update(clientes =>
      clientes.map(c =>
        c.id === id ? { ...c, ...datos, updatedAt: new Date() } : c
      )
    );
  }

  cambiarEstado(id: string, estado: EstadoCliente): void {
    this.actualizarCliente(id, { estado });
  }

  private loadDummyData(): void {
    this._clientes.set([
      {
        id: '1',
        nombre: 'María García López',
        email: 'maria.garcia@email.com',
        telefono: '+52 555 123 4567',
        whatsapp: '+52 555 123 4567',
        direccion: 'Av. Reforma 123, Col. Juárez',
        ciudad: 'Ciudad de México',
        estado: 'activo',
        notas: 'Cliente VIP, referida por Ana Martínez',
        createdAt: new Date('2025-06-15'),
        updatedAt: new Date('2026-02-20'),
        eventosActivos: 1,
        saldoPendienteTotal: 175000,
        proximoEvento: {
          id: '1',
          nombre: 'Boda García-López',
          fecha: new Date('2026-06-15')
        },
        ultimoContacto: new Date('2026-03-01')
      },
      {
        id: '2',
        nombre: 'Roberto López Hernández',
        email: 'roberto.lopez@email.com',
        telefono: '+52 555 987 6543',
        whatsapp: '+52 555 987 6543',
        ciudad: 'Guadalajara',
        estado: 'activo',
        createdAt: new Date('2025-09-10'),
        updatedAt: new Date('2026-02-15'),
        eventosActivos: 1,
        saldoPendienteTotal: 135000,
        proximoEvento: {
          id: '2',
          nombre: 'XV Años Sofía',
          fecha: new Date('2026-08-20')
        },
        ultimoContacto: new Date('2026-02-28')
      },
      {
        id: '3',
        nombre: 'Ana Martínez Sánchez',
        email: 'ana.martinez@email.com',
        telefono: '+52 555 456 7890',
        ciudad: 'Ciudad de México',
        estado: 'activo',
        createdAt: new Date('2025-11-20'),
        updatedAt: new Date('2026-03-01'),
        eventosActivos: 1,
        saldoPendienteTotal: 35000,
        proximoEvento: {
          id: '3',
          nombre: 'Luna de Miel Martínez',
          fecha: new Date('2026-07-01')
        },
        ultimoContacto: new Date('2026-03-03')
      },
      {
        id: '4',
        nombre: 'Carlos Sánchez Ruiz',
        email: 'carlos.sanchez@empresa.com',
        telefono: '+52 555 111 2222',
        ciudad: 'Monterrey',
        estado: 'activo',
        notas: 'Evento corporativo anual',
        createdAt: new Date('2026-01-05'),
        updatedAt: new Date('2026-02-10'),
        eventosActivos: 1,
        saldoPendienteTotal: 0,
        proximoEvento: {
          id: '4',
          nombre: 'Gala Corporativa 2026',
          fecha: new Date('2026-03-22')
        },
        ultimoContacto: new Date('2026-02-25')
      },
      {
        id: '5',
        nombre: 'Laura Fernández Torres',
        email: 'laura.fernandez@email.com',
        telefono: '+52 555 333 4444',
        ciudad: 'Puebla',
        estado: 'potencial',
        notas: 'Interesada en paquete de boda completo',
        createdAt: new Date('2026-02-20'),
        updatedAt: new Date('2026-03-02'),
        eventosActivos: 0,
        saldoPendienteTotal: 0,
        ultimoContacto: new Date('2026-03-02')
      },
      {
        id: '6',
        nombre: 'Pedro Ramírez Vega',
        email: 'pedro.ramirez@email.com',
        telefono: '+52 555 555 6666',
        ciudad: 'Cancún',
        estado: 'potencial',
        notas: 'Boda destino, presupuesto alto',
        createdAt: new Date('2026-02-25'),
        updatedAt: new Date('2026-03-04'),
        eventosActivos: 0,
        saldoPendienteTotal: 0,
        ultimoContacto: new Date('2026-03-04')
      },
      {
        id: '7',
        nombre: 'Gabriela Morales Díaz',
        email: 'gaby.morales@email.com',
        telefono: '+52 555 777 8888',
        ciudad: 'Ciudad de México',
        estado: 'inactivo',
        notas: 'Evento completado en 2025',
        createdAt: new Date('2024-08-10'),
        updatedAt: new Date('2025-12-15'),
        eventosActivos: 0,
        saldoPendienteTotal: 0,
        ultimoContacto: new Date('2025-12-15')
      }
    ]);
  }
}
