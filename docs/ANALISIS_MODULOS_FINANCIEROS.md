# Análisis de Módulos Financieros y Automatización de Ventas

## Wedding Planner Solution

**Fecha:** Marzo 2026
**Versión:** 1.0
**Estado:** Análisis Inicial

---

## 1. Resumen Ejecutivo

Este documento analiza la integración de dos módulos principales en el sistema Wedding Planner:

1. **Módulo de Gestión Financiera** - Control de pagos, saldos y comprobantes
2. **Módulo de Automatización de Ventas** - Cotizaciones automáticas y gestión de promociones

---

## 2. Arquitectura Actual

### Stack Tecnológico
| Capa | Tecnología |
|------|------------|
| Frontend | Angular 21 (Standalone Components, Signals) |
| Backend | Azure Functions (Serverless) |
| Base de Datos | SQL Server / Azure SQL |
| Estilos | Tailwind CSS + Sass |

### Estructura del Proyecto
```
WedingPlannerSolution/
├── wedding-planner/           # Frontend Angular
│   └── src/app/
│       ├── core/              # Layout, navegación
│       ├── pages/             # Componentes de página
│       └── shared/            # Modelos y servicios
├── wedding-planner-api/       # Backend Azure Functions
│   └── src/functions/         # Endpoints HTTP
└── database/                  # Esquema SQL
```

---

## 3. MÓDULO DE GESTIÓN FINANCIERA

### 3.1 Validación Manual de Pagos

#### Descripción
Permite al administrador validar manualmente los pagos recibidos por transferencia, depósito o efectivo antes de marcarlos como completados.

#### Casos de Uso
| ID | Caso de Uso | Actor |
|----|-------------|-------|
| UC-01 | Revisar pagos pendientes de validación | Administrador |
| UC-02 | Validar pago con referencia bancaria | Administrador |
| UC-03 | Rechazar pago con observaciones | Administrador |
| UC-04 | Notificar cliente sobre estado del pago | Sistema |

#### Modelo de Datos
```typescript
interface Pago {
  id: string;
  eventoId: string;
  clienteId: string;
  monto: number;
  metodoPago: 'efectivo' | 'transferencia' | 'tarjeta' | 'deposito';
  estado: 'pendiente' | 'validando' | 'completado' | 'rechazado';
  referenciaBancaria?: string;
  comprobante?: string;          // URL del archivo
  fechaPago: Date;
  fechaValidacion?: Date;
  validadoPor?: string;          // Usuario admin
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Endpoints API
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/pagos?estado=pendiente` | Listar pagos por estado |
| GET | `/api/pagos/{id}` | Detalle de pago |
| PUT | `/api/pagos/{id}/validar` | Validar pago |
| PUT | `/api/pagos/{id}/rechazar` | Rechazar pago |
| POST | `/api/pagos/{id}/notificar` | Enviar notificación |

#### Componente Frontend
```
Ubicación: /src/app/pages/pagos/
├── pagos.component.ts          # Lista de pagos
├── pago-detalle.component.ts   # Modal de validación
└── pagos.service.ts            # Servicio de pagos
```

#### Flujo de Validación
```
[Cliente realiza pago]
    → [Sube comprobante]
    → [Estado: pendiente]
    → [Admin revisa]
    → [Valida referencia bancaria]
    → [Estado: completado / rechazado]
    → [Notificación automática al cliente]
```

---

### 3.2 Cálculo de Saldo Pendiente

#### Descripción
Cálculo automático del saldo pendiente por evento y por cliente, considerando presupuesto total, pagos realizados y descuentos aplicados.

#### Fórmula de Cálculo
```
Saldo Pendiente = Presupuesto Total
                - Pagos Completados
                - Descuentos Aplicados
                + Cargos Adicionales
```

#### Modelo de Datos
```typescript
interface BalanceEvento {
  eventoId: string;
  clienteId: string;
  presupuestoTotal: number;
  totalPagado: number;
  descuentosAplicados: number;
  cargosAdicionales: number;
  saldoPendiente: number;        // Calculado
  porcentajePagado: number;      // Calculado
  proximoPago?: {
    monto: number;
    fechaLimite: Date;
  };
}

interface ResumenCliente {
  clienteId: string;
  totalEventos: number;
  saldoTotalPendiente: number;
  eventosConSaldo: EventoResumen[];
}
```

#### Servicio de Balance
```typescript
@Injectable({ providedIn: 'root' })
export class BalanceService {

  calcularSaldoEvento(evento: Evento, pagos: Pago[]): BalanceEvento {
    const pagosCompletados = pagos
      .filter(p => p.estado === 'completado')
      .reduce((sum, p) => sum + p.monto, 0);

    const saldoPendiente = evento.presupuesto
      - pagosCompletados
      - (evento.descuentos || 0)
      + (evento.cargosAdicionales || 0);

    return {
      eventoId: evento.id,
      clienteId: evento.clienteId,
      presupuestoTotal: evento.presupuesto,
      totalPagado: pagosCompletados,
      descuentosAplicados: evento.descuentos || 0,
      cargosAdicionales: evento.cargosAdicionales || 0,
      saldoPendiente: Math.max(0, saldoPendiente),
      porcentajePagado: (pagosCompletados / evento.presupuesto) * 100
    };
  }

  calcularSaldoCliente(clienteId: string): ResumenCliente {
    // Agrupa todos los eventos del cliente
    // Suma saldos pendientes
  }
}
```

#### Visualización
- **Card de resumen** en detalle de evento
- **Barra de progreso** de pagos (verde/amarillo/rojo)
- **Alertas** para saldos vencidos
- **Dashboard** con totales generales

---

### 3.3 Gestión de Comprobantes

#### Descripción
Sistema para subir, almacenar y gestionar comprobantes de pago (imágenes, PDFs) asociados a cada transacción.

#### Funcionalidades
| Funcionalidad | Descripción |
|---------------|-------------|
| Subida de archivos | Soporte para imágenes y PDFs |
| Almacenamiento | Azure Blob Storage |
| Visualización | Preview en modal |
| Descarga | Enlace directo al archivo |
| Historial | Log de comprobantes por pago |

#### Modelo de Datos
```typescript
interface Comprobante {
  id: string;
  pagoId: string;
  tipo: 'imagen' | 'pdf';
  nombreArchivo: string;
  url: string;
  tamaño: number;              // bytes
  subidoPor: string;
  fechaSubida: Date;
  verificado: boolean;
}
```

#### Endpoints API
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/comprobantes/upload` | Subir comprobante |
| GET | `/api/comprobantes/{pagoId}` | Obtener comprobantes |
| DELETE | `/api/comprobantes/{id}` | Eliminar comprobante |
| GET | `/api/comprobantes/{id}/download` | Descargar archivo |

#### Validaciones
- Tamaño máximo: 5MB
- Formatos permitidos: JPG, PNG, PDF
- Escaneo de malware (opcional)

---

### 3.4 Vista de Clientes Activos

#### Descripción
Dashboard de clientes con eventos activos, mostrando información de contacto, estado de pagos y próximas actividades.

#### Modelo de Datos
```typescript
interface ClienteActivo {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  whatsapp?: string;
  eventosActivos: number;
  saldoPendienteTotal: number;
  proximoEvento?: {
    id: string;
    nombre: string;
    fecha: Date;
  };
  ultimoContacto?: Date;
  estado: 'activo' | 'inactivo' | 'potencial';
  notas?: string;
}
```

#### Filtros y Búsqueda
- Por estado (activo/inactivo/potencial)
- Por saldo pendiente (con saldo/sin saldo)
- Por fecha de próximo evento
- Búsqueda por nombre/email/teléfono

#### Acciones Rápidas
| Acción | Descripción |
|--------|-------------|
| Ver perfil | Detalle completo del cliente |
| Ver eventos | Lista de eventos del cliente |
| Enviar mensaje | WhatsApp/Email directo |
| Agregar nota | Registro de interacciones |
| Ver pagos | Historial de pagos |

#### Métricas del Dashboard
```
┌─────────────────┬─────────────────┬─────────────────┐
│ Clientes        │ Eventos         │ Saldo           │
│ Activos: 45     │ Este Mes: 12    │ Pendiente:      │
│ Nuevos: 8       │ Próximos: 23    │ $125,000        │
└─────────────────┴─────────────────┴─────────────────┘
```

---

## 4. MÓDULO DE AUTOMATIZACIÓN DE VENTAS

### 4.1 Selección Dinámica de Promociones

#### Descripción
Sistema que permite configurar y aplicar promociones automáticamente basadas en reglas de negocio (temporada, cantidad de personas, tipo de evento, etc.).

#### Modelo de Datos
```typescript
interface Promocion {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'porcentaje' | 'monto_fijo' | 'servicio_gratis';
  valor: number;
  condiciones: CondicionPromocion[];
  fechaInicio: Date;
  fechaFin: Date;
  usoMaximo?: number;
  usosActuales: number;
  activa: boolean;
  prioridad: number;            // Para resolver conflictos
  acumulable: boolean;          // Puede combinarse con otras
}

