# Versionado de Admin y CRM

La version visible de la aplicacion se muestra siempre en el sidebar de `admin` y `agents`/CRM.

## Regla

- Cambios menores: `v1.<numero total de commits>`.
- Cambios mayores: subir el mayor en `app-version.json` (`2`, `3`, etc.).

## Generacion

El archivo `scripts/write-app-version.js` toma el mayor desde `app-version.json` y el numero de commit desde Git:

```bash
node scripts/write-app-version.js
```

Tambien se ejecuta automaticamente antes de `npm start` y `npm run build` dentro de `admin/` y `agents/`.

Los archivos generados son:

- `admin/src/config/appVersion.js`
- `agents/src/config/appVersion.js`

No editarlos a mano; para un cambio mayor, editar solo `app-version.json`.

## Novedades

El panel de **Novedades** del sidebar se alimenta desde `changelog.json`.

- Todo cambio visible para usuarios finales debe agregarse a `changelog.json` antes de commit/push.
- El texto debe estar en español simple, pensado para usuarios finales.
- Los tipos validos son `nuevo`, `mejora` y `arreglo`.
- Despues de editar `changelog.json`, ejecutar `node scripts/write-app-version.js` o correr los builds para regenerar:
  - `admin/src/config/changelog.js`
  - `agents/src/config/changelog.js`

No cerrar ni pushear una mejora visible si no quedo reflejada en **Novedades**.
