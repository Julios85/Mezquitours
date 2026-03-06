import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagosService } from '../../shared/services/pagos.service';
import { Pago, EstadoPago, MetodoPago } from '../../shared/models';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Gestión de Pagos</h1>
          <p class="text-gray-500 mt-1">Validación manual y seguimiento de pagos</p>
        </div>
        <button (click)="showNuevoModal = true"
                class="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Registrar Pago
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-3xl font-bold text-amber-600">{{ pagosService.pagosPendientes().length }}</p>
              <p class="text-sm text-gray-500 mt-1">Pendientes</p>
            </div>
            <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-3xl font-bold text-blue-600">{{ pagosService.totalPendienteValidacion() | currency:'MXN':'symbol-narrow':'1.0-0' }}</p>
              <p class="text-sm text-gray-500 mt-1">Por Validar</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-3xl font-bold text-green-600">{{ pagosService.pagosCompletados().length }}</p>
              <p class="text-sm text-gray-500 mt-1">Completados</p>
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
              <p class="text-3xl font-bold text-gray-800">{{ pagosService.totalRecaudado() | currency:'MXN':'symbol-narrow':'1.0-0' }}</p>
              <p class="text-sm text-gray-500 mt-1">Total Recaudado</p>
            </div>
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div class="flex gap-4 items-center">
          <div class="flex gap-2">
            <button (click)="filtroEstado = ''; filtrar()"
                    [class.bg-primary]="filtroEstado === ''"
                    [class.text-white]="filtroEstado === ''"
                    class="px-4 py-2 rounded-lg font-medium transition-colors"
                    [class.bg-gray-100]="filtroEstado !== ''">
              Todos
            </button>
            <button (click)="filtroEstado = 'pendiente'; filtrar()"
                    [class.bg-amber-500]="filtroEstado === 'pendiente'"
                    [class.text-white]="filtroEstado === 'pendiente'"
                    class="px-4 py-2 rounded-lg font-medium transition-colors"
                    [class.bg-gray-100]="filtroEstado !== 'pendiente'">
              Pendientes
            </button>
            <button (click)="filtroEstado = 'validando'; filtrar()"
                    [class.bg-blue-500]="filtroEstado === 'validando'"
                    [class.text-white]="filtroEstado === 'validando'"
                    class="px-4 py-2 rounded-lg font-medium transition-colors"
                    [class.bg-gray-100]="filtroEstado !== 'validando'">
              Validando
            </button>
            <button (click)="filtroEstado = 'completado'; filtrar()"
                    [class.bg-green-500]="filtroEstado === 'completado'"
                    [class.text-white]="filtroEstado === 'completado'"
                    class="px-4 py-2 rounded-lg font-medium transition-colors"
                    [class.bg-gray-100]="filtroEstado !== 'completado'">
              Completados
            </button>
            <button (click)="filtroEstado = 'rechazado'; filtrar()"
                    [class.bg-red-500]="filtroEstado === 'rechazado'"
                    [class.text-white]="filtroEstado === 'rechazado'"
                    class="px-4 py-2 rounded-lg font-medium transition-colors"
                    [class.bg-gray-100]="filtroEstado !== 'rechazado'">
              Rechazados
            </button>
          </div>
        </div>
      </div>

      <!-- Payments Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Cliente / Evento</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Monto</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Método</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Fecha</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Estado</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (pago of pagosFiltrados(); track pago.id) {
              <tr class="border-t border-gray-100 hover:bg-gray-50"
                  [class.bg-amber-50]="pago.estado === 'pendiente'"
                  [class.bg-blue-50]="pago.estado === 'validando'">
                <td class="px-6 py-4">
                  <div>
                    <p class="font-medium text-gray-800">{{ pago.clienteNombre }}</p>
                    <p class="text-sm text-gray-500">{{ pago.eventoNombre }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-lg font-semibold text-gray-800">
                    {{ pago.monto | currency:'MXN':'symbol-narrow':'1.0-0' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-full flex items-center justify-center"
                          [class.bg-blue-100]="pago.metodoPago === 'transferencia'"
                          [class.bg-green-100]="pago.metodoPago === 'efectivo'"
                          [class.bg-purple-100]="pago.metodoPago === 'tarjeta'"
                          [class.bg-amber-100]="pago.metodoPago === 'deposito'">
                      @if (pago.metodoPago === 'transferencia') {
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                        </svg>
                      }
                      @if (pago.metodoPago === 'efectivo') {
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                      }
                      @if (pago.metodoPago === 'tarjeta') {
                        <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                        </svg>
                      }
                      @if (pago.metodoPago === 'deposito') {
                        <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                      }
                    </span>
                    <div>
                      <span class="text-sm font-medium text-gray-800">{{ getMetodoLabel(pago.metodoPago) }}</span>
                      @if (pago.referenciaBancaria) {
                        <p class="text-xs text-gray-500 font-mono">{{ pago.referenciaBancaria }}</p>
                      }
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-gray-800">{{ pago.fechaPago | date:'dd/MM/yyyy' }}</p>
                  <p class="text-xs text-gray-500">{{ pago.fechaPago | date:'HH:mm' }}</p>
                </td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 rounded-full text-xs font-medium"
                        [class.bg-amber-100]="pago.estado === 'pendiente'"
                        [class.text-amber-700]="pago.estado === 'pendiente'"
                        [class.bg-blue-100]="pago.estado === 'validando'"
                        [class.text-blue-700]="pago.estado === 'validando'"
                        [class.bg-green-100]="pago.estado === 'completado'"
                        [class.text-green-700]="pago.estado === 'completado'"
                        [class.bg-red-100]="pago.estado === 'rechazado'"
                        [class.text-red-700]="pago.estado === 'rechazado'">
                    {{ getEstadoLabel(pago.estado) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    @if (pago.comprobante) {
                      <button (click)="verComprobante(pago)"
                              class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Ver comprobante">
                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </button>
                    }
                    @if (pago.estado === 'pendiente' || pago.estado === 'validando') {
                      <button (click)="abrirValidacion(pago)"
                              class="p-2 hover:bg-green-100 rounded-lg transition-colors" title="Validar pago">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </button>
                      <button (click)="abrirRechazo(pago)"
                              class="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Rechazar pago">
                        <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </button>
                    }
                    <button (click)="verDetalle(pago)"
                            class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Ver detalle">
                      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  No hay pagos con el filtro seleccionado
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Modal Validación -->
      @if (pagoValidar) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl w-full max-w-md p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">Validar Pago</h2>
              <button (click)="cerrarValidacion()" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="space-y-4 mb-6">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between mb-2">
                  <span class="text-gray-500">Cliente:</span>
                  <span class="font-medium">{{ pagoValidar.clienteNombre }}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-500">Monto:</span>
                  <span class="font-bold text-primary">{{ pagoValidar.monto | currency:'MXN':'symbol-narrow' }}</span>
                </div>
                @if (pagoValidar.referenciaBancaria) {
                  <div class="flex justify-between">
                    <span class="text-gray-500">Referencia:</span>
                    <span class="font-mono text-sm">{{ pagoValidar.referenciaBancaria }}</span>
                  </div>
                }
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones (opcional)</label>
                <textarea [(ngModel)]="observacionesValidacion" rows="3"
                          placeholder="Agregar notas sobre la validación..."
                          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <button (click)="cerrarValidacion()"
                      class="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button (click)="confirmarValidacion()"
                      class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Validar Pago
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modal Rechazo -->
      @if (pagoRechazar) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl w-full max-w-md p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-red-600">Rechazar Pago</h2>
              <button (click)="cerrarRechazo()" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="space-y-4 mb-6">
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-700 text-sm">
                  Esta acción marcará el pago como rechazado. El cliente será notificado.
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Motivo del rechazo *</label>
                <textarea [(ngModel)]="motivoRechazo" rows="3" required
                          placeholder="Explica el motivo del rechazo..."
                          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20"></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <button (click)="cerrarRechazo()"
                      class="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button (click)="confirmarRechazo()"
                      [disabled]="!motivoRechazo"
                      class="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors">
                Rechazar Pago
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modal Detalle -->
      @if (pagoDetalle) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl w-full max-w-lg">
            <div class="p-6 border-b border-gray-100">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800">Detalle del Pago</h2>
                <button (click)="cerrarDetalle()" class="p-2 hover:bg-gray-100 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="p-6 space-y-4">
              <div class="flex justify-between items-center pb-4 border-b border-gray-100">
                <span class="text-gray-500">Monto</span>
                <span class="text-2xl font-bold text-primary">{{ pagoDetalle.monto | currency:'MXN':'symbol-narrow' }}</span>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Cliente</p>
                  <p class="font-medium">{{ pagoDetalle.clienteNombre }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Evento</p>
                  <p class="font-medium">{{ pagoDetalle.eventoNombre }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Método de Pago</p>
                  <p class="font-medium">{{ getMetodoLabel(pagoDetalle.metodoPago) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Fecha de Pago</p>
                  <p class="font-medium">{{ pagoDetalle.fechaPago | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
                @if (pagoDetalle.referenciaBancaria) {
                  <div class="col-span-2">
                    <p class="text-sm text-gray-500">Referencia Bancaria</p>
                    <p class="font-mono font-medium">{{ pagoDetalle.referenciaBancaria }}</p>
                  </div>
                }
                @if (pagoDetalle.fechaValidacion) {
                  <div>
                    <p class="text-sm text-gray-500">Validado Por</p>
                    <p class="font-medium">{{ pagoDetalle.validadoPor }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Fecha Validación</p>
                    <p class="font-medium">{{ pagoDetalle.fechaValidacion | date:'dd/MM/yyyy HH:mm' }}</p>
                  </div>
                }
              </div>

              @if (pagoDetalle.observaciones) {
                <div class="pt-4 border-t border-gray-100">
                  <p class="text-sm text-gray-500 mb-1">Observaciones</p>
                  <p class="text-gray-700 bg-gray-50 rounded-lg p-3">{{ pagoDetalle.observaciones }}</p>
                </div>
              }
            </div>

            <div class="p-6 border-t border-gray-100 flex justify-end">
              <button (click)="cerrarDetalle()"
                      class="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modal Nuevo Pago -->
      @if (showNuevoModal) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl w-full max-w-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">Registrar Pago</h2>
              <button (click)="showNuevoModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Monto *</label>
                  <input type="number" placeholder="0.00"
                         class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Método *</label>
                  <select class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="transferencia">Transferencia</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="deposito">Depósito</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <select class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Seleccionar cliente...</option>
                  <option value="1">María García López</option>
                  <option value="2">Roberto López Hernández</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Referencia bancaria</label>
                <input type="text" placeholder="SPEI-XXXX-XXXX"
                       class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea rows="2"
                          class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"></textarea>
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button type="button" (click)="showNuevoModal = false"
                        class="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit"
                        class="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                  Registrar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class PagosComponent {
  pagosService = inject(PagosService);

  filtroEstado: EstadoPago | '' = '';
  pagosFiltrados = signal<Pago[]>([]);

  pagoValidar: Pago | null = null;
  pagoRechazar: Pago | null = null;
  pagoDetalle: Pago | null = null;
  showNuevoModal = false;

  observacionesValidacion = '';
  motivoRechazo = '';

  constructor() {
    this.filtrar();
  }

  filtrar(): void {
    const pagos = this.filtroEstado
      ? this.pagosService.filtrarPorEstado(this.filtroEstado)
      : this.pagosService.pagos();
    this.pagosFiltrados.set(pagos);
  }

  getMetodoLabel(metodo: MetodoPago): string {
    const labels: Record<MetodoPago, string> = {
      transferencia: 'Transferencia',
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      deposito: 'Depósito'
    };
    return labels[metodo];
  }

  getEstadoLabel(estado: EstadoPago): string {
    const labels: Record<EstadoPago, string> = {
      pendiente: 'Pendiente',
      validando: 'Validando',
      completado: 'Completado',
      rechazado: 'Rechazado'
    };
    return labels[estado];
  }

  abrirValidacion(pago: Pago): void {
    this.pagoValidar = pago;
    this.observacionesValidacion = '';
  }

  cerrarValidacion(): void {
    this.pagoValidar = null;
    this.observacionesValidacion = '';
  }

  confirmarValidacion(): void {
    if (this.pagoValidar) {
      this.pagosService.validarPago(this.pagoValidar.id, 'Admin', this.observacionesValidacion);
      this.cerrarValidacion();
      this.filtrar();
    }
  }

  abrirRechazo(pago: Pago): void {
    this.pagoRechazar = pago;
    this.motivoRechazo = '';
  }

  cerrarRechazo(): void {
    this.pagoRechazar = null;
    this.motivoRechazo = '';
  }

  confirmarRechazo(): void {
    if (this.pagoRechazar && this.motivoRechazo) {
      this.pagosService.rechazarPago(this.pagoRechazar.id, 'Admin', this.motivoRechazo);
      this.cerrarRechazo();
      this.filtrar();
    }
  }

  verDetalle(pago: Pago): void {
    this.pagoDetalle = pago;
  }

  cerrarDetalle(): void {
    this.pagoDetalle = null;
  }

  verComprobante(pago: Pago): void {
    if (pago.comprobante) {
      window.open(pago.comprobante, '_blank');
    }
  }
}
