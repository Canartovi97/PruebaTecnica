# Buenas Prácticas de Liderazgo Técnico

Contexto asumido: equipo pequeño de 2–3 desarrolladores construyendo este
sistema desde cero.

## ¿Cómo organizaría los sprints y la asignación de tareas?

Sprints cortos (1 semana) para un equipo de este tamaño; un sprint de 2
semanas diluye demasiado la retroalimentación cuando solo hay 2-3 personas
tocando el mismo código. Antes del primer sprint, una sesión de kickoff
donde se deja explícito el alcance, no solo el ticket — en línea con algo
que aplico siempre en mis proyectos: **las expectativas del proyecto se
fijan al inicio, un tablero de tickets por sí solo no es gestión de
proyecto.**

Asignación de tareas, por los límites naturales del dominio, no por
capa técnica: una persona puede quedarse con el módulo de Solicitudes,
otra con Ofertas, la tercera (o yo, liderando) con la base compartida
(modelo de datos, middlewares, CI/CD) y con integrarlas. Esto evita el
cuello de botella clásico de "todos esperando el commit de backend" y deja
clara la responsabilidad: cada quien es dueño de su módulo de punta a
punta (rutas, servicio, repositorio y tests).

Priorización dentro del sprint: **crítico → alto → medio → bajo**, y
ningún ticket debería pasar más de un par de horas sin una actualización
visible en el tablero — no porque haya que resolverlo en ese tiempo, sino
porque el equipo necesita saber si alguien está bloqueado antes de que se
vuelva un problema del sprint completo. Un stand-up corto diario (15 min)
es suficiente para eso en un equipo de este tamaño; no organizaría
ceremonias más pesadas.

## ¿Qué metodologías y herramientas de revisión de código recomendaría?

Trunk-based con ramas de vida corta por ticket (`feature/NEX-123-...`),
no Git Flow completo — con 2-3 personas, mantener ramas `develop`/`release`
paralelas es más costo de coordinación que beneficio. Cada Pull Request:

- Referencia el ticket en el formato del issue tracker (`NEX-123`), tanto en
  el nombre de la rama como en el commit, para trazabilidad total.
- Pasa CI (build + lint + tests) antes de poder revisarse.
- Requiere al menos una aprobación de otro desarrollador del equipo,
  nunca auto-merge, incluso siendo el lead.
- Se revisa con un checklist simple: ¿la lógica de negocio vive en el
  service y no en el controller? ¿hay un test para el caso feliz y para
  al menos un caso de error? ¿el PR hace una sola cosa?

Como lead, mi rol en code review no es solo aprobar o rechazar: dejar
comentarios que enseñan el porqué de una sugerencia, no solo el qué,
para que el equipo internalice el criterio y no dependa de mí para cada
decisión de diseño.

## ¿Qué procesos de CI/CD implementaría para garantizar la calidad y el despliegue continuo?

Pipeline en GitHub Actions con estas etapas, en este orden, fallando rápido:

1. **Lint + type-check** (`tsc --noEmit`) — el más barato, corre primero.
2. **Tests unitarios** de la capa de `service` (la que no depende de
   Express ni de una base de datos real, así que corren rápido y sin
   infraestructura).
3. **Build** (`tsc -p tsconfig.json`) para confirmar que lo que se va a
   desplegar realmente compila.
4. **Tests de integración** contra una base de datos efímera (SQLite en
   CI, o un contenedor Postgres si ya se migró) cubriendo los endpoints
   principales.
5. **Despliegue** automático a un ambiente de staging en cada merge a
   `main`; a producción con aprobación manual (un solo click), siguiendo
   el mismo patrón de Cloud Run + Artifact Registry que uso hoy en mis
   proyectos.

Complementaría esto con lo que aplico en la práctica diaria: **ninguna
migración destructiva (UPDATE/DELETE) corre en producción sin permiso
explícito**, ni siquiera desde el pipeline — las migraciones de Prisma en
producción se revisan igual que un PR de código.

## Otros temas adicionales que considere relevantes

- **Documentación viva, no al final**: el README y el `Arquitectura/`
  de este mismo repositorio se escriben junto con el código, no después.
  Un README desactualizado es peor que no tener README.
- **Definición de "hecho" explícita** para el equipo: un ticket no está
  terminado en "funciona en mi máquina" — necesita tests, PR aprobado,
  y una prueba (screenshot o video corto) del flujo funcionando, igual
  que exijo en mis propios entregables.
- **Feedback continuo, no solo en retro**: con un equipo de 2-3 personas,
  una retro cada dos semanas es demasiado espaciada para corregir el rumbo;
  prefiero ajustar en el momento, en el stand-up o en el propio PR.
