import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Mesa {
  id: string;
  numero: number;
  capacidad: number;
  asignados: Invitado[];
  ubicacion: string;
  tipo: 'redonda' | 'rectangular' | 'imperial';
}

interface Invitado {
  id: string;
  nombre: string;
  telefono?: string;
  confirmado: boolean;
  restriccionAlimentaria?: string;
  mesaId?: string;
}

interface EventoLogistica {
  id: string;
  nombre: string;
  fecha: Date;
  totalInvitados: number;
  confirmados: number;
}

@Component({
  selector: 'app-logistica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Logística de Eventos</h1>
          <p class="text-gray-500 mt-1">Administra mesas, sillas e invitados</p>
        </div>
        <div class="flex gap-3">
          <button (click)="showMesaModal = true"
                  class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nueva Mesa
          </button>
          <button (click)="showInvitadoModal = true"
                  class="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
            Agregar Invitado
          </button>
        </div>
      </div>

      <!-- Evento Selector -->
      <div class="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div class="flex items-center gap-4">
          <label class="text-sm font-medium text-gray-700">Evento:</label>
          <select [(ngModel)]="eventoSeleccionado" class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
            @for (evento of eventos; track evento.id) {
              <option [value]="evento.id">{{ evento.nombre }} - {{ evento.fecha | date:'dd/MM/yyyy' }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ invitados.length }}</p>
              <p class="text-sm text-gray-500">Total Invitados</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ getConfirmados() }}</p>
              <p class="text-sm text-gray-500">Confirmados</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ mesas.length }}</p>
              <p class="text-sm text-gray-500">Mesas</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ getSinAsignar() }}</p>
              <p class="text-sm text-gray-500">Sin Asignar</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-3 gap-6">
        <!-- Mesas Layout -->
        <div class="col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Distribución de Mesas</h2>

          <div class="grid grid-cols-4 gap-4">
            @for (mesa of mesas; track mesa.id) {
              <div class="border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
                   [class.border-primary]="mesaSeleccionada?.id === mesa.id"
                   [class.border-gray-200]="mesaSeleccionada?.id !== mesa.id"
                   (click)="seleccionarMesa(mesa)">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-lg font-bold text-gray-800">Mesa {{ mesa.numero }}</span>
                  <span class="text-xs px-2 py-1 rounded-full"
                        [class.bg-green-100]="mesa.asignados.length === mesa.capacidad"
                        [class.text-green-700]="mesa.asignados.length === mesa.capacidad"
                        [class.bg-yellow-100]="mesa.asignados.length < mesa.capacidad && mesa.asignados.length > 0"
                        [class.text-yellow-700]="mesa.asignados.length < mesa.capacidad && mesa.asignados.length > 0"
                        [class.bg-gray-100]="mesa.asignados.length === 0"
                        [class.text-gray-600]="mesa.asignados.length === 0">
                    {{ mesa.asignados.length }}/{{ mesa.capacidad }}
                  </span>
                </div>

                <div class="flex items-center justify-center my-3">
                  @if (mesa.tipo === 'redonda') {
                    <div class="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                      <span class="text-xs text-gray-500">{{ mesa.tipo }}</span>
                    </div>
                  } @else if (mesa.tipo === 'rectangular') {
                    <div class="w-20 h-12 rounded bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                      <span class="text-xs text-gray-500">{{ mesa.tipo }}</span>
                    </div>
                  } @else {
                    <div class="w-24 h-8 rounded bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                      <span class="text-xs text-gray-500">{{ mesa.tipo }}</span>
                    </div>
                  }
                </div>

                <p class="text-xs text-gray-500 text-center">{{ mesa.ubicacion }}</p>
              </div>
            }
          </div>
        </div>

        <!-- Invitados sin asignar -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Invitados sin Mesa</h2>

          <div class="space-y-2 max-h-96 overflow-y-auto">
            @for (invitado of getInvitadosSinMesa(); track invitado.id) {
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                   draggable="true"
                   (dragstart)="onDragStart($event, invitado)">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                    {{ invitado.nombre.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-800">{{ invitado.nombre }}</p>
                    <p class="text-xs text-gray-500">
                      @if (invitado.confirmado) {
                        <span class="text-green-600">Confirmado</span>
                      } @else {
                        <span class="text-yellow-600">Pendiente</span>
                      }
                    </p>
                  </div>
                </div>
                @if (mesaSeleccionada) {
                  <button (click)="asignarAMesa(invitado)"
                          class="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary-dark">
                    Asignar
                  </button>
                }
              </div>
            }

            @if (getInvitadosSinMesa().length === 0) {
              <div class="text-center py-8 text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <p class="text-sm">Todos asignados</p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Detalle Mesa Seleccionada -->
      @if (mesaSeleccionada) {
        <div class="mt-6 bg-white rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-800">Mesa {{ mesaSeleccionada.numero }} - {{ mesaSeleccionada.ubicacion }}</h2>
            <button (click)="mesaSeleccionada = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-4 gap-4">
            @for (invitado of mesaSeleccionada.asignados; track invitado.id) {
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                    {{ invitado.nombre.charAt(0) }}
                  </div>
                  <span class="text-sm font-medium text-gray-800">{{ invitado.nombre }}</span>
                </div>
                <button (click)="quitarDeMesa(invitado)" class="text-red-500 hover:text-red-700">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            }

            @for (empty of getEmptySeats(mesaSeleccionada); track $index) {
              <div class="flex items-center justify-center p-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
            }
          </div>
        </div>
      }

      <!-- Modal Nueva Mesa -->
      @if (showMesaModal) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl w-full max-w-md p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">Nueva Mesa</h2>
              <button (click)="showMesaModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form (ngSubmit)="saveMesa()" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Número de mesa</label>
                  <input type="number" [(ngModel)]="newMesa.numero" name="numero"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                  <input type="number" [(ngModel)]="newMesa.capacidad" name="capacidad"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select [(ngModel)]="newMesa.tipo" name="tipo"
                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="redonda">Redonda</option>
                  <option value="rectangular">Rectangular</option>
                  <option value="imperial">Imperial</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <input type="text" [(ngModel)]="newMesa.ubicacion" name="ubicacion" placeholder="Ej: Cerca del escenario"
                       class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button type="button" (click)="showMesaModal = false"
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

      <!-- Modal Nuevo Invitado -->
      @if (showInvitadoModal) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl w-full max-w-md p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">Agregar Invitado</h2>
              <button (click)="showInvitadoModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form (ngSubmit)="saveInvitado()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input type="text" [(ngModel)]="newInvitado.nombre" name="nombre"
                       class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="tel" [(ngModel)]="newInvitado.telefono" name="telefono"
                       class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Restricción alimentaria</label>
                <input type="text" [(ngModel)]="newInvitado.restriccionAlimentaria" name="restriccion" placeholder="Vegetariano, sin gluten, etc."
                       class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              </div>
              <div class="flex items-center gap-2">
                <input type="checkbox" [(ngModel)]="newInvitado.confirmado" name="confirmado" id="confirmado"
                       class="w-4 h-4 text-primary rounded focus:ring-primary">
                <label for="confirmado" class="text-sm text-gray-700">Asistencia confirmada</label>
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button type="button" (click)="showInvitadoModal = false"
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
export class LogisticaComponent implements OnInit {
  eventos: EventoLogistica[] = [];
  eventoSeleccionado = '';
  mesas: Mesa[] = [];
  invitados: Invitado[] = [];
  mesaSeleccionada: Mesa | null = null;

  showMesaModal = false;
  showInvitadoModal = false;

  newMesa: Partial<Mesa> = { numero: 1, capacidad: 8, tipo: 'redonda', ubicacion: '' };
  newInvitado: Partial<Invitado> = { nombre: '', telefono: '', confirmado: false };

  ngOnInit() {
    this.loadDummyData();
  }

  loadDummyData() {
    this.eventos = [
      { id: '1', nombre: 'Boda García-López', fecha: new Date('2026-06-15'), totalInvitados: 150, confirmados: 120 },
      { id: '2', nombre: 'XV Años Sofía', fecha: new Date('2026-08-20'), totalInvitados: 100, confirmados: 75 }
    ];
    this.eventoSeleccionado = '1';

    this.mesas = [
      { id: '1', numero: 1, capacidad: 10, asignados: [], ubicacion: 'Mesa de honor', tipo: 'imperial' },
      { id: '2', numero: 2, capacidad: 8, asignados: [], ubicacion: 'Cerca del escenario', tipo: 'redonda' },
      { id: '3', numero: 3, capacidad: 8, asignados: [], ubicacion: 'Cerca del escenario', tipo: 'redonda' },
      { id: '4', numero: 4, capacidad: 8, asignados: [], ubicacion: 'Zona central', tipo: 'redonda' },
      { id: '5', numero: 5, capacidad: 10, asignados: [], ubicacion: 'Zona central', tipo: 'rectangular' },
      { id: '6', numero: 6, capacidad: 8, asignados: [], ubicacion: 'Zona jardín', tipo: 'redonda' }
    ];

    this.invitados = [
      { id: '1', nombre: 'Juan García', confirmado: true },
      { id: '2', nombre: 'María López', confirmado: true },
      { id: '3', nombre: 'Carlos Rodríguez', confirmado: true },
      { id: '4', nombre: 'Ana Martínez', confirmado: false },
      { id: '5', nombre: 'Pedro Sánchez', confirmado: true },
      { id: '6', nombre: 'Laura Hernández', confirmado: true },
      { id: '7', nombre: 'Miguel Torres', confirmado: false },
      { id: '8', nombre: 'Carmen Díaz', confirmado: true }
    ];
  }

  getConfirmados(): number {
    return this.invitados.filter(i => i.confirmado).length;
  }

  getSinAsignar(): number {
    return this.invitados.filter(i => !i.mesaId).length;
  }

  getInvitadosSinMesa(): Invitado[] {
    return this.invitados.filter(i => !i.mesaId);
  }

  seleccionarMesa(mesa: Mesa) {
    this.mesaSeleccionada = this.mesaSeleccionada?.id === mesa.id ? null : mesa;
  }

  asignarAMesa(invitado: Invitado) {
    if (this.mesaSeleccionada && this.mesaSeleccionada.asignados.length < this.mesaSeleccionada.capacidad) {
      invitado.mesaId = this.mesaSeleccionada.id;
      this.mesaSeleccionada.asignados.push(invitado);
    }
  }

  quitarDeMesa(invitado: Invitado) {
    if (this.mesaSeleccionada) {
      const index = this.mesaSeleccionada.asignados.findIndex(i => i.id === invitado.id);
      if (index > -1) {
        this.mesaSeleccionada.asignados.splice(index, 1);
        invitado.mesaId = undefined;
      }
    }
  }

  getEmptySeats(mesa: Mesa): number[] {
    return Array(mesa.capacidad - mesa.asignados.length).fill(0);
  }

  onDragStart(event: DragEvent, invitado: Invitado) {
    event.dataTransfer?.setData('invitadoId', invitado.id);
  }

  saveMesa() {
    const mesa: Mesa = {
      id: Date.now().toString(),
      numero: this.newMesa.numero || this.mesas.length + 1,
      capacidad: this.newMesa.capacidad || 8,
      tipo: this.newMesa.tipo || 'redonda',
      ubicacion: this.newMesa.ubicacion || '',
      asignados: []
    };
    this.mesas.push(mesa);
    this.showMesaModal = false;
    this.newMesa = { numero: this.mesas.length + 1, capacidad: 8, tipo: 'redonda', ubicacion: '' };
  }

  saveInvitado() {
    const invitado: Invitado = {
      id: Date.now().toString(),
      nombre: this.newInvitado.nombre || '',
      telefono: this.newInvitado.telefono,
      confirmado: this.newInvitado.confirmado || false,
      restriccionAlimentaria: this.newInvitado.restriccionAlimentaria
    };
    this.invitados.push(invitado);
    this.showInvitadoModal = false;
    this.newInvitado = { nombre: '', telefono: '', confirmado: false };
  }
}
