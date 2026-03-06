import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../shared/services/carrito.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen">
      <!-- Fixed Navbar -->
      <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur shadow-sm">
        <div class="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <a routerLink="/landing" class="block">
            <img src="/assets/images/logo-mezquitours.jpg" alt="Mezquitours" class="h-14 w-auto object-contain">
          </a>
          <div class="flex items-center gap-8">
            <a href="#servicios" class="text-gray-600 hover:text-primary transition-colors">Servicios</a>
            <a href="#tours" class="text-gray-600 hover:text-primary transition-colors">Tours</a>
            <a href="#contacto" class="text-gray-600 hover:text-primary transition-colors">Contacto</a>
            <a routerLink="/dashboard" class="text-gray-600 hover:text-primary transition-colors">Admin</a>
            <a routerLink="/carrito" class="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              @if (carritoService.cantidadItems() > 0) {
                <span class="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {{ carritoService.cantidadItems() > 9 ? '9+' : carritoService.cantidadItems() }}
                </span>
              }
            </a>
          </div>
        </div>
      </nav>

      <!-- Marquee Banner -->
      <div class="fixed top-[72px] left-0 right-0 z-40 bg-gradient-to-r from-primary via-primary-dark to-primary overflow-hidden py-2">
        <div class="marquee-container">
          <div class="marquee-content">
            <span class="text-white text-xl font-bold tracking-[0.5em] mx-8">MEZQUITOURS</span>
            <span class="text-white/60 mx-4">✈</span>
            <span class="text-white text-xl font-bold tracking-[0.5em] mx-8">CREANDO EXPERIENCIAS INOLVIDABLES</span>
            <span class="text-white/60 mx-4">✈</span>
            <span class="text-white text-xl font-bold tracking-[0.5em] mx-8">MEZQUITOURS</span>
            <span class="text-white/60 mx-4">✈</span>
            <span class="text-white text-xl font-bold tracking-[0.5em] mx-8">CREANDO EXPERIENCIAS INOLVIDABLES</span>
            <span class="text-white/60 mx-4">✈</span>
            <span class="text-white text-xl font-bold tracking-[0.5em] mx-8">MEZQUITOURS</span>
            <span class="text-white/60 mx-4">✈</span>
            <span class="text-white text-xl font-bold tracking-[0.5em] mx-8">CREANDO EXPERIENCIAS INOLVIDABLES</span>
            <span class="text-white/60 mx-4">✈</span>
          </div>
        </div>
      </div>

      <!-- Hero Section -->
      <section class="relative h-screen flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10"></div>
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920" alt="Wedding"
             class="absolute inset-0 w-full h-full object-cover">
        <div class="relative z-20 text-center text-white max-w-4xl px-6">
          <h1 class="text-5xl md:text-7xl font-bold mb-6">Creamos Momentos Inolvidables</h1>
          <p class="text-xl md:text-2xl mb-8 text-white/90">
            Bodas, eventos sociales y viajes de ensueño. Tu historia, nuestra pasión.
          </p>
          <div class="flex gap-4 justify-center">
            <a href="#contacto" class="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105">
              Agenda tu Cita
            </a>
            <a href="#servicios" class="bg-white/20 hover:bg-white/30 backdrop-blur text-white px-8 py-4 rounded-full text-lg font-medium transition-all">
              Ver Servicios
            </a>
          </div>
        </div>
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </section>

      <!-- Servicios -->
      <section id="servicios" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-800 mb-4">Nuestros Servicios</h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Desde bodas de ensueño hasta viajes por el mundo, hacemos realidad tus sueños.
            </p>
          </div>

          <div class="grid grid-cols-3 gap-8">
            @for (servicio of servicios; track servicio.titulo) {
              <div class="group cursor-pointer">
                <div class="relative h-80 rounded-2xl overflow-hidden mb-6">
                  <img [src]="servicio.imagen" [alt]="servicio.titulo" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div class="absolute bottom-6 left-6 text-white">
                    <h3 class="text-2xl font-bold mb-2">{{ servicio.titulo }}</h3>
                    <p class="text-white/80">{{ servicio.descripcion }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Tours y Destinos -->
      <section id="tours" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-800 mb-4">Tours y Destinos</h2>
            <p class="text-xl text-gray-600">Descubre el mundo con nosotros</p>
          </div>

          <!-- Tabs Destinos -->
          <div class="flex justify-center gap-4 mb-12">
            @for (region of regiones; track region.id) {
              <button (click)="regionActiva = region.id"
                      [class.bg-primary]="regionActiva === region.id"
                      [class.text-white]="regionActiva === region.id"
                      class="px-6 py-3 rounded-full font-medium bg-white hover:bg-gray-100 transition-colors shadow-sm">
                {{ region.nombre }}
              </button>
            }
          </div>

          <!-- Tours Grid -->
          <div class="grid grid-cols-4 gap-6">
            @for (tour of getToursPorRegion(); track tour.destino) {
              <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div class="relative h-48">
                  <img [src]="tour.imagen" [alt]="tour.destino" class="w-full h-full object-cover">
                  @if (tour.descuento) {
                    <div class="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      -{{ tour.descuento }}%
                    </div>
                  }
                </div>
                <div class="p-5">
                  <h3 class="font-bold text-lg text-gray-800">{{ tour.destino }}</h3>
                  <p class="text-gray-500 text-sm mb-3">{{ tour.duracion }}</p>
                  <div class="flex items-end justify-between">
                    <div>
                      @if (tour.precioAnterior) {
                        <p class="text-sm text-gray-400 line-through">{{ tour.precioAnterior | currency:'MXN':'symbol-narrow':'1.0-0' }}</p>
                      }
                      <p class="text-2xl font-bold text-primary">{{ tour.precio | currency:'MXN':'symbol-narrow':'1.0-0' }}</p>
                    </div>
                    <button class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Promociones -->
      <section class="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div class="max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-4xl font-bold mb-6">Promociones Especiales</h2>
              <p class="text-xl text-white/90 mb-8">
                Aprovecha nuestras ofertas exclusivas en paquetes de luna de miel, bodas destino y tours grupales.
              </p>
              <ul class="space-y-4 mb-8">
                <li class="flex items-center gap-3">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Hasta 30% de descuento en lunas de miel</span>
                </li>
                <li class="flex items-center gap-3">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Paquetes todo incluido desde $19,900</span>
                </li>
                <li class="flex items-center gap-3">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Meses sin intereses en todos nuestros servicios</span>
                </li>
              </ul>
              <button class="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-medium transition-colors">
                Ver Promociones
              </button>
            </div>
            <div class="relative">
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600" alt="Promo" class="rounded-2xl shadow-2xl">
              <div class="absolute -bottom-6 -left-6 bg-white text-gray-800 p-6 rounded-xl shadow-xl">
                <p class="text-sm text-gray-500">Desde</p>
                <p class="text-3xl font-bold text-primary">$19,900</p>
                <p class="text-sm text-gray-500">por persona</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonios -->
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-800 mb-4">Lo que dicen nuestros clientes</h2>
          </div>

          <div class="grid grid-cols-3 gap-8">
            @for (testimonio of testimonios; track testimonio.nombre) {
              <div class="bg-gray-50 rounded-2xl p-8">
                <div class="flex items-center gap-1 mb-4">
                  @for (star of [1,2,3,4,5]; track star) {
                    <svg class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  }
                </div>
                <p class="text-gray-600 mb-6 italic">"{{ testimonio.texto }}"</p>
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {{ testimonio.nombre.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">{{ testimonio.nombre }}</p>
                    <p class="text-sm text-gray-500">{{ testimonio.evento }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Contacto -->
      <section id="contacto" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-2 gap-12">
            <div>
              <h2 class="text-4xl font-bold text-gray-800 mb-6">Contáctanos</h2>
              <p class="text-xl text-gray-600 mb-8">
                Estamos listos para ayudarte a planear el evento de tus sueños.
              </p>

              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800">Oficina Principal</h3>
                    <p class="text-gray-600">Av. Reforma 222, Piso 15<br>Col. Juárez, Ciudad de México</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800">Teléfono</h3>
                    <p class="text-gray-600">+52 55 1234 5678<br>+52 55 8765 4321</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800">Email</h3>
                    <p class="text-gray-600">info&#64;mezquitours.mx<br>ventas&#64;mezquitours.mx</p>
                  </div>
                </div>

                <!-- Redes Sociales -->
                <div class="pt-6">
                  <h3 class="font-semibold text-gray-800 mb-4">Síguenos</h3>
                  <div class="flex gap-4">
                    <a href="#" class="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a href="#" class="w-12 h-12 rounded-full bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700 transition-colors">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </a>
                    <a href="#" class="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                    <a href="#" class="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulario -->
            <div class="bg-white rounded-2xl p-8 shadow-lg">
              <h3 class="text-2xl font-bold text-gray-800 mb-6">Envíanos un mensaje</h3>
              <form class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input type="text" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input type="tel" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Servicio de interés</label>
                  <select class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Boda</option>
                    <option>XV Años</option>
                    <option>Luna de Miel</option>
                    <option>Tour Europa</option>
                    <option>Tour México</option>
                    <option>Evento Corporativo</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                  <textarea rows="4" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"></textarea>
                </div>
                <button type="submit" class="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-lg font-medium transition-colors">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/assets/images/logo-mezquitours.jpg" alt="Mezquitours" class="h-20 w-auto object-contain mb-2 bg-white rounded-lg p-2">
              <p class="text-gray-400">Creando experiencias inolvidables.</p>
            </div>
            <div>
              <h4 class="font-semibold mb-4">Servicios</h4>
              <ul class="space-y-2 text-gray-400">
                <li><a href="#" class="hover:text-white">Bodas</a></li>
                <li><a href="#" class="hover:text-white">XV Años</a></li>
                <li><a href="#" class="hover:text-white">Eventos Corporativos</a></li>
                <li><a href="#" class="hover:text-white">Viajes</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold mb-4">Tours</h4>
              <ul class="space-y-2 text-gray-400">
                <li><a href="#" class="hover:text-white">Europa</a></li>
                <li><a href="#" class="hover:text-white">México</a></li>
                <li><a href="#" class="hover:text-white">Latinoamérica</a></li>
                <li><a href="#" class="hover:text-white">Caribe</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold mb-4">Horario</h4>
              <ul class="space-y-2 text-gray-400">
                <li>Lun - Vie: 9:00 - 19:00</li>
                <li>Sábado: 10:00 - 14:00</li>
                <li>Domingo: Cerrado</li>
              </ul>
            </div>
          </div>
          <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Mezquitours. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .marquee-container {
      display: flex;
      width: 100%;
      overflow: hidden;
    }

    .marquee-content {
      display: flex;
      white-space: nowrap;
      animation: marquee 20s linear infinite;
    }

    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    .marquee-content:hover {
      animation-play-state: paused;
    }
  `]
})
export class LandingComponent {
  carritoService = inject(CarritoService);
  regionActiva = 'europa';

  servicios = [
    { titulo: 'Bodas', descripcion: 'El día perfecto para tu historia de amor', imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600' },
    { titulo: 'XV Años', descripcion: 'Una celebración única e inolvidable', imagen: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600' },
    { titulo: 'Viajes', descripcion: 'Descubre destinos de ensueño', imagen: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600' }
  ];

  regiones = [
    { id: 'europa', nombre: 'Europa' },
    { id: 'mexico', nombre: 'México' },
    { id: 'latam', nombre: 'Latinoamérica' },
    { id: 'caribe', nombre: 'Caribe' }
  ];

  tours = [
    { destino: 'París Romántico', duracion: '7 días', precio: 45000, precioAnterior: 52000, descuento: 15, region: 'europa', imagen: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
    { destino: 'Roma Imperial', duracion: '6 días', precio: 38000, region: 'europa', imagen: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400' },
    { destino: 'Barcelona Gaudí', duracion: '5 días', precio: 32000, region: 'europa', imagen: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400' },
    { destino: 'Santorini', duracion: '6 días', precio: 55000, precioAnterior: 65000, descuento: 15, region: 'europa', imagen: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400' },
    { destino: 'Cancún', duracion: '5 días', precio: 19900, precioAnterior: 25000, descuento: 20, region: 'mexico', imagen: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=400' },
    { destino: 'Los Cabos', duracion: '4 días', precio: 22000, region: 'mexico', imagen: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400' },
    { destino: 'Puerto Vallarta', duracion: '5 días', precio: 18500, region: 'mexico', imagen: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=400' },
    { destino: 'Riviera Maya', duracion: '6 días', precio: 24000, region: 'mexico', imagen: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400' },
    { destino: 'Machu Picchu', duracion: '8 días', precio: 35000, region: 'latam', imagen: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400' },
    { destino: 'Buenos Aires', duracion: '6 días', precio: 28000, region: 'latam', imagen: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=400' },
    { destino: 'Punta Cana', duracion: '7 días', precio: 29500, precioAnterior: 38000, descuento: 22, region: 'caribe', imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400' },
    { destino: 'Aruba', duracion: '6 días', precio: 42000, region: 'caribe', imagen: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400' }
  ];

  testimonios = [
    { nombre: 'María García', evento: 'Boda - Junio 2025', texto: 'Hicieron de nuestra boda un sueño hecho realidad. Cada detalle fue perfecto y el servicio excepcional.' },
    { nombre: 'Roberto López', evento: 'Luna de Miel - Europa', texto: 'El tour por Europa superó todas nuestras expectativas. Los hoteles, los tours, todo fue increíble.' },
    { nombre: 'Ana Martínez', evento: 'XV Años', texto: 'La fiesta de mi hija fue espectacular. Gracias por hacer de su día algo único e inolvidable.' }
  ];

  getToursPorRegion() {
    return this.tours.filter(t => t.region === this.regionActiva);
  }
}
