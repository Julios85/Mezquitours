import { Injectable, signal, computed } from '@angular/core';

export interface ItemCarrito {
  id: string;
  tipo: 'tour' | 'hotel' | 'servicio' | 'paquete';
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
  cantidad: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  personas?: number;
  detalles?: Record<string, string>;
}

export interface Carrito {
  items: ItemCarrito[];
  subtotal: number;
  descuento: number;
  cuponAplicado?: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private _items = signal<ItemCarrito[]>([]);
  private _cuponAplicado = signal<string | null>(null);
  private _descuentoPorcentaje = signal<number>(0);

  items = this._items.asReadonly();

  cantidadItems = computed(() =>
    this._items().reduce((sum, item) => sum + item.cantidad, 0)
  );

  subtotal = computed(() =>
    this._items().reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  );

  descuento = computed(() =>
    this.subtotal() * (this._descuentoPorcentaje() / 100)
  );

  total = computed(() =>
    this.subtotal() - this.descuento()
  );

  cuponAplicado = this._cuponAplicado.asReadonly();

  agregarItem(item: Omit<ItemCarrito, 'cantidad'>) {
    const items = this._items();
    const existente = items.find(i => i.id === item.id);

    if (existente) {
      this._items.update(items =>
        items.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i)
      );
    } else {
      this._items.update(items => [...items, { ...item, cantidad: 1 }]);
    }
  }

  removerItem(itemId: string) {
    this._items.update(items => items.filter(i => i.id !== itemId));
  }

  actualizarCantidad(itemId: string, cantidad: number) {
    if (cantidad <= 0) {
      this.removerItem(itemId);
      return;
    }
    this._items.update(items =>
      items.map(i => i.id === itemId ? { ...i, cantidad } : i)
    );
  }

  aplicarCupon(codigo: string): { exito: boolean; mensaje: string } {
    const cupones: Record<string, number> = {
      'BODA2026': 15,
      'LUNA20': 20,
      'PROMO10': 10,
      'EUROPA500': 5
    };

    const descuento = cupones[codigo.toUpperCase()];

    if (descuento) {
      this._cuponAplicado.set(codigo.toUpperCase());
      this._descuentoPorcentaje.set(descuento);
      return { exito: true, mensaje: `Cupón aplicado: ${descuento}% de descuento` };
    }

    return { exito: false, mensaje: 'Cupón inválido o expirado' };
  }

  removerCupon() {
    this._cuponAplicado.set(null);
    this._descuentoPorcentaje.set(0);
  }

  vaciarCarrito() {
    this._items.set([]);
    this._cuponAplicado.set(null);
    this._descuentoPorcentaje.set(0);
  }

  getCarrito(): Carrito {
    return {
      items: this._items(),
      subtotal: this.subtotal(),
      descuento: this.descuento(),
      cuponAplicado: this._cuponAplicado() || undefined,
      total: this.total()
    };
  }
}