interface CondicionPromocion {
  campo: 'numPersonas' | 'tipoEvento' | 'fechaEvento' | 'montoMinimo';
  operador: 'igual' | 'mayor' | 'menor' | 'entre' | 'contiene';
  valor: any;
}

// Ejemplo de promoción
const promoVerano: Promocion = {
  id: 'promo-001',
  nombre: 'Bodas de Verano 2026',
  descripcion: '15% de descuento en bodas de junio a agosto',
  tipo: 'porcentaje',
  valor: 15,
  condiciones: [
    { campo: 'tipoEvento', operador: 'igual', valor: 'boda' },
    { campo: 'fechaEvento', operador: 'entre', valor: ['2026-06-01', '2026-08-31'] }
  ],
  fechaInicio: new Date('2026-03-01'),
  fechaFin: new Date('2026-08-31'),
  activa: true,
  prioridad: 1,
  acumulable: false
};
```

#### Motor de Promociones
```typescript
@Injectable({ providedIn: 'root' })
export class PromocionesService {

  obtenerPromocionesAplicables(cotizacion: DatosCotizacion): Promocion[] {
    return this.promociones()
      .filter(p => p.activa)
      .filter(p => this.cumpleCondiciones(p, cotizacion))
      .sort((a, b) => a.prioridad - b.prioridad);
  }

  private cumpleCondiciones(promo: Promocion, datos: DatosCotizacion): boolean {
    return promo.condiciones.every(cond => {
      const valorCampo = datos[cond.campo];
      switch (cond.operador) {
        case 'igual': return valorCampo === cond.valor;
        case 'mayor': return valorCampo > cond.valor;
        case 'menor': return valorCampo < cond.valor;
        case 'entre': return valorCampo >= cond.valor[0] && valorCampo <= cond.valor[1];
        default: return false;
      }
    });
  }

  aplicarMejorPromocion(cotizacion: DatosCotizacion): PromocionAplicada {
    const aplicables = this.obtenerPromocionesAplicables(cotizacion);
    // Retorna la de mayor beneficio para el cliente
  }
}
```

---

### 4.2 Cálculo Automático por Número de Personas

#### Descripción
Sistema de precios escalonados que calcula automáticamente el costo total basado en la cantidad de invitados y los servicios seleccionados.

#### Modelo de Datos
```typescript
interface TarifaServicio {
  servicioId: string;
  nombre: string;
  tipoCalculo: 'por_persona' | 'fijo' | 'escalonado';
  precioBase: number;
  escala?: EscalaPrecio[];
  minPersonas?: number;
  maxPersonas?: number;
}

interface EscalaPrecio {
  desde: number;
  hasta: number;
  precioPorPersona: number;
  descuentoPorcentaje?: number;
}

// Ejemplo
const tarifaBanquete: TarifaServicio = {
  servicioId: 'srv-banquete',
  nombre: 'Servicio de Banquete Premium',
  tipoCalculo: 'escalonado',
  precioBase: 0,
  escala: [
    { desde: 1,   hasta: 50,  precioPorPersona: 850 },
    { desde: 51,  hasta: 100, precioPorPersona: 800 },
    { desde: 101, hasta: 200, precioPorPersona: 750 },
    { desde: 201, hasta: 500, precioPorPersona: 700 }
  ],
  minPersonas: 30,
  maxPersonas: 500
};
```

#### Calculadora de Precios
```typescript
@Injectable({ providedIn: 'root' })
export class CalculadoraPreciosService {

