import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DummyDataService } from '../../shared/services/dummy-data.service';
import { Evento, EstadoEvento } from '../../shared/models';

@Component({
  selector: 'app-planeador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Planeador de Eventos</h1>
          <p class="text-gray-500 mt-1">Organiza y da seguimiento a tus eventos</p>
        </div>
        <button (click)="showModal = true"
                class="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Evento
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-3xl font-bold">{{ eventos.length }}</p>
              <p class="text-pink-100 mt-1">Eventos Activos</p>
            </div>
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-3xl font-bold">{{ getTotalInvitados() }}</p>
              <p class="text-blue-100 mt-1">Invitados Totales</p>
            </div>
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-3xl font-bold">{{ getPresupuestoTotal() | currency:'MXN':'symbol-narrow':'1.0-0' }}</p>
              <p class="text-green-100 mt-1">Presupuesto Total</p>
            </div>
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-3xl font-bold">{{ getTareasPendientes() }}</p>
              <p class="text-amber-100 mt-1">Tareas Pendientes</p>
            </div>
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Events List -->
      <div class="space-y-6">
        @for (evento of eventos; track evento.id) {
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="p-6">
              <div class="flex justify-between items-start">
                <div class="flex gap-6">
                  <div class="w-24 h-24 rounded-xl flex items-center justify-center"
                       [ngClass]="getTipoBackground(evento.tipo)">
                    <span class="text-4xl">{{ getTipoEmoji(evento.tipo) }}</span>
                  </div>
                  <div>
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-xl font-semibold text-gray-800">{{ evento.nombre }}</h3>
                      <span class="px-3 py-1 rounded-full text-xs font-medium"
                            [ngClass]="getEstadoClass(evento.estado)">
                        {{ getEstadoLabel(evento.estado) }}
                      </span>
                    </div>
                    <p class="text-gray-500 mb-2">{{ evento.cliente }} • {{ evento.ubicacion }}</p>
                    <div class="flex items-center gap-6 text-sm text-gray-600">
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        {{ evento.fecha | date:'dd MMM yyyy' }}
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {{ evento.invitados }} invitados
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/>
                        </svg>
                        {{ evento.proveedores.length }} proveedores
                      </span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500">Presupuesto</p>
                  <p class="text-xl font-bold text-gray-800">{{ evento.presupuesto | currency:'MXN':'symbol-narrow':'1.0-0' }}</p>
                  <div class="mt-2">
                    <div class="flex items-center gap-2 text-sm">
                      <span class="text-gray-500">Gastado:</span>
                      <span [class.text-red-500]="evento.presupuestoGastado > evento.presupuesto * 0.8"
                            [class.text-green-500]="evento.presupuestoGastado <= evento.presupuesto * 0.5"
                            [class.text-yellow-500]="evento.presupuestoGastado > evento.presupuesto * 0.5 && evento.presupuestoGastado <= evento.presupuesto * 0.8">
                        {{ evento.presupuestoGastado | currency:'MXN':'symbol-narrow':'1.0-0' }}
                      </span>
                    </div>
                    <div class="w-32 h-2 bg-gray-200 rounded-full mt-1">
                      <div class="h-2 rounded-full transition-all"
                           [style.width.%]="(evento.presupuestoGastado / evento.presupuesto) * 100"
                           [class.bg-green-500]="evento.presupuestoGastado <= evento.presupuesto * 0.5"
                           [class.bg-yellow-500]="evento.presupuestoGastado > evento.presupuesto * 0.5 && evento.presupuestoGastado <= evento.presupuesto * 0.8"
                           [class.bg-red-500]="evento.presupuestoGastado > evento.presupuesto * 0.8">
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tasks Progress -->
              <div class="mt-6 pt-6 border-t border-gray-100">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-medium text-gray-700">Tareas</h4>
                  <span class="text-sm text-gray-500">
                    {{ getCompletedTasks(evento) }}/{{ evento.tareas.length }} completadas
                  </span>
                </div>
                <div class="space-y-2">
                  @for (tarea of evento.tareas; track tarea.id) {
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <input type="checkbox"
                             [checked]="tarea.completada"
                             (change)="toggleTarea(evento, tarea)"
                             class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary">
                      <span [class.line-through]="tarea.completada"
                            [class.text-gray-400]="tarea.completada"
                            class="flex-1">
                        {{ tarea.descripcion }}
                      </span>
                      @if (tarea.fechaLimite && !tarea.completada) {
                        <span class="text-xs px-2 py-1 rounded"
                              [class.bg-red-100]="isOverdue(tarea.fechaLimite)"
                              [class.text-red-600]="isOverdue(tarea.fechaLimite)"
                              [class.bg-gray-100]="!isOverdue(tarea.fechaLimite)"
                              [class.text-gray-600]="!isOverdue(tarea.fechaLimite)">
                          {{ tarea.fechaLimite | date:'dd/MM' }}
                        </span>
                      }
                    </div>
                  }
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-6 flex justify-end gap-3">
                <button class="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Ver Detalles
                </button>
                <button class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm">
                  Agregar Tarea
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Modal -->
      @if (showModal) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl w-full max-w-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">Nuevo Evento</h2>
              <button (click)="showModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form (ngSubmit)="saveEvento()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del evento</label>
                <input type="text" [(ngModel)]="newEvento.nombre" name="nombre"
                       class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select [(ngModel)]="newEvento.tipo" name="tipo"
                          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="boda">Boda</option>
                    <option value="quinceanos">XV Años</option>
                    <option value="bautizo">Bautizo</option>
                    <option value="corporativo">Corporativo</option>
                    <option value="viaje">Viaje</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input type="date" [(ngModel)]="newEvento.fecha" name="fecha"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <input type="text" [(ngModel)]="newEvento.cliente" name="cliente"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Invitados</label>
                  <input type="number" [(ngModel)]="newEvento.invitados" name="invitados"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <input type="text" [(ngModel)]="newEvento.ubicacion" name="ubicacion"
                       class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Presupuesto (MXN)</label>
                <input type="number" [(ngModel)]="newEvento.presupuesto" name="presupuesto"
                       class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button type="button" (click)="showModal = false"
                        class="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit"
                        class="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                  Crear Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class PlaneadorComponent implements OnInit {
  eventos: Evento[] = [];
  showModal = false;

  newEvento: Partial<Evento> = {
    nombre: '',
    tipo: 'boda',
    fecha: new Date(),
    cliente: '',
    presupuesto: 0,
    ubicacion: '',
    invitados: 0
  };

  constructor(private dummyData: DummyDataService) {}

  ngOnInit() {
    this.eventos = this.dummyData.getEventos();
  }

  getTotalInvitados(): number {
    return this.eventos.reduce((sum, e) => sum + e.invitados, 0);
  }

  getPresupuestoTotal(): number {
    return this.eventos.reduce((sum, e) => sum + e.presupuesto, 0);
  }

  getTareasPendientes(): number {
    return this.eventos.reduce((sum, e) => sum + e.tareas.filter(t => !t.completada).length, 0);
  }

  getCompletedTasks(evento: Evento): number {
    return evento.tareas.filter(t => t.completada).length;
  }

  getTipoEmoji(tipo: string): string {
    const emojis: Record<string, string> = {
      boda: '💒',
      quinceanos: '👑',
      bautizo: '👼',
      corporativo: '🏢',
      viaje: '✈️',
      otro: '🎉'
    };
    return emojis[tipo] || '🎉';
  }

  getTipoBackground(tipo: string): string {
    const backgrounds: Record<string, string> = {
      boda: 'bg-pink-100',
      quinceanos: 'bg-purple-100',
      bautizo: 'bg-blue-100',
      corporativo: 'bg-gray-100',
      viaje: 'bg-teal-100',
      otro: 'bg-orange-100'
    };
    return backgrounds[tipo] || 'bg-gray-100';
  }

  getEstadoClass(estado: EstadoEvento): string {
    const classes: Record<EstadoEvento, string> = {
      planificacion: 'bg-blue-100 text-blue-700',
      en_progreso: 'bg-yellow-100 text-yellow-700',
      completado: 'bg-green-100 text-green-700',
      cancelado: 'bg-red-100 text-red-700'
    };
    return classes[estado];
  }

  getEstadoLabel(estado: EstadoEvento): string {
    const labels: Record<EstadoEvento, string> = {
      planificacion: 'En Planificación',
      en_progreso: 'En Progreso',
      completado: 'Completado',
      cancelado: 'Cancelado'
    };
    return labels[estado];
  }

  isOverdue(fecha: Date): boolean {
    return new Date(fecha) < new Date();
  }

  toggleTarea(evento: Evento, tarea: any) {
    tarea.completada = !tarea.completada;
  }

  saveEvento() {
    const evento: Evento = {
      id: Date.now().toString(),
      nombre: this.newEvento.nombre || '',
      tipo: this.newEvento.tipo || 'boda',
      fecha: this.newEvento.fecha || new Date(),
      cliente: this.newEvento.cliente || '',
      presupuesto: this.newEvento.presupuesto || 0,
      presupuestoGastado: 0,
      ubicacion: this.newEvento.ubicacion || '',
      estado: 'planificacion',
      invitados: this.newEvento.invitados || 0,
      proveedores: [],
      tareas: []
    };
    this.eventos.unshift(evento);
    this.showModal = false;
  }
}
