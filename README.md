# Raíz Horaria — Reloj mundial y clima

App SSR con Astro + `@astrojs/node` que muestra tu hora local, las zonas horarias que guardes (en `localStorage`) y el clima de cada una (Open-Meteo, sin API key). Estilo neobrutalista con paleta "bosque neutro pastel" en HSL.

## Scripts

| Comando        | Acción                                              |
| -------------- | --------------------------------------------------- |
| `pnpm dev`     | Servidor de desarrollo en `localhost:4321`          |
| `pnpm build`   | Compila el servidor SSR en `./dist/`                |
| `pnpm start`   | Arranca el servidor de producción (Node standalone) |
| `pnpm check`   | Verificación de tipos con `astro check`             |

En producción define `SITE_URL` (p. ej. `SITE_URL=https://tudominio.com pnpm build`) para que canonical, Open Graph y el sitemap usen tu dominio.

## Deploy con Dokploy + GitHub Actions

El workflow [`.github/workflows/ci-deploy.yml`](.github/workflows/ci-deploy.yml) hace:

1. **check**: `pnpm check` + `pnpm build` (en PRs y en `main`).
2. **docker**: construye la imagen del `Dockerfile` para validar que compila (no la publica).
3. **deploy** (solo push a `main`): llama a `POST {DOKPLOY_URL}/api/application.deploy` y Dokploy construye y despliega.

### 1. En Dokploy

1. Crea un proyecto y una **Application** con proveedor GitHub apuntando a este repo, rama `main`.
2. **Build Type** → `Dockerfile` (ruta `Dockerfile`, contexto `.`).
3. **Environment → Build Time Arguments**: `SITE_URL=https://tudominio.com`.
4. **Domains**: añade tu dominio con puerto de contenedor `4321` y HTTPS.
5. **General → Auto Deploy**: **desactívalo**. Si no, cada push despliega dos veces (webhook + Actions) y además se desplegaría aunque el CI falle.
6. **Settings → Profile → API/CLI Keys** → *Generate New Key* (un admin debe darte permiso de API).
7. Obtén el `applicationId` con `GET {DOKPLOY_URL}/api/project.all` (cabecera `x-api-key`) o desde Swagger en `{DOKPLOY_URL}/swagger`.

### 2. En GitHub (Settings → Secrets and variables → Actions)

| Tipo     | Nombre                   | Valor                                    |
| -------- | ------------------------ | ---------------------------------------- |
| Secret   | `DOKPLOY_URL`            | `https://dokploy.tudominio.com`          |
| Secret   | `DOKPLOY_API_KEY`        | La API key generada                      |
| Secret   | `DOKPLOY_APPLICATION_ID` | El id de la aplicación                   |
| Variable | `SITE_URL`               | `https://tudominio.com`                  |

Opcional: crea el environment `production` (Settings → Environments) para exigir aprobación manual antes de desplegar.

### Probar la imagen en local

```bash
docker build --build-arg SITE_URL=http://localhost:4321 -t raiz-horaria .
docker run --rm -p 4321:4321 raiz-horaria
```

## Arquitectura (screaming + atomic design)

La carpeta `src/` "grita" lo que hace la app: cada feature tiene su dominio, infraestructura y UI atómica.

```
src/
├── world-clock/              # Reloj mundial
│   ├── domain/               # Zonas, catálogo de ciudades, cálculo de horas (funciones puras)
│   ├── infrastructure/       # Cookie de zona del visitante y geocodificación
│   ├── client/               # Navegador: tic por segundo, localStorage, cookie
│   └── ui/{atoms,molecules,organisms}
├── weather/                  # Clima
│   ├── domain/               # Tipos y códigos WMO → etiqueta/icono
│   ├── infrastructure/       # Cliente Open-Meteo con caché en memoria
│   └── ui/{atoms,molecules,organisms}
├── seo/                      # SEO
│   ├── domain/               # Metadatos del sitio, schema.org, sitemap
│   └── ui/                   # SeoHead, JsonLd
├── shared/
│   ├── styles/               # tokens.css (paleta HSL) + global.css
│   └── ui/{atoms,molecules,organisms,templates}
└── pages/                    # Rutas (Astro exige esta carpeta)
    ├── index.astro           # Hora local + mis zonas + populares
    ├── zonas.astro           # Directorio de todas las zonas
    ├── zona/[slug].astro     # Detalle: hora, ficha, clima, 24 h, 7 días, FAQ
    ├── partials/             # Fragmentos HTML que pide el cliente
    └── robots.txt.ts
```

### Integraciones y APIs nativas de Astro

| Necesidad          | Solución                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| SSR en Node        | `@astrojs/node` (modo `standalone`)                                                              |
| Sitemap            | `@astrojs/sitemap` → `/sitemap-index.xml`; las rutas `/zona/[slug]` se añaden con `customPages` desde el catálogo (`src/seo/domain/sitemap.ts`). Se genera en `astro build`. |
| Fuentes            | Fonts API (`fonts` en la config + `<Font />`): se sirven desde el propio sitio con fallbacks ajustados |
| Precarga de enlaces | `prefetch` nativo (al pasar el ratón)                                                           |
| Fragmentos HTML    | Páginas parciales (`export const partial = true`)                                                |
| robots.txt         | Endpoint propio: Astro no tiene integración oficial para esto                                    |

### Cómo encaja SSR con localStorage

- **Hora local**: el navegador guarda su zona horaria en la cookie `rh_tz`; el servidor la lee y renderiza tu ciudad y su clima. En la primera visita se pide `/partials/local-hero` para completar el bloque.
- **Mis zonas**: viven en `localStorage` (`raiz-horaria:zones`). El cliente pide `/partials/zone-cards?zones=…` y el servidor devuelve las tarjetas ya renderizadas (componentes Astro) con su clima.
- **Relojes**: los elementos con `data-clock` / `data-analog` se actualizan cada segundo con las mismas funciones que usa el servidor.

### Paleta HSL

`src/shared/styles/tokens.css` define cada familia (musgo, salvia, helecho, niebla, liquen, corteza, arcilla) con tono y saturación separados y una escala de luminosidad común (`--l-50` … `--l-900`). Cambia `--h-*` para mover una familia entera o `--s-*` para hacerla más o menos pastel.
