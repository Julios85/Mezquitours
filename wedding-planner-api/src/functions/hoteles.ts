import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

interface Hotel {
  id: string;
  nombre: string;
  ciudad: string;
  pais: string;
  estrellas: number;
  precioNoche: number;
  imagen: string;
  amenidades: string[];
  disponible: boolean;
}

interface ReservaHotel {
  id: string;
  hotelId: string;
  clienteNombre: string;
  fechaEntrada: string;
  fechaSalida: string;
  habitaciones: number;
  huespedes: number;
  total: number;
  estado: string;
}

// Datos dummy
let hoteles: Hotel[] = [
  {
    id: "1",
    nombre: "Grand Fiesta Americana Cancún",
    ciudad: "Cancún",
    pais: "México",
    estrellas: 5,
    precioNoche: 4500,
    imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    amenidades: ["Playa", "Spa", "Restaurantes", "Bar", "Gimnasio"],
    disponible: true
  },
  {
    id: "2",
    nombre: "Hotel Xcaret México",
    ciudad: "Playa del Carmen",
    pais: "México",
    estrellas: 5,
    precioNoche: 8500,
    imagen: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
    amenidades: ["All Inclusive", "Parques", "Spa", "Ríos subterráneos"],
    disponible: true
  }
];

let reservas: ReservaHotel[] = [];

export async function getHoteles(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const pais = request.query.get("pais");
  const ciudad = request.query.get("ciudad");
  const estrellas = request.query.get("estrellas");

  let result = hoteles;

  if (pais) {
    result = result.filter(h => h.pais.toLowerCase() === pais.toLowerCase());
  }
  if (ciudad) {
    result = result.filter(h => h.ciudad.toLowerCase().includes(ciudad.toLowerCase()));
  }
  if (estrellas) {
    result = result.filter(h => h.estrellas >= parseInt(estrellas));
  }

  return { status: 200, jsonBody: result };
}

export async function getHotelById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  const hotel = hoteles.find(h => h.id === id);

  if (!hotel) {
    return { status: 404, jsonBody: { error: "Hotel no encontrado" } };
  }

  return { status: 200, jsonBody: hotel };
}

export async function createReserva(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const body = await request.json() as Partial<ReservaHotel>;

  const hotel = hoteles.find(h => h.id === body.hotelId);
  if (!hotel) {
    return { status: 404, jsonBody: { error: "Hotel no encontrado" } };
  }

  if (!hotel.disponible) {
    return { status: 400, jsonBody: { error: "Hotel no disponible" } };
  }

  // Calcular noches y total
  const entrada = new Date(body.fechaEntrada || "");
  const salida = new Date(body.fechaSalida || "");
  const noches = Math.ceil((salida.getTime() - entrada.getTime()) / (1000 * 60 * 60 * 24));
  const total = noches * hotel.precioNoche * (body.habitaciones || 1);

  const newReserva: ReservaHotel = {
    id: Date.now().toString(),
    hotelId: body.hotelId || "",
    clienteNombre: body.clienteNombre || "",
    fechaEntrada: body.fechaEntrada || "",
    fechaSalida: body.fechaSalida || "",
    habitaciones: body.habitaciones || 1,
    huespedes: body.huespedes || 1,
    total,
    estado: "pendiente"
  };

  reservas.push(newReserva);

  return { status: 201, jsonBody: newReserva };
}

export async function getReservas(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  return { status: 200, jsonBody: reservas };
}

export async function getReservaById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  const reserva = reservas.find(r => r.id === id);

  if (!reserva) {
    return { status: 404, jsonBody: { error: "Reserva no encontrada" } };
  }

  return { status: 200, jsonBody: reserva };
}

export async function updateReserva(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  const body = await request.json() as Partial<ReservaHotel>;

  const index = reservas.findIndex(r => r.id === id);
  if (index === -1) {
    return { status: 404, jsonBody: { error: "Reserva no encontrada" } };
  }

  reservas[index] = { ...reservas[index], ...body };

  return { status: 200, jsonBody: reservas[index] };
}

export async function cancelReserva(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  const index = reservas.findIndex(r => r.id === id);

  if (index === -1) {
    return { status: 404, jsonBody: { error: "Reserva no encontrada" } };
  }

  reservas[index].estado = "cancelada";

  return { status: 200, jsonBody: reservas[index] };
}

// Register routes
app.http("getHoteles", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "hoteles",
  handler: getHoteles
});

app.http("getHotelById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "hoteles/{id}",
  handler: getHotelById
});

app.http("createReserva", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "reservas",
  handler: createReserva
});

app.http("getReservas", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "reservas",
  handler: getReservas
});

app.http("getReservaById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "reservas/{id}",
  handler: getReservaById
});

app.http("updateReserva", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "reservas/{id}",
  handler: updateReserva
});

app.http("cancelReserva", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "reservas/{id}/cancelar",
  handler: cancelReserva
});
