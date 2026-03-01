# pedido-backend

API REST de gestión de pedidos — Spring Boot 3.5.0 / Java 21 + PostgreSQL.

## Stack

| Capa | Tecnología |
|---|---|
| Runtime | Java 21 |
| Framework | Spring Boot 3.5.0 |
| Persistencia | Spring Data JPA + PostgreSQL |
| Build | Maven 3.9 |
| Imagen base | `eclipse-temurin:21-jre-alpine` |

## Estructura de paquetes

```
com.pedidos/
├── PedidoBackendApplication.java   ← entry point
├── controller/
│   ├── PedidoController.java       ← CRUD /api/pedidos
│   └── HealthController.java       ← GET /api/health
├── model/
│   └── Pedido.java                 ← entidad JPA
├── repository/
│   └── PedidoRepository.java       ← JpaRepository<Pedido, Long>
└── service/
    └── PedidoService.java          ← lógica de negocio
```

## Modelo de datos — `Pedido`

| Campo | Tipo | Restricción |
|---|---|---|
| `id` | Long | PK, autoincremental |
| `cliente` | String | NOT NULL |
| `descripcion` | String | opcional |
| `cantidad` | Integer | NOT NULL |
| `estado` | String | default `PENDIENTE` |
| `fechaCreacion` | LocalDateTime | seteado en `@PrePersist` |
| `fechaActualizacion` | LocalDateTime | seteado en `@PreUpdate` |

Estados válidos: `PENDIENTE` · `EN_PROCESO` · `COMPLETADO` · `CANCELADO`

## Endpoints

| Método | Ruta | Status | Descripción |
|---|---|---|---|
| GET | `/api/pedidos` | 200 | Listar todos |
| GET | `/api/pedidos/{id}` | 200 / 404 | Obtener por ID |
| POST | `/api/pedidos` | 201 + `Location` | Crear |
| PUT | `/api/pedidos/{id}` | 200 / 404 | Actualizar |
| DELETE | `/api/pedidos/{id}` | 204 / 404 | Eliminar |
| GET | `/api/health` | 200 | `{"status":"UP"}` |

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `DB_HOST` | `localhost` | Host PostgreSQL |
| `DB_PORT` | `5432` | Puerto PostgreSQL |
| `DB_NAME` | `pedidos` | Base de datos |
| `DB_USER` | — | Usuario (requerido) |
| `DB_PASSWORD` | — | Contraseña (requerida) |
| `SERVER_PORT` | `8080` | Puerto del servidor |

## Correr localmente con Maven

Requiere PostgreSQL corriendo en `localhost:5432` con una DB `pedidos`.

```bash
cd backend
export DB_USER=postgres DB_PASSWORD=secret
./mvnw spring-boot:run
# → http://localhost:8080/api/pedidos
```

## Correr con Docker

```bash
# Build
docker build -t pedido-backend:local ./backend

# Run (requiere PostgreSQL accesible desde el contenedor)
docker run -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_USER=postgres \
  -e DB_PASSWORD=secret \
  pedido-backend:local
```

## Tags Docker

| Evento | Tag |
|---|---|
| Push a `main` | `maosuarez/pedido-backend:dev-<sha>` + `dev-latest` |
| Tag `Major.Minor.Fix` | `maosuarez/pedido-backend:Major.Minor.Fix` + `latest` |
