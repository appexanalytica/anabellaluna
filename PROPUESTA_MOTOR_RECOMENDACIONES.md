# PROPUESTA — MOTOR DE RECOMENDACIONES POR MATCHING SEMÁNTICO

**Producto:** matching inteligente entre la cartera de propiedades y los requerimientos de los clientes, con explicaciones en lenguaje natural para agentes y admin.
**Fecha:** 2026-08-15
**Documentos relacionados:** `ARQUITECTURA_PLATAFORMA_COGNITIVA.md`, `PLAN_EJECUCION_PLATAFORMA_COGNITIVA.md`

---

## 1. EL PROBLEMA DE NEGOCIO

Hoy el cruce entre lo que el cliente pide y lo que hay en cartera lo hace el agente **de memoria**. Eso significa:

- **Se pierden operaciones por olvido.** Entra una captación nueva y nadie recuerda que hace tres semanas un cliente pidió exactamente eso. La propiedad se publica, y el cliente que ya estaba en el CRM se entera por el portal (o no se entera).
- **El conocimiento no se comparte.** Un agente conoce su cartera de clientes; no conoce la de sus compañeros. Una propiedad de Juan puede ser la casa ideal de un cliente de María, y nadie los cruza.
- **La demanda no informa la captación.** La inmobiliaria no sabe qué le están pidiendo y no tiene. Se capta lo que aparece, no lo que se vende.
- **Los datos ricos están muertos.** Las notas del agente, las interacciones (`ClientInteraction`), las consultas del sitio y las conversaciones de WhatsApp contienen el 70% de lo que realmente quiere el cliente — "quiere planta baja porque la madre está en silla de ruedas", "descartó la de Alberdi por la autopista" — y ningún filtro SQL puede usarlo.

El motor resuelve las cuatro. No reemplaza al agente: le pone adelante la lista corta que él habría armado si tuviera memoria perfecta de toda la cartera y de todo lo que se habló con cada cliente.

---

## 2. QUÉ SE CONSTRUYE — VISIÓN EN UNA PANTALLA

```
   FICHA DEL CLIENTE                        FICHA DE LA PROPIEDAD
   ┌────────────────────────┐               ┌────────────────────────┐
   │ Propiedades sugeridas  │               │ Clientes para esta     │
   │                        │               │ propiedad              │
   │ 92  Casa en Villa Ana  │               │ 88  Familia Gómez      │
   │     "Cumple los 3      │               │     "Pidieron esto     │
   │      dormitorios y el  │               │      hace 12 días"     │
   │      patio que pidió"  │               │                        │
   │     [WhatsApp][Visita] │               │ 74  Ana Ruiz           │
   └────────────────────────┘               └────────────────────────┘

   PANEL DEL ADMIN — RADAR DE OPORTUNIDADES
   ┌──────────────────────────────────────────────────────────────────┐
   │ 7 matches fuertes sin contactar hace +48h                        │
   │ Cobertura de cartera: 61% de los clientes tiene al menos 1 match │
   │ Demanda insatisfecha: 9 clientes buscan 2 amb. en Centro < USD 70k│
   │ 4 propiedades sin ningún match — revisar precio o datos          │
   └──────────────────────────────────────────────────────────────────┘
```

**Bidireccional**, y las dos direcciones se disparan solas:

| Evento | Qué hace el motor | Quién lo recibe |
|---|---|---|
| Se carga/publica una propiedad | La cruza contra **todos** los clientes activos | El agente de cada cliente que matchea |
| Cambia el precio de una propiedad | Recalcula: puede entrar en el presupuesto de clientes que antes quedaban afuera | Agente del cliente |
| Se crea o edita un cliente | La cruza contra toda la cartera | El agente del cliente |
| Se registra una interacción o visita | Ajusta el perfil y re-ranquea | El agente del cliente |
| Nada, cron diario | Detecta matches fuertes sin acción, propiedades huérfanas, demanda sin cubrir | Admin |

---

## 3. DECISIÓN DE ARQUITECTURA: SE CONSTRUYE EN EL BACKEND NODE

**Recomendación: `backend/services/matching/`, no en el AI Gateway Python.**

