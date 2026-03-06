import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

interface Proveedor {
  id: string;
  nombre: string;
  categoria: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  calificacion: number;
  precioBase: number;
  descripcion: string;
  servicios: string[];
  activo: boolean;
}

// Datos dummy
let proveedores: Proveedor[] = [
  {
    id: "1",
    nombre: "Catering Elegance",
    categoria: "catering",
    contacto: "Juan Pérez",
    telefono: "+52 555 100 2000",
    email: "info@cateringelegance.com",
    direccion: "Av. Reforma 123",
    ciudad: "Ciudad de México",
    calificacion: 4.8,
    precioBase: 25000,
    descripcion: "Servicio de catering premium para bodas y eventos",
    servicios: ["Buffet", "Servicio a mesa", "Coctelería", "Postres"],
    activo: true
  }
];

export async function getProveedores(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const categoria = request.query.get("categoria");

  let result = proveedores;
  if (categoria) {
    result = proveedores.filter(p => p.categoria === categoria);
  }

  return { status: 200, jsonBody: result };
}

export async function getProveedorById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  const proveedor = proveedores.find(p => p.id === id);

  if (!proveedor) {
    return { status: 404, jsonBody: { error: "Proveedor no encontrado" } };
  }

  return { status: 200, jsonBody: proveedor };
}

export async function createProveedor(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const body = await request.json() as Partial<Proveedor>;

  const newProveedor: Proveedor = {
    id: Date.now().toString(),
    nombre: body.nombre || "",
    categoria: body.categoria || "otro",
    contacto: body.contacto || "",
    telefono: body.telefono || "",
    email: body.email || "",
    direccion: body.direccion || "",
    ciudad: body.ciudad || "",
    calificacion: body.calificacion || 5.0,
    precioBase: body.precioBase || 0,
    descripcion: body.descripcion || "",
    servicios: body.servicios || [],
    activo: true
  };

  proveedores.push(newProveedor);

  return { status: 201, jsonBody: newProveedor };
}

export async function updateProveedor(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  const body = await request.json() as Partial<Proveedor>;

  const index = proveedores.findIndex(p => p.id === id);
  if (index === -1) {
    return { status: 404, jsonBody: { error: "Proveedor no encontrado" } };
  }

  proveedores[index] = { ...proveedores[index], ...body };

  return { status: 200, jsonBody: proveedores[index] };
}

export async function deleteProveedor(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  const index = proveedores.findIndex(p => p.id === id);

  if (index === -1) {
    return { status: 404, jsonBody: { error: "Proveedor no encontrado" } };
  }

  proveedores.splice(index, 1);

  return { status: 204 };
}

// Register routes
app.http("getProveedores", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "proveedores",
  handler: getProveedores
});

app.http("getProveedorById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "proveedores/{id}",
  handler: getProveedorById
});

app.http("createProveedor", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "proveedores",
  handler: createProveedor
});

app.http("updateProveedor", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "proveedores/{id}",
  handler: updateProveedor
});

app.http("deleteProveedor", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "proveedores/{id}",
  handler: deleteProveedor
});
