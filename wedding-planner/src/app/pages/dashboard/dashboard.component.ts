import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

interface CalendarEvent {
  id: string;
  titulo: string;
  tipo: string;
  hora: string;
  color: string;
}

interface Chat {
  id: string;
  nombre: string;
  telefono: string;
  avatar: string;
  ultimoMensaje: string;
  hora: string;
  sinLeer: number;
  online: boolean;
}

interface Mensaje {
  id: string;
  texto: string;
  hora: string;
  enviado: boolean;
  leido: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-4rem)]">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p class="text-gray-500">Bienvenido de vuelta, Admin</p>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-gray-600">{{ today | date:'EEEE, d MMMM yyyy' }}</span>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6 h-[calc(100%-5rem)]">
        <!-- Calendario -->
        <div class="col-span-2 bg-white rounded-xl shadow-sm p-6 flex flex-col">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-gray-800">Calendario de Eventos</h2>
            <div class="flex items-center gap-2">
              <button (click)="previousMonth()" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <span class="font-medium text-gray-800 min-w-[150px] text-center">
                {{ currentDate | date:'MMMM yyyy' }}
              </span>
              <button (click)="nextMonth()" class="p-2 hover:bg-gray-100 rounded-lg">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="flex-1">
            <div class="grid grid-cols-7 gap-1 mb-2">
              @for (day of weekDays; track day) {
                <div class="text-center text-sm font-medium text-gray-500 py-2">{{ day }}</div>
              }
            </div>

            <div class="grid grid-cols-7 gap-1 flex-1">
              @for (day of calendarDays; track day.date.toISOString()) {
                <div class="min-h-[80px] p-1 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                     [class.bg-primary]="day.isToday"
                     [class.bg-opacity-10]="day.isToday"
                     [class.border-primary]="day.isToday"
                     [class.border-gray-100]="!day.isToday"
                     [class.opacity-40]="!day.isCurrentMonth"
                     (click)="selectDay(day)">
                  <span class="text-sm font-medium"
                        [class.text-primary]="day.isToday"
                        [class.text-gray-800]="!day.isToday && day.isCurrentMonth">
                    {{ day.date.getDate() }}
                  </span>
                  <div class="mt-1 space-y-1">
                    @for (event of day.events.slice(0, 2); track event.id) {
                      <div class="text-xs px-1 py-0.5 rounded truncate"
                           [style.backgroundColor]="event.color + '20'"
                           [style.color]="event.color">
                        {{ event.hora }} {{ event.titulo }}
                      </div>
                    }
                    @if (day.events.length > 2) {
                      <div class="text-xs text-gray-500 px-1">+{{ day.events.length - 2 }} más</div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Selected Day Events -->
          @if (selectedDay && selectedDay.events.length > 0) {
            <div class="mt-4 pt-4 border-t border-gray-100">
              <h3 class="text-sm font-medium text-gray-700 mb-3">
                Eventos del {{ selectedDay.date | date:'d MMMM' }}
              </h3>
              <div class="flex gap-3 overflow-x-auto pb-2">
                @for (event of selectedDay.events; track event.id) {
                  <div class="flex-shrink-0 bg-gray-50 rounded-lg p-3 min-w-[200px]">
                    <div class="flex items-center gap-2 mb-1">
                      <div class="w-3 h-3 rounded-full" [style.backgroundColor]="event.color"></div>
                      <span class="text-sm font-medium text-gray-800">{{ event.titulo }}</span>
                    </div>
                    <p class="text-xs text-gray-500">{{ event.hora }} • {{ event.tipo }}</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Chat WhatsApp Style -->
        <div class="bg-white rounded-xl shadow-sm flex flex-col overflow-hidden">
          <!-- Chat Header -->
          <div class="bg-primary p-4">
            <h2 class="text-white font-semibold">Mensajes a Clientes</h2>
          </div>

          <!-- Chat List / Conversation -->
          @if (!chatActivo) {
            <!-- Lista de Chats -->
            <div class="flex-1 overflow-y-auto">
              @for (chat of chats; track chat.id) {
                <div class="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                     (click)="abrirChat(chat)">
                  <div class="relative">
                    <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {{ chat.nombre.charAt(0) }}
                    </div>
                    @if (chat.online) {
                      <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    }
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center">
                      <span class="font-medium text-gray-800">{{ chat.nombre }}</span>
                      <span class="text-xs text-gray-500">{{ chat.hora }}</span>
                    </div>
                    <p class="text-sm text-gray-500 truncate">{{ chat.ultimoMensaje }}</p>
                  </div>
                  @if (chat.sinLeer > 0) {
                    <div class="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <span class="text-xs text-white font-medium">{{ chat.sinLeer }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          } @else {
            <!-- Conversación -->
            <div class="flex flex-col h-full">
              <!-- Chat Contact Header -->
              <div class="flex items-center gap-3 p-3 bg-gray-50 border-b border-gray-200">
                <button (click)="chatActivo = null" class="p-1 hover:bg-gray-200 rounded-full">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {{ chatActivo.nombre.charAt(0) }}
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-800">{{ chatActivo.nombre }}</p>
                  <p class="text-xs text-green-600">{{ chatActivo.online ? 'En línea' : 'Desconectado' }}</p>
                </div>
                <button class="p-2 hover:bg-gray-200 rounded-full">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </button>
              </div>

              <!-- Messages -->
              <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5]" style="background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABHSURBVGhD7c4xAQAgDAOw+jcdLBYtGPYYkk7Oub/d9yOySCKJJJJIIokkkkgiiSSSSCKJJJJIIokkkkgiiSSSSPZ9ZGYfxQB8y0P3HwAAAABJRU5ErkJggg==');">
                @for (mensaje of mensajes; track mensaje.id) {
                  <div class="flex" [class.justify-end]="mensaje.enviado">
                    <div class="max-w-[80%] rounded-lg p-3 shadow-sm"
                         [class.bg-primary]="mensaje.enviado"
                         [class.text-white]="mensaje.enviado"
                         [class.bg-white]="!mensaje.enviado">
                      <p class="text-sm">{{ mensaje.texto }}</p>
                      <div class="flex items-center justify-end gap-1 mt-1">
                        <span class="text-xs" [class.text-white]="mensaje.enviado" [class.text-opacity-70]="mensaje.enviado" [class.text-gray-500]="!mensaje.enviado">
                          {{ mensaje.hora }}
                        </span>
                        @if (mensaje.enviado) {
                          <svg class="w-4 h-4" [class.text-blue-300]="mensaje.leido" [class.text-white]="!mensaje.leido" [class.text-opacity-70]="!mensaje.leido" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
                          </svg>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>

              <!-- Input -->
              <div class="p-3 bg-gray-100 border-t border-gray-200">
                <div class="flex items-center gap-2">
                  <button class="p-2 text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                  <button class="p-2 text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                    </svg>
                  </button>
                  <input type="text"
                         [(ngModel)]="nuevoMensaje"
                         (keyup.enter)="enviarMensaje()"
                         placeholder="Escribe un mensaje..."
                         class="flex-1 px-4 py-2 bg-white rounded-full focus:outline-none">
                  <button (click)="enviarMensaje()"
                          class="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  today = new Date();
  currentDate = new Date();
  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  calendarDays: CalendarDay[] = [];
  selectedDay: CalendarDay | null = null;

  chats: Chat[] = [];
  chatActivo: Chat | null = null;
  mensajes: Mensaje[] = [];
  nuevoMensaje = '';

  ngOnInit() {
    this.generateCalendar();
    this.loadChats();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    this.calendarDays = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const isCurrentMonth = current.getMonth() === month;
      const isToday = this.isSameDay(current, this.today);

      this.calendarDays.push({
        date: new Date(current),
        isCurrentMonth,
        isToday,
        events: this.getEventsForDay(current)
      });

      current.setDate(current.getDate() + 1);
    }
  }

  getEventsForDay(date: Date): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const day = date.getDate();
    const month = date.getMonth();

    if (day === 15 && month === this.currentDate.getMonth()) {
      events.push({ id: '1', titulo: 'Boda García', tipo: 'Boda', hora: '16:00', color: '#e91e63' });
    }
    if (day === 18 && month === this.currentDate.getMonth()) {
      events.push({ id: '2', titulo: 'Cita - María L.', tipo: 'Cita', hora: '10:00', color: '#2196f3' });
      events.push({ id: '3', titulo: 'Reunión proveedores', tipo: 'Reunión', hora: '14:00', color: '#ff9800' });
    }
    if (day === 20 && month === this.currentDate.getMonth()) {
      events.push({ id: '4', titulo: 'XV Años Sofía', tipo: 'XV Años', hora: '18:00', color: '#9c27b0' });
    }
    if (day === 22 && month === this.currentDate.getMonth()) {
      events.push({ id: '5', titulo: 'Tour Europa - Salida', tipo: 'Viaje', hora: '06:00', color: '#4caf50' });
    }
    if (day === 25 && month === this.currentDate.getMonth()) {
      events.push({ id: '6', titulo: 'Degustación catering', tipo: 'Cita', hora: '12:00', color: '#2196f3' });
      events.push({ id: '7', titulo: 'Prueba vestido', tipo: 'Cita', hora: '16:00', color: '#2196f3' });
      events.push({ id: '8', titulo: 'Revisión flores', tipo: 'Proveedor', hora: '18:00', color: '#ff9800' });
    }

    return events;
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  selectDay(day: CalendarDay) {
    this.selectedDay = day;
  }

  loadChats() {
    this.chats = [
      { id: '1', nombre: 'María García', telefono: '+52 555 123 4567', avatar: '', ultimoMensaje: 'Perfecto, nos vemos el lunes', hora: '10:30', sinLeer: 2, online: true },
      { id: '2', nombre: 'Roberto López', telefono: '+52 555 987 6543', avatar: '', ultimoMensaje: '¿Ya tienen disponibilidad para agosto?', hora: '09:15', sinLeer: 0, online: false },
      { id: '3', nombre: 'Ana Martínez', telefono: '+52 555 456 7890', avatar: '', ultimoMensaje: 'Gracias por la cotización', hora: 'Ayer', sinLeer: 0, online: true },
      { id: '4', nombre: 'Carlos Sánchez', telefono: '+52 555 111 2222', avatar: '', ultimoMensaje: 'El evento quedó increíble!', hora: 'Ayer', sinLeer: 1, online: false },
      { id: '5', nombre: 'Laura Hernández', telefono: '+52 555 333 4444', avatar: '', ultimoMensaje: 'Necesito información sobre tours', hora: 'Lun', sinLeer: 0, online: false }
    ];
  }

  abrirChat(chat: Chat) {
    this.chatActivo = chat;
    chat.sinLeer = 0;
    this.loadMensajes();
  }

  loadMensajes() {
    this.mensajes = [
      { id: '1', texto: 'Hola, buenos días! Quisiera información sobre sus paquetes de boda.', hora: '09:30', enviado: false, leido: true },
      { id: '2', texto: 'Buenos días! Con gusto le ayudo. ¿Tiene alguna fecha en mente?', hora: '09:32', enviado: true, leido: true },
      { id: '3', texto: 'Estamos pensando en junio del próximo año', hora: '09:35', enviado: false, leido: true },
      { id: '4', texto: 'Excelente! Tenemos varios paquetes disponibles. ¿Le gustaría agendar una cita para verlos?', hora: '09:38', enviado: true, leido: true },
      { id: '5', texto: 'Sí, me encantaría. ¿Tienen disponibilidad el lunes?', hora: '10:15', enviado: false, leido: true },
      { id: '6', texto: 'Perfecto! Tenemos disponible a las 10am o 4pm. ¿Cuál le conviene más?', hora: '10:20', enviado: true, leido: true },
      { id: '7', texto: 'A las 10am está perfecto', hora: '10:25', enviado: false, leido: true },
      { id: '8', texto: 'Listo! Queda agendada su cita para el lunes a las 10am. Le enviaré un recordatorio. ¡Que tenga excelente día!', hora: '10:28', enviado: true, leido: true },
      { id: '9', texto: 'Perfecto, nos vemos el lunes', hora: '10:30', enviado: false, leido: false }
    ];
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;

    const mensaje: Mensaje = {
      id: Date.now().toString(),
      texto: this.nuevoMensaje,
      hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      enviado: true,
      leido: false
    };

    this.mensajes.push(mensaje);
    this.nuevoMensaje = '';

    if (this.chatActivo) {
      this.chatActivo.ultimoMensaje = mensaje.texto;
      this.chatActivo.hora = mensaje.hora;
    }
  }
}