| Criterio | Node (backend actual) | AI Gateway Python |
|---|---|---|
| Estado en producción | Vivo, desplegado por `deploy.sh`, 4 procesos PM2 sanos | Código completo pero **nunca activado** — pgvector/Langfuse en Docker siguen sin levantarse (ver `PLAN_EJECUCION_*.md`, Fase 3.1) |
| Acceso a los datos | MongoDB es la fuente de verdad, acceso directo | Tiene que pedir todo por HTTP al backend |
| Proveedor LLM | `providerAbstraction.js` ya apunta a OpenAI, con log de tokens/costo y health del proveedor | Sin API key configurada |
| Riesgo de entrega | Bajo | Alto: hay que levantar Postgres+pgvector, Redis AI y Langfuse antes de escribir una línea del motor |

El motor queda desacoplado detrás de una interfaz de servicio, así que si más adelante se activa el gateway, se migra o se espeja sin tocar la UI ni los endpoints.

**Vector store: MongoDB, sin base vectorial.** Con una cartera del orden de cientos a pocos miles de propiedades, la similitud coseno por fuerza bruta sobre una matriz en memoria (`Float32Array`) resuelve en pocos milisegundos. Una base vectorial para este volumen es infraestructura que hay que operar sin ganancia medible. Los embeddings se guardan en Mongo y se cachean en memoria del proceso, invalidados por `contentHash`.

**✅ Resuelto — OpenRouter descartado, todo va directo a la API de OpenAI.** El intermediario quedaba corto: no expone `/v1/embeddings`, que es justo lo que el motor necesita. El sistema entero (chat, tools, sugerencias, perfiles semánticos y embeddings) usa ahora una sola `OPENAI_API_KEY` contra `api.openai.com`. Un solo proveedor, una sola key, un solo lugar donde mirar el costo.

---

## 4. LA CAPA SEMÁNTICA — EL CORAZÓN DE LA PROPUESTA

Este es el punto que pediste: **describir semánticamente todos los campos de clientes y propiedades**.

Hoy `Propiedad.metadata` y `Cliente.metadata` son objetos libres. Un dato puede estar en `metadata.barrio`, dentro de `description`, o solo en una nota del agente. Migrar el esquema sería un proyecto de meses y rompería formularios. **La solución es no migrar nada: generar una capa de perfil canónico por encima.**

Por cada propiedad y cada cliente, GPT genera y se persiste un `EntityProfile`:

### Perfil de propiedad

| Campo | Contenido | Para qué sirve |
|---|---|---|
| `narrativa` | 150-250 palabras en español natural que integran **todos** los campos disponibles + la descripción + las notas internas | Es el texto que se embebe. Captura lo que ningún filtro captura. |
| `facts` | JSON normalizado: `tipo`, `operacion`, `precioUSD` (convertido), `m2Cubierta`, `m2Total`, `dormitorios`, `baños`, `cocheras`, `expensasUSD`, `antigüedad`, `estado`, `amenities[]`, `barrio`, `lat/lng` | Es lo que consume el scoring determinista. Resuelve claves inconsistentes sin migrar. |
| `tags` | `["familiar", "a estrenar", "apto crédito", "renta asegurada", "para refaccionar", "apto profesional"]` | Matching por concepto, no por campo |
| `publicoIdeal` | `["familia con hijos en edad escolar", "inversor de renta"]` | Alimenta la dirección propiedad → clientes |
| `faltantes` | Campos críticos ausentes: `["sin m²", "sin barrio", "sin fotos"]` | **Sugerencia gratis al agente:** "esta propiedad es invisible para el motor" |

### Perfil de cliente

| Campo | Contenido | Para qué sirve |
|---|---|---|
| `narrativa` | El requerimiento contado como se lo contaría a un colega, integrando ficha + notas + `ClientInteraction` + consultas del sitio + resumen de WhatsApp | Se embebe. Acá vive el "quiere planta baja por la madre". |
| `requisitos.must` / `requisitos.nice` | **Clasificación excluyente vs. deseable** — la distinción que hace útil a un motor inmobiliario. El presupuesto es `must`; la cochera casi siempre es `nice`. | Los `must` se vuelven filtros duros; los `nice` suman puntos |
| `presupuestoRango` | `{ min, max, origen: 'derivado' \| 'declarado' }` — derivado del número de la ficha, o extraído textualmente si el cliente dijo un rango en una nota o en WhatsApp | Evita agregar campos al formulario y aun así trabaja con rangos reales |
| `zonasInteres` | Array de zonas, la primera es la principal | El cliente que mira Centro, Sur y Villa Ana deja de ser un cliente de una sola zona |
| `señales` | `urgencia`, `capacidadDePago`, `formaDePago` (contado/crédito/permuta), `motivación`, `flexibilidadZona` | Prioriza a quién atender primero |
| `descartes` | Qué ya rechazó y por qué (de las interacciones) | **No volver a sugerir lo mismo** — el error que más credibilidad quema |

