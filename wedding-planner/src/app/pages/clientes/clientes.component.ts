import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../shared/services/clientes.service';
import { ClienteActivo, EstadoCliente } from '../../shared/models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Clientes</h1>
          <p class="text-gray-500 mt-1">Directorio de clientes y gestión de relaciones</p>
        </div>
        <button (click)="showNuevoModal = true"
                class="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Cliente
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-3xl font-bold text-gray-800">{{ clientesService.totalClientes() }}</p>
              <p class="text-sm text-gray-500 mt-1">Total Clientes</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-3xl font-bold text-green-600">{{ clientesService.totalActivos() }}</p>
              <p class="text-sm text-gray-500 mt-1">Activos</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-3xl font-bold text-purple-600">{{ clientesService.clientesPotenciales().length }}</p>
              <p class="text-sm text-gray-500 mt-1">Potenciales</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-3xl font-bold text-amber-600">{{ clientesService.saldoPendienteTotal() | currency:'MXN':'symbol-narrow':'1.0-0' }}</p>
              <p class="text-sm text-gray-500 mt-1">Saldo Pendiente</p>
            </div>
            <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div class="flex gap-4 items-center">
          <div class="flex-1">
            <div class="relative">
              <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text"
                     [(ngModel)]="busqueda"
                     (ngModelChange)="filtrar()"
                     placeholder="Buscar por nombre, email o teléfono..."
                     class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
            </div>
          </div>
          <select [(ngModel)]="filtroEstado"
                  (ngModelChange)="filtrar()"
                  class="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="potencial">Potenciales</option>
            <option value="inactivo">Inactivos</option>
          </select>
          <button (click)="toggleFiltroSaldo()"
                  [class.bg-primary]="filtroConSaldo"
                  [class.text-white]="filtroConSaldo"
                  class="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Con saldo
          </button>
        </div>
      </div>

      <!-- Clients Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Cliente</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Contacto</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Eventos</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Saldo Pendiente</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Estado</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (cliente of clientesFiltrados(); track cliente.id) {
              <tr class="border-t border-gray-100 hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                      {{ getInitials(cliente.nombre) }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-800">{{ cliente.nombre }}</p>
                      <p class="text-sm text-gray-500">{{ cliente.ciudad || 'Sin ciudad' }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-gray-600">{{ cliente.email }}</p>
                  <p class="text-sm text-gray-500">{{ cliente.telefono }}</p>
                </td>
                <td class="px-6 py-4">
                  @if (cliente.eventosActivos > 0) {
                    <div>
                      <span class="font-semibold text-gray-800">{{ cliente.eventosActivos }}</span>
                      <span class="text-gray-500 text-sm"> activo(s)</span>
                      @if (cliente.proximoEvento) {
                        <p class="text-xs text-primary mt-1">
                          {{ cliente.proximoEvento.nombre }} - {{ cliente.proximoEvento.fecha | date:'dd/MM/yy' }}
                        </p>
                      }
                    </div>
                  } @else {
                    <span class="text-gray-400">Sin eventos</span>
                  }
                </td>
                <td class="px-6 py-4">
                  @if (cliente.saldoPendienteTotal > 0) {
                    <span class="font-semibold text-amber-600">
                      {{ cliente.saldoPendienteTotal | currency:'MXN':'symbol-narrow':'1.0-0' }}
                    </span>
                  } @else {
                    <span class="text-green-600 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      Al corriente
                    </span>
                  }
                </td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 rounded-full text-xs font-medium"
                        [class.bg-green-100]="cliente.estado === 'activo'"
                        [class.text-green-700]="cliente.estado === 'activo'"
                        [class.bg-purple-100]="cliente.estado === 'potencial'"
                        [class.text-purple-700]="cliente.estado === 'potencial'"
                        [class.bg-gray-100]="cliente.estado === 'inactivo'"
                        [class.text-gray-700]="cliente.estado === 'inactivo'">
                    {{ getEstadoLabel(cliente.estado) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button (click)="verDetalle(cliente)"
                            class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Ver detalle">
                      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                    @if (cliente.whatsapp) {
                      <a [href]="'https://wa.me/' + cliente.whatsapp.replace(/[^0-9]/g, '')"
                         target="_blank"
                         class="p-2 hover:bg-green-100 rounded-lg transition-colors" title="WhatsApp">
                        <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </a>
                    }
                    <a [href]="'mailto:' + cliente.email"
                       class="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Enviar email">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </a>
                    <button (click)="editarCliente(cliente)"
                            class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Editar">
                      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  No se encontraron clientes con los filtros seleccionados
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Modal Detalle Cliente -->
      @if (clienteSeleccionado) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-100">
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold">
                    {{ getInitials(clienteSeleccionado.nombre) }}
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-gray-800">{{ clienteSeleccionado.nombre }}</h2>
                    <p class="text-gray-500">{{ clienteSeleccionado.ciudad || 'Sin ciudad' }}</p>
                  </div>
                </div>
                <button (click)="cerrarDetalle()" class="p-2 hover:bg-gray-100 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="p-6 space-y-6">
              <!-- Contacto -->
              <div>
                <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">Información de Contacto</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Email</p>
                      <p class="font-medium text-gray-800">{{ clienteSeleccionado.email }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Teléfono</p>
                      <p class="font-medium text-gray-800">{{ clienteSeleccionado.telefono }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Resumen Financiero -->
              <div>
                <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">Resumen Financiero</h3>
                <div class="grid grid-cols-3 gap-4">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-2xl font-bold text-gray-800">{{ clienteSeleccionado.eventosActivos }}</p>
                    <p class="text-sm text-gray-500">Eventos Activos</p>
                  </div>
                  <div class="bg-amber-50 rounded-lg p-4">
                    <p class="text-2xl font-bold text-amber-600">
                      {{ clienteSeleccionado.saldoPendienteTotal | currency:'MXN':'symbol-narrow':'1.0-0' }}
                    </p>
                    <p class="text-sm text-gray-500">Saldo Pendiente</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-2xl font-bold text-gray-800">
                      {{ clienteSeleccionado.ultimoContacto | date:'dd/MM/yy' }}
                    </p>
                    <p class="text-sm text-gray-500">Último Contacto</p>
                  </div>
                </div>
              </div>

              <!-- Próximo Evento -->
              @if (clienteSeleccionado.proximoEvento) {
                <div>
                  <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">Próximo Evento</h3>
                  <div class="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div class="flex justify-between items-center">
                      <div>
                        <p class="font-semibold text-gray-800">{{ clienteSeleccionado.proximoEvento.nombre }}</p>
                        <p class="text-sm text-gray-500">{{ clienteSeleccionado.proximoEvento.fecha | date:'EEEE, d MMMM yyyy' }}</p>
                      </div>
                      <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors">
                        Ver Evento
                      </button>
                    </div>
                  </div>
                </div>
              }

              <!-- Notas -->
              @if (clienteSeleccionado.notas) {
                <div>
                  <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">Notas</h3>
                  <p class="text-gray-600 bg-gray-50 rounded-lg p-4">{{ clienteSeleccionado.notas }}</p>
                </div>
              }
            </div>

            <div class="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button (click)="cerrarDetalle()"
                      class="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Cerrar
              </button>
              <button class="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                Ver Pagos
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modal Nuevo/Editar Cliente -->
      @if (showNuevoModal) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl w-full max-w-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">{{ clienteEditar ? 'Editar' : 'Nuevo' }} Cliente</h2>
              <button (click)="cerrarNuevoModal()" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form (ngSubmit)="guardarCliente()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                <input type="text" [(ngModel)]="nuevoCliente.nombre" name="nombre" required
                       class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" [(ngModel)]="nuevoCliente.email" name="email" required
                         class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input type="tel" [(ngModel)]="nuevoCliente.telefono" name="telefono" required
                         class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input type="tel" [(ngModel)]="nuevoCliente.whatsapp" name="whatsapp"
                       class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input type="text" [(ngModel)]="nuevoCliente.ciudad" name="ciudad"
                         class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select [(ngModel)]="nuevoCliente.estado" name="estado"
                          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="potencial">Potencial</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea [(ngModel)]="nuevoCliente.notas" name="notas" rows="3"
                          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"></textarea>
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button type="button" (click)="cerrarNuevoModal()"
                        class="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit"
                        class="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                  {{ clienteEditar ? 'Guardar Cambios' : 'Crear Cliente' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class ClientesComponent {
  clientesService = inject(ClientesService);

  busqueda = '';
  filtroEstado: EstadoCliente | '' = '';
  filtroConSaldo = false;

  clientesFiltrados = signal<ClienteActivo[]>([]);
  clienteSeleccionado: ClienteActivo | null = null;
  clienteEditar: ClienteActivo | null = null;
  showNuevoModal = false;

  nuevoCliente: Partial<ClienteActivo> = {
    nombre: '',
    email: '',
    telefono: '',
    whatsapp: '',
    ciudad: '',
    estado: 'potencial',
    notas: ''
  };

  constructor() {
    this.filtrar();
  }

  filtrar(): void {
    let resultado = this.clientesService.clientes();

    if (this.busqueda) {
      resultado = this.clientesService.buscarClientes(this.busqueda);
    }

    if (this.filtroEstado) {
      resultado = resultado.filter(c => c.estado === this.filtroEstado);
    }

    if (this.filtroConSaldo) {
      resultado = resultado.filter(c => c.saldoPendienteTotal > 0);
    }

    this.clientesFiltrados.set(resultado);
  }

  toggleFiltroSaldo(): void {
    this.filtroConSaldo = !this.filtroConSaldo;
    this.filtrar();
  }

  getInitials(nombre: string): string {
    return nombre
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getEstadoLabel(estado: EstadoCliente): string {
    const labels: Record<EstadoCliente, string> = {
      activo: 'Activo',
      inactivo: 'Inactivo',
      potencial: 'Potencial'
    };
    return labels[estado];
  }

  verDetalle(cliente: ClienteActivo): void {
    this.clienteSeleccionado = cliente;
  }

  cerrarDetalle(): void {
    this.clienteSeleccionado = null;
  }

  editarCliente(cliente: ClienteActivo): void {
    this.clienteEditar = cliente;
    this.nuevoCliente = { ...cliente };
    this.showNuevoModal = true;
  }

  cerrarNuevoModal(): void {
    this.showNuevoModal = false;
    this.clienteEditar = null;
    this.nuevoCliente = {
      nombre: '',
      email: '',
      telefono: '',
      whatsapp: '',
      ciudad: '',
      estado: 'potencial',
      notas: ''
    };
  }

  guardarCliente(): void {
    if (this.clienteEditar) {
      this.clientesService.actualizarCliente(this.clienteEditar.id, this.nuevoCliente);
    } else {
      this.clientesService.agregarCliente(this.nuevoCliente as any);
    }
    this.cerrarNuevoModal();
    this.filtrar();
  }
}
