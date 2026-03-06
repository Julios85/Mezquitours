import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DummyDataService } from '../../shared/services/dummy-data.service';
import { Cita, EstadoCita, TipoEvento } from '../../shared/models';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Gestión de Citas</h1>
          <p class="text-gray-500 mt-1">Administra las citas con tus clientes</p>
        </div>
        <button (click)="showModal = true"
                class="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nueva Cita
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ citas.length }}</p>
              <p class="text-sm text-gray-500">Total Citas</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ getPendientes() }}</p>
              <p class="text-sm text-gray-500">Pendientes</p>
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
              <p class="text-2xl font-bold text-gray-800">{{ getConfirmadas() }}</p>
              <p class="text-sm text-gray-500">Confirmadas</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ getBodas() }}</p>
              <p class="text-sm text-gray-500">Bodas</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center gap-4">
            <div class="relative flex-1">
              <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text"
                     [(ngModel)]="searchTerm"
                     placeholder="Buscar citas..."
                     class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
            </div>
            <select [(ngModel)]="filterEstado"
                    class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Cliente</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Fecha</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Hora</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Tipo</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Estado</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (cita of filteredCitas(); track cita.id) {
              <tr class="border-t border-gray-100 hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div>
                    <p class="font-medium text-gray-800">{{ cita.clienteNombre }}</p>
                    <p class="text-sm text-gray-500">{{ cita.clienteEmail }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-600">{{ cita.fecha | date:'dd/MM/yyyy' }}</td>
                <td class="px-6 py-4 text-gray-600">{{ cita.hora }}</td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 rounded-full text-xs font-medium"
                        [ngClass]="getTipoClass(cita.tipoEvento)">
                    {{ getTipoLabel(cita.tipoEvento) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 rounded-full text-xs font-medium"
                        [ngClass]="getEstadoClass(cita.estado)">
                    {{ cita.estado | titlecase }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Ver detalles">
                      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                    <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Editar">
                      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button class="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar">
                      <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Modal Nueva Cita -->
      @if (showModal) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl w-full max-w-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">Nueva Cita</h2>
              <button (click)="showModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form (ngSubmit)="saveCita()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del cliente</label>
                <input type="text" [(ngModel)]="newCita.clienteNombre" name="nombre"
                       class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" [(ngModel)]="newCita.clienteEmail" name="email"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" [(ngModel)]="newCita.clienteTelefono" name="telefono"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input type="date" [(ngModel)]="newCita.fecha" name="fecha"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <input type="time" [(ngModel)]="newCita.hora" name="hora"
                         class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de evento</label>
                <select [(ngModel)]="newCita.tipoEvento" name="tipo"
                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  @for (tipo of tiposEvento; track tipo.value) {
                    <option [value]="tipo.value">{{ tipo.label }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea [(ngModel)]="newCita.notas" name="notas" rows="3"
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
export class CitasComponent implements OnInit {
  citas: Cita[] = [];
  searchTerm = '';
  filterEstado = '';
  showModal = false;
  tiposEvento: { value: TipoEvento; label: string }[] = [];

  newCita: Partial<Cita> = {
    clienteNombre: '',
    clienteEmail: '',
    clienteTelefono: '',
    fecha: new Date(),
    hora: '',
    tipoEvento: 'boda',
    notas: ''
  };

  constructor(private dummyData: DummyDataService) {}

  ngOnInit() {
    this.citas = this.dummyData.getCitas();
    this.tiposEvento = this.dummyData.getTiposEvento();
  }

  filteredCitas(): Cita[] {
    return this.citas.filter(cita => {
      const matchSearch = cita.clienteNombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          cita.clienteEmail.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchEstado = !this.filterEstado || cita.estado === this.filterEstado;
      return matchSearch && matchEstado;
    });
  }

  getPendientes(): number {
    return this.citas.filter(c => c.estado === 'pendiente').length;
  }

  getConfirmadas(): number {
    return this.citas.filter(c => c.estado === 'confirmada').length;
  }

  getBodas(): number {
    return this.citas.filter(c => c.tipoEvento === 'boda').length;
  }

  getEstadoClass(estado: EstadoCita): string {
    const classes: Record<EstadoCita, string> = {
      pendiente: 'bg-yellow-100 text-yellow-700',
      confirmada: 'bg-green-100 text-green-700',
      completada: 'bg-blue-100 text-blue-700',
      cancelada: 'bg-red-100 text-red-700'
    };
    return classes[estado];
  }

  getTipoClass(tipo: TipoEvento): string {
    const classes: Record<TipoEvento, string> = {
      boda: 'bg-pink-100 text-pink-700',
      quinceanos: 'bg-purple-100 text-purple-700',
      bautizo: 'bg-blue-100 text-blue-700',
      corporativo: 'bg-gray-100 text-gray-700',
      viaje: 'bg-teal-100 text-teal-700',
      otro: 'bg-orange-100 text-orange-700'
    };
    return classes[tipo];
  }

  getTipoLabel(tipo: TipoEvento): string {
    const labels: Record<TipoEvento, string> = {
      boda: 'Boda',
      quinceanos: 'XV Años',
      bautizo: 'Bautizo',
      corporativo: 'Corporativo',
      viaje: 'Viaje',
      otro: 'Otro'
    };
    return labels[tipo];
  }

  saveCita() {
    const cita: Cita = {
      id: Date.now().toString(),
      clienteNombre: this.newCita.clienteNombre || '',
      clienteEmail: this.newCita.clienteEmail || '',
      clienteTelefono: this.newCita.clienteTelefono || '',
      fecha: this.newCita.fecha || new Date(),
      hora: this.newCita.hora || '',
      tipoEvento: this.newCita.tipoEvento || 'otro',
      estado: 'pendiente',
      notas: this.newCita.notas,
      createdAt: new Date()
    };
    this.citas.unshift(cita);
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.newCita = {
      clienteNombre: '',
      clienteEmail: '',
      clienteTelefono: '',
      fecha: new Date(),
      hora: '',
      tipoEvento: 'boda',
      notas: ''
    };
  }
}