**Regeneración:** solo cuando cambia el `contentHash` de los campos fuente. Una propiedad que no se toca no se re-procesa nunca. El costo real es el del alta, no el del catálogo.

---

## 5. EL ALGORITMO DE MATCHING — 3 ETAPAS

> **Principio rector: la IA no calcula el score, lo explica.**
> El puntaje sale de reglas deterministas, auditables y testeables. El LLM solo redacta sobre hechos que ya se le entregan calculados. Un modelo que "estima" si un precio entra en el presupuesto es un modelo que va a equivocarse delante de un cliente, y ahí se pierde la confianza del agente para siempre.

### Etapa 1 — Filtros duros (generación de candidatos)

Query Mongo barata que descarta lo imposible:

- Operación distinta (venta ≠ alquiler)
- Estado ≠ `Disponible`
- Precio fuera del rango derivado, con corte duro en presupuesto × 1.20 — el que busca hasta USD 100k mira una de 110k, no una de 200k. Comparación siempre en la misma moneda, usando la cotización que cargó el admin
- Vetos de contexto: no acepta mascotas y el cliente tiene; expensas > máximo declarado × 1.1; `disponibleDesde` posterior a la mudanza + 30 días
- Scope de permisos: **toda la cartera de propiedades** (visibilidad cruzada), pero solo **los clientes propios** del agente. El admin ve todo

### Etapa 2 — Score híbrido 0-100 (ranking determinista)

**Los pesos cambian según el tipo de cliente** — esto es lo que hace al motor *inmobiliario* y no genérico:

| Dimensión | Comprador | Inversor | Inquilino | Cómo se calcula |
|---|---|---|---|---|
| Precio vs. presupuesto | 25 | 20 | 20 | Penalización asimétrica: pasarse duele más que quedar por debajo |
| Ubicación | 20 | 20 | 25 | **La mejor de las zonas de interés** (no el promedio) + distancia geo con decaimiento — ya hay `lat`/`lng`. Plus si es la zona principal |
| Tipología (amb./dorm./baños) | 15 | 10 | 15 | Tolerancia ±1, penalizada |
| Superficie | 10 | 10 | 5 | m² cubiertos y totales vs. lo pedido |
| **Similitud semántica** | **20** | **20** | **20** | Coseno entre el embedding del perfil del cliente y el de la propiedad |
| Señales de comportamiento | 10 | 10 | 5 | Propiedades vistas (`PropertyView`), `propiedad_interes`, visitas realizadas, parecido con lo que ya le gustó |
| Rentabilidad / estado | — | 10 | — | Precio por m² vs. zona, estado de conservación |
| Costo total (expensas) | — | — | 10 | Alquiler + expensas contra el tope real |

Bandas de resultado: **≥80 match fuerte** (contactar hoy) · **65-79 buena opción** · **50-64 alternativa** · **<50 no se muestra**. Mostrar de más entrena al agente a ignorar el panel.

### Etapa 3 — Explicación en lenguaje natural (solo el top 5)

GPT recibe el brief del cliente, el brief de la propiedad y **el desglose del score ya calculado**, y devuelve JSON validado:

```json
{
  "titulo": "La casa de Villa Ana cumple lo que la familia Gómez viene pidiendo",
  "porQue": [
    "Tres dormitorios en planta baja, que era la condición excluyente por la madre de Laura",
    "USD 92.000: entra en el presupuesto de 95.000 con margen para la escritura",
    "A ocho cuadras del colegio al que van los chicos, la zona que pidieron"
  ],
  "objeciones": [
    "No tiene cochera y ellos la mencionaron como deseable",
    "La cocina está para refaccionar — conviene anticiparlo antes de la visita"
  ],
  "accionSugerida": "Ofrecer visita para el sábado a la mañana",
  "mensajeWhatsapp": "Hola Laura, apareció una casa en Villa Ana que..."
}
```

**Las objeciones son obligatorias.** Un motor que solo dice cosas lindas es un folleto; uno que dice "no tiene cochera, anticipalo" es un colega. Eso es lo que hace que el agente lo use la segunda semana.

**Anti-alucinación:** el prompt recibe los `facts` en JSON, tiene instrucción explícita de no afirmar nada fuera de esos hechos, y todo número que aparezca en el texto se valida contra los `facts` antes de persistir. Si no valida, se cae al texto plantilla del desglose de score.

