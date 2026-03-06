import { Injectable, computed, signal } from '@angular/core';
import { Pago, EstadoPago, MetodoPago, BalanceEvento, Comprobante } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private _pagos = signal<Pago[]>([]);
  private _comprobantes = signal<Comprobante[]>([]);

  pagos = this._pagos.asReadonly();
  comprobantes = this._comprobantes.asReadonly();

  pagosPendientes = computed(() =>
    this._pagos().filter(p => p.estado === 'pendiente' || p.estado === 'validando')
  );

  pagosCompletados = computed(() =>
    this._pagos().filter(p => p.estado === 'completado')
  );

  totalPendienteValidacion = computed(() =>
    this.pagosPendientes().reduce((sum, p) => sum + p.monto, 0)
  );

  totalRecaudado = computed(() =>
    this.pagosCompletados().reduce((sum, p) => sum + p.monto, 0)
  );

  constructor() {
    this.loadDummyData();
  }

  getPagoById(id: string): Pago | undefined {
    return this._pagos().find(p => p.id === id);
  }

  getPagosPorEvento(eventoId: string): Pago[] {
    return this._pagos().filter(p => p.eventoId === eventoId);
  }

  getPagosPorCliente(clienteId: string): Pago[] {
    return this._pagos().filter(p => p.clienteId === clienteId);
  }

  filtrarPorEstado(estado: EstadoPago | ''): Pago[] {
    if (!estado) return this._pagos();
    return this._pagos().filter(p => p.estado === estado);
  }

  validarPago(id: string, validadoPor: string, observaciones?: string): void {
    this._pagos.update(pagos =>
      pagos.map(p =>
        p.id === id
          ? {
              ...p,
              estado: 'completado' as EstadoPago,
              fechaValidacion: new Date(),
              validadoPor,
              observaciones: observaciones || p.observaciones,
              updatedAt: new Date()
            }
          : p
      )
    );
  }

  rechazarPago(id: string, validadoPor: string, observaciones: string): void {
    this._pagos.update(pagos =>
      pagos.map(p =>
        p.id === id
          ? {
              ...p,
              estado: 'rechazado' as EstadoPago,
              fechaValidacion: new Date(),
              validadoPor,
              observaciones,
              updatedAt: new Date()
            }
          : p
      )
    );
  }

  marcarComoValidando(id: string): void {
    this._pagos.update(pagos =>
      pagos.map(p =>
        p.id === id
          ? { ...p, estado: 'validando' as EstadoPago, updatedAt: new Date() }
          : p
      )
    );
  }

  agregarPago(pago: Omit<Pago, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = Date.now().toString();
    const nuevoPago: Pago = {
      ...pago,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this._pagos.update(pagos => [...pagos, nuevoPago]);
    return id;
  }

  getComprobantesPorPago(pagoId: string): Comprobante[] {
    return this._comprobantes().filter(c => c.pagoId === pagoId);
  }

  calcularBalanceEvento(eventoId: string, presupuesto: number): BalanceEvento {
    const pagosEvento = this.getPagosPorEvento(eventoId);
    const pagosCompletados = pagosEvento
      .filter(p => p.estado === 'completado')
      .reduce((sum, p) => sum + p.monto, 0);

    const saldoPendiente = presupuesto - pagosCompletados;

    return {
      eventoId,
      clienteId: pagosEvento[0]?.clienteId || '',
      eventoNombre: pagosEvento[0]?.eventoNombre || '',
      presupuestoTotal: presupuesto,
      totalPagado: pagosCompletados,
      descuentosAplicados: 0,
      cargosAdicionales: 0,
      saldoPendiente: Math.max(0, saldoPendiente),
      porcentajePagado: presupuesto > 0 ? (pagosCompletados / presupuesto) * 100 : 0
    };
  }

  private loadDummyData(): void {
    this._pagos.set([
      {
        id: '1',
        eventoId: '1',
        clienteId: '1',
        clienteNombre: 'María García López',
        eventoNombre: 'Boda García-López',
        monto: 105000,
        metodoPago: 'transferencia',
        estado: 'completado',
        referenciaBancaria: 'SPEI-20260115-001',
        fechaPago: new Date('2026-01-15'),
        fechaValidacion: new Date('2026-01-15'),
        validadoPor: 'Admin',
        createdAt: new Date('2026-01-15'),
        updatedAt: new Date('2026-01-15')
      },
      {
        id: '2',
        eventoId: '1',
        clienteId: '1',
        clienteNombre: 'María García López',
        eventoNombre: 'Boda García-López',
        monto: 70000,
        metodoPago: 'transferencia',
        estado: 'pendiente',
        referenciaBancaria: 'SPEI-20260301-045',
        comprobante: 'https://example.com/comprobante.jpg',
        fechaPago: new Date('2026-03-01'),
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date('2026-03-01')
      },
      {
        id: '3',
        eventoId: '2',
        clienteId: '2',
        clienteNombre: 'Roberto López Hernández',
        eventoNombre: 'XV Años Sofía',
        monto: 45000,
        metodoPago: 'deposito',
        estado: 'completado',
        referenciaBancaria: 'DEP-20260210-012',
        fechaPago: new Date('2026-02-10'),
        fechaValidacion: new Date('2026-02-10'),
        validadoPor: 'Admin',
        createdAt: new Date('2026-02-10'),
        updatedAt: new Date('2026-02-10')
      },
      {
        id: '4',
        eventoId: '3',
        clienteId: '3',
        clienteNombre: 'Ana Martínez Sánchez',
        eventoNombre: 'Luna de Miel Martínez',
        monto: 85000,
        metodoPago: 'tarjeta',
        estado: 'completado',
        fechaPago: new Date('2026-02-20'),
        fechaValidacion: new Date('2026-02-20'),
        validadoPor: 'Sistema',
        createdAt: new Date('2026-02-20'),
        updatedAt: new Date('2026-02-20')
      },
      {
        id: '5',
        eventoId: '2',
        clienteId: '2',
        clienteNombre: 'Roberto López Hernández',
        eventoNombre: 'XV Años Sofía',
        monto: 35000,
        metodoPago: 'transferencia',
        estado: 'validando',
        referenciaBancaria: 'SPEI-20260304-089',
        comprobante: 'https://example.com/comprobante2.jpg',
        fechaPago: new Date('2026-03-04'),
        observaciones: 'Pendiente verificar referencia con banco',
        createdAt: new Date('2026-03-04'),
        updatedAt: new Date('2026-03-04')
      },
      {
        id: '6',
        eventoId: '4',
        clienteId: '4',
        clienteNombre: 'Carlos Sánchez Ruiz',
        eventoNombre: 'Gala Corporativa 2026',
        monto: 120000,
        metodoPago: 'transferencia',
        estado: 'completado',
        referenciaBancaria: 'SPEI-20260220-034',
        fechaPago: new Date('2026-02-20'),
        fechaValidacion: new Date('2026-02-20'),
        validadoPor: 'Admin',
        createdAt: new Date('2026-02-20'),
        updatedAt: new Date('2026-02-20')
      },
      {
        id: '7',
        eventoId: '1',
        clienteId: '1',
        clienteNombre: 'María García López',
        eventoNombre: 'Boda García-López',
        monto: 50000,
        metodoPago: 'efectivo',
        estado: 'pendiente',
        fechaPago: new Date('2026-03-05'),
        observaciones: 'Pago en efectivo, pendiente confirmar recepción',
        createdAt: new Date('2026-03-05'),
        updatedAt: new Date('2026-03-05')
      }
    ]);

    this._comprobantes.set([
      {
        id: '1',
        pagoId: '2',
        tipo: 'imagen',
        nombreArchivo: 'comprobante_spei_70000.jpg',
        url: 'https://example.com/comprobante.jpg',
        tamaño: 256000,
        subidoPor: 'María García',
        fechaSubida: new Date('2026-03-01'),
        verificado: false
      },
      {
        id: '2',
        pagoId: '5',
        tipo: 'imagen',
        nombreArchivo: 'transferencia_35000.jpg',
        url: 'https://example.com/comprobante2.jpg',
        tamaño: 180000,
        subidoPor: 'Roberto López',
        fechaSubida: new Date('2026-03-04'),
        verificado: false
      }
    ]);
  }
}
