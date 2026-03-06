import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Cupon {
  id: string;
  codigo: string;
  descripcion: string;
  tipoDescuento: 'porcentaje' | 'monto';
  valor: number;
  fechaInicio: Date;
  fechaFin: Date;
  usosMaximos: number;
  usosActuales: number;
  aplicaA: string[];
  activo: boolean;
  createdAt: Date;
}

interface Promocion {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  destino: string;
  precioOriginal: number;
  precioPromo: number;
  fechaInicio: Date;
  fechaFin: Date;
  incluye: string[];
  activa: boolean;
}

@Component({
  selector: 'app-cupones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Cupones y Promociones</h1>
          <p class="text-gray-500 mt-1">Gestiona descuentos y ofertas especiales</p>
        </div>
        <div class="flex gap-3">
          <button (click)="showPromoModal = true"
                  class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nueva Promoción
          </button>
          <button (click)="showCuponModal = true"
                  class="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
            </svg>
            Nuevo Cupón
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6">
        <button (click)="activeTab = 'cupones'"
                [class.bg-primary]="activeTab === 'cupones'"
                [class.text-white]="activeTab === 'cupones'"
                class="px-6 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 transition-colors">
          Cupones
        </button>
        <button (click)="activeTab = 'promociones'"
                [class.bg-primary]="activeTab === 'promociones'"
                [class.text-white]="activeTab === 'promociones'"
                class="px-6 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 transition-colors">
          Promociones de Tours
        </button>
      </div>

      <!-- Cupones Tab -->
      @if (activeTab === 'cupones') {
        <!-- Stats -->
        <div class="grid grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <p class="text-3xl font-bold text-gray-800">{{ cupones.length }}</p>
            <p class="text-sm text-gray-500 mt-1">Total Cupones</p>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <p class="text-3xl font-bold text-green-600">{{ getCuponesActivos() }}</p>
            <p class="text-sm text-gray-500 mt-1">Activos</p>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <p class="text-3xl font-bold text-blue-600">{{ getTotalUsos() }}</p>
            <p class="text-sm text-gray-500 mt-1">Usos Totales</p>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <p class="text-3xl font-bold text-purple-600">{{ getCuponesExpirados() }}</p>
            <p class="text-sm text-gray-500 mt-1">Expirados</p>
          </div>
        </div>

        <!-- Cupones List -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Código</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Descripción</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Descuento</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Vigencia</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Usos</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Estado</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (cupon of cupones; track cupon.id) {
                <tr class="border-t border-gray-100 hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <span class="font-mono font-bold text-primary bg-primary bg-opacity-10 px-3 py-1 rounded">{{ cupon.codigo }}</span>
                      <button (click)="copiarCodigo(cupon.codigo)" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-600">{{ cupon.descripcion }}</td>
                  <td class="px-6 py-4">
                    <span class="font-semibold text-green-600">
                      @if (cupon.tipoDescuento === 'porcentaje') {
                        {{ cupon.valor }}%
                      } @else {
                        {{ cupon.valor | currency:'MXN':'symbol-narrow' }}
                      }
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ cupon.fechaInicio | date:'dd/MM' }} - {{ cupon.fechaFin | date:'dd/MM/yy' }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="w-20 h-2 bg-gray-200 rounded-full">
                        <div class="h-2 bg-primary rounded-full" [style.width.%]="(cupon.usosActuales / cupon.usosMaximos) * 100"></div>
                      </div>
                      <span class="text-sm text-gray-600">{{ cupon.usosActuales }}/{{ cupon.usosMaximos }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    @if (cupon.activo && !isExpired(cupon)) {
                      <span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Activo</span>
                    } @else if (isExpired(cupon)) {
                      <span class="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Expirado</span>
                    } @else {
                      <span class="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Inactivo</span>
                    }
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <button class="p-2 hover:bg-gray-100 rounded-lg" title="Editar">
                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button (click)="toggleCupon(cupon)" class="p-2 hover:bg-gray-100 rounded-lg" [title]="cupon.activo ? 'Desactivar' : 'Activar'">
                        @if (cupon.activo) {
                          <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        } @else {
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                          </svg>
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Promociones Tab -->
      @if (activeTab === 'promociones') {
        <div class="grid grid-cols-3 gap-6">
          @for (promo of promociones; track promo.id) {
            <div class="bg-white rounded-xl shadow-sm overflow-hidden group">
              <div class="relative h-48 bg-gray-200">
                <img [src]="promo.imagen + '?w=400&h=300&fit=crop'" [alt]="promo.nombre" class="w-full h-full object-cover">
                <div class="absolute top-3 left-3">
                  <span class="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{{ getDescuentoPorcentaje(promo) }}%
                  </span>
                </div>
                @if (!promo.activa) {
                  <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span class="bg-gray-800 text-white px-4 py-2 rounded-lg">Inactiva</span>
                  </div>
                }
              </div>
              <div class="p-5">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <h3 class="font-semibold text-lg text-gray-800">{{ promo.nombre }}</h3>
                    <p class="text-sm text-primary font-medium">{{ promo.destino }}</p>
                  </div>
                </div>

                <p class="text-gray-600 text-sm mb-4">{{ promo.descripcion }}</p>

                <div class="flex flex-wrap gap-1 mb-4">
                  @for (item of promo.incluye.slice(0, 3); track item) {
                    <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{{ item }}</span>
                  }
                </div>

                <div class="flex items-end justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p class="text-sm text-gray-400 line-through">{{ promo.precioOriginal | currency:'MXN':'symbol-narrow' }}</p>
                    <p class="text-2xl font-bold text-primary">{{ promo.precioPromo | currency:'MXN':'symbol-narrow' }}</p>
                    <p class="text-xs text-gray-500">por persona</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500">Válido hasta</p>
                    <p class="text-sm font-medium text-gray-700">{{ promo.fechaFin | date:'dd MMM yyyy' }}</p>
                  </div>
                </div>

                <div class="mt-4 flex gap-2">
                  <button class="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                    Editar
                  </button>
                  <button (click)="togglePromo(promo)"
                          class="flex-1 px-4 py-2 rounded-lg text-sm"
                          [class.bg-red-50]="promo.activa"
                          [class.text-red-600]="promo.activa"
                          [class.bg-green-50]="!promo.activa"
                          [class.text-green-600]="!promo.activa">
                    {{ promo.activa ? 'Desactivar' : 'Activar' }}
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Modal Nuevo Cupón -->
      @if (showCuponModal) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl w-full max-w-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">Nuevo Cupón</h2>
              <button (click)="showCuponModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form (ngSubmit)="saveCupon()" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Código</label>
                  <input type="text" [(ngModel)]="newCupon.codigo" name="codigo" placeholder="BODA2026"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Usos máximos</label>
                  <input type="number" [(ngModel)]="newCupon.usosMaximos" name="usos"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input type="text" [(ngModel)]="newCupon.descripcion" name="descripcion"
                       class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de descuento</label>
                  <select [(ngModel)]="newCupon.tipoDescuento" name="tipo"
                          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="porcentaje">Porcentaje (%)</option>
                    <option value="monto">Monto fijo ($)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <input type="number" [(ngModel)]="newCupon.valor" name="valor"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                  <input type="date" [(ngModel)]="newCupon.fechaInicio" name="fechaInicio"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                  <input type="date" [(ngModel)]="newCupon.fechaFin" name="fechaFin"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button type="button" (click)="showCuponModal = false"
                        class="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit"
                        class="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                  Crear Cupón
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Modal Nueva Promoción -->
      @if (showPromoModal) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl w-full max-w-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">Nueva Promoción</h2>
              <button (click)="showPromoModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form (ngSubmit)="savePromo()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la promoción</label>
                <input type="text" [(ngModel)]="newPromo.nombre" name="nombre"
                       class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                <select [(ngModel)]="newPromo.destino" name="destino"
                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="Europa">Europa</option>
                  <option value="México">México</option>
                  <option value="LATAM">Latinoamérica</option>
                  <option value="Caribe">Caribe</option>
                  <option value="Asia">Asia</option>
                  <option value="USA">Estados Unidos</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea [(ngModel)]="newPromo.descripcion" name="descripcion" rows="2"
                          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Precio original</label>
                  <input type="number" [(ngModel)]="newPromo.precioOriginal" name="precioOriginal"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Precio promoción</label>
                  <input type="number" [(ngModel)]="newPromo.precioPromo" name="precioPromo"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                  <input type="date" [(ngModel)]="newPromo.fechaInicio" name="fechaInicio"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                  <input type="date" [(ngModel)]="newPromo.fechaFin" name="fechaFin"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button type="button" (click)="showPromoModal = false"
                        class="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit"
                        class="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                  Crear Promoción
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class CuponesComponent implements OnInit {
  activeTab = 'cupones';
  cupones: Cupon[] = [];
  promociones: Promocion[] = [];

  showCuponModal = false;
  showPromoModal = false;

  newCupon: Partial<Cupon> = {
    codigo: '',
    descripcion: '',
    tipoDescuento: 'porcentaje',
    valor: 10,
    usosMaximos: 100
  };

  newPromo: Partial<Promocion> = {
    nombre: '',
    destino: 'Europa',
    descripcion: '',
    precioOriginal: 0,
    precioPromo: 0
  };

  ngOnInit() {
    this.loadDummyData();
  }

  loadDummyData() {
    this.cupones = [
      {
        id: '1',
        codigo: 'BODA2026',
        descripcion: 'Descuento en paquetes de boda',
        tipoDescuento: 'porcentaje',
        valor: 15,
        fechaInicio: new Date('2026-01-01'),
        fechaFin: new Date('2026-06-30'),
        usosMaximos: 50,
        usosActuales: 23,
        aplicaA: ['bodas'],
        activo: true,
        createdAt: new Date()
      },
      {
        id: '2',
        codigo: 'LUNA20',
        descripcion: 'Descuento luna de miel',
        tipoDescuento: 'porcentaje',
        valor: 20,
        fechaInicio: new Date('2026-01-01'),
        fechaFin: new Date('2026-12-31'),
        usosMaximos: 100,
        usosActuales: 45,
        aplicaA: ['hoteles', 'viajes'],
        activo: true,
        createdAt: new Date()
      },
      {
        id: '3',
        codigo: 'EUROPA500',
        descripcion: '$500 descuento en tours Europa',
        tipoDescuento: 'monto',
        valor: 500,
        fechaInicio: new Date('2026-03-01'),
        fechaFin: new Date('2026-05-31'),
        usosMaximos: 30,
        usosActuales: 30,
        aplicaA: ['tours'],
        activo: false,
        createdAt: new Date()
      },
      {
        id: '4',
        codigo: 'PROMO10',
        descripcion: '10% en cualquier servicio',
        tipoDescuento: 'porcentaje',
        valor: 10,
        fechaInicio: new Date('2025-01-01'),
        fechaFin: new Date('2025-12-31'),
        usosMaximos: 200,
        usosActuales: 180,
        aplicaA: ['todos'],
        activo: true,
        createdAt: new Date()
      }
    ];

    this.promociones = [
      {
        id: '1',
        nombre: 'Europa Romántica',
        descripcion: '15 días por París, Roma y Barcelona. Incluye vuelos y hoteles 4 estrellas.',
        imagen: 'https://picsum.photos/seed/photo-1502602898657-3e91760cbb34',
        destino: 'Europa',
        precioOriginal: 85000,
        precioPromo: 68000,
        fechaInicio: new Date('2026-01-01'),
        fechaFin: new Date('2026-06-30'),
        incluye: ['Vuelos', 'Hoteles 4★', 'Desayunos', 'Tours guiados'],
        activa: true
      },
      {
        id: '2',
        nombre: 'Cancún All Inclusive',
        descripcion: '5 noches en resort 5 estrellas con todo incluido.',
        imagen: 'https://picsum.photos/seed/photo-1552074284-5e88ef1aef18',
        destino: 'México',
        precioOriginal: 28000,
        precioPromo: 19900,
        fechaInicio: new Date('2026-01-01'),
        fechaFin: new Date('2026-04-30'),
        incluye: ['Todo incluido', 'Traslados', 'Resort 5★'],
        activa: true
      },
      {
        id: '3',
        nombre: 'Machu Picchu Místico',
        descripcion: '8 días descubriendo Perú: Lima, Cusco y Machu Picchu.',
        imagen: 'https://picsum.photos/seed/photo-1587595431973-160d0d94add1',
        destino: 'LATAM',
        precioOriginal: 45000,
        precioPromo: 35000,
        fechaInicio: new Date('2026-02-01'),
        fechaFin: new Date('2026-08-31'),
        incluye: ['Vuelos', 'Hoteles', 'Guías', 'Entradas'],
        activa: true
      },
      {
        id: '4',
        nombre: 'Punta Cana Paradise',
        descripcion: '7 noches en el Caribe con playas de ensueño.',
        imagen: 'https://picsum.photos/seed/photo-1548574505-5e239809ee19',
        destino: 'Caribe',
        precioOriginal: 38000,
        precioPromo: 29500,
        fechaInicio: new Date('2026-01-01'),
        fechaFin: new Date('2026-05-31'),
        incluye: ['All inclusive', 'Vuelos', 'Traslados'],
        activa: true
      }
    ];
  }

  getCuponesActivos(): number {
    return this.cupones.filter(c => c.activo && !this.isExpired(c)).length;
  }

  getCuponesExpirados(): number {
    return this.cupones.filter(c => this.isExpired(c)).length;
  }

  getTotalUsos(): number {
    return this.cupones.reduce((sum, c) => sum + c.usosActuales, 0);
  }

  isExpired(cupon: Cupon): boolean {
    return new Date(cupon.fechaFin) < new Date();
  }

  getDescuentoPorcentaje(promo: Promocion): number {
    return Math.round(((promo.precioOriginal - promo.precioPromo) / promo.precioOriginal) * 100);
  }

  copiarCodigo(codigo: string) {
    navigator.clipboard.writeText(codigo);
  }

  toggleCupon(cupon: Cupon) {
    cupon.activo = !cupon.activo;
  }

  togglePromo(promo: Promocion) {
    promo.activa = !promo.activa;
  }

  saveCupon() {
    const cupon: Cupon = {
      id: Date.now().toString(),
      codigo: (this.newCupon.codigo || '').toUpperCase(),
      descripcion: this.newCupon.descripcion || '',
      tipoDescuento: this.newCupon.tipoDescuento || 'porcentaje',
      valor: this.newCupon.valor || 0,
      fechaInicio: new Date(this.newCupon.fechaInicio || new Date()),
      fechaFin: new Date(this.newCupon.fechaFin || new Date()),
      usosMaximos: this.newCupon.usosMaximos || 100,
      usosActuales: 0,
      aplicaA: ['todos'],
      activo: true,
      createdAt: new Date()
    };
    this.cupones.unshift(cupon);
    this.showCuponModal = false;
  }

  savePromo() {
    const promo: Promocion = {
      id: Date.now().toString(),
      nombre: this.newPromo.nombre || '',
      descripcion: this.newPromo.descripcion || '',
      imagen: 'https://picsum.photos/seed/photo-1507525428034-b723cf961d3e',
      destino: this.newPromo.destino || 'México',
      precioOriginal: this.newPromo.precioOriginal || 0,
      precioPromo: this.newPromo.precioPromo || 0,
      fechaInicio: new Date(this.newPromo.fechaInicio || new Date()),
      fechaFin: new Date(this.newPromo.fechaFin || new Date()),
      incluye: ['Por definir'],
      activa: true
    };
    this.promociones.unshift(promo);
    this.showPromoModal = false;
  }
}