---

## 6. EL MISMO MOTOR, OTRAS SUGERENCIAS

Una vez que existen los perfiles semánticos + embeddings + scoring + capa de redacción, cada uno de estos es entre medio día y dos días de trabajo, no un proyecto nuevo:

### Para el agente

| Sugerencia | Cómo sale del motor |
|---|---|
| **"Tu propiedad no aparece en ninguna búsqueda"** | `faltantes` del perfil: sin m², sin barrio, sin fotos → checklist concreto |
| **"Estos 3 clientes están fríos y tenés algo para ellos"** | Matches nuevos ≥75 sin contacto hace +X días |
| **"El cliente descartó dos por la misma razón"** | Patrón en `descartes` → corregir el perfil antes de seguir mostrando |
| **Mensaje listo para WhatsApp** | Ya integrado con la mensajería existente |
| **Comparables para justificar precio** | Vecinos semánticos de la propiedad en la cartera y en operaciones cerradas |

### Para el admin

| Sugerencia | Valor de negocio |
|---|---|
| **Cobertura de cartera** — % de clientes con al menos un match ≥70 | Mide si lo que se capta responde a lo que se pide. Es un KPI que hoy no existe. |
| **Demanda insatisfecha** — agrupa requerimientos sin match por zona/tipología/rango | **Convierte la captación en una decisión con datos:** "hay 9 clientes buscando 2 ambientes en Centro bajo USD 70k y no tenemos ninguno" |
| **Propiedades huérfanas** — +30 días sin matches ni visitas | Disparador de baja de precio, refresco de fotos o recategorización |
| **Oportunidades sin acción** | Matches fuertes que ningún agente movió en 48h |
| **Agente idóneo para un lead entrante** | Por afinidad histórica: zona, tipología y ticket donde ese agente **convierte**, no donde tiene más clientes |
| **Duplicados en cartera** | Similitud >0.95 entre embeddings de propiedades = misma unidad cargada dos veces |
| **Permutas** | Cliente propietario + cliente comprador cuyos perfiles se cruzan |

---

## 7. MODELO DE DATOS (2 colecciones nuevas, cero migraciones)

```js
// backend/models/EntityProfile.js
{
  entityType: 'propiedad' | 'cliente',
  entityId: String,            // index
  agenteId: String,            // scoping de permisos
  contentHash: String,         // evita regenerar lo que no cambió
  narrativa: String,
  facts: Object,               // normalizado, alimenta el scoring
  tags: [String],
  publicoIdeal: [String],      // propiedades
  requisitos: { must: [Object], nice: [Object] },  // clientes
  senales: Object,
  descartes: [Object],
  faltantes: [String],
  embedding: [Number],         // 1536 dims (text-embedding-3-small)
  embeddingModel: String,
  provider, model, tokens, costUSD,
  version: Number, generatedAt: Date
}

// backend/models/MatchRecommendation.js
{
  clienteId, propiedadId,
  colocadorId,                  // agente dueño del cliente — el que acciona
  captadorId,                   // agente que captó la propiedad (match cruzado)
  direction: 'cliente_a_propiedad' | 'propiedad_a_cliente',
  score: Number,
  breakdown: { precio, ubicacion, tipologia, superficie, semantico, senales },
  fxRate: { valor: Number, fecha: Date },   // cotización usada, para releer el match igual
  bucket: 'fuerte' | 'buena' | 'alternativa',
  titulo, porQue: [String], objeciones: [String],
  accionSugerida, mensajeWhatsapp,
  status: 'pending'|'viewed'|'sent'|'visita_agendada'|'descartado'|'convertido',
  motivoDescarte: String,
  profileVersions: { cliente: Number, propiedad: Number },
  expiresAt: Date               // TTL index, igual que MarketingRecommendation
}
```

`MatchRecommendation` sigue el patrón ya probado de `MarketingRecommendation` (status/priority/expiresAt + TTL), así que la UI puede reusar el lenguaje visual de `RecommendationCard.jsx`.

### El bucle de aprendizaje

Cada descarte con motivo alimenta tres cosas: (1) no repetir esa sugerencia, (2) corregir el perfil del cliente, (3) a los 3-6 meses, recalibrar los pesos por agente y tipo de cliente con datos reales de conversión. La métrica que cierra el círculo es **match → visita → operación**, que ya se puede seguir con `Cita` y `Operacion`.

---

## 8. ARCHIVOS A CREAR