  calcularServicio(tarifa: TarifaServicio, numPersonas: number): number {
    switch (tarifa.tipoCalculo) {
      case 'fijo':
        return tarifa.precioBase;

      case 'por_persona':
        return tarifa.precioBase * numPersonas;

      case 'escalonado':
        const escala = tarifa.escala?.find(
          e => numPersonas >= e.desde && numPersonas <= e.hasta
        );
        return escala
          ? escala.precioPorPersona * numPersonas
          : tarifa.precioBase * numPersonas;
    }
  }

  calcularCotizacionTotal(
    servicios: TarifaServicio[],
    numPersonas: number,
    promocion?: Promocion
  ): ResumenCotizacion {
    const subtotal = servicios.reduce(
      (sum, srv) => sum + this.calcularServicio(srv, numPersonas),
      0
    );

    const descuento = promocion
      ? this.aplicarDescuento(subtotal, promocion)
      : 0;

    return {
      servicios: servicios.map(s => ({
        nombre: s.nombre,
        cantidad: numPersonas,
        precioUnitario: this.calcularServicio(s, numPersonas) / numPersonas,
        subtotal: this.calcularServicio(s, numPersonas)
      })),
      subtotal,
      descuento,
      total: subtotal - descuento,
      numPersonas,
      promocionAplicada: promocion?.nombre
    };
  }
}
```

---

### 4.3 Generación Automática de Cotización en PDF

#### Descripción
Generación de documentos PDF profesionales con diseño de marca, desglose de servicios y condiciones comerciales.

#### Estructura del PDF
```
┌─────────────────────────────────────────────────────────┐
│                     LOGO + ENCABEZADO                   │
│               Wedding Planner Solution                  │
├─────────────────────────────────────────────────────────┤
│  COTIZACIÓN #COT-2026-0345                              │
│  Fecha: 05/03/2026          Válida hasta: 05/04/2026    │
├─────────────────────────────────────────────────────────┤
│  DATOS DEL CLIENTE                                      │
│  Nombre: María García                                   │
│  Email: maria@email.com                                 │
│  Teléfono: +52 555 123 4567                             │
├─────────────────────────────────────────────────────────┤
│  DETALLES DEL EVENTO                                    │
│  Tipo: Boda                Fecha: 15/06/2026            │
│  Lugar: Hacienda San Miguel                             │
│  Invitados: 150 personas                                │
├─────────────────────────────────────────────────────────┤
│  SERVICIOS INCLUIDOS                                    │
│  ┌──────────────────┬────────┬──────────┬──────────┐   │
│  │ Servicio         │ Cant.  │ P.Unit.  │ Subtotal │   │
│  ├──────────────────┼────────┼──────────┼──────────┤   │
│  │ Banquete Premium │ 150    │ $750     │ $112,500 │   │
│  │ Decoración       │ 1      │ $25,000  │ $25,000  │   │
│  │ Fotografía       │ 1      │ $18,000  │ $18,000  │   │
│  │ DJ & Sonido      │ 1      │ $12,000  │ $12,000  │   │
│  └──────────────────┴────────┴──────────┴──────────┘   │
│                                                         │
│                              Subtotal:    $167,500      │
│                              Descuento:   -$25,125      │
│                              (Promo Verano 15%)         │
│                              ─────────────────────      │
│                              TOTAL:       $142,375      │
├─────────────────────────────────────────────────────────┤
│  PLAN DE PAGOS                                          │
│  • 30% Anticipo: $42,712.50 (al confirmar)              │
│  • 40% Segundo pago: $56,950 (30 días antes)            │
│  • 30% Liquidación: $42,712.50 (día del evento)         │
├─────────────────────────────────────────────────────────┤
│  TÉRMINOS Y CONDICIONES                                 │
│  • Cotización válida por 30 días                        │
│  • Precios en MXN, IVA incluido                         │
│  • Cambios sujetos a disponibilidad                     │
├─────────────────────────────────────────────────────────┤
│  CONTACTO                                               │
│  Tel: +52 555 987 6543 | email@weddingplanner.com      │
│  www.weddingplanner.com                                 │
└─────────────────────────────────────────────────────────┘
```

#### Tecnología Recomendada
| Opción | Descripción | Pros | Contras |
|--------|-------------|------|---------|
| **jsPDF** | Generación en cliente | Sin servidor, rápido | Diseño limitado |
| **PDFMake** | Declarativo | Fácil de usar | Bundle grande |
| **Puppeteer** | HTML a PDF | Diseño flexible | Requiere servidor |
| **Azure PDF API** | Serverless | Escalable | Costo por uso |

#### Implementación con PDFMake
```typescript
@Injectable({ providedIn: 'root' })
export class GeneradorPDFService {

