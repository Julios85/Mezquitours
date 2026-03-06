import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DummyDataService } from '../../shared/services/dummy-data.service';
import { Proveedor, CategoriaProveedor } from '../../shared/models';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Directorio de Proveedores</h1>
          <p class="text-gray-500 mt-1">Gestiona tus proveedores de servicios</p>
        </div>
        <button (click)="showModal = true"
                class="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Proveedor
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div class="flex items-center gap-4">
          <div class="relative flex-1">
            <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text"
                   [(ngModel)]="searchTerm"
                   placeholder="Buscar proveedores..."
                   class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
          </div>
          <select [(ngModel)]="filterCategoria"
                  class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Todas las categorías</option>
            @for (cat of categorias; track cat.value) {
              <option [value]="cat.value">{{ cat.label }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Categories Quick Filter -->
      <div class="flex gap-2 mb-6 flex-wrap">
        <button (click)="filterCategoria = ''"
                [class.bg-primary]="!filterCategoria"
                [class.text-white]="!filterCategoria"
                class="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors">
          Todos
        </button>
        @for (cat of categorias; track cat.value) {
          <button (click)="filterCategoria = cat.value"
                  [class.bg-primary]="filterCategoria === cat.value"
                  [class.text-white]="filterCategoria === cat.value"
                  class="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors">
            {{ cat.label }}
          </button>
        }
      </div>

      <!-- Providers Grid -->
      <div class="grid grid-cols-3 gap-6">
        @for (proveedor of filteredProveedores(); track proveedor.id) {
          <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="h-3" [ngClass]="getCategoriaColor(proveedor.categoria)"></div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="font-semibold text-lg text-gray-800">{{ proveedor.nombre }}</h3>
                  <span class="text-sm px-2 py-0.5 rounded-full"
                        [ngClass]="getCategoriaBadge(proveedor.categoria)">
                    {{ getCategoriaLabel(proveedor.categoria) }}
                  </span>
                </div>
                <div class="flex items-center gap-1 text-yellow-500">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="font-medium text-gray-700">{{ proveedor.calificacion }}</span>
                </div>
              </div>

              <p class="text-gray-600 text-sm mb-4">{{ proveedor.descripcion }}</p>

              <div class="flex flex-wrap gap-2 mb-4">
                @for (servicio of proveedor.servicios.slice(0, 3); track servicio) {
                  <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{{ servicio }}</span>
                }
                @if (proveedor.servicios.length > 3) {
                  <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">+{{ proveedor.servicios.length - 3 }}</span>
                }
              </div>

              <div class="border-t border-gray-100 pt-4">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-xs text-gray-500">Precio base</p>
                    <p class="font-semibold text-primary">{{ proveedor.precioBase | currency:'MXN':'symbol-narrow' }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Contactar">
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </button>
                    <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Ver detalles">
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Modal -->
      @if (showModal) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">Nuevo Proveedor</h2>
              <button (click)="showModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form (ngSubmit)="saveProveedor()" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del negocio</label>
                  <input type="text" [(ngModel)]="newProveedor.nombre" name="nombre"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select [(ngModel)]="newProveedor.categoria" name="categoria"
                          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                    @for (cat of categorias; track cat.value) {
                      <option [value]="cat.value">{{ cat.label }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
                  <input type="text" [(ngModel)]="newProveedor.contacto" name="contacto"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" [(ngModel)]="newProveedor.telefono" name="telefono"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" [(ngModel)]="newProveedor.email" name="email"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Precio base (MXN)</label>
                  <input type="number" [(ngModel)]="newProveedor.precioBase" name="precio"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input type="text" [(ngModel)]="newProveedor.direccion" name="direccion"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input type="text" [(ngModel)]="newProveedor.ciudad" name="ciudad"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea [(ngModel)]="newProveedor.descripcion" name="descripcion" rows="3"
                          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"></textarea>
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button type="button" (click)="showModal = false"
                        class="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit"
                        class="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  categorias: { value: CategoriaProveedor; label: string }[] = [];
  searchTerm = '';
  filterCategoria = '';
  showModal = false;

  newProveedor: Partial<Proveedor> = {
    nombre: '',
    categoria: 'catering',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    precioBase: 0,
    descripcion: '',
    servicios: [],
    activo: true
  };

  constructor(private dummyData: DummyDataService) {}

  ngOnInit() {
    this.proveedores = this.dummyData.getProveedores();
    this.categorias = this.dummyData.getCategorias();
  }

  filteredProveedores(): Proveedor[] {
    return this.proveedores.filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          p.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCategoria = !this.filterCategoria || p.categoria === this.filterCategoria;
      return matchSearch && matchCategoria;
    });
  }

  getCategoriaLabel(categoria: CategoriaProveedor): string {
    return this.categorias.find(c => c.value === categoria)?.label || categoria;
  }

  getCategoriaColor(categoria: CategoriaProveedor): string {
    const colors: Record<CategoriaProveedor, string> = {
      catering: 'bg-orange-500',
      fotografia: 'bg-purple-500',
      musica: 'bg-pink-500',
      decoracion: 'bg-yellow-500',
      floreria: 'bg-green-500',
      salon: 'bg-blue-500',
      hotel: 'bg-teal-500',
      transporte: 'bg-gray-500',
      vestimenta: 'bg-rose-500',
      pasteleria: 'bg-amber-500'
    };
    return colors[categoria];
  }

  getCategoriaBadge(categoria: CategoriaProveedor): string {
    const badges: Record<CategoriaProveedor, string> = {
      catering: 'bg-orange-100 text-orange-700',
      fotografia: 'bg-purple-100 text-purple-700',
      musica: 'bg-pink-100 text-pink-700',
      decoracion: 'bg-yellow-100 text-yellow-700',
      floreria: 'bg-green-100 text-green-700',
      salon: 'bg-blue-100 text-blue-700',
      hotel: 'bg-teal-100 text-teal-700',
      transporte: 'bg-gray-100 text-gray-700',
      vestimenta: 'bg-rose-100 text-rose-700',
      pasteleria: 'bg-amber-100 text-amber-700'
    };
    return badges[categoria];
  }

  saveProveedor() {
    const proveedor: Proveedor = {
      id: Date.now().toString(),
      nombre: this.newProveedor.nombre || '',
      categoria: this.newProveedor.categoria || 'catering',
      contacto: this.newProveedor.contacto || '',
      telefono: this.newProveedor.telefono || '',
      email: this.newProveedor.email || '',
      direccion: this.newProveedor.direccion || '',
      ciudad: this.newProveedor.ciudad || '',
      calificacion: 5.0,
      precioBase: this.newProveedor.precioBase || 0,
      descripcion: this.newProveedor.descripcion || '',
      servicios: [],
      activo: true
    };
    this.proveedores.unshift(proveedor);
    this.showModal = false;
  }
}