```
backend/
├── models/
│   ├── EntityProfile.js
│   └── MatchRecommendation.js
├── services/ai/
│   └── embeddings.js           # ✅ HECHO — embeddings OpenAI, batch, coseno, ranking
├── services/matching/
│   ├── currency.js             # ✅ HECHO — cotización del dólar y conversión a USD
│   ├── profileService.js       # genera perfiles canónicos con GPT
│   ├── scoringEngine.js        # determinista, puro, testeable sin IA
│   ├── weights.js              # pesos por tipo de cliente (override en GlobalConfig)
│   ├── explainService.js       # redacción GPT + validación anti-alucinación
│   ├── matchService.js         # orquesta las 3 etapas
│   └── insightsService.js      # cobertura, demanda insatisfecha, huérfanas
├── routes/
│   └── matching.js
└── workers/  (dentro de ai-worker y scheduler-worker existentes)

admin/src/components/matching/   →  MatchCard.jsx, MatchList.jsx, MatchPanel.jsx
admin/src/services/matchingService.js
agents/  →  espejo de los mismos componentes
```

**Endpoints:**

| Método | Ruta | Uso |
|---|---|---|
| GET | `/matching/clientes/:id/propiedades` | Panel en la ficha del cliente |
| GET | `/matching/propiedades/:id/clientes` | Panel en la ficha de la propiedad |
| POST | `/matching/:id/feedback` | Enviado / agendado / descartado + motivo |
| GET | `/matching/oportunidades` | Radar del admin |
| GET | `/matching/demanda-insatisfecha` | Guía de captación |
| POST | `/matching/reprocesar` | Backfill / recálculo (admin) |

---

## 9. PLAN DE EJECUCIÓN

| Fase | Entregable | Estimado | Sirve solo |
|---|---|---|---|
| **0 ✅ HECHA** | Migración completa a OpenAI (chat + embeddings), servicio de embeddings en Node, **cotización del dólar + pantalla de carga en el admin** | 1 día | Sí: la cotización sirve en toda la app, no solo acá |
| **1 ✅ HECHA** | Perfiles semánticos: modelos, `profileService`, `embeddingService`, backfill, regeneración por evento. **+ zonas de interés múltiples (modelo, normalizador y selector en ambos frontends)** | 3-4 días | Sí: los `faltantes` ya son sugerencias útiles |
| **2 ✅ HECHA** | Motor de scoring determinista + endpoints, **sin LLM**. Incluye rango de presupuesto derivado y scoring multi-zona | 2 días | **Sí — el matching ya funciona y se puede validar contra el criterio del agente** |
| **3 ✅ HECHA** | Capa de explicación GPT + `MatchRecommendation` + caché | 1-2 días | Sí |
| **4 ✅ HECHA** | UI en admin y agents: pestañas en ficha de cliente y propiedad, acciones, WhatsApp, **captador visible y "coordinar con…"** | 2-3 días | Sí |
| **5 ✅ HECHA** | Automatización por eventos + **notificaciones agrupadas y resumen diario** + panel de oportunidades del admin | 2 días | Sí |
| **6** | Resto de sugerencias del punto 6 + calibración con feedback | continuo | Sí |

**Total hasta producción usable: ~2 semanas y media** (las decisiones tomadas suman ~2 días: multi-zona, pantalla de cotización y notificaciones agrupadas). Las fases 1 a 3 se pueden probar por API antes de tocar una sola pantalla, y **la fase 2 ya entrega un motor funcionando sin IA generativa** — eso permite validar que los pesos reflejan el criterio real de la inmobiliaria antes de gastar un peso en redacción.

Cada fase con impacto visible suma su entrada en `changelog.json` antes del commit.

---

## 10. COSTOS Y GUARDRAILES

**Costo estimado con `gpt-4o-mini` (el modelo que ya usa el sistema) + `text-embedding-3-small`:**

| Concepto | Volumen | Costo |
|---|---|---|
| Embeddings de toda la cartera (carga inicial) | ~2.000 entidades × 600 tokens | **< USD 0,05** (una vez) |
| Perfiles semánticos iniciales | ~2.000 × (1.000 in + 400 out) | **~USD 1** (una vez) |
| Perfiles nuevos/actualizados | ~50/mes | ~USD 0,03/mes |
| Explicaciones (top 5, cacheadas por versión de perfil) | ~100/día | **~USD 1,50/mes** |
| **Total operativo** | | **< USD 5/mes** |

