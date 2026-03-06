import { Injectable } from '@angular/core';
import {
  Cita,
  Proveedor,
  Evento,
  Hotel,
  CategoriaProveedor,
  TipoEvento
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DummyDataService {

  getCitas(): Cita[] {
    return [
      {
        id: '1',
        clienteNombre: 'María García',
        clienteEmail: 'maria@email.com',
        clienteTelefono: '+52 555 123 4567',
        fecha: new Date('2026-03-15'),
        hora: '10:00',
        tipoEvento: 'boda',
        estado: 'confirmada',
        notas: 'Boda para 150 personas',
        createdAt: new Date()
      },
      {
        id: '2',
        clienteNombre: 'Roberto López',
        clienteEmail: 'roberto@email.com',
        clienteTelefono: '+52 555 987 6543',
        fecha: new Date('2026-03-18'),
        hora: '14:00',
        tipoEvento: 'quinceanos',
        estado: 'pendiente',
        notas: 'Quinceañera temática princesas',
        createdAt: new Date()
      },
      {
        id: '3',
        clienteNombre: 'Ana Martínez',
        clienteEmail: 'ana@email.com',
        clienteTelefono: '+52 555 456 7890',
        fecha: new Date('2026-03-20'),
        hora: '11:00',
        tipoEvento: 'viaje',
        estado: 'pendiente',
        notas: 'Luna de miel Cancún',
        createdAt: new Date()
      },
      {
        id: '4',
        clienteNombre: 'Carlos Sánchez',
        clienteEmail: 'carlos@email.com',
        clienteTelefono: '+52 555 111 2222',
        fecha: new Date('2026-03-22'),
        hora: '16:00',
        tipoEvento: 'corporativo',
        estado: 'confirmada',
        notas: 'Evento empresarial 80 personas',
        createdAt: new Date()
      }
    ];
  }

  getProveedores(): Proveedor[] {
    return [
      {
        id: '1',
        nombre: 'Catering Elegance',
        categoria: 'catering',
        contacto: 'Juan Pérez',
        telefono: '+52 555 100 2000',
        email: 'info@cateringelegance.com',
        direccion: 'Av. Reforma 123',
        ciudad: 'Ciudad de México',
        calificacion: 4.8,
        precioBase: 25000,
        descripcion: 'Servicio de catering premium para bodas y eventos',
        servicios: ['Buffet', 'Servicio a mesa', 'Coctelería', 'Postres'],
        activo: true
      },
      {
        id: '2',
        nombre: 'Foto Momentos',
        categoria: 'fotografia',
        contacto: 'Laura Díaz',
        telefono: '+52 555 200 3000',
        email: 'contacto@fotomomentos.com',
        direccion: 'Calle Polanco 456',
        ciudad: 'Ciudad de México',
        calificacion: 4.9,
        precioBase: 15000,
        descripcion: 'Fotografía y video profesional para eventos',
        servicios: ['Fotografía', 'Video 4K', 'Drone', 'Fotocabina'],
        activo: true
      },
      {
        id: '3',
        nombre: 'Flores del Valle',
        categoria: 'floreria',
        contacto: 'Rosa Hernández',
        telefono: '+52 555 300 4000',
        email: 'ventas@floresdelvalle.com',
        direccion: 'Av. Insurgentes 789',
        ciudad: 'Ciudad de México',
        calificacion: 4.7,
        precioBase: 8000,
        descripcion: 'Arreglos florales y decoración para eventos',
        servicios: ['Ramos novia', 'Centros de mesa', 'Decoración iglesia', 'Boutonniere'],
        activo: true
      },
      {
        id: '4',
        nombre: 'Salón Gran Imperial',
        categoria: 'salon',
        contacto: 'Miguel Torres',
        telefono: '+52 555 400 5000',
        email: 'reservas@granimperial.com',
        direccion: 'Blvd. Ávila Camacho 100',
        ciudad: 'Ciudad de México',
        calificacion: 4.6,
        precioBase: 45000,
        descripcion: 'Salón de eventos con capacidad hasta 500 personas',
        servicios: ['Salón principal', 'Jardín', 'Estacionamiento', 'Mobiliario'],
        activo: true
      },
      {
        id: '5',
        nombre: 'DJ Party Mix',
        categoria: 'musica',
        contacto: 'Eduardo Ruiz',
        telefono: '+52 555 500 6000',
        email: 'booking@djpartymix.com',
        direccion: 'Col. Roma Norte',
        ciudad: 'Ciudad de México',
        calificacion: 4.5,
        precioBase: 12000,
        descripcion: 'DJ profesional y equipo de sonido',
        servicios: ['DJ', 'Iluminación', 'Sonido', 'Karaoke'],
        activo: true
      },
      {
        id: '6',
        nombre: 'Hotel Riviera Maya',
        categoria: 'hotel',
        contacto: 'Reservaciones',
        telefono: '+52 998 100 2000',
        email: 'reservas@rivieramaya.com',
        direccion: 'Km 45 Carretera Cancún',
        ciudad: 'Playa del Carmen',
        calificacion: 4.9,
        precioBase: 3500,
        descripcion: 'Resort todo incluido frente al mar',
        servicios: ['All inclusive', 'Spa', 'Playa privada', 'Wedding planner'],
        activo: true
      }
    ];
  }

  getEventos(): Evento[] {
    return [
      {
        id: '1',
        nombre: 'Boda García-López',
        tipo: 'boda',
        fecha: new Date('2026-06-15'),
        cliente: 'María García',
        presupuesto: 350000,
        presupuestoGastado: 180000,
        ubicacion: 'Salón Gran Imperial, CDMX',
        estado: 'planificacion',
        invitados: 150,
        proveedores: [
          { proveedorId: '1', servicio: 'Catering completo', costo: 75000, confirmado: true },
          { proveedorId: '2', servicio: 'Foto y video', costo: 25000, confirmado: true },
          { proveedorId: '3', servicio: 'Decoración floral', costo: 18000, confirmado: false }
        ],
        tareas: [
          { id: '1', descripcion: 'Confirmar menú con catering', completada: true },
          { id: '2', descripcion: 'Prueba de vestido', completada: false, fechaLimite: new Date('2026-04-01') },
          { id: '3', descripcion: 'Enviar invitaciones', completada: false, fechaLimite: new Date('2026-04-15') }
        ]
      },
      {
        id: '2',
        nombre: 'XV Años Sofía',
        tipo: 'quinceanos',
        fecha: new Date('2026-08-20'),
        cliente: 'Roberto López',
        presupuesto: 180000,
        presupuestoGastado: 45000,
        ubicacion: 'Jardín Las Flores, Guadalajara',
        estado: 'planificacion',
        invitados: 100,
        proveedores: [
          { proveedorId: '5', servicio: 'DJ y sonido', costo: 15000, confirmado: true }
        ],
        tareas: [
          { id: '1', descripcion: 'Seleccionar vestido', completada: false },
          { id: '2', descripcion: 'Contratar chambelanes', completada: false }
        ]
      },
      {
        id: '3',
        nombre: 'Luna de Miel Martínez',
        tipo: 'viaje',
        fecha: new Date('2026-07-01'),
        cliente: 'Ana Martínez',
        presupuesto: 120000,
        presupuestoGastado: 85000,
        ubicacion: 'Riviera Maya, Quintana Roo',
        estado: 'en_progreso',
        invitados: 2,
        proveedores: [
          { proveedorId: '6', servicio: 'Hospedaje 7 noches', costo: 85000, confirmado: true }
        ],
        tareas: [
          { id: '1', descripcion: 'Confirmar vuelos', completada: true },
          { id: '2', descripcion: 'Reservar tours', completada: false }
        ]
      }
    ];
  }

  getHoteles(): Hotel[] {
    return [
      {
        id: '1',
        nombre: 'Grand Fiesta Americana Cancún',
        ciudad: 'Cancún',
        pais: 'México',
        estrellas: 5,
        precioNoche: 4500,
        imagen: 'https://picsum.photos/400/300?random=1',
        amenidades: ['Playa', 'Spa', 'Restaurantes', 'Bar', 'Gimnasio'],
        disponible: true
      },
      {
        id: '2',
        nombre: 'Hotel Xcaret México',
        ciudad: 'Playa del Carmen',
        pais: 'México',
        estrellas: 5,
        precioNoche: 8500,
        imagen: 'https://picsum.photos/400/300?random=2',
        amenidades: ['All Inclusive', 'Parques', 'Spa', 'Ríos subterráneos'],
        disponible: true
      },
      {
        id: '3',
        nombre: 'Marriott Puerto Vallarta',
        ciudad: 'Puerto Vallarta',
        pais: 'México',
        estrellas: 4,
        precioNoche: 3200,
        imagen: 'https://picsum.photos/400/300?random=3',
        amenidades: ['Playa', 'Piscina', 'Restaurante', 'Gimnasio'],
        disponible: true
      },
      {
        id: '4',
        nombre: 'Ritz Carlton Miami',
        ciudad: 'Miami',
        pais: 'Estados Unidos',
        estrellas: 5,
        precioNoche: 12000,
        imagen: 'https://picsum.photos/400/300?random=4',
        amenidades: ['Playa privada', 'Spa', 'Restaurantes gourmet', 'Club de playa'],
        disponible: true
      },
      {
        id: '5',
        nombre: 'Hotel Negresco',
        ciudad: 'Niza',
        pais: 'Francia',
        estrellas: 5,
        precioNoche: 15000,
        imagen: 'https://picsum.photos/400/300?random=5',
        amenidades: ['Vista al mar', 'Restaurante Michelin', 'Arte', 'Concierge'],
        disponible: true
      },
      {
        id: '6',
        nombre: 'Santorini Grace Hotel',
        ciudad: 'Santorini',
        pais: 'Grecia',
        estrellas: 5,
        precioNoche: 18000,
        imagen: 'https://picsum.photos/400/300?random=6',
        amenidades: ['Vista caldera', 'Piscina infinita', 'Spa', 'Restaurante'],
        disponible: true
      }
    ];
  }

  getCategorias(): { value: CategoriaProveedor; label: string }[] {
    return [
      { value: 'catering', label: 'Catering' },
      { value: 'fotografia', label: 'Fotografía' },
      { value: 'musica', label: 'Música y DJ' },
      { value: 'decoracion', label: 'Decoración' },
      { value: 'floreria', label: 'Florería' },
      { value: 'salon', label: 'Salón de eventos' },
      { value: 'hotel', label: 'Hotel' },
      { value: 'transporte', label: 'Transporte' },
      { value: 'vestimenta', label: 'Vestimenta' },
      { value: 'pasteleria', label: 'Pastelería' }
    ];
  }

  getTiposEvento(): { value: TipoEvento; label: string }[] {
    return [
      { value: 'boda', label: 'Boda' },
      { value: 'quinceanos', label: 'XV Años' },
      { value: 'bautizo', label: 'Bautizo' },
      { value: 'corporativo', label: 'Evento Corporativo' },
      { value: 'viaje', label: 'Viaje/Luna de miel' },
      { value: 'otro', label: 'Otro' }
    ];
  }
}
