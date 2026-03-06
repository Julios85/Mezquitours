# Database - Wedding Planner

Esta carpeta contiene los scripts y modelos para la base de datos del sistema Wedding Planner.

## Estructura

```
database/
├── models/
│   └── schema.sql       # Esquema completo de la base de datos
├── scripts/
│   └── seed-data.sql    # Datos de ejemplo para desarrollo
└── README.md
```

## Requisitos

- SQL Server 2019+ o Azure SQL Database
- Para desarrollo local: SQL Server Express o Docker

## Configuración Local con Docker

```bash
# Iniciar SQL Server en Docker
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name wedding-planner-db \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

## Ejecutar Scripts

1. **Crear el esquema:**
```bash
sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -i models/schema.sql
```

2. **Insertar datos de ejemplo:**
```bash
sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -i scripts/seed-data.sql
```

## Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `Clientes` | Información de clientes |
| `Citas` | Citas programadas |
| `Proveedores` | Directorio de proveedores |
| `Eventos` | Eventos en planificación |
| `Hoteles` | Catálogo de hoteles |
| `ReservasHotel` | Reservaciones de hotel |

## Conexión desde Azure Functions

Configurar en `local.settings.json`:

```json
{
  "Values": {
    "DATABASE_CONNECTION_STRING": "Server=localhost;Database=WeddingPlanner;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True"
  }
}
```

## Azure SQL Database

Para producción, crear una instancia de Azure SQL Database y actualizar la cadena de conexión.
