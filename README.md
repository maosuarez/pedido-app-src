# pedido-app-src

> Código fuente del sistema de gestión de pedidos — backend Spring Boot + frontend React.
> Este repositorio produce imágenes Docker publicadas en Docker Hub.
> El despliegue en Kubernetes vive en [`pedido-app-infra`](https://github.com/<org>/pedido-app-infra).

---

## 📂 Repositorios del proyecto

| Repo | Responsabilidad |
|---|---|
| `pedido-app-src` *(este repo)* | Código fuente + Dockerfiles + CI |
| `pedido-app-infra` | Helm charts + ArgoCD + despliegue en K8s |

---

## 🏗️ Estructura del repositorio

```
pedido-app-src/
├── backend/
│   ├── src/main/java/com/pedidos/
│   │   ├── PedidoApplication.java
│   │   ├── controller/PedidoController.java
│   │   ├── model/Pedido.java
│   │   ├── repository/PedidoRepository.java
│   │   └── service/PedidoService.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── PedidoList.jsx
│   │   │   └── PedidoForm.jsx
│   │   └── services/api.js
│   ├── nginx.conf
│   ├── package.json
│   └── Dockerfile
└── .github/
    └── workflows/
        ├── ci-backend.yml
        └── ci-frontend.yml
```

---

## 🐳 Imágenes Docker

| Componente | Imagen en Docker Hub |
|---|---|
| Backend | `<dockerhub-user>/pedido-backend` |
| Frontend | `<dockerhub-user>/pedido-frontend` |

### Estrategia de tags

| Evento Git | Tag generado |
|---|---|
| Push a `main` | `dev-<git-sha-corto>` + `dev-latest` |
| Tag `v*.*.*` | versión semver + `latest` |

---

## ⚙️ Variables de entorno — Backend

El backend lee toda su configuración de variables de entorno. No hay valores hardcodeados.

| Variable | Descripción | Default |
|---|---|---|
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto | `5432` |
| `DB_NAME` | Nombre de la base de datos | `pedidos` |
| `DB_USER` | Usuario | — |
| `DB_PASSWORD` | Contraseña | — |
| `SERVER_PORT` | Puerto del servidor | `8080` |

---

## 🌐 API REST — Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/pedidos` | Listar todos los pedidos |
| `GET` | `/api/pedidos/{id}` | Obtener un pedido por ID |
| `POST` | `/api/pedidos` | Crear un nuevo pedido |
| `PUT` | `/api/pedidos/{id}` | Actualizar un pedido |
| `DELETE` | `/api/pedidos/{id}` | Eliminar un pedido |
| `GET` | `/api/health` | Health check |

---

## 🚀 Correr localmente con Docker Compose

```bash
# Clonar el repo
git clone https://github.com/<org>/pedido-app-src
cd pedido-app-src

# Levantar todo el stack localmente
docker compose up --build

# Frontend: http://localhost:3000
# Backend:  http://localhost:8080/api/pedidos
```

---

## 🏗️ Build manual de imágenes

```bash
# Backend
docker build -t pedido-backend:local ./backend
docker run -p 8080:8080 \
  -e DB_HOST=localhost -e DB_USER=user -e DB_PASSWORD=pass \
  pedido-backend:local

# Frontend
docker build -t pedido-frontend:local ./frontend
docker run -p 3000:80 pedido-frontend:local
```

---

## ⚙️ GitHub Actions — CI

El CI se dispara automáticamente en cada push a `main`.

### `ci-backend.yml`
1. Checkout del código
2. Build de la imagen Docker (`./backend/Dockerfile`)
3. Push a Docker Hub con tags `dev-<sha>` y `dev-latest`

### `ci-frontend.yml`
1. Checkout del código
2. Build de la imagen Docker (`./frontend/Dockerfile`)
3. Push a Docker Hub con tags `dev-<sha>` y `dev-latest`

### Secrets requeridos en GitHub

| Secret | Descripción |
|---|---|
| `DOCKERHUB_USERNAME` | Usuario de Docker Hub |
| `DOCKERHUB_TOKEN` | Access token de Docker Hub (no la contraseña) |

> Configurar en: **Settings → Secrets and variables → Actions**

---

## 🔀 Flujo de trabajo Git

```
main  (protegido, requiere PR)
 ├── feature/pa-<tarea>   → PR → revisión → merge
 └── feature/pb-<tarea>   → PR → revisión → merge
```

Al mergear a `main`, el CI construye y publica la nueva imagen. Luego se actualiza el tag en [`pedido-app-infra`](https://github.com/<org>/pedido-app-infra) para que ArgoCD despliegue la nueva versión.

---

## 📋 Backlog — Repo src

Leyenda: `⬜ Pendiente` · `🔄 En progreso` · `✅ Completado` · `🔴 Bloqueado`

### 🏗️ Setup

| # | Tarea | Responsable | Estado | Rama |
|---|---|---|---|---|
| 1 | Crear estructura base de carpetas | Persona B | ⬜ | `feature/pb-repo-setup` |
| 2 | Agregar `CLAUDE.md` y `README.md` | Persona B | ⬜ | `feature/pb-repo-setup` |
| 3 | Configurar secrets en GitHub (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`) | Ambos | ⬜ | — |

### 🖥️ Backend

| # | Tarea | Responsable | Estado | Rama |
|---|---|---|---|---|
| 4 | Modelo `Pedido` y configuración Spring Boot + PostgreSQL | Persona B | ⬜ | `feature/pb-backend` |
| 5 | CRUD completo de pedidos (`/api/pedidos`) | Persona B | ⬜ | `feature/pb-backend` |
| 6 | Endpoint `/api/health` para liveness probe | Persona B | ⬜ | `feature/pb-backend` |
| 7 | `application.properties` leyendo todo de variables de entorno | Persona B | ⬜ | `feature/pb-backend` |
| 8 | `Dockerfile` multi-stage (Maven build + JRE slim runtime) | Persona B | ⬜ | `feature/pb-backend` |
| 9 | Validar imagen backend localmente | Persona B | ⬜ | — |

### 🎨 Frontend

| # | Tarea | Responsable | Estado | Rama |
|---|---|---|---|---|
| 10 | Componente `PedidoList` — lista pedidos desde `/api/pedidos` | Persona A | ⬜ | `feature/pa-frontend` |
| 11 | Componente `PedidoForm` — crear pedido via POST | Persona A | ⬜ | `feature/pa-frontend` |
| 12 | `nginx.conf` — proxy `/api/` → backend, serve SPA en `/` | Persona A | ⬜ | `feature/pa-frontend` |
| 13 | `Dockerfile` multi-stage (Node build + nginx alpine serve) | Persona A | ⬜ | `feature/pa-frontend` |
| 14 | Validar imagen frontend localmente | Persona A | ⬜ | — |

### 🔗 Integración local

| # | Tarea | Responsable | Estado | Rama |
|---|---|---|---|---|
| 15 | `docker-compose.yml` con backend + frontend + PostgreSQL | Ambos | ⬜ | `feature/pa-docker-compose` |
| 16 | Prueba end-to-end local: crear pedido desde UI, verificar en DB | Ambos | ⬜ | — |

### ⚙️ CI

| # | Tarea | Responsable | Estado | Rama |
|---|---|---|---|---|
| 17 | `ci-backend.yml` — build + push a Docker Hub | Persona B | ⬜ | `feature/pb-ci-backend` |
| 18 | `ci-frontend.yml` — build + push a Docker Hub | Persona A | ⬜ | `feature/pa-ci-frontend` |
| 19 | Validar que las imágenes aparecen en Docker Hub tras el push | Ambos | ⬜ | — |

---

## 📊 Progreso — Repo src

```
Setup              [░░░░░░░░░░]  0/3
Backend            [░░░░░░░░░░]  0/6
Frontend           [░░░░░░░░░░]  0/5
Integración local  [░░░░░░░░░░]  0/2
CI                 [░░░░░░░░░░]  0/3
──────────────────────────────────
Total              [░░░░░░░░░░]  0/19
```

> Actualiza el estado: `⬜ → 🔄 → ✅`
