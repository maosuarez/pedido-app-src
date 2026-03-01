# CLAUDE.md — pedido-app-src

## Contexto del repositorio

Este repo contiene el **código fuente** de la aplicación de gestión de pedidos.
Su única responsabilidad es producir imágenes Docker publicadas en Docker Hub.
No contiene nada de Kubernetes, Helm ni ArgoCD — eso vive en `pedido-app-infra`.

**Stack:**
- Backend: Java 21 + Spring Boot 3.5.0 (CRUD de pedidos, conexión PostgreSQL via JDBC)
- Frontend: React + Vite + TypeScript (SPA que consume `/api/` del backend)
- CI: GitHub Actions (build + push a Docker Hub en cada push a `main`)
- Registry: Docker Hub (`maosuarez/pedido-backend`, `maosuarez/pedido-frontend`)

---

## Reglas de trabajo

1. **Cada componente es independiente.** Backend y frontend tienen su propio `Dockerfile` y su propio workflow de CI. No los mezcles.

2. **Los Dockerfiles deben ser multi-stage.** Backend: etapa build (Maven) + etapa runtime (JRE slim). Frontend: etapa build (Node) + etapa serve (nginx alpine).

3. **Las imágenes deben ser lo más pequeñas posible.** Usa imágenes base slim/alpine. No copies archivos innecesarios.

4. **El tag de la imagen debe estar en formato Major.Minor.Fix.** Nunca uses `latest` como único tag en CI. Formato: `maosuarez/pedido-backend:Major.Minor.Fix`.

5. **El backend no hardcodea configuración.** Toda conexión a DB y configuración sensible se lee de variables de entorno. El `application.properties` usa `${ENV_VAR:default}`.

6. **El frontend no hardcodea la URL del backend.** La URL base de la API se configura via variable de entorno en build time (`REACT_APP_API_URL`) o via nginx proxy pass.

7. **Explica antes de implementar.** Si hay decisiones de diseño (estructura de endpoints, modelo de datos, estrategia de proxy nginx), descríbelas y espera confirmación.

8. **No generes código si no se pidió explícitamente.** Diseño y código son pasos separados.

---

## Estructura objetivo

```
pedido-app-src/
├── backend/                            # Spring Boot 3.5.0 / Java 21
│   ├── .mvn/wrapper/
│   │   └── maven-wrapper.properties
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/pedidos/
│   │   │   │   ├── PedidoBackendApplication.java
│   │   │   │   ├── controller/PedidoController.java
│   │   │   │   ├── model/Pedido.java
│   │   │   │   ├── repository/PedidoRepository.java
│   │   │   │   └── service/PedidoService.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/java/com/pedidos/
│   │       └── PedidoBackendApplicationTests.java
│   ├── mvnw / mvnw.cmd
│   ├── pom.xml
│   └── Dockerfile                      # Multi-stage: Maven build + JRE runtime
├── frontend/                           # React + Vite + TypeScript
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── PedidoList.tsx
│   │   │   └── PedidoForm.tsx
│   │   └── services/
│   │       └── api.ts                  # fetch wrapper apuntando a /api/
│   ├── index.html
│   ├── nginx.conf                      # Proxy /api/ → backend, serve SPA
│   ├── package.json
│   ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│   ├── vite.config.ts
│   └── Dockerfile                      # Multi-stage: Node build + nginx serve
└── .github/
    └── workflows/
        ├── ci-backend.yml              # Build + push pedido-backend
        └── ci-frontend.yml            # Build + push pedido-frontend
```

---

## Endpoints del backend

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/pedidos` | Listar todos los pedidos |
| GET | `/api/pedidos/{id}` | Obtener un pedido |
| POST | `/api/pedidos` | Crear un pedido |
| PUT | `/api/pedidos/{id}` | Actualizar un pedido |
| DELETE | `/api/pedidos/{id}` | Eliminar un pedido |
| GET | `/api/health` | Health check (para liveness probe) |

---

## Variables de entorno del backend

| Variable | Descripción | Default |
|---|---|---|
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base de datos | `pedidos` |
| `DB_USER` | Usuario de PostgreSQL | — |
| `DB_PASSWORD` | Contraseña de PostgreSQL | — |
| `SERVER_PORT` | Puerto del servidor | `8080` |

---

## Estrategia de tags Docker

| Evento | Tag generado |
|---|---|
| Push a `main` | `dev-<git-sha-corto>` + `dev-latest` |
| Tag `Major.Minor.Fix` (ej: `1.0.0`) | `Major.Minor.Fix` + `latest` |

---

## Flujo de trabajo con Claude Code

```
1. Definir modelo de datos Pedido (campos, tipos)
2. Implementar backend Spring Boot
3. Dockerfile backend (multi-stage)
4. Validar imagen backend localmente
5. Implementar frontend React
6. nginx.conf con proxy hacia backend
7. Dockerfile frontend (multi-stage)
8. Validar con docker compose ambos servicios
9. ci-backend.yml (GitHub Actions)
10. ci-frontend.yml (GitHub Actions)
11. Validar que el CI publica las imágenes en Docker Hub
```

Nunca saltes pasos. Si el usuario pide avanzar más rápido, confirma que entiende lo que se está generando.