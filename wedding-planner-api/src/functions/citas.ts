import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

interface Cita {
  id: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  fecha: string;
  hora: string;
  tipoEvento: string;
  estado: string;
  notas?: string;
  createdAt: string;
}

// Datos dummy - se reemplazará por conexión a BD
let citas: Cita[] = [
  {
    id: "1",
    clienteNombre: "María García",
    clienteEmail: "maria@email.com",
    clienteTelefono: "+52 555 123 4567",
    fecha: "2026-03-15",
    hora: "10:00",
    tipoEvento: "boda",
    estado: "confirmada",
    notas: "Boda para 150 personas",
    createdAt: new Date().toISOString()
  }
];

// GET /api/citas
export async function getCitas(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("GET /api/citas");
  return {
    status: 200,
    jsonBody: citas
  };
}

// GET /api/citas/:id
export async function getCitaById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  const cita = citas.find(c => c.id === id);

  if (!cita) {
    return { status: 404, jsonBody: { error: "Cita no encontrada" } };
  }

  return { status: 200, jsonBody: cita };
}

// POST /api/citas
export async function createCita(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const body = await request.json() as Partial<Cita>;

  const newCita: Cita = {
    id: Date.now().toString(),
    clienteNombre: body.clienteNombre || "",
    clienteEmail: body.clienteEmail || "",
    clienteTelefono: body.clienteTelefono || "",
    fecha: body.fecha || "",
    hora: body.hora || "",
    tipoEvento: body.tipoEvento || "otro",
    estado: "pendiente",
    notas: body.notas,
    createdAt: new Date().toISOString()
  };

  citas.push(newCita);

  return { status: 201, jsonBody: newCita };
}

// PUT /api/citas/:id
export async function updateCita(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  const body = await request.json() as Partial<Cita>;

  const index = citas.findIndex(c => c.id === id);
  if (index === -1) {
    return { status: 404, jsonBody: { error: "Cita no encontrada" } };
  }

  citas[index] = { ...citas[index], ...body };

  return { status: 200, jsonBody: citas[index] };
}

// DELETE /api/citas/:id
export async function deleteCita(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  const index = citas.findIndex(c => c.id === id);

  if (index === -1) {
    return { status: 404, jsonBody: { error: "Cita no encontrada" } };
  }

  citas.splice(index, 1);

  return { status: 204 };
}

// Register routes
app.http("getCitas", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "citas",
  handler: getCitas
});

app.http("getCitaById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "citas/{id}",
  handler: getCitaById
});

app.http("createCita", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "citas",
  handler: createCita
});

app.http("updateCita", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "citas/{id}",
  handler: updateCita
});

app.http("deleteCita", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "citas/{id}",
  handler: deleteCita
});