  generarCotizacion(cotizacion: Cotizacion): Promise<Blob> {
    const docDefinition = {
      pageSize: 'LETTER',
      pageMargins: [40, 60, 40, 60],

      header: this.generarEncabezado(),
      footer: this.generarPiePagina(),

      content: [
        this.seccionDatosCliente(cotizacion.cliente),
        this.seccionDetallesEvento(cotizacion.evento),
        this.seccionTablaServicios(cotizacion.servicios),
        this.seccionTotales(cotizacion),
        this.seccionPlanPagos(cotizacion.planPagos),
        this.seccionTerminos()
      ],

      styles: this.estilosDocumento()
    };

    return pdfMake.createPdf(docDefinition).getBlob();
  }
}
```

---

### 4.4 Envío Profesional al Cliente

#### Descripción
Sistema de envío automatizado de cotizaciones por email con plantillas profesionales y seguimiento.

#### Plantilla de Email
```html
Asunto: Tu cotización personalizada - [Nombre Evento] | Wedding Planner

Hola [Nombre Cliente],

Gracias por tu interés en nuestros servicios.

Adjunto encontrarás la cotización personalizada para tu [tipo evento]
el [fecha evento].

📎 Cotización #COT-2026-0345

Resumen:
• Invitados: [num personas] personas
• Total: $[monto total] MXN
• Promoción aplicada: [nombre promoción]

Esta cotización es válida hasta el [fecha vencimiento].

¿Tienes preguntas? Responde a este correo o contáctanos:
📞 +52 555 987 6543
💬 WhatsApp: +52 555 987 6543

¡Esperamos hacer de tu evento algo inolvidable!

Saludos,
El equipo de Wedding Planner

---
Este correo fue enviado automáticamente.
Si no solicitaste esta cotización, puedes ignorar este mensaje.
```

#### Modelo de Datos
```typescript
interface EnvioEmail {
  id: string;
  cotizacionId: string;
  destinatario: string;
  asunto: string;
  cuerpo: string;
  adjuntos: string[];           // URLs de PDFs
  estado: 'pendiente' | 'enviado' | 'fallido' | 'abierto';
  fechaEnvio?: Date;
  fechaApertura?: Date;         // Tracking pixel
  intentos: number;
  error?: string;
}
```

#### Servicio de Envío
```typescript
// Azure Function para envío
export async function enviarCotizacion(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const { cotizacionId, email } = await req.json();

  // 1. Obtener cotización
  const cotizacion = await obtenerCotizacion(cotizacionId);

  // 2. Generar PDF
  const pdfBuffer = await generarPDF(cotizacion);

  // 3. Subir a blob storage
  const pdfUrl = await subirBlob(pdfBuffer, `cotizaciones/${cotizacionId}.pdf`);

  // 4. Enviar email (SendGrid / Azure Communication Services)
  const resultado = await sendGrid.send({
    to: email,
    from: 'cotizaciones@weddingplanner.com',
    subject: `Tu cotización - ${cotizacion.evento.nombre}`,
    html: renderTemplate('cotizacion', { cotizacion, pdfUrl }),
    attachments: [{
      content: pdfBuffer.toString('base64'),
      filename: `Cotizacion-${cotizacionId}.pdf`,
      type: 'application/pdf'
    }]
  });

  // 5. Registrar envío
  await registrarEnvio(cotizacionId, email, resultado);

  return { status: 200, body: JSON.stringify({ success: true }) };
}
```

---

### 4.5 Registro Interno de Solicitudes

#### Descripción
Sistema de tracking de todas las solicitudes de cotización para análisis de conversión y seguimiento comercial.

#### Modelo de Datos
```typescript
interface SolicitudCotizacion {
  id: string;
  numero: string;               // COT-2026-0001

