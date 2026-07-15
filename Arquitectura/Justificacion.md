# Justificación de Decisiones Técnicas

## ¿Por qué elegí la estructura arquitectónica propuesta?

Elegí un monolito modular por dominio con
cuatro capas internas por módulo: `routes → controller → service →
repository`. Para el alcance de esta prueba (1–2 horas, un componente
concreto) un microservicio por módulo habría sido demasiado:
añade orquestación, red y despliegue sin aportar valor al problema que
se está resolviendo. 

- Los tests unitarios del `service` no necesiten levantar Express.
- Cambiar de Prisma a otro ORM, o de SQLite a PostgreSQL, no toque una sola
  línea de lógica de negocio (de hecho, el cambio a PostgreSQL es una
  línea en `schema.prisma`).
- Cada módulo pueda extraerse a un servicio independiente el día que el
  dominio lo justifique, sin reescribir reglas de negocio.

Esta decisión también condicionó el punto 2: como los servicios están
desacoplados de Express, `offerService.createOffer()` puede orquestar al
`requestService` y al `userService` directamente (aplicar reglas cruzadas
entre módulos) sin que esa lógica termine filtrada en un controller.

## ¿Cómo maneja el sistema la seguridad de las transacciones (autenticación, roles de usuario)?

En esta entrega **no implementé autenticación** porque era una de las tres
opciones del punto 2 y elegí "Gestión de solicitudes y ofertas" en su
lugar; no tendría sentido construir JWT a medias solo para decorar el
componente elegido. Lo que sí implementé, porque es responsabilidad del
componente elegido, es autorización por rol a nivel de servicio:
`userService.assertRole()` verifica que quien crea una `ProductRequest`
tenga rol `CLIENT` y que quien crea una `Offer` tenga rol `PROVIDER`,
antes de tocar la base de datos. Esa validación vive en la capa de
servicio, no en el controller ni en middleware, a propósito: es una regla
de negocio ("solo un cliente puede solicitar, solo un proveedor puede
ofertar"), no una regla de transporte HTTP.

Si tuviera que añadir autenticación real, el punto de extensión ya está
pensado: agregaría un middleware `authenticate` que decodifica el JWT y
adjunta `req.user`, y `assertRole` dejaría de recibir un `userId` por
`body`/`params` para leerlo de `req.user.id` — el resto del `service` no
cambia. Para las transacciones sensibles del dominio (aceptar una oferta,
mover dinero en un caso como Sclub) usaría además transacciones de base de
datos (`prisma.$transaction`) para que el cambio de estado de la oferta y
el cierre de la solicitud sean atómicos, y agregaría rate limiting y
`helmet` (ya incluido) para las cabeceras de seguridad básicas.

## ¿Cómo manejaría el crecimiento del sistema si tuviera que escalar?

En capas, de menor a mayor esfuerzo, en el orden en que realmente las
aplicaría:

1. **Base de datos**: migrar de SQLite a PostgreSQL gestionado (Neon o
   Cloud SQL) es un cambio de una línea gracias al ORM; añadir índices
   compuestos sobre `(status, createdAt)` para los listados filtrados, que
   ya están cubiertos parcialmente (`@@index([status])`).
2. **Aplicación**: el servidor Express es *stateless* (no guarda sesión en
   memoria), así que escala horizontalmente detrás de un load balancer sin
   cambios — es el mismo patrón que uso hoy con Cloud Run para los
   servicios de Keep Calm y para el backend de Sclub.
3. **Contención por dominio**: si el módulo de Ofertas empieza a recibir
   mucho más tráfico que Solicitudes (por ejemplo, muchos proveedores
   compitiendo por pocas solicitudes), la separación por módulo permite
   extraerlo a su propio servicio y su propia base de datos sin tocar el
   resto, precisamente porque `offer.repository.ts` es el único lugar
   acoplado a la infraestructura de datos.
4. **Asincronía**: la creación de una oferta hoy es síncrona
   (request → respuesta). Si el volumen crece, movería notificaciones al
   cliente (por ejemplo, "tienes una nueva oferta") a una cola
   (Pub/Sub o similar) en vez de acoplarlas al flujo de escritura.
5. **Caché de lectura**: los listados de solicitudes abiertas son de
   lectura intensiva y de baja volatilidad relativa; son candidatos claros
   para caché (Redis) antes de tocar la base de datos.

La razón para no aplicar nada de esto desde el día uno es la misma que
guía toda la prueba: diseñar pensando en escalar, pero **implementar solo
lo que el problema actual necesita**. Construir para una escala que no
existe todavía es tan costoso como no diseñar para ninguna escala.
