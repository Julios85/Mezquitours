import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DummyDataService } from '../../shared/services/dummy-data.service';
import { Hotel } from '../../shared/models';

@Component({
  selector: 'app-hoteles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Hoteles y Viajes</h1>
          <p class="text-gray-500 mt-1">Reserva hoteles nacionales e internacionales</p>
        </div>
      </div>

      <!-- Search -->
      <div class="bg-white rounded-xl p-6 shadow-sm mb-8">
        <div class="grid grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Destino</label>
            <div class="relative">
              <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <input type="text"
                     [(ngModel)]="searchDestino"
                     placeholder="Ciudad o país"
                     class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha entrada</label>
            <input type="date"
                   [(ngModel)]="fechaEntrada"
                   class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha salida</label>
            <input type="date"
                   [(ngModel)]="fechaSalida"
                   class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Huéspedes</label>
            <select [(ngModel)]="huespedes"
                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="1">1 huésped</option>
              <option value="2">2 huéspedes</option>
              <option value="3">3 huéspedes</option>
              <option value="4">4+ huéspedes</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button class="bg-primary hover:bg-primary-dark text-white px-8 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Buscar Hoteles
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6">
        <button (click)="activeTab = 'nacional'"
                [class.bg-primary]="activeTab === 'nacional'"
                [class.text-white]="activeTab === 'nacional'"
                class="px-6 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 transition-colors">
          Nacional
        </button>
        <button (click)="activeTab = 'internacional'"
                [class.bg-primary]="activeTab === 'internacional'"
                [class.text-white]="activeTab === 'internacional'"
                class="px-6 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 transition-colors">
          Internacional
        </button>
        <button (click)="activeTab = 'lunamiel'"
                [class.bg-primary]="activeTab === 'lunamiel'"
                [class.text-white]="activeTab === 'lunamiel'"
                class="px-6 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 transition-colors">
          Luna de Miel
        </button>
      </div>

      <!-- Hotels Grid -->
      <div class="grid grid-cols-3 gap-6">
        @for (hotel of filteredHoteles(); track hotel.id) {
          <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
            <div class="relative h-48 bg-gray-200 overflow-hidden">
              <img [src]="hotel.imagen + '?w=400&h=300&fit=crop'"
                   [alt]="hotel.nombre"
                   class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
              <div class="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                @for (star of [1,2,3,4,5]; track star) {
                  <svg class="w-4 h-4" [class.text-yellow-400]="star <= hotel.estrellas" [class.text-gray-300]="star > hotel.estrellas" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                }
              </div>
              @if (!hotel.disponible) {
                <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span class="bg-red-500 text-white px-4 py-2 rounded-lg font-medium">No Disponible</span>
                </div>
              }
            </div>
            <div class="p-5">
              <h3 class="font-semibold text-lg text-gray-800 mb-1">{{ hotel.nombre }}</h3>
              <p class="text-gray-500 text-sm flex items-center gap-1 mb-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                {{ hotel.ciudad }}, {{ hotel.pais }}
              </p>

              <div class="flex flex-wrap gap-2 mb-4">
                @for (amenidad of hotel.amenidades.slice(0, 3); track amenidad) {
                  <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{{ amenidad }}</span>
                }
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p class="text-xs text-gray-500">Desde</p>
                  <p class="text-xl font-bold text-primary">{{ hotel.precioNoche | currency:'MXN':'symbol-narrow':'1.0-0' }}</p>
                  <p class="text-xs text-gray-500">por noche</p>
                </div>
                <button [disabled]="!hotel.disponible"
                        class="px-5 py-2 bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white rounded-lg transition-colors">
                  Reservar
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Empty State -->
      @if (filteredHoteles().length === 0) {
        <div class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <h3 class="text-lg font-medium text-gray-600 mb-2">No se encontraron hoteles</h3>
          <p class="text-gray-500">Intenta con otros filtros de búsqueda</p>
        </div>
      }
    </div>
  `
})
export class HotelesComponent implements OnInit {
  hoteles: Hotel[] = [];
  searchDestino = '';
  fechaEntrada = '';
  fechaSalida = '';
  huespedes = '2';
  activeTab = 'nacional';

  constructor(private dummyData: DummyDataService) {}

  ngOnInit() {
    this.hoteles = this.dummyData.getHoteles();
  }

  filteredHoteles(): Hotel[] {
    return this.hoteles.filter(hotel => {
      const matchSearch = !this.searchDestino ||
        hotel.ciudad.toLowerCase().includes(this.searchDestino.toLowerCase()) ||
        hotel.pais.toLowerCase().includes(this.searchDestino.toLowerCase()) ||
        hotel.nombre.toLowerCase().includes(this.searchDestino.toLowerCase());

      let matchTab = true;
      if (this.activeTab === 'nacional') {
        matchTab = hotel.pais === 'México';
      } else if (this.activeTab === 'internacional') {
        matchTab = hotel.pais !== 'México';
      }
      // 'lunamiel' shows all

      return matchSearch && matchTab;
    });
  }
}