  // Datos del solicitante
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
    fuente: 'web' | 'whatsapp' | 'telefono' | 'referido' | 'redes';
  };

  // Datos del evento
  evento: {
    tipo: string;
    fecha: Date;
    numPersonas: number;
    lugar?: string;
    serviciosInteres: string[];
  };

  // Estado del proceso
  estado: 'nueva' | 'contactada' | 'cotizada' | 'negociando' | 'cerrada' | 'perdida';

  // Cotización generada
  cotizacion?: {
    id: string;
    monto: number;
    fechaGeneracion: Date;
    fechaEnvio?: Date;
    veces_vista: number;
  };

  // Seguimiento
  seguimientos: Seguimiento[];

  // Conversión
  conversion?: {
    fecha: Date;
    eventoId: string;
    montoFinal: number;
  };

  // Razón de pérdida
  razonPerdida?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  asignadoA?: string;           // Vendedor responsable
}

interface Seguimiento {
  fecha: Date;
  tipo: 'llamada' | 'email' | 'whatsapp' | 'reunion' | 'nota';
  descripcion: string;
  resultado: string;
  proximaAccion?: {
    fecha: Date;
    descripcion: string;
  };
  registradoPor: string;
}
```

#### Pipeline de Ventas (Kanban)
```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│    NUEVAS    │  CONTACTADAS │   COTIZADAS  │  NEGOCIANDO  │   CERRADAS   │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │
│ │ María G. │ │ │ Juan P.  │ │ │ Ana R.   │ │ │ Luis M.  │ │ │ Pedro S. │ │
│ │ Boda     │ │ │ XV Años  │ │ │ Boda     │ │ │ Boda     │ │ │ Boda     │ │
│ │ $150,000 │ │ │ $80,000  │ │ │ $200,000 │ │ │ $175,000 │ │ │ $165,000 │ │
│ │ 2 días   │ │ │ 5 días   │ │ │ 1 semana │ │ │ 2 sem.   │ │ │ ✓ Ganada │ │
│ └──────────┘ │ └──────────┘ │ └──────────┘ │ └──────────┘ │ └──────────┘ │
│ ┌──────────┐ │              │ ┌──────────┐ │              │ ┌──────────┐ │
│ │ Carlos T.│ │              │ │ Diana L. │ │              │ │ Rosa M.  │ │
│ │ Bautizo  │ │              │ │ Boda     │ │              │ │ XV Años  │ │
│ │ $45,000  │ │              │ │ $180,000 │ │              │ │ ✗ Perdida│ │
│ └──────────┘ │              │ └──────────┘ │              │ └──────────┘ │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

#### Métricas de Conversión
```typescript
interface MetricasVentas {
  periodo: { inicio: Date; fin: Date };

  solicitudes: {
    total: number;
    porFuente: Record<string, number>;
    porTipoEvento: Record<string, number>;
  };

  conversion: {
    tasaContacto: number;       // % contactadas
    tasaCotizacion: number;     // % que reciben cotización
    tasaCierre: number;         // % que cierran
    tasaGeneral: number;        // Nueva → Cerrada
  };

  tiempos: {
    promedioRespuesta: number;  // horas
    promedioCierre: number;     // días
  };

  ingresos: {
    potencialTotal: number;     // Suma de cotizaciones activas
    cerradoTotal: number;       // Ventas cerradas
    ticketPromedio: number;
  };
}
```

---

## 5. Integración con Sistema Actual

