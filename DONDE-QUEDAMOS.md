# Alta Colina — dónde quedamos (2026-09-10)

## Hecho y cobrado

**https://alta-colina.com** en línea, con SSL. Ronivel pagó los S/ 500 completos.

| | |
|---|---|
| Dominio | Porkbun, comprado 2026-09-08, vence 2027-09-08, renovación automática |
| Titular del dominio | Ronivel · la cuenta de Porkbun es de Midwar |
| Alojamiento | Cloudflare Pages, proyecto `alta-colina` |
| Zona Cloudflare | `4986f3d95e739fa34c7df12fdfd6b7e1` |
| Repo | `By0nder/alta-colina` — **sigue público a propósito**, ver abajo |

## Lo que falta pedirle a Ronivel

1. **El ID del píxel de Meta.** `assets/app.js:18` está vacío. Sin eso la pauta se gasta
   sin poder medir quién escribe.
2. **La lista de vendidos y separados por número.** Los 17 tomados se ubicaron leyendo la
   foto del letrero del terreno; a 720 px los números no se leen. Es lectura por posición.
3. **Fotos y datos de los dos proyectos nuevos** — ver más abajo qué se necesita exactamente.

## Los dos proyectos nuevos

Ya mandó información de **dos** (uno de departamentos en condominio y otro parecido, ambos
del sur). Como son dos y no tres, **no aplica el paquete: son S/ 250 c/u = S/ 500.**

Van dentro del mismo dominio, en `alta-colina.com/nombre-del-proyecto`. Más simples que
Alta Colina: portada, qué se vende, galería, cómo llegar y WhatsApp. **Sin plano
interactivo**, salvo que tengan su PDF de independización (+S/ 200 cada uno).

Por cada proyecto hace falta: 8 a 15 fotos reales, el nombre, dónde queda, cuántos lotes o
departamentos, de qué medidas, si están independizados o en trámite, y qué hay construido.

## El repo: por qué sigue público

Se sacó del repo todo lo que no debía publicarse (el plan interno, los planos de casas de
terceros con nombres de propietarios, el expediente). **Pero eso sigue en el historial de
git**, y el repo es público. Se decidió NO reescribir el historial todavía porque el riesgo
real es bajo (cero forks, hay que adivinar un SHA de 40 caracteres) y porque conviene
resolverlo cuando se mude a su repo propio de agente, que es cuando toca igual.

Falta preguntarle a Ronivel si compartió con alguien el enlace viejo
(`by0nder.github.io/alta-colina/`). **Si no lo compartió, se puede apagar y hacer el repo
privado hoy mismo.**

## Propuestas entregadas, esperando respuesta

- `negocio/propuestas/Plan-Anuncios-Alta-Colina.pdf` — S/ 500 arranque, S/ 300/mes gestión,
  S/ 700/mes de pauta que paga él directo. Lo está pateando hasta terminar las páginas.
- `negocio/propuestas/Plan-Proyectos-Ronivel.pdf` — S/ 250 por proyecto.

## Lo que viene después

Pidió **su propia página de agente**, con todos sus proyectos adentro. Es proyecto aparte.
En la propuesta 2 quedó anotado en S/ 350 más el dominio (~S/ 45/año), pero sin cotizar
en detalle.

## Piezas para anuncios

En `negocio/piezas-alta-colina/` hay 4 piezas de 1080x1350 con las fuentes reales del sitio
y el molde para generar más. **Las fotos sirven (1600 px); el video no (720 px, se ve
blando al estirarlo).** Ronivel casi no va al terreno, así que no habrá video nuevo: se
trabaja con fotos.
