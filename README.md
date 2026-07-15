# Sistema de Solicitudes de Producto y Ofertas de Proveedores

Prueba técnica — Líder de Desarrollo, IKBO.
Componente implementado: **Gestión de solicitudes de productos y ofertas**
(clientes crean solicitudes, proveedores responden con ofertas de precio).

Diseño de arquitectura completo (los 3 módulos) y justificación de
decisiones en [`Arquitectura/`](./Arquitectura).

## Stack

Node.js 20+, TypeScript, Express, Prisma ORM, SQLite (dev), Zod.

## Requisitos previos

- Node.js 20 o superior
- npm

## Instalación y ejecución local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Generar el cliente de Prisma y crear la base de datos SQLite local
npx prisma generate
npx prisma migrate dev --name init

# 4. (Opcional) Crear un cliente y un proveedor de prueba
npm run seed

# 5. Levantar el servidor en modo desarrollo
npm run dev
```

El servidor queda disponible en `http://localhost:3000`. Verificación
rápida: `GET http://localhost:3000/health`.

> **Nota**: SQLite no soporta el tipo `enum` nativo de Prisma. Por eso
> `role` (en `User`) y `status` (en `ProductRequest` y `Offer`) son
> columnas `String` en `prisma/schema.prisma`, y sus valores válidos están
> tipados en TypeScript en [`src/common/enums.ts`](./src/common/enums.ts)
> en vez de en un `enum` de Prisma. Si migras a PostgreSQL, esos mismos
> campos se pueden convertir a `enum` real sin tocar el código de
> aplicación.

### Build de producción

```bash
npm run build
npm start
```

## Modelo de datos

Ver diagrama entidad-relación en
[`Arquitectura/arquitectura.md`](./Arquitectura/arquitectura.md#3-modelo-de-datos-er).

Resumen: `User` (rol `CLIENT` o `PROVIDER`) → crea `ProductRequest` →
recibe múltiples `Offer` de distintos `User` con rol `PROVIDER`.

## Endpoints

No hay autenticación en este alcance (ver `Justificación.md`); los
endpoints de usuarios son un helper para poder probar el flujo completo.

### Usuarios (helper de prueba)

```bash
# Crear un cliente
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Ana Cliente", "email": "ana@demo.com", "role": "CLIENT"}'

# Crear un proveedor
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Proveedor SAS", "email": "proveedor@demo.com", "role": "PROVIDER"}'

# Listar usuarios
curl http://localhost:3000/api/users
```

### Solicitudes de productos

```bash
# Crear una solicitud (clientId de un usuario con rol CLIENT)
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "<uuid-del-cliente>",
    "productName": "Laptops Dell Latitude",
    "description": "Para renovación de equipos del área comercial",
    "quantity": 15
  }'

# Listar solicitudes (filtros opcionales)
curl "http://localhost:3000/api/requests?status=OPEN"

# Ver el detalle de una solicitud (incluye sus ofertas)
curl http://localhost:3000/api/requests/<id-de-la-solicitud>
```

### Ofertas de proveedores

```bash
# Un proveedor responde con una oferta (providerId de un usuario con rol PROVIDER)
curl -X POST http://localhost:3000/api/requests/<id-de-la-solicitud>/offers \
  -H "Content-Type: application/json" \
  -d '{
    "providerId": "<uuid-del-proveedor>",
    "price": 45000000,
    "message": "Incluye garantía extendida de 3 años"
  }'

# Listar las ofertas de una solicitud
curl http://localhost:3000/api/requests/<id-de-la-solicitud>/offers
```

## Estructura del repositorio

```
src/
  modules/
    users/       # helper de clientes/proveedores (sin auth en este alcance)
    requests/     # Módulo de Solicitudes de Productos
    offers/        # Módulo de Ofertas de Proveedores
  middlewares/    # validate (Zod) y manejo centralizado de errores
  utils/           # ApiError, catchAsync
  config/           # cliente Prisma (singleton)
prisma/
  schema.prisma   # modelo de datos completo (User, ProductRequest, Offer)
  seed.ts          # datos de prueba
Arquitectura/
  arquitectura.md       # diseño de los 3 módulos + diagramas
  Justificación.md       # respuestas al punto 3 de la prueba
  gestión de equipo.md    # respuestas al punto 4 de la prueba
```

## Decisiones clave (resumen)

Detalle completo en [`Arquitectura/Justificación.md`](./Arquitectura/Justificación.md).

- Arquitectura modular por dominio, 4 capas por módulo (`routes → controller
  → service → repository`), para aislar reglas de negocio de HTTP y de la
  base de datos.
- Autorización por rol a nivel de servicio (`CLIENT` solicita, `PROVIDER`
  oferta); autenticación (JWT) queda fuera de este alcance por diseño —
  era una opción distinta del punto 2.
- Prisma + SQLite en desarrollo por cero fricción al clonar y correr;
  el mismo esquema migra a PostgreSQL cambiando una línea.
