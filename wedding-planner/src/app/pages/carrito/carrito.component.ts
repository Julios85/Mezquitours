import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService, ItemCarrito } from '../../shared/services/carrito.service';

type MetodoPago = 'spei' | 'paypal' | null;
type PasoCheckout = 'carrito' | 'datos' | 'pago' | 'confirmacion';

interface DatosCliente {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  notas: string;
}

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Carrito de Compras</h1>
          <p class="text-gray-500 mt-1">{{ carritoService.cantidadItems() }} artículos en tu carrito</p>
        </div>
      </div>

      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-center">
          @for (step of pasos; track step.id; let i = $index) {
            <div class="flex items-center">
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors"
                     [class.bg-primary]="getPasoIndex(pasoActual) >= i"
                     [class.text-white]="getPasoIndex(pasoActual) >= i"
                     [class.bg-gray-200]="getPasoIndex(pasoActual) < i"
                     [class.text-gray-500]="getPasoIndex(pasoActual) < i">
                  @if (getPasoIndex(pasoActual) > i) {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  } @else {
                    {{ i + 1 }}
                  }
                </div>
                <span class="font-medium" [class.text-primary]="getPasoIndex(pasoActual) >= i" [class.text-gray-500]="getPasoIndex(pasoActual) < i">
                  {{ step.nombre }}
                </span>
              </div>
              @if (i < pasos.length - 1) {
                <div class="w-20 h-1 mx-4 rounded" [class.bg-primary]="getPasoIndex(pasoActual) > i" [class.bg-gray-200]="getPasoIndex(pasoActual) <= i"></div>
              }
            </div>
          }
        </div>
      </div>

      <div class="grid grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="col-span-2">
          <!-- Paso 1: Carrito -->
          @if (pasoActual === 'carrito') {
            <div class="bg-white rounded-xl shadow-sm">
              @if (carritoService.items().length === 0) {
                <div class="p-12 text-center">
                  <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <h3 class="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h3>
                  <p class="text-gray-500 mb-6">Agrega tours, hoteles o servicios para comenzar</p>
                  <button (click)="agregarItemsDemo()" class="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors">
                    Agregar items de demostración
                  </button>
                </div>
              } @else {
                <div class="divide-y divide-gray-100">
                  @for (item of carritoService.items(); track item.id) {
                    <div class="p-6 flex gap-6">
                      <div class="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img [src]="item.imagen" [alt]="item.nombre" class="w-full h-full object-cover">
                      </div>
                      <div class="flex-1">
                        <div class="flex justify-between">
                          <div>
                            <span class="text-xs px-2 py-1 rounded-full bg-primary bg-opacity-10 text-primary font-medium">
                              {{ getTipoLabel(item.tipo) }}
                            </span>
                            <h3 class="font-semibold text-gray-800 mt-2">{{ item.nombre }}</h3>
                            <p class="text-sm text-gray-500">{{ item.descripcion }}</p>
                            @if (item.fechaInicio) {
                              <p class="text-sm text-gray-500 mt-1">
                                Fecha: {{ item.fechaInicio | date:'dd/MM/yyyy' }}
                                @if (item.fechaFin) { - {{ item.fechaFin | date:'dd/MM/yyyy' }} }
                              </p>
                            }
                            @if (item.personas) {
                              <p class="text-sm text-gray-500">{{ item.personas }} personas</p>
                            }
                          </div>
                          <div class="text-right">
                            <p class="text-xl font-bold text-primary">{{ item.precio | currency:'MXN':'symbol-narrow' }}</p>
                            <p class="text-sm text-gray-500">c/u</p>
                          </div>
                        </div>
                        <div class="flex items-center justify-between mt-4">
                          <div class="flex items-center gap-3">
                            <button (click)="actualizarCantidad(item.id, item.cantidad - 1)"
                                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                              </svg>
                            </button>
                            <span class="font-semibold text-gray-800 w-8 text-center">{{ item.cantidad }}</span>
                            <button (click)="actualizarCantidad(item.id, item.cantidad + 1)"
                                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                              </svg>
                            </button>
                          </div>
                          <button (click)="removerItem(item.id)" class="text-red-500 hover:text-red-700 text-sm flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- Paso 2: Datos del Cliente -->
          @if (pasoActual === 'datos') {
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-6">Datos de Contacto</h2>
              <form class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                    <input type="text" [(ngModel)]="datosCliente.nombre" name="nombre" required
                           class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                    <input type="tel" [(ngModel)]="datosCliente.telefono" name="telefono" required
                           class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" [(ngModel)]="datosCliente.email" name="email" required
                         class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input type="text" [(ngModel)]="datosCliente.direccion" name="direccion"
                         class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                    <input type="text" [(ngModel)]="datosCliente.ciudad" name="ciudad"
                           class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                    <input type="text" [(ngModel)]="datosCliente.codigoPostal" name="cp"
                           class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
                  <textarea [(ngModel)]="datosCliente.notas" name="notas" rows="3"
                            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"></textarea>
                </div>
              </form>
            </div>
          }

          <!-- Paso 3: Método de Pago -->
          @if (pasoActual === 'pago') {
            <div class="space-y-6">
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-6">Selecciona tu método de pago</h2>

                <div class="grid grid-cols-2 gap-4">
                  <!-- SPEI -->
                  <div (click)="metodoPago = 'spei'"
                       class="border-2 rounded-xl p-6 cursor-pointer transition-all"
                       [class.border-primary]="metodoPago === 'spei'"
                       [class.bg-primary]="metodoPago === 'spei'"
                       [class.bg-opacity-5]="metodoPago === 'spei'"
                       [class.border-gray-200]="metodoPago !== 'spei'">
                    <div class="flex items-center gap-4 mb-4">
                      <div class="w-16 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-sm">SPEI</span>
                      </div>
                      <div>
                        <h3 class="font-semibold text-gray-800">Transferencia SPEI</h3>
                        <p class="text-sm text-gray-500">Pago inmediato desde tu banca en línea</p>
                      </div>
                    </div>
                    <ul class="text-sm text-gray-600 space-y-2">
                      <li class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Sin comisiones adicionales
                      </li>
                      <li class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Confirmación en minutos
                      </li>
                      <li class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Todos los bancos mexicanos
                      </li>
                    </ul>
                  </div>

                  <!-- PayPal -->
                  <div (click)="metodoPago = 'paypal'"
                       class="border-2 rounded-xl p-6 cursor-pointer transition-all"
                       [class.border-primary]="metodoPago === 'paypal'"
                       [class.bg-primary]="metodoPago === 'paypal'"
                       [class.bg-opacity-5]="metodoPago === 'paypal'"
                       [class.border-gray-200]="metodoPago !== 'paypal'">
                    <div class="flex items-center gap-4 mb-4">
                      <div class="w-16 h-12 bg-[#003087] rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-sm">PayPal</span>
                      </div>
                      <div>
                        <h3 class="font-semibold text-gray-800">PayPal</h3>
                        <p class="text-sm text-gray-500">Paga con tu cuenta PayPal o tarjeta</p>
                      </div>
                    </div>
                    <ul class="text-sm text-gray-600 space-y-2">
                      <li class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Protección al comprador
                      </li>
                      <li class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Tarjetas de crédito/débito
                      </li>
                      <li class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Pagos internacionales
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Detalles del método seleccionado -->
              @if (metodoPago === 'spei') {
                <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 class="font-semibold text-blue-800 mb-4">Datos para transferencia SPEI</h3>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p class="text-blue-600">Banco</p>
                      <p class="font-semibold text-blue-900">BBVA México</p>
                    </div>
                    <div>
                      <p class="text-blue-600">CLABE</p>
                      <p class="font-mono font-semibold text-blue-900">012180001234567890</p>
                    </div>
                    <div>
                      <p class="text-blue-600">Beneficiario</p>
                      <p class="font-semibold text-blue-900">Mezquitours SA de CV</p>
                    </div>
                    <div>
                      <p class="text-blue-600">Referencia</p>
                      <p class="font-mono font-semibold text-blue-900">{{ generarReferencia() }}</p>
                    </div>
                  </div>
                  <div class="mt-4 p-4 bg-white rounded-lg">
                    <p class="text-blue-800 text-sm">
                      <strong>Importante:</strong> Usa la referencia indicada para identificar tu pago.
                      Una vez realizada la transferencia, recibirás confirmación por email en un máximo de 30 minutos.
                    </p>
                  </div>
                </div>
              }

              @if (metodoPago === 'paypal') {
                <div class="bg-white rounded-xl shadow-sm p-6">
                  <h3 class="font-semibold text-gray-800 mb-4">Pagar con PayPal</h3>
                  <p class="text-gray-600 mb-6">
                    Serás redirigido a PayPal para completar tu pago de forma segura.
                  </p>
                  <button (click)="procesarPagoPayPal()"
                          class="w-full bg-[#0070ba] hover:bg-[#003087] text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.629h6.724c2.381 0 4.152.557 5.267 1.656.51.502.88 1.074 1.1 1.7.236.67.316 1.446.24 2.31-.012.15-.03.3-.053.452-.238 1.55-.866 2.836-1.867 3.822-1.045 1.03-2.5 1.644-4.327 1.825l-.27.012H9.73a.95.95 0 0 0-.937.794l-.016.084-.86 5.447-.014.063a.18.18 0 0 1-.178.151H7.076z"/>
                    </svg>
                    Pagar {{ carritoService.total() | currency:'MXN':'symbol-narrow' }} con PayPal
                  </button>
                  <div class="flex items-center justify-center gap-4 mt-4">
                    <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" alt="PayPal" class="h-6">
                    <span class="text-gray-400">|</span>
                    <div class="flex gap-2">
                      <div class="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-blue-800">VISA</div>
                      <div class="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-red-600">MC</div>
                      <div class="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">AMEX</div>
                    </div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- Paso 4: Confirmación -->
          @if (pasoActual === 'confirmacion') {
            <div class="bg-white rounded-xl shadow-sm p-8 text-center">
              <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">¡Pedido Confirmado!</h2>
              <p class="text-gray-600 mb-6">Tu número de orden es: <span class="font-mono font-bold text-primary">{{ numeroOrden }}</span></p>

              <div class="bg-gray-50 rounded-lg p-6 text-left mb-6">
                <h3 class="font-semibold text-gray-800 mb-4">Resumen de tu compra</h3>
                <div class="space-y-2 text-sm">
                  @for (item of carritoService.items(); track item.id) {
                    <div class="flex justify-between">
                      <span class="text-gray-600">{{ item.nombre }} x{{ item.cantidad }}</span>
                      <span class="font-medium">{{ item.precio * item.cantidad | currency:'MXN':'symbol-narrow' }}</span>
                    </div>
                  }
                  <div class="border-t border-gray-200 pt-2 mt-2">
                    <div class="flex justify-between font-bold text-lg">
                      <span>Total pagado</span>
                      <span class="text-primary">{{ carritoService.total() | currency:'MXN':'symbol-narrow' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p class="text-gray-600 mb-6">
                Hemos enviado los detalles de tu compra a <strong>{{ datosCliente.email }}</strong>
              </p>

              <div class="flex gap-4 justify-center">
                <button (click)="volverInicio()" class="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Volver al inicio
                </button>
                <button class="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                  Ver mis pedidos
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Sidebar - Resumen -->
        <div>
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Resumen del pedido</h2>

            <!-- Items resumidos -->
            <div class="space-y-3 mb-4 max-h-48 overflow-y-auto">
              @for (item of carritoService.items(); track item.id) {
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">{{ item.nombre }} <span class="text-gray-400">x{{ item.cantidad }}</span></span>
                  <span class="font-medium">{{ item.precio * item.cantidad | currency:'MXN':'symbol-narrow' }}</span>
                </div>
              }
            </div>

            <div class="border-t border-gray-100 pt-4 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span>{{ carritoService.subtotal() | currency:'MXN':'symbol-narrow' }}</span>
              </div>

              @if (carritoService.descuento() > 0) {
                <div class="flex justify-between text-sm text-green-600">
                  <span>Descuento ({{ carritoService.cuponAplicado() }})</span>
                  <span>-{{ carritoService.descuento() | currency:'MXN':'symbol-narrow' }}</span>
                </div>
              }

              <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                <span>Total</span>
                <span class="text-primary">{{ carritoService.total() | currency:'MXN':'symbol-narrow' }}</span>
              </div>
            </div>

            <!-- Cupón -->
            @if (pasoActual === 'carrito') {
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">¿Tienes un cupón?</label>
                <div class="flex gap-2">
                  <input type="text" [(ngModel)]="codigoCupon" placeholder="Código"
                         class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase">
                  <button (click)="aplicarCupon()" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                    Aplicar
                  </button>
                </div>
                @if (mensajeCupon) {
                  <p class="text-sm mt-2" [class.text-green-600]="cuponExito" [class.text-red-500]="!cuponExito">
                    {{ mensajeCupon }}
                  </p>
                }
              </div>
            }

            <!-- Botones de acción -->
            <div class="mt-6 space-y-3">
              @if (pasoActual !== 'confirmacion') {
                @if (pasoActual !== 'carrito') {
                  <button (click)="pasoAnterior()"
                          class="w-full py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Volver
                  </button>
                }
                <button (click)="siguientePaso()"
                        [disabled]="!puedeAvanzar()"
                        class="w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium">
                  @if (pasoActual === 'pago') {
                    Confirmar pedido
                  } @else {
                    Continuar
                  }
                </button>
              }
            </div>

            <!-- Seguridad -->
            <div class="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              Pago seguro garantizado
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CarritoComponent {
  carritoService = inject(CarritoService);

  pasoActual: PasoCheckout = 'carrito';
  metodoPago: MetodoPago = null;
  codigoCupon = '';
  mensajeCupon = '';
  cuponExito = false;
  numeroOrden = '';

  pasos = [
    { id: 'carrito', nombre: 'Carrito' },
    { id: 'datos', nombre: 'Datos' },
    { id: 'pago', nombre: 'Pago' },
    { id: 'confirmacion', nombre: 'Confirmación' }
  ];

  datosCliente: DatosCliente = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    notas: ''
  };

  getPasoIndex(paso: PasoCheckout): number {
    return this.pasos.findIndex(p => p.id === paso);
  }

  getTipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      tour: 'Tour',
      hotel: 'Hotel',
      servicio: 'Servicio',
      paquete: 'Paquete'
    };
    return labels[tipo] || tipo;
  }

  actualizarCantidad(itemId: string, cantidad: number) {
    this.carritoService.actualizarCantidad(itemId, cantidad);
  }

  removerItem(itemId: string) {
    this.carritoService.removerItem(itemId);
  }

  aplicarCupon() {
    const resultado = this.carritoService.aplicarCupon(this.codigoCupon);
    this.mensajeCupon = resultado.mensaje;
    this.cuponExito = resultado.exito;
  }

  puedeAvanzar(): boolean {
    switch (this.pasoActual) {
      case 'carrito':
        return this.carritoService.items().length > 0;
      case 'datos':
        return !!(this.datosCliente.nombre && this.datosCliente.email && this.datosCliente.telefono);
      case 'pago':
        return !!this.metodoPago;
      default:
        return true;
    }
  }

  siguientePaso() {
    const currentIndex = this.getPasoIndex(this.pasoActual);
    if (currentIndex < this.pasos.length - 1) {
      if (this.pasoActual === 'pago') {
        this.procesarPago();
      }
      this.pasoActual = this.pasos[currentIndex + 1].id as PasoCheckout;
    }
  }

  pasoAnterior() {
    const currentIndex = this.getPasoIndex(this.pasoActual);
    if (currentIndex > 0) {
      this.pasoActual = this.pasos[currentIndex - 1].id as PasoCheckout;
    }
  }

  procesarPago() {
    this.numeroOrden = 'MQ-' + Date.now().toString().slice(-8);
  }

  procesarPagoPayPal() {
    // Aquí iría la integración real con PayPal SDK
    console.log('Redirigiendo a PayPal...');
    this.siguientePaso();
  }

  generarReferencia(): string {
    return 'REF' + Date.now().toString().slice(-10);
  }

  volverInicio() {
    this.carritoService.vaciarCarrito();
    this.pasoActual = 'carrito';
    this.metodoPago = null;
    this.datosCliente = {
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      notas: ''
    };
  }

  agregarItemsDemo() {
    this.carritoService.agregarItem({
      id: '1',
      tipo: 'tour',
      nombre: 'Europa Romántica - 15 días',
      descripcion: 'París, Roma y Barcelona con vuelos incluidos',
      imagen: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
      precio: 68000,
      fechaInicio: new Date('2026-06-15'),
      fechaFin: new Date('2026-06-30'),
      personas: 2
    });

    this.carritoService.agregarItem({
      id: '2',
      tipo: 'hotel',
      nombre: 'Grand Fiesta Americana Cancún',
      descripcion: '5 noches All Inclusive',
      imagen: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      precio: 22500,
      fechaInicio: new Date('2026-07-10'),
      fechaFin: new Date('2026-07-15'),
      personas: 2
    });

    this.carritoService.agregarItem({
      id: '3',
      tipo: 'servicio',
      nombre: 'Paquete Fotografía Boda',
      descripcion: 'Sesión pre-boda + cobertura completa + álbum',
      imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
      precio: 25000
    });
  }
}
