-- Wedding Planner Database Schema
-- SQL Server / Azure SQL Database

-- ==========================================
-- CLIENTES
-- ==========================================
CREATE TABLE Clientes (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Nombre NVARCHAR(200) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Telefono NVARCHAR(50),
    Direccion NVARCHAR(500),
    Ciudad NVARCHAR(100),
    Notas NVARCHAR(MAX),
    Activo BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- ==========================================
-- CITAS
-- ==========================================
CREATE TABLE Citas (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ClienteId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Clientes(Id),
    Fecha DATE NOT NULL,
    Hora TIME NOT NULL,
    TipoEvento NVARCHAR(50) NOT NULL, -- boda, quinceanos, bautizo, corporativo, viaje, otro
    Estado NVARCHAR(50) DEFAULT 'pendiente', -- pendiente, confirmada, completada, cancelada
    Notas NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Citas_ClienteId ON Citas(ClienteId);
CREATE INDEX IX_Citas_Fecha ON Citas(Fecha);
CREATE INDEX IX_Citas_Estado ON Citas(Estado);

-- ==========================================
-- CATEGORIAS DE PROVEEDORES
-- ==========================================
CREATE TABLE CategoriasProveedor (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL UNIQUE,
    Descripcion NVARCHAR(500),
    Icono NVARCHAR(50)
);

INSERT INTO CategoriasProveedor (Nombre, Descripcion) VALUES
('catering', 'Servicios de catering y banquetes'),
('fotografia', 'Fotografía y video'),
('musica', 'Música, DJ y entretenimiento'),
('decoracion', 'Decoración de eventos'),
('floreria', 'Arreglos florales'),
('salon', 'Salones de eventos'),
('hotel', 'Hoteles y hospedaje'),
('transporte', 'Transporte y logística'),
('vestimenta', 'Vestidos y trajes'),
('pasteleria', 'Pasteles y postres');

-- ==========================================
-- PROVEEDORES
-- ==========================================
CREATE TABLE Proveedores (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Nombre NVARCHAR(200) NOT NULL,
    CategoriaId INT NOT NULL FOREIGN KEY REFERENCES CategoriasProveedor(Id),
    Contacto NVARCHAR(200),
    Telefono NVARCHAR(50),
    Email NVARCHAR(255),
    Direccion NVARCHAR(500),
    Ciudad NVARCHAR(100),
    Calificacion DECIMAL(3,2) DEFAULT 5.00,
    PrecioBase DECIMAL(18,2),
    Descripcion NVARCHAR(MAX),
    Activo BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Proveedores_CategoriaId ON Proveedores(CategoriaId);
CREATE INDEX IX_Proveedores_Ciudad ON Proveedores(Ciudad);

-- ==========================================
-- SERVICIOS DE PROVEEDORES
-- ==========================================
CREATE TABLE ServiciosProveedor (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ProveedorId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Proveedores(Id) ON DELETE CASCADE,
    Nombre NVARCHAR(200) NOT NULL,
    Descripcion NVARCHAR(500),
    Precio DECIMAL(18,2)
);

CREATE INDEX IX_ServiciosProveedor_ProveedorId ON ServiciosProveedor(ProveedorId);

-- ==========================================
-- EVENTOS
-- ==========================================
CREATE TABLE Eventos (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Nombre NVARCHAR(200) NOT NULL,
    TipoEvento NVARCHAR(50) NOT NULL,
    Fecha DATE NOT NULL,
    ClienteId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Clientes(Id),
    Presupuesto DECIMAL(18,2) DEFAULT 0,
    PresupuestoGastado DECIMAL(18,2) DEFAULT 0,
    Ubicacion NVARCHAR(500),
    Estado NVARCHAR(50) DEFAULT 'planificacion', -- planificacion, en_progreso, completado, cancelado
    Invitados INT DEFAULT 0,
    Notas NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Eventos_ClienteId ON Eventos(ClienteId);
CREATE INDEX IX_Eventos_Fecha ON Eventos(Fecha);
CREATE INDEX IX_Eventos_Estado ON Eventos(Estado);

-- ==========================================
-- PROVEEDORES ASIGNADOS A EVENTOS
-- ==========================================
CREATE TABLE EventosProveedores (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EventoId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Eventos(Id) ON DELETE CASCADE,
    ProveedorId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Proveedores(Id),
    Servicio NVARCHAR(200),
    Costo DECIMAL(18,2),
    Confirmado BIT DEFAULT 0,
    Notas NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX IX_EventosProveedores_EventoId ON EventosProveedores(EventoId);
CREATE INDEX IX_EventosProveedores_ProveedorId ON EventosProveedores(ProveedorId);

-- ==========================================
-- TAREAS DE EVENTOS
-- ==========================================
CREATE TABLE TareasEvento (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EventoId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Eventos(Id) ON DELETE CASCADE,
    Descripcion NVARCHAR(500) NOT NULL,
    Completada BIT DEFAULT 0,
    FechaLimite DATE,
    Prioridad INT DEFAULT 2, -- 1: alta, 2: media, 3: baja
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    CompletadaAt DATETIME2
);

CREATE INDEX IX_TareasEvento_EventoId ON TareasEvento(EventoId);
CREATE INDEX IX_TareasEvento_FechaLimite ON TareasEvento(FechaLimite);

-- ==========================================
-- HOTELES
-- ==========================================
CREATE TABLE Hoteles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Nombre NVARCHAR(200) NOT NULL,
    Ciudad NVARCHAR(100) NOT NULL,
    Pais NVARCHAR(100) NOT NULL,
    Estrellas INT CHECK (Estrellas >= 1 AND Estrellas <= 5),
    PrecioNoche DECIMAL(18,2),
    ImagenUrl NVARCHAR(500),
    Descripcion NVARCHAR(MAX),
    Direccion NVARCHAR(500),
    Telefono NVARCHAR(50),
    Email NVARCHAR(255),
    Disponible BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Hoteles_Ciudad ON Hoteles(Ciudad);
CREATE INDEX IX_Hoteles_Pais ON Hoteles(Pais);

-- ==========================================
-- AMENIDADES DE HOTELES
-- ==========================================
CREATE TABLE AmenidadesHotel (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    HotelId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Hoteles(Id) ON DELETE CASCADE,
    Nombre NVARCHAR(100) NOT NULL
);

CREATE INDEX IX_AmenidadesHotel_HotelId ON AmenidadesHotel(HotelId);

-- ==========================================
-- RESERVAS DE HOTEL
-- ==========================================
CREATE TABLE ReservasHotel (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    HotelId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Hoteles(Id),
    ClienteId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Clientes(Id),
    EventoId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Eventos(Id), -- Opcional, si está vinculado a un evento
    FechaEntrada DATE NOT NULL,
    FechaSalida DATE NOT NULL,
    Habitaciones INT DEFAULT 1,
    Huespedes INT DEFAULT 1,
    Total DECIMAL(18,2),
    Estado NVARCHAR(50) DEFAULT 'pendiente', -- pendiente, confirmada, cancelada
    Notas NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX IX_ReservasHotel_HotelId ON ReservasHotel(HotelId);
CREATE INDEX IX_ReservasHotel_ClienteId ON ReservasHotel(ClienteId);
CREATE INDEX IX_ReservasHotel_FechaEntrada ON ReservasHotel(FechaEntrada);

-- ==========================================
-- PAGOS
-- ==========================================
CREATE TABLE Pagos (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EventoId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Eventos(Id),
    ReservaId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES ReservasHotel(Id),
    Monto DECIMAL(18,2) NOT NULL,
    MetodoPago NVARCHAR(50), -- efectivo, tarjeta, transferencia
    Estado NVARCHAR(50) DEFAULT 'pendiente', -- pendiente, completado, reembolsado
    FechaPago DATETIME2,
    Referencia NVARCHAR(100),
    Notas NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Pagos_EventoId ON Pagos(EventoId);
CREATE INDEX IX_Pagos_ReservaId ON Pagos(ReservaId);
