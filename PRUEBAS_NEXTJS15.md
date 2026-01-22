# Pruebas de Actualización a Next.js 15

## ✅ Cambios Realizados

### 1. Dependencias Actualizadas

- ✅ `next`: `^14.2.35` → `^15.1.7`
- ✅ `@next/eslint-plugin-next`: `^14.2.18` → `^15.1.7`
- ✅ `react`: `18.2.0` → `^19.0.0`
- ✅ `react-dom`: `18.2.0` → `^19.0.0`
- ✅ `@types/react`: `18.2.15` → `^19.0.0`

### 2. Configuración Actualizada

- ✅ `next.config.js` - Eliminada configuración experimental obsoleta
- ✅ Eliminado script `copy-vendor-css.js` del build (Next.js 15 maneja mejor el CSS)

### 3. Funciones de Datos Actualizadas (28 archivos)

Todas las funciones `getStaticProps` y `getServerSideProps` ahora usan `await params` para compatibilidad con Next.js 15:

**Archivos actualizados:**

- ✅ `src/pages/ecma/entidades/index.tsx`
- ✅ `src/pages/ecma/entidades/[slug]/index.tsx`
- ✅ `src/pages/ecma/entidades/pais/[slug].tsx`
- ✅ `src/pages/ecma/generos/index.tsx`
- ✅ `src/pages/ecma/generos/[genre]/index.tsx`
- ✅ `src/pages/ecma/personas/index.tsx`
- ✅ `src/pages/ecma/personas/[slug]/index.tsx`
- ✅ `src/pages/ecma/personas/pais/[slug].tsx`
- ✅ `src/pages/ecma/revistas/index.tsx`
- ✅ `src/pages/ecma/revistas/[slug]/index.tsx`
- ✅ `src/pages/ecma/revistas/demografia/[slug].tsx`
- ✅ `src/pages/ecma/titulos/index.tsx`
- ✅ `src/pages/ecma/titulos/estrenos/index.tsx`
- ✅ `src/pages/ecma/titulos/[type]/index.tsx`
- ✅ `src/pages/ecma/titulos/[type]/[title].tsx`
- ✅ `src/pages/eventos/index.tsx`
- ✅ `src/pages/eventos/[slug]/index.tsx`
- ✅ `src/pages/eventos/pais/[slug].tsx`
- ✅ `src/pages/posts/index.tsx`
- ✅ `src/pages/posts/[slug]/index.tsx`
- ✅ `src/pages/users/[slug]/index.tsx`
- ✅ `src/pages/tags/[tag].tsx`
- ✅ `src/pages/categorias/[category].tsx`
- ✅ `src/pages/mi-lista/index.tsx`
- ✅ `src/pages/dashboard/titles/[id]/index.tsx`

## 📋 Checklist de Pruebas

### Paso 1: Instalar Dependencias

```bash
yarn install
```

**Posibles problemas:**

- ⚠️ Algunas librerías pueden no ser compatibles con React 19 aún
- ⚠️ Puede haber conflictos de peer dependencies

### Paso 2: Limpiar Caché

```bash
rm -rf .next
rm -rf node_modules/.cache
```

### Paso 3: Verificar TypeScript

```bash
yarn typecheck
```

**Qué verificar:**

- ✅ No hay errores de tipo relacionados con React 19
- ✅ Los tipos de `params` están correctos

### Paso 4: Lint

```bash
yarn lint
```

### Paso 5: Build de Producción

```bash
yarn build
```

**Qué verificar:**

- ✅ El build se completa sin errores
- ✅ No hay errores de Sucrase parseando CSS
- ✅ Todas las páginas se generan correctamente
- ✅ No hay errores de "socket hang up" durante el prerender

**Páginas críticas a verificar:**

- `/ecma/entidades`
- `/ecma/generos`
- `/ecma/personas`
- `/ecma/revistas`
- `/ecma/titulos`
- `/ecma/titulos/estrenos`
- `/eventos`

### Paso 6: Desarrollo Local

```bash
yarn dev
```

**Qué verificar:**

- ✅ La aplicación inicia sin errores
- ✅ Las rutas funcionan correctamente
- ✅ La navegación funciona
- ✅ Los datos se cargan correctamente

## ⚠️ Posibles Problemas y Soluciones

### Problema 1: Incompatibilidad de React 19 con Librerías

**Síntomas:** Errores durante `yarn install` o en runtime

**Librerías que podrían tener problemas:**

- `@tanstack/react-query` v4 - Debería funcionar pero verificar
- `react-hook-form` - Debería ser compatible
- `next-auth` v4 - Puede requerir actualización a v5 (Auth.js)

**Solución temporal:** Si hay problemas, usar React 18.3+ temporalmente:

```json
"react": "^18.3.0",
"react-dom": "^18.3.0",
"@types/react": "^18.3.0"
```

### Problema 2: Errores de CSS aún persisten

**Síntomas:** Errores de Sucrase parseando CSS durante build

**Solución:** Next.js 15 debería manejar esto mejor, pero si persiste:

1. Verificar que los imports de CSS en `_app.tsx` sean correctos
2. Asegurar que los archivos CSS en `src/styles/vendor/` existan

### Problema 3: Errores de TypeScript con `params`

**Síntomas:** Errores de tipo en funciones `getStaticProps`/`getServerSideProps`

**Solución:** Asegurar que todos los `params` usen `await`:

```typescript
export const getStaticProps = async ({ params }) => {
  const resolvedParams = await params;
  // Usar resolvedParams en lugar de params
};
```

### Problema 4: Errores de Hidratación

**Síntomas:** Warnings o errores de hidratación en consola

**Causa común:** Cambios en el comportamiento de React 19

**Solución:** Verificar componentes que usan `useEffect` para manipular el DOM

## 🎯 Próximos Pasos Después de las Pruebas

Una vez que el build y las pruebas funcionen:

1. **Optimizar QueryClient** - Crear singleton
2. **Migrar useAuth a React Query** - Eliminar SWR
3. **Mejoras de TypeScript** - Habilitar strict mode gradualmente
4. **Eliminar dependencias no usadas** - `@tinymce/tinymce-react`, `react-select-search`
5. **Crear `.env.example`** - Documentar variables de entorno

## 📝 Notas Adicionales

- Next.js 15 introduce cambios en el manejo de cache por defecto para `fetch`
- Las APIs de `cookies()` y `headers()` ahora son asíncronas (solo en App Router)
- El motor de compilación Turbopack está disponible con `next dev --turbo`
