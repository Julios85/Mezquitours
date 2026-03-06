-- Seed Data para Wedding Planner
-- Ejecutar después de schema.sql

-- ==========================================
-- CLIENTES DE EJEMPLO
-- ==========================================
INSERT INTO Clientes (Id, Nombre, Email, Telefono, Ciudad) VALUES
(NEWID(), 'María García', 'maria@email.com', '+52 555 123 4567', 'Ciudad de México'),
(NEWID(), 'Roberto López', 'roberto@email.com', '+52 555 987 6543', 'Guadalajara'),
(NEWID(), 'Ana Martínez', 'ana@email.com', '+52 555 456 7890', 'Monterrey'),
(NEWID(), 'Carlos Sánchez', 'carlos@email.com', '+52 555 111 2222', 'Ciudad de México');

-- ==========================================
-- PROVEEDORES DE EJEMPLO
-- ==========================================
DECLARE @CateringId INT = (SELECT Id FROM CategoriasProveedor WHERE Nombre = 'catering');
DECLARE @FotoId INT = (SELECT Id FROM CategoriasProveedor WHERE Nombre = 'fotografia');
DECLARE @FloreriaId INT = (SELECT Id FROM CategoriasProveedor WHERE Nombre = 'floreria');
DECLARE @SalonId INT = (SELECT Id FROM CategoriasProveedor WHERE Nombre = 'salon');
DECLARE @MusicaId INT = (SELECT Id FROM CategoriasProveedor WHERE Nombre = 'musica');
DECLARE @HotelId INT = (SELECT Id FROM CategoriasProveedor WHERE Nombre = 'hotel');

INSERT INTO Proveedores (Id, Nombre, CategoriaId, Contacto, Telefono, Email, Direccion, Ciudad, Calificacion, PrecioBase, Descripcion) VALUES
(NEWID(), 'Catering Elegance', @CateringId, 'Juan Pérez', '+52 555 100 2000', 'info@cateringelegance.com', 'Av. Reforma 123', 'Ciudad de México', 4.8, 25000, 'Servicio de catering premium para bodas y eventos'),
(NEWID(), 'Foto Momentos', @FotoId, 'Laura Díaz', '+52 555 200 3000', 'contacto@fotomomentos.com', 'Calle Polanco 456', 'Ciudad de México', 4.9, 15000, 'Fotografía y video profesional para eventos'),
(NEWID(), 'Flores del Valle', @FloreriaId, 'Rosa Hernández', '+52 555 300 4000', 'ventas@floresdelvalle.com', 'Av. Insurgentes 789', 'Ciudad de México', 4.7, 8000, 'Arreglos florales y decoración para eventos'),
(NEWID(), 'Salón Gran Imperial', @SalonId, 'Miguel Torres', '+52 555 400 5000', 'reservas@granimperial.com', 'Blvd. Ávila Camacho 100', 'Ciudad de México', 4.6, 45000, 'Salón de eventos con capacidad hasta 500 personas'),
(NEWID(), 'DJ Party Mix', @MusicaId, 'Eduardo Ruiz', '+52 555 500 6000', 'booking@djpartymix.com', 'Col. Roma Norte', 'Ciudad de México', 4.5, 12000, 'DJ profesional y equipo de sonido');

-- ==========================================
-- HOTELES DE EJEMPLO
-- ==========================================
DECLARE @Hotel1 UNIQUEIDENTIFIER = NEWID();
DECLARE @Hotel2 UNIQUEIDENTIFIER = NEWID();
DECLARE @Hotel3 UNIQUEIDENTIFIER = NEWID();
DECLARE @Hotel4 UNIQUEIDENTIFIER = NEWID();

INSERT INTO Hoteles (Id, Nombre, Ciudad, Pais, Estrellas, PrecioNoche, ImagenUrl, Descripcion) VALUES
(@Hotel1, 'Grand Fiesta Americana Cancún', 'Cancún', 'México', 5, 4500, 'https://images.unsplash.com/photo-1566073771259-6a8506099945', 'Resort todo incluido frente al mar'),
(@Hotel2, 'Hotel Xcaret México', 'Playa del Carmen', 'México', 5, 8500, 'https://images.unsplash.com/photo-1582719508461-905c673771fd', 'Resort de lujo con acceso a parques'),
(@Hotel3, 'Marriott Puerto Vallarta', 'Puerto Vallarta', 'México', 4, 3200, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', 'Hotel frente a la playa'),
(@Hotel4, 'Ritz Carlton Miami', 'Miami', 'Estados Unidos', 5, 12000, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791', 'Hotel de lujo en South Beach');

-- Amenidades
INSERT INTO AmenidadesHotel (HotelId, Nombre) VALUES
(@Hotel1, 'Playa'), (@Hotel1, 'Spa'), (@Hotel1, 'Restaurantes'), (@Hotel1, 'Bar'), (@Hotel1, 'Gimnasio'),
(@Hotel2, 'All Inclusive'), (@Hotel2, 'Parques'), (@Hotel2, 'Spa'), (@Hotel2, 'Ríos subterráneos'),
(@Hotel3, 'Playa'), (@Hotel3, 'Piscina'), (@Hotel3, 'Restaurante'), (@Hotel3, 'Gimnasio'),
(@Hotel4, 'Playa privada'), (@Hotel4, 'Spa'), (@Hotel4, 'Restaurantes gourmet'), (@Hotel4, 'Club de playa');

PRINT 'Seed data inserted successfully!';
