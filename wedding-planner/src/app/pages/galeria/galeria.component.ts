import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Zona {
  id: string;
  nombre: string;
  descripcion: string;
  capacidad: number;
  imagen360: string;
  imagenes: string[];
  amenidades: string[];
}

interface EventoPasado {
  id: string;
  nombre: string;
  tipo: string;
  fecha: Date;
  zona: string;
  imagenes: string[];
  destacado: boolean;
}

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Galería y Espacios 360°</h1>
          <p class="text-gray-500 mt-1">Explora nuestros espacios y eventos pasados</p>
        </div>
        <button (click)="showUploadModal = true"
                class="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Subir Imágenes
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6">
        <button (click)="activeTab = 'zonas'"
                [class.bg-primary]="activeTab === 'zonas'"
                [class.text-white]="activeTab === 'zonas'"
                class="px-6 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 transition-colors">
          Zonas 360°
        </button>
        <button (click)="activeTab = 'eventos'"
                [class.bg-primary]="activeTab === 'eventos'"
                [class.text-white]="activeTab === 'eventos'"
                class="px-6 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 transition-colors">
          Eventos Pasados
        </button>
      </div>

      <!-- Zonas 360 -->
      @if (activeTab === 'zonas') {
        <div class="grid grid-cols-2 gap-6">
          @for (zona of zonas; track zona.id) {
            <div class="bg-white rounded-xl shadow-sm overflow-hidden group">
              <div class="relative h-64 overflow-hidden cursor-pointer" (click)="abrirVisor360(zona)">
                <img [src]="zona.imagen360" [alt]="zona.nombre" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="bg-white/90 backdrop-blur px-6 py-3 rounded-full flex items-center gap-2">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <span class="font-medium text-gray-800">Ver en 360°</span>
                  </div>
                </div>
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                  <span class="text-sm font-medium text-gray-700">360°</span>
                </div>
              </div>
              <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-800">{{ zona.nombre }}</h3>
                    <p class="text-gray-500 text-sm">Capacidad: {{ zona.capacidad }} personas</p>
                  </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">{{ zona.descripcion }}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                  @for (amenidad of zona.amenidades; track amenidad) {
                    <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{{ amenidad }}</span>
                  }
                </div>
                <div class="flex gap-2">
                  @for (img of zona.imagenes.slice(0, 4); track img; let i = $index) {
                    <div class="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                         (click)="abrirGaleria(zona, i)">
                      <img [src]="img" class="w-full h-full object-cover">
                    </div>
                  }
                  @if (zona.imagenes.length > 4) {
                    <div class="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                         (click)="abrirGaleria(zona, 0)">
                      <span class="text-sm font-medium text-gray-600">+{{ zona.imagenes.length - 4 }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Eventos Pasados -->
      @if (activeTab === 'eventos') {
        <!-- Filtros -->
        <div class="flex gap-4 mb-6">
          <select [(ngModel)]="filtroTipo" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Todos los tipos</option>
            <option value="boda">Bodas</option>
            <option value="quinceanos">XV Años</option>
            <option value="corporativo">Corporativos</option>
          </select>
          <select [(ngModel)]="filtroAnio" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Todos los años</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <!-- Grid de Eventos -->
        <div class="grid grid-cols-3 gap-6">
          @for (evento of getEventosFiltrados(); track evento.id) {
            <div class="bg-white rounded-xl shadow-sm overflow-hidden group"
                 [class.ring-2]="evento.destacado"
                 [class.ring-primary]="evento.destacado">
              <div class="relative h-48 overflow-hidden">
                <img [src]="evento.imagenes[0]" [alt]="evento.nombre" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                @if (evento.destacado) {
                  <div class="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                    Destacado
                  </div>
                }
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 class="text-white font-semibold">{{ evento.nombre }}</h3>
                  <p class="text-white/80 text-sm">{{ evento.fecha | date:'MMMM yyyy' }}</p>
                </div>
              </div>
              <div class="p-4">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm px-2 py-1 rounded-full"
                        [class.bg-pink-100]="evento.tipo === 'boda'"
                        [class.text-pink-700]="evento.tipo === 'boda'"
                        [class.bg-purple-100]="evento.tipo === 'quinceanos'"
                        [class.text-purple-700]="evento.tipo === 'quinceanos'"
                        [class.bg-blue-100]="evento.tipo === 'corporativo'"
                        [class.text-blue-700]="evento.tipo === 'corporativo'">
                    {{ getTipoLabel(evento.tipo) }}
                  </span>
                  <span class="text-sm text-gray-500">{{ evento.zona }}</span>
                </div>

                <!-- Thumbnails con drag -->
                <div class="flex gap-2 overflow-x-auto pb-2"
                     (dragover)="onDragOver($event)"
                     (drop)="onDrop($event, evento)">
                  @for (img of evento.imagenes.slice(0, 5); track img; let i = $index) {
                    <div class="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
                         draggable="true"
                         (dragstart)="onDragStart($event, evento, i)"
                         (click)="abrirLightbox(evento, i)">
                      <img [src]="img" class="w-full h-full object-cover hover:opacity-80 transition-opacity">
                    </div>
                  }
                  @if (evento.imagenes.length > 5) {
                    <div class="flex-shrink-0 w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer"
                         (click)="abrirLightbox(evento, 0)">
                      <span class="text-xs font-medium text-gray-600">+{{ evento.imagenes.length - 5 }}</span>
                    </div>
                  }
                </div>

                <p class="text-xs text-gray-400 mt-2">Arrastra para reorganizar</p>
              </div>
            </div>
          }
        </div>
      }

      <!-- Modal Visor 360 -->
      @if (visor360Activo) {
        <div class="fixed inset-0 bg-black z-50 flex flex-col">
          <div class="flex justify-between items-center p-4 bg-black/50">
            <h2 class="text-white text-xl font-semibold">{{ zonaSeleccionada?.nombre }} - Vista 360°</h2>
            <button (click)="cerrarVisor360()" class="text-white p-2 hover:bg-white/10 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="flex-1 relative overflow-hidden">
            <img [src]="zonaSeleccionada?.imagen360" class="w-full h-full object-cover" style="cursor: grab;">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="bg-black/50 text-white px-6 py-3 rounded-full">
                Arrastra para explorar en 360°
              </div>
            </div>
            <!-- Controles 360 -->
            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
              <button class="bg-white/20 backdrop-blur p-3 rounded-full text-white hover:bg-white/30">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"/>
                </svg>
              </button>
              <button class="bg-white/20 backdrop-blur p-3 rounded-full text-white hover:bg-white/30">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/>
                </svg>
              </button>
              <button class="bg-white/20 backdrop-blur p-3 rounded-full text-white hover:bg-white/30">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Lightbox -->
      @if (lightboxActivo) {
        <div class="fixed inset-0 bg-black/95 z-50 flex flex-col">
          <div class="flex justify-between items-center p-4">
            <h2 class="text-white text-lg">{{ eventoLightbox?.nombre }} - {{ lightboxIndex + 1 }}/{{ eventoLightbox?.imagenes?.length }}</h2>
            <button (click)="cerrarLightbox()" class="text-white p-2 hover:bg-white/10 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="flex-1 flex items-center justify-center relative">
            <button (click)="lightboxPrev()" class="absolute left-4 text-white p-3 bg-white/10 hover:bg-white/20 rounded-full">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <img [src]="eventoLightbox?.imagenes?.[lightboxIndex]" class="max-h-[80vh] max-w-[90vw] object-contain rounded-lg">
            <button (click)="lightboxNext()" class="absolute right-4 text-white p-3 bg-white/10 hover:bg-white/20 rounded-full">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <!-- Thumbnails -->
          <div class="p-4 flex justify-center gap-2 overflow-x-auto">
            @for (img of eventoLightbox?.imagenes; track img; let i = $index) {
              <div class="w-16 h-16 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
                   [class.ring-2]="i === lightboxIndex"
                   [class.ring-primary]="i === lightboxIndex"
                   (click)="lightboxIndex = i">
                <img [src]="img" class="w-full h-full object-cover">
              </div>
            }
          </div>
        </div>
      }

      <!-- Modal Upload -->
      @if (showUploadModal) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl w-full max-w-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">Subir Imágenes</h2>
              <button (click)="showUploadModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4 hover:border-primary transition-colors cursor-pointer"
                 (dragover)="$event.preventDefault()"
                 (drop)="onDropUpload($event)">
              <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p class="text-gray-600 mb-2">Arrastra tus imágenes aquí</p>
              <p class="text-sm text-gray-400">o haz clic para seleccionar</p>
              <input type="file" multiple accept="image/*" class="hidden">
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Asociar a evento</label>
              <select class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Seleccionar evento...</option>
                @for (evento of eventosPasados; track evento.id) {
                  <option [value]="evento.id">{{ evento.nombre }}</option>
                }
              </select>
            </div>

            <div class="flex justify-end gap-3">
              <button (click)="showUploadModal = false"
                      class="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button class="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
                Subir
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class GaleriaComponent implements OnInit {
  activeTab = 'zonas';
  filtroTipo = '';
  filtroAnio = '';

  zonas: Zona[] = [];
  eventosPasados: EventoPasado[] = [];

  visor360Activo = false;
  zonaSeleccionada: Zona | null = null;

  lightboxActivo = false;
  eventoLightbox: EventoPasado | null = null;
  lightboxIndex = 0;

  showUploadModal = false;

  dragEvento: EventoPasado | null = null;
  dragIndex = -1;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.zonas = [
      {
        id: '1',
        nombre: 'Salón Principal',
        descripcion: 'Elegante salón con capacidad para grandes eventos, iluminación ambiental y pista de baile.',
        capacidad: 300,
        imagen360: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200',
        imagenes: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
          'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400',
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400'
        ],
        amenidades: ['Aire acondicionado', 'Pista de baile', 'Escenario', 'Sistema de sonido']
      },
      {
        id: '2',
        nombre: 'Jardín Exterior',
        descripcion: 'Hermoso jardín con fuente central, perfecto para ceremonias al aire libre.',
        capacidad: 200,
        imagen360: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200',
        imagenes: [
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
          'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=400',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
        ],
        amenidades: ['Fuente', 'Gazebo', 'Iluminación', 'Áreas verdes']
      },
      {
        id: '3',
        nombre: 'Terraza Rooftop',
        descripcion: 'Terraza con vista panorámica de la ciudad, ideal para cócteles y eventos íntimos.',
        capacidad: 80,
        imagen360: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
        imagenes: [
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
          'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400'
        ],
        amenidades: ['Vista panorámica', 'Bar', 'Lounge', 'Calefacción exterior']
      },
      {
        id: '4',
        nombre: 'Capilla',
        descripcion: 'Capilla íntima para ceremonias religiosas con vitrales y decoración clásica.',
        capacidad: 100,
        imagen360: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
        imagenes: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
        ],
        amenidades: ['Órgano', 'Vitrales', 'Altar', 'Bancas de madera']
      }
    ];

    this.eventosPasados = [
      {
        id: '1',
        nombre: 'Boda García-López',
        tipo: 'boda',
        fecha: new Date('2025-11-15'),
        zona: 'Salón Principal',
        imagenes: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
          'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
          'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400',
          'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
        ],
        destacado: true
      },
      {
        id: '2',
        nombre: 'XV Años Valentina',
        tipo: 'quinceanos',
        fecha: new Date('2025-10-20'),
        zona: 'Jardín Exterior',
        imagenes: [
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
          'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400',
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
          'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400'
        ],
        destacado: false
      },
      {
        id: '3',
        nombre: 'Gala Corporativa TechMX',
        tipo: 'corporativo',
        fecha: new Date('2025-09-10'),
        zona: 'Terraza Rooftop',
        imagenes: [
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
          'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400'
        ],
        destacado: true
      },
      {
        id: '4',
        nombre: 'Boda Martínez-Soto',
        tipo: 'boda',
        fecha: new Date('2025-08-25'),
        zona: 'Capilla',
        imagenes: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400'
        ],
        destacado: false
      },
      {
        id: '5',
        nombre: 'XV Años Camila',
        tipo: 'quinceanos',
        fecha: new Date('2025-07-18'),
        zona: 'Salón Principal',
        imagenes: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400'
        ],
        destacado: false
      },
      {
        id: '6',
        nombre: 'Conferencia Anual 2025',
        tipo: 'corporativo',
        fecha: new Date('2025-06-05'),
        zona: 'Salón Principal',
        imagenes: [
          'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
        ],
        destacado: false
      }
    ];
  }

  getEventosFiltrados(): EventoPasado[] {
    return this.eventosPasados.filter(e => {
      const matchTipo = !this.filtroTipo || e.tipo === this.filtroTipo;
      const matchAnio = !this.filtroAnio || e.fecha.getFullYear().toString() === this.filtroAnio;
      return matchTipo && matchAnio;
    });
  }

  getTipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      boda: 'Boda',
      quinceanos: 'XV Años',
      corporativo: 'Corporativo'
    };
    return labels[tipo] || tipo;
  }

  abrirVisor360(zona: Zona) {
    this.zonaSeleccionada = zona;
    this.visor360Activo = true;
  }

  cerrarVisor360() {
    this.visor360Activo = false;
    this.zonaSeleccionada = null;
  }

  abrirGaleria(zona: Zona, index: number) {
    // Implementar galería de zona
  }

  abrirLightbox(evento: EventoPasado, index: number) {
    this.eventoLightbox = evento;
    this.lightboxIndex = index;
    this.lightboxActivo = true;
  }

  cerrarLightbox() {
    this.lightboxActivo = false;
    this.eventoLightbox = null;
  }

  lightboxPrev() {
    if (this.eventoLightbox) {
      this.lightboxIndex = this.lightboxIndex > 0
        ? this.lightboxIndex - 1
        : this.eventoLightbox.imagenes.length - 1;
    }
  }

  lightboxNext() {
    if (this.eventoLightbox) {
      this.lightboxIndex = this.lightboxIndex < this.eventoLightbox.imagenes.length - 1
        ? this.lightboxIndex + 1
        : 0;
    }
  }

  onDragStart(event: DragEvent, evento: EventoPasado, index: number) {
    this.dragEvento = evento;
    this.dragIndex = index;
    event.dataTransfer?.setData('text/plain', index.toString());
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, evento: EventoPasado) {
    event.preventDefault();
    if (this.dragEvento && this.dragEvento.id === evento.id) {
      const dropIndex = this.getDropIndex(event);
      if (dropIndex !== -1 && dropIndex !== this.dragIndex) {
        const img = evento.imagenes.splice(this.dragIndex, 1)[0];
        evento.imagenes.splice(dropIndex, 0, img);
      }
    }
    this.dragEvento = null;
    this.dragIndex = -1;
  }

  getDropIndex(event: DragEvent): number {
    return 0; // Simplificado
  }

  onDropUpload(event: DragEvent) {
    event.preventDefault();
    // Implementar upload
  }
}
