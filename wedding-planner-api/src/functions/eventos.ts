import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

interface Evento {
  id: string;
  nombre: string;
  tipo: string;
  fecha: string;
  cliente: string;
  presupuesto: number;
  presupuestoGastado: number;
  ubicacion: string;
  estado: string;
  invitados: number;
  proveedores: ProveedorAsignado[];
  tareas: Tarea[];
  notas?: string;
}

interface ProveedorAsignado {
  proveedorId: string;
  servicio: string;
  costo: number;
  confirmado: boolean;
}

interface Tarea {
  id: string;
  descripcion: string;
  completada: boolean;
  fechaLimite?: string;
}

// Datos dummy
let eventos: Evento[] = [
  {
    id: "1",
    nombre: "Boda García-López",
    tipo: "boda",
    fecha: "2026-06-15",
    cliente: "María García",
    presupuesto: 350000,
    presupuestoGastado: 180000,
    ubicacion: "Salón Gran Imperial, CDMX",
    estado: "planificacion",
    invitados: 150,
    proveedores: [
      { proveedorId: "1", servicio: "Catering completo", costo: 75000, confirmado: true }
    ],
    tareas: [
      { id: "1", descripcion: "Confirmar menú con catering", completada: true },
      { id: "2", descripcion: "Prueba de vestido", completada: false, fechaLimite: "2026-04-01" }
    ]
  }
];

export async function getEventos(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const estado = request.query.get("estado");
  const tipo = request.query.get("tipo");

  let result = eventos;
  if (estado) {
    result = result.filter(e => e.estado === estado);
  }
  if (tipo) {
    result = result.filter(e => e.tipo === tipo);
  }

  return { status: 200, jsonBody: result };
}

export async function getEventoById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  const evento = eventos.find(e => e.id === id);

  if (!evento) {
    return { status: 404, jsonBody: { error: "Evento no encontrado" } };
  }

  return { status: 200, jsonBody: evento };
}

export async function createEvento(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const body = await request.json() as Partial<Evento>;

  const newEvento: Evento = {
    id: Date.now().toString(),
    nombre: body.nombre || "",
    tipo: body.tipo || "otro",
    fecha: body.fecha || "",
    cliente: body.cliente || "",
    presupuesto: body.presupuesto || 0,
    presupuestoGastado: 0,
    ubicacion: body.ubicacion || "",
    estado: "planificacion",
    invitados: body.invitados || 0,
    proveedores: [],
    tareas: [],
    notas: body.notas
  };

  eventos.push(newEvento);

  return { status: 201, jsonBody: newEvento };
}

export async function updateEvento(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  const body = await request.json() as Partial<Evento>;

  const index = eventos.findIndex(e => e.id === id);
  if (index === -1) {
    return { status: 404, jsonBody: { error: "Evento no encontrado" } };
  }

  eventos[index] = { ...eventos[index], ...body };

  return { status: 200, jsonBody: eventos[index] };
}

export async function addTareaToEvento(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  const body = await request.json() as Partial<Tarea>;

  const evento = eventos.find(e => e.id === id);
  if (!evento) {
    return { status: 404, jsonBody: { error: "Evento no encontrado" } };
  }

  const newTarea: Tarea = {
    id: Date.now().toString(),
    descripcion: body.descripcion || "",
    completada: false,
    fechaLimite: body.fechaLimite
  };

  evento.tareas.push(newTarea);

  return { status: 201, jsonBody: newTarea };
}

export async function deleteEvento(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  const index = eventos.findIndex(e => e.id === id);

  if (index === -1) {
    return { status: 404, jsonBody: { error: "Evento no encontrado" } };
  }

  eventos.splice(index, 1);

  return { status: 204 };
}

// Register routes
app.http("getEventos", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "eventos",
  handler: getEventos
});

app.http("getEventoById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "eventos/{id}",
  handler: getEventoById
});

app.http("createEvento", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "eventos",
  handler: createEvento
});

app.http("updateEvento", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "eventos/{id}",
  handler: updateEvento
});

app.http("addTareaToEvento", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "eventos/{id}/tareas",
  handler: addTareaToEvento
});

app.http("deleteEvento", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "eventos/{id}",
  handler: deleteEvento
});