El costo real del motor no es la IA: es el tiempo de desarrollo. Todo llamado queda registrado en `AIUsageLog` con tokens y costo, como el resto del sistema.

**Guardrailes:**

- **Suggest-first.** El motor nunca contacta a un cliente. Propone; el agente decide y aprieta enviar.
- **Scoping de permisos asimétrico.** El agente ve **propiedades de toda la cartera** (visibilidad cruzada) pero **solo sus propios clientes**. Se comparte la propiedad, nunca los datos del propietario: esos siguen siendo del captador. El LLM nunca recibe datos fuera de ese alcance.
- **Techo de interrupciones.** La cobertura de notificaciones es del 100%, pero agrupada por evento y con tope diario por agente. El resumen diario absorbe todo lo que no sea match fuerte.
- **Sin datos personales en los embeddings.** Teléfono, mail y documento no aportan al matching y no se embeben.
- **Tope de gasto diario** + el circuit breaker de salud del proveedor que ya existe en `AIProvider`.
- **Degradación limpia.** Si la API de OpenAI no responde, el motor sirve el score determinista con texto plantilla. Nunca se cae el panel.
- **Todo auditable.** Cada recomendación guarda el desglose del score, la versión de perfil y el modelo que la redactó.

---

## 11. DECISIONES TOMADAS

| # | Decisión | Qué implica en el código |
|---|---|---|
| 1 | **Presupuesto: rango automático** | Sin tocar el formulario. El rango efectivo se deriva como `[presupuesto × 0,75 , presupuesto × 1,15]`, con corte duro en `× 1,20`. Además, si las notas o la conversación dicen un rango explícito ("hasta 90 mil", "entre 80 y 100"), el perfil semántico lo extrae y **pisa** al derivado. |
| 2 | **Zona de interés múltiple** | `metadata.zonaInteres` (string) → `metadata.zonasInteres` (array), leyendo lo viejo sin migrar nada (string suelto y separación por comas). Selector múltiple en el formulario de cliente, en admin y en agentes. El score de ubicación toma **la mejor de las zonas**, con un plus si es la primera. Se adelanta a la Fase 1 porque impacta directo en la calidad del match. |
| 3 | **La cotización del dólar la carga el admin** | Clave `cotizacion_usd` en `GlobalConfig` con valor, fecha y quién la cargó, más pantalla en Configuración y aviso de vencimiento a los 7 días. **Cada match guarda la cotización que usó**, así un match viejo se relee sin que los números se muevan solos. Si nunca se cargó, el motor compara únicamente dentro de la misma moneda y lo avisa. |
| 4 | **Visibilidad cruzada entre agentes** | Un agente ve propiedades de toda la cartera para sus clientes, con el **nombre del captador visible** y acción "coordinar con…". Guardrail: se comparte la propiedad, **no los datos del propietario** — esos siguen siendo del captador. Cada match cruzado registra `captadorId` y `colocadorId`, que es exactamente lo que después necesita el motor de recompensas para repartir. |
| 5 | **Notificaciones al 100%** | Notifica todo lo que el panel muestra (≥50), pero **agrupado**: una notificación por evento con todos los clientes que matchean ("3 clientes tuyos encajan con la propiedad que acabás de cargar"), no una por match. Los ≥80 salen con prioridad alta y push; el resto entra en el resumen diario. Tope por agente y por día. |

**Sobre la quinta:** cobertura del 100% no puede significar interrupción del 100%. Un agente con 30 clientes recibiría 30 avisos por cada propiedad nueva y en tres días silencia el canal — y ahí se pierden también los matches fuertes. Por eso la cobertura es total pero la entrega va agrupada: es la única forma de que el 100% se lea de verdad. Si al mes se ve que el resumen diario no se abre, se sube el umbral del push, no el de la cobertura.

---

## 12. CÓMO SE MIDE EL ÉXITO

| Métrica | Cómo se lee |
|---|---|
| % de clientes con al menos un match ≥70 | Cobertura de cartera — si es baja, el problema es la captación, no el motor |
| Matches enviados por semana / por agente | Adopción real de la herramienta |
| **Tasa match → visita agendada** | La métrica central de calidad del motor |
| **Tasa match → operación** | La métrica de negocio |
| Tiempo entre carga de propiedad y primer contacto con un cliente interesado | Hoy son días; el objetivo son minutos |
| % de matches descartados y sus motivos | Alimenta la recalibración de pesos |
| Costo IA mensual | Control de gasto |
