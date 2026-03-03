# pedido-app-src

> Código fuente del sistema de gestión de pedidos — backend Spring Boot + frontend React.
> Este repositorio produce imágenes Docker publicadas en Docker Hub.
> El despliegue en Kubernetes vive en [`pedido-app-infra`](https://github.com/maosuarez/pedido-app-infra).

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
├── backend/                                    ← Spring Boot 3.5.0 / Java 21
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
│   └── Dockerfile
├── frontend/                                   ← React + Vite + TypeScript
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/react.svg
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── components/
│   │   │   ├── PedidoList.tsx
│   │   │   ├── PedidoForm.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── hooks/
│   │   │   ├── useForm.ts
│   │   │   └── usePedidos.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   └── types/
│   │       └── pedido.ts
│   ├── index.html
│   ├── nginx.conf.template
│   ├── package.json
│   ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│   ├── vite.config.ts
│   ├── eslint.config.js
│   └── Dockerfile
└── .github/
    └── workflows/
        ├── ci-backend.yml
        └── ci-frontend.yml
```

---

## Aclaracion importnate porque se pone `nginx.conf` — proxy `/api/` → backend, serve SPA en `/`
Lo mantenemos porque para pruebas en local va a ser mas sencillo usarlo y ver que todo funciona porque:

  - Localmente (docker compose): el nginx proxea al backend directamente
  - En k8s: el Ingress intercepta /api/ antes de que llegue a nginx, así que el proxy_pass nunca se ejecuta — no hace daño

---

## 🐳 Imágenes Docker

| Componente | Imagen en Docker Hub |
|---|---|
| Backend | `maosuarez/pedido-backend` |
| Frontend | `maosuarez/pedido-frontend` |

### Estrategia de tags

| Evento Git | Tag generado |
|---|---|
| Push a `main` | `dev-<git-sha-corto>` + `dev-latest` |
| Tag `Major.Minor.Fix` (ej: `1.0.0`) | `Major.Minor.Fix` + `latest` |

---

## ⚙️ Variables de entorno — Backend

El backend lee toda su configuración de variables de entorno. No hay valores hardcodeados.

| Variable | Descripción | Default |
|---|---|---|
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto | `5432` |
| `DB_NAME` | Nombre de la base de datos | `pedidos` |
| `DB_USER` | Usuario | admin |
| `DB_PASSWORD` | Contraseña | admin1234 |
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
git clone https://github.com/maosuarez/pedido-app-src
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
  -e DB_HOST=localhost -e DB_USER=admin -e DB_PASSWORD=admin1234 \
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
3. Push a Docker Hub con tags `Major.Minor.Fix` y `dev-latest`

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

Al mergear a `main`, el CI construye y publica la nueva imagen. Luego se actualiza el tag en [`pedido-app-infra`](https://github.com/maosuarez/pedido-app-infra) para que ArgoCD despliegue la nueva versión.

---

## 📋 Backlog — Repo src

Leyenda: `⬜ Pendiente` · `🔄 En progreso` · `✅ Completado` · `🔴 Bloqueado`

### 🏗️ Setup

| # | Tarea | Responsable | Estado | Rama |
|---|---|---|---|---|
| 1 | Crear estructura base de carpetas | Persona B | ✅ | `feature/pb-repo-setup` |
| 2 | Agregar `CLAUDE.md` y `README.md` | Persona B | ✅ | `feature/pb-repo-setup` |
| 3 | Configurar secrets en GitHub (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`) | Ambos | ✅ | — |

### 🖥️ Backend

| # | Tarea | Responsable | Estado | Rama |
|---|---|---|---|---|
| 4 | Modelo `Pedido` y configuración Spring Boot + PostgreSQL | Persona B | ✅ | `feature/pb-backend` |
| 5 | CRUD completo de pedidos (`/api/pedidos`) | Persona B | ✅ | `feature/pb-backend` |
| 6 | Endpoint `/api/health` para liveness probe | Persona B | ✅ | `feature/pb-backend` |
| 7 | `application.properties` leyendo todo de variables de entorno | Persona B | ✅ | `feature/pb-backend` |
| 8 | `Dockerfile` multi-stage (Maven build + JRE slim runtime) | Persona B | ✅ | `feature/pb-backend` |
| 9 | Validar imagen backend localmente | Persona B | ✅ | — |

### 🎨 Frontend

| # | Tarea | Responsable | Estado | Rama |
|---|---|---|---|---|
| 10 | Componente `PedidoList` — lista pedidos desde `/api/pedidos` | Persona A | ✅ | `feature/pa-frontend` |
| 11 | Componente `PedidoForm` — crear pedido via POST | Persona A | ✅ | `feature/pa-frontend` |
| 12 | `nginx.conf.template` — proxy `/api/` → backend, serve SPA en `/` | Persona A | ✅ | `feature/pa-frontend` |
| 13 | `Dockerfile` multi-stage (Node build + nginx alpine serve) | Persona A | ✅ | `feature/pa-frontend` |
| 14 | Validar imagen frontend localmente | Persona A | ✅ | — |

### 🔗 Integración local

| # | Tarea | Responsable | Estado | Rama |
|---|---|---|---|---|
| 15 | `docker-compose.yml` con backend + frontend + PostgreSQL | Ambos | ✅ | `feature/pb-backend` |
| 16 | Prueba end-to-end local: crear pedido desde UI, verificar en DB | Ambos | ✅ | — |

### ⚙️ CI

| # | Tarea | Responsable | Estado | Rama |
|---|---|---|---|---|
| 17 | `ci-backend.yml` — build + push a Docker Hub | Persona B | ✅ | `feature/pb-backend` |
| 18 | `ci-frontend.yml` — build + push a Docker Hub | Persona A | ✅ | `feature/pa-ci-frontend` |
| 19 | Validar que las imágenes aparecen en Docker Hub tras el push | Ambos | ✅ | — |

---

## 📊 Progreso — Repo src

```
Setup              [██████████]  3/3
Backend            [██████████]  6/6
Frontend           [██████████]  5/5
Integración local  [██████████]  2/2
CI                 [██████████]  3/3
──────────────────────────────────
Total              [██████████]  19/19
```

> Actualiza el estado: `⬜ → 🔄 → ✅`

---

## 🚢 Publicar una nueva versión a Docker Hub

1. **Desarrollar en una rama y abrir PR**
   ```bash
   git checkout -b feature/mi-cambio
   # ... cambios ...
   git push -u origin feature/mi-cambio
   # Abrir PR → revisar → mergear a main
   ```

2. **Traer main actualizado**
   ```bash
   git checkout main
   git pull
   ```

3. **Crear y pushear el tag de versión**
   ```bash
   git tag 1.1.0
   git push origin 1.1.0
   ```

4. **El CI publica automáticamente en Docker Hub**
   - `maosuarez/pedido-backend:1.1.0`
   - `maosuarez/pedido-backend:latest`

> El tag debe seguir el formato `Major.Minor.Fix` exacto (ej: `1.0.0`, `1.1.0`, `2.0.0`).
> Nunca taggear desde una rama — siempre desde `main` después del merge.