### 5.1 Nuevas Rutas
```typescript
// app.routes.ts
export const routes: Routes = [
  // ... rutas existentes ...

  // Módulo Financiero
  {
    path: 'pagos',
    loadComponent: () => import('./pages/pagos/pagos.component')
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/clientes/clientes.component')
  },
  {
    path: 'comprobantes',
    loadComponent: () => import('./pages/comprobantes/comprobantes.component')
  },

  // Módulo Ventas
  {
    path: 'cotizaciones',
    loadComponent: () => import('./pages/cotizaciones/cotizaciones.component')
  },
  {
    path: 'cotizaciones/nueva',
    loadComponent: () => import('./pages/cotizaciones/nueva-cotizacion.component')
  },
  {
    path: 'promociones',
    loadComponent: () => import('./pages/promociones/promociones.component')
  },
  {
    path: 'solicitudes',
    loadComponent: () => import('./pages/solicitudes/solicitudes.component')
  }
];
```

### 5.2 Nuevos Endpoints API
```typescript
// pagos.ts
app.http("getPagos", { route: "pagos", methods: ["GET"] });
app.http("validarPago", { route: "pagos/{id}/validar", methods: ["PUT"] });

// comprobantes.ts
app.http("uploadComprobante", { route: "comprobantes/upload", methods: ["POST"] });

// clientes.ts
app.http("getClientesActivos", { route: "clientes/activos", methods: ["GET"] });
app.http("getBalanceCliente", { route: "clientes/{id}/balance", methods: ["GET"] });

// cotizaciones.ts
app.http("generarCotizacion", { route: "cotizaciones", methods: ["POST"] });
app.http("enviarCotizacion", { route: "cotizaciones/{id}/enviar", methods: ["POST"] });
app.http("descargarPDF", { route: "cotizaciones/{id}/pdf", methods: ["GET"] });

// promociones.ts
app.http("getPromocionesActivas", { route: "promociones/activas", methods: ["GET"] });
app.http("calcularPromocion", { route: "promociones/calcular", methods: ["POST"] });

// solicitudes.ts
app.http("getSolicitudes", { route: "solicitudes", methods: ["GET"] });
app.http("actualizarEstado", { route: "solicitudes/{id}/estado", methods: ["PUT"] });
app.http("agregarSeguimiento", { route: "solicitudes/{id}/seguimiento", methods: ["POST"] });
```

### 5.3 Nuevas Tablas de Base de Datos
```sql
-- Extensiones a schema existente

-- Comprobantes de pago
CREATE TABLE Comprobantes (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PagoId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Pagos(Id),
    Tipo NVARCHAR(20) NOT NULL,
    NombreArchivo NVARCHAR(255) NOT NULL,
    Url NVARCHAR(500) NOT NULL,
    Tamaño INT,
    Verificado BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Promociones
CREATE TABLE Promociones (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500),
    Tipo NVARCHAR(20) NOT NULL,
    Valor DECIMAL(18,2) NOT NULL,
    Condiciones NVARCHAR(MAX),  -- JSON
    FechaInicio DATETIME2,
    FechaFin DATETIME2,
    UsoMaximo INT,
    UsosActuales INT DEFAULT 0,
    Activa BIT DEFAULT 1,
    Prioridad INT DEFAULT 0,
    Acumulable BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Cotizaciones
CREATE TABLE Cotizaciones (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Numero NVARCHAR(20) NOT NULL UNIQUE,
    ClienteId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Clientes(Id),
    TipoEvento NVARCHAR(50),
    FechaEvento DATETIME2,
    NumPersonas INT,
    Servicios NVARCHAR(MAX),     -- JSON
    Subtotal DECIMAL(18,2),
    Descuento DECIMAL(18,2),
    Total DECIMAL(18,2),
    PromocionId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Promociones(Id),
    Estado NVARCHAR(20) DEFAULT 'borrador',
    ValidaHasta DATETIME2,
    PdfUrl NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Solicitudes de cotización (CRM)
CREATE TABLE Solicitudes (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Numero NVARCHAR(20) NOT NULL UNIQUE,
    NombreCliente NVARCHAR(200) NOT NULL,
    Email NVARCHAR(200),
    Telefono NVARCHAR(50),
    Fuente NVARCHAR(50),
    TipoEvento NVARCHAR(50),
    FechaEvento DATETIME2,
    NumPersonas INT,
    ServiciosInteres NVARCHAR(MAX),
    Estado NVARCHAR(20) DEFAULT 'nueva',
    CotizacionId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Cotizaciones(Id),
    AsignadoA NVARCHAR(100),
    RazonPerdida NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Seguimientos de solicitudes
CREATE TABLE Seguimientos (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SolicitudId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Solicitudes(Id),
    Tipo NVARCHAR(50) NOT NULL,
    Descripcion NVARCHAR(MAX),
    Resultado NVARCHAR(500),
    ProximaAccionFecha DATETIME2,
    ProximaAccionDesc NVARCHAR(500),
    RegistradoPor NVARCHAR(100),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Envíos de email
CREATE TABLE EnviosEmail (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CotizacionId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Cotizaciones(Id),
    Destinatario NVARCHAR(200) NOT NULL,
    Asunto NVARCHAR(500),
    Estado NVARCHAR(20) DEFAULT 'pendiente',
    FechaEnvio DATETIME2,
    FechaApertura DATETIME2,
    Intentos INT DEFAULT 0,
    Error NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);
```

---

## 6. Navegación Actualizada

### Sidebar Propuesto
```
┌─────────────────────────────────┐
│  🏠 Dashboard                   │
├─────────────────────────────────┤
│  📅 AGENDA                      │
│     └─ Citas                    │
├─────────────────────────────────┤
│  🎉 EVENTOS                     │
│     ├─ Planeador                │
│     ├─ Logística                │
│     └─ Galería 360°             │
├─────────────────────────────────┤
│  💰 FINANZAS          ← NUEVO   │
│     ├─ Pagos                    │
│     ├─ Comprobantes             │
│     └─ Balance                  │
├─────────────────────────────────┤
│  📊 VENTAS            ← NUEVO   │
│     ├─ Solicitudes              │
│     ├─ Cotizaciones             │
│     └─ Promociones              │
├─────────────────────────────────┤
│  👥 CLIENTES          ← NUEVO   │
│     └─ Directorio               │
├─────────────────────────────────┤
│  🏪 CATÁLOGO                    │
│     ├─ Proveedores              │
│     ├─ Hoteles                  │
│     └─ Cupones                  │
├─────────────────────────────────┤
│  🛒 Carrito                     │
└─────────────────────────────────┘
```

---

## 7. Dependencias Adicionales

```json
{
  "dependencies": {
    "pdfmake": "^0.2.10",
    "@sendgrid/mail": "^8.1.0",
    "@azure/storage-blob": "^12.17.0",
    "chart.js": "^4.4.0",
    "ng2-charts": "^6.0.0"
  }
}
```

---

## 8. Priorización de Desarrollo

### Fase 1 - Fundamentos (Sprint 1-2)
1. ✅ Vista de Clientes Activos
2. ✅ Cálculo de Saldo Pendiente
3. ✅ Validación Manual de Pagos

### Fase 2 - Automatización (Sprint 3-4)
4. ✅ Registro de Solicitudes (CRM básico)
5. ✅ Selección de Promociones
6. ✅ Cálculo por Número de Personas

### Fase 3 - Comunicación (Sprint 5-6)
7. ✅ Generación de PDF
8. ✅ Gestión de Comprobantes
9. ✅ Envío Automático de Cotizaciones

### Fase 4 - Optimización (Sprint 7-8)
10. ✅ Pipeline de Ventas (Kanban)
11. ✅ Métricas y Reportes
12. ✅ Integraciones (WhatsApp, Calendar)

---

## 9. Consideraciones Técnicas

### Seguridad
- Validación de archivos subidos (tipo, tamaño)
- Sanitización de URLs de comprobantes
- Rate limiting en envío de emails
- Auditoría de validaciones de pago

### Performance
- Lazy loading de módulos
- Paginación en listas grandes
- Caché de promociones activas
- Generación de PDF en background

### UX
- Confirmaciones antes de acciones destructivas
- Feedback visual en operaciones asíncronas
- Estados de carga consistentes
- Notificaciones toast para resultados

---

## 10. Próximos Pasos

1. **Validar** este análisis con stakeholders
2. **Priorizar** funcionalidades según necesidades del negocio
3. **Diseñar** wireframes de las nuevas pantallas
4. **Crear** tareas detalladas en backlog
5. **Iniciar** desarrollo de Fase 1

---

*Documento generado para Wedding Planner Solution*
