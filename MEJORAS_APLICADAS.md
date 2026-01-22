# Mejoras Aplicadas - CoAnime Frontend

**Fecha:** Enero 2026  
**Versión:** 1.0.4  
**Última Actualización:** Enero 2026

---

## ✅ Mejoras Completadas

### 1. Actualización a Next.js 15 y React 19 ⭐

#### Cambios Realizados:

- ✅ **Next.js:** `^14.2.35` → `^15.1.7`
- ✅ **React:** `18.2.0` → `^19.0.0`
- ✅ **React DOM:** `18.2.0` → `^19.0.0`
- ✅ **@next/eslint-plugin-next:** `^14.2.18` → `^15.1.7`
- ✅ **@types/react:** `18.2.15` → `^19.0.0`

#### Actualizaciones de Funciones de Datos:

- ✅ Actualizadas **28 funciones** `getStaticProps` y `getServerSideProps` para usar `await params` (requerido en Next.js 15)
- ✅ Todas las funciones ahora son compatibles con Next.js 15

#### Archivos Modificados:

- `package.json`
- `next.config.js`
- 28 archivos de páginas con funciones de datos

#### Beneficios:

- ✅ Mejor manejo de CSS de `node_modules` (resuelve problema de Sucrase)
- ✅ Mejor rendimiento del build
- ✅ APIs modernas y estables
- ✅ Tooling mejorado para desarrollo

---

### 2. Actualización a Tailwind CSS 4 ⭐

#### Cambios Realizados:

- ✅ **Tailwind CSS:** `^3.4.17` → `^4.0.0`
- ✅ **@tailwindcss/postcss:** `^4.0.0` (nuevo)
- ✅ Migrado de `@tailwind base/components/utilities` a `@import "tailwindcss"`
- ✅ Actualizado `postcss.config.js` para usar `@tailwindcss/postcss`
- ✅ Eliminado `tailwind.config.js` (reemplazado por `tailwind.config.ts`)
- ✅ Actualizadas variables CSS de shadcn/ui para Tailwind v4
- ✅ Corregidos errores de `@layer` (eliminados donde causaban conflictos)

#### Archivos Modificados:

- `package.json`
- `postcss.config.js`
- `tailwind.config.ts` (nuevo, reemplaza `.js`)
- `src/styles/app.css`
- `components.json`

#### Beneficios:

- ✅ Sintaxis moderna de Tailwind v4
- ✅ Mejor rendimiento de compilación
- ✅ Compatibilidad con la última versión de shadcn/ui
- ✅ Configuración más simple y basada en CSS

---

### 3. Migración a shadcn/ui ⭐

#### Cambios Realizados:

- ✅ Instalado y configurado shadcn/ui
- ✅ Creados componentes base: `button`, `input`, `textarea`, `label`, `form`, `calendar`, `popover`
- ✅ Reemplazado `react-datetime-picker` por `DatePicker` de shadcn/ui
- ✅ Migrados imports en archivos principales (login, register, dashboard)
- ✅ Mantenida compatibilidad con componentes antiguos (`FormWithContext`)

#### Componentes Creados:

- `src/components/ui/button.tsx` - Button de shadcn/ui con variantes personalizadas
- `src/components/ui/input.tsx` - Input de shadcn/ui compatible con el anterior
- `src/components/ui/textarea.tsx` - Textarea de shadcn/ui
- `src/components/ui/label.tsx` - Label de shadcn/ui
- `src/components/ui/form.tsx` - Form de shadcn/ui con FormField, FormItem, etc.
- `src/components/ui/calendar.tsx` - Calendar de shadcn/ui
- `src/components/ui/popover.tsx` - Popover de shadcn/ui
- `src/components/ui/date-picker.tsx` - DatePicker personalizado que reemplaza `react-datetime-picker`

#### Archivos Migrados:

- `src/pages/login.tsx`
- `src/pages/register.tsx`
- `src/pages/dashboard/titles/create.tsx`
- `src/pages/dashboard/titles/[id]/index.tsx`
- `src/pages/dashboard/posts/create.tsx`
- `src/pages/dashboard/posts/[id]/index.tsx`

#### Dependencias Agregadas:

- `@radix-ui/react-popover`
- `@radix-ui/react-slot`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-react`
- `react-day-picker`

#### Dependencias Eliminadas:

- `react-datetime-picker` (reemplazado por DatePicker de shadcn/ui)

#### Estado:

- ✅ Componentes base creados y funcionando
- ⚠️ Migración parcial: ~21 archivos aún usan componentes antiguos (Button, Input, TextArea, Label)
- ✅ DatePicker completamente migrado

---

### 4. Migración Completa a Auth.js (next-auth) ⭐

#### Cambios Realizados:

- ✅ Migrado completamente de Laravel Sanctum client-side a Auth.js
- ✅ Configurado Credentials Provider en `src/pages/api/auth/[...nextauth].tsx`
- ✅ Creada ruta API interna `/api/auth/coanime-auth` para autenticación con Laravel
- ✅ Implementado manejo de cookies server-side con `axios-cookiejar-support` y `tough-cookie`
- ✅ Refactorizado `useAuth` hook para usar `useSession`, `signIn`, `signOut` de Auth.js
- ✅ Migrado login y registro a Auth.js
- ✅ Mantenidas funciones `forgotPassword`, `resetPassword`, `resendEmailVerification` (llamadas directas a Laravel)
- ✅ Agregado `SessionProvider` en `_app.tsx`

#### Archivos Modificados:

- `src/pages/api/auth/[...nextauth].tsx` (nuevo)
- `src/pages/api/auth/coanime-auth.ts` (nuevo)
- `src/hooks/auth.ts` - Refactorizado completamente
- `src/pages/_app.tsx` - Agregado SessionProvider
- `src/lib/axios.ts` - Configurado para Laravel Sanctum (para funciones que aún lo necesitan)
- `src/pages/login.tsx` - Usa Auth.js
- `src/pages/register.tsx` - Usa Auth.js

#### Dependencias Agregadas:

- `axios-cookiejar-support`
- `tough-cookie`
- `next-auth` (ya estaba instalado, ahora en uso activo)

#### Beneficios:

- ✅ Autenticación más robusta y estándar
- ✅ Mejor manejo de sesiones
- ✅ Preparado para OAuth providers si se necesita en el futuro
- ✅ Mejor integración con Next.js

---

### 5. Estandarización de Librería de Fechas ⭐

#### Cambios Realizados:

- ✅ Eliminado `date-fns` completamente del proyecto
- ✅ Migrado **todos** los usos de `date-fns` a `dayjs`
- ✅ Configurado locale español (`dayjs/locale/es`) donde se necesita
- ✅ Actualizado `DatePicker` para usar `dayjs` en lugar de `date-fns`

#### Archivos Migrados (11 archivos):

- `src/components/ui/date-picker.tsx`
- `src/pages/posts/[slug]/index.tsx`
- `src/pages/eventos/[slug]/index.tsx`
- `src/components/Layouts/Footer.tsx`
- `src/components/modules/posts/components/PostHeader.tsx`
- `src/components/modules/home/components/TopSlider.tsx`
- `src/components/modules/home/components/RecentPosts.tsx`
- `src/components/modules/home/components/OtherNews.tsx`
- `src/pages/ecma/entidades/[slug]/index.tsx`
- `src/pages/ecma/personas/[slug]/index.tsx`
- `src/pages/ecma/revistas/[slug]/index.tsx`

#### Dependencias Eliminadas:

- `date-fns` (2.30.0)

#### Beneficios:

- ✅ Una sola librería de fechas (menor bundle size)
- ✅ API más simple y consistente
- ✅ Mejor rendimiento (dayjs es más ligero)

---

### 6. QueryClient Singleton ⭐ (Crítico)

#### Problema Resuelto:

- QueryClient se recreaba en cada render de `_app.tsx`

#### Solución Implementada:

- ✅ Creado `src/lib/queryClient.ts` con patrón singleton
- ✅ Función `getQueryClient()` que mantiene una única instancia en el browser
- ✅ Actualizado `_app.tsx` para usar el singleton

#### Archivos Modificados:

- `src/lib/queryClient.ts` (nuevo)
- `src/pages/_app.tsx`

#### Beneficios:

- ✅ Mejor rendimiento (no recrea QueryClient)
- ✅ Menor consumo de memoria
- ✅ Mejor práctica de React Query

---

### 7. Eliminación de Dependencias No Usadas

#### Dependencias Eliminadas:

- ✅ `@tinymce/tinymce-react` (4.3.0) - No usado
- ✅ `react-select-search` (4.1.6) - No usado
- ✅ `@tailwindcss/line-clamp` (0.4.4) - Ya incluido en Tailwind CSS 3.3+
- ✅ `swr` (2.2.4) - Reemplazado por React Query (y luego por Auth.js)
- ✅ `react-datetime-picker` - Reemplazado por DatePicker de shadcn/ui
- ✅ `date-fns` - Reemplazado por dayjs
- ✅ `@tailwindcss/forms` - No necesario en Tailwind v4
- ✅ `@tailwindcss/typography` - No necesario en Tailwind v4

#### Archivos Modificados:

- `package.json`

#### Beneficios:

- ✅ Reducción del bundle size
- ✅ Menor tiempo de instalación
- ✅ Proyecto más limpio y mantenible

---

### 8. Configuración de Imágenes Next.js 15

#### Cambios Realizados:

- ✅ Actualizado `remotePatterns` con `pathname` y `port` explícitos
- ✅ Agregado `domains` como fallback (compatibilidad)
- ✅ Agregado `unoptimized` a **todos** los componentes `Image` de Next.js

#### Archivos Modificados:

- `next.config.js` - Configuración de `remotePatterns` mejorada
- **37 archivos** con componentes `Image` - Agregado `unoptimized`

#### Beneficios:

- ✅ Evita errores de hostname no configurado
- ✅ Compatibilidad total con Next.js 15
- ✅ No hay problemas de optimización con dominios externos

---

### 9. Correcciones de React 19

#### Cambios Realizados:

- ✅ Corregida firma del componente `SectionTitle` (eliminado segundo parámetro)
- ✅ Agregado `unoptimized` a todos los componentes `Image`
- ✅ Actualizadas funciones de datos para `await params`
- ✅ Actualizado `react-datetime-picker` a versión compatible con React 19
- ✅ Agregado `resolutions` para `react-fit` en `package.json`

#### Archivos Modificados:

- `src/components/ui/SectionTitle.tsx`
- `package.json` (resolutions)

---

### 10. Limpieza de Lógica Antigua de Sanctum/CSRF

#### Cambios Realizados:

- ✅ Eliminada función `SetFormDataHeader` de `src/lib/http.ts`
- ✅ Eliminado import innecesario de `useAuth` en `http.ts`
- ✅ Mantenida solo la lógica CSRF necesaria para:
  - Forgot/Reset password (llamadas directas a Laravel)
  - Verificación de email
  - Uploads de imágenes

#### Archivos Modificados:

- `src/lib/http.ts`

#### Beneficios:

- ✅ Código más limpio
- ✅ Eliminada lógica obsoleta
- ✅ Mejor separación de responsabilidades

---

### 11. Correcciones de ESLint/Prettier

#### Cambios Realizados:

- ✅ Corregidos errores de Prettier en `src/hooks/auth.ts`
- ✅ Corregidos errores de Prettier en `src/components/ui/Form.tsx`
- ✅ Corregidos errores de variables no usadas en `src/components/ui/calendar.tsx`
- ✅ Corregido orden de imports en componentes de shadcn/ui

#### Archivos Modificados:

- `src/hooks/auth.ts`
- `src/components/ui/Form.tsx`
- `src/components/ui/calendar.tsx`
- `src/components/ui/date-picker.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/popover.tsx`

---

## 📊 Resumen de Cambios

### Archivos Modificados: ~100+ archivos

- **Dependencias:** `package.json`
- **Configuración:** `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `components.json`
- **Hooks:** `src/hooks/auth.ts`, `src/lib/queryClient.ts` (nuevo)
- **Páginas:** 28 archivos con `getStaticProps`/`getServerSideProps`, múltiples páginas migradas a shadcn/ui
- **Componentes:** 37 archivos con componentes `Image`, componentes de shadcn/ui creados
- **API Routes:** `src/pages/api/auth/[...nextauth].tsx`, `src/pages/api/auth/coanime-auth.ts` (nuevos)
- **Estilos:** `src/styles/app.css` (migrado a Tailwind v4)
- **Utilidades:** 11 archivos migrados de `date-fns` a `dayjs`

### Dependencias Eliminadas: 8

- `@tinymce/tinymce-react`
- `react-select-search`
- `@tailwindcss/line-clamp`
- `swr`
- `react-datetime-picker`
- `date-fns`
- `@tailwindcss/forms`
- `@tailwindcss/typography`

### Dependencias Agregadas: 12

- `@radix-ui/react-popover`
- `@radix-ui/react-slot`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-react`
- `react-day-picker`
- `axios-cookiejar-support`
- `tough-cookie`
- `tailwindcss` (v4)
- `@tailwindcss/postcss`
- `next-auth` (ahora en uso activo)

### Dependencias Actualizadas: 6

- `next`: `^14.2.35` → `^15.1.7`
- `react`: `18.2.0` → `^19.0.0`
- `react-dom`: `18.2.0` → `^19.0.0`
- `@next/eslint-plugin-next`: `^14.2.18` → `^15.1.7`
- `@types/react`: `18.2.15` → `^19.0.0`
- `tailwindcss`: `^3.4.17` → `^4.0.0`

---

## 🎯 Próximas Mejoras Sugeridas

### Prioridad Alta

1. **Completar Migración a shadcn/ui**

   - Migrar los ~21 archivos restantes que usan componentes antiguos
   - Eliminar componentes antiguos (Button.tsx, Input.tsx, TextArea.tsx, Label.tsx) una vez migrados todos

2. **Habilitar TypeScript Strict Mode gradualmente**

   - Empezar con `noImplicitAny: true`
   - Reducir uso de `any` progresivamente
   - Actualizar `target` a `ES2020` o `ES2022`

3. **Crear Error Boundary Global**

   - Manejo centralizado de errores de React
   - Mejor UX en caso de errores

4. **Validación de Variables de Entorno**
   - Crear `src/lib/env.ts` para validar variables requeridas
   - Throw error en build si faltan variables críticas

### Prioridad Media

5. **Reemplazar `<img>` con `<Image />`**

   - Archivos: `Error.tsx`, `Loading.tsx`
   - Mejorar LCP y reducir bandwidth

6. **Implementar `next-seo`**

   - Manejo centralizado de meta tags
   - Open Graph y Twitter Cards automáticos

7. **Optimizar Componentes**

   - Usar `React.memo` donde sea apropiado
   - Lazy loading de componentes pesados

8. **Corregir Warnings de ESLint**
   - Orden de imports en archivos restantes
   - Dependencias faltantes en useEffect/useCallback

### Prioridad Baja

9. **Agregar Testing**

   - Jest + React Testing Library
   - Tests unitarios para hooks críticos
   - Tests de integración para flujos importantes

10. **Documentación**

    - Actualizar README con nuevas versiones
    - Documentar hooks personalizados
    - Guías de contribución

11. **Crear `.env.example`**
    - Documentar todas las variables de entorno necesarias
    - Facilitar onboarding

---

## 📝 Notas Importantes

### Breaking Changes Aplicados

- **Next.js 15:** `params` ahora puede ser una Promise (✅ actualizado)
- **React 19:** Componentes no pueden recibir múltiples parámetros (✅ corregido)
- **findDOMNode:** Eliminado en React 19 (✅ resuelto)
- **Tailwind v4:** Cambio de sintaxis `@tailwind` a `@import "tailwindcss"` (✅ migrado)
- **Auth.js:** Migración completa de Laravel Sanctum client-side (✅ completado)

### Compatibilidad

- ✅ Todas las funciones actualizadas son compatibles con Next.js 15
- ✅ Todos los componentes son compatibles con React 19
- ✅ `useAuth` ahora usa Auth.js pero mantiene API similar
- ✅ Tailwind v4 configurado correctamente
- ✅ shadcn/ui funcionando con Tailwind v4

### Performance

- ✅ QueryClient singleton mejora rendimiento
- ✅ Auth.js mejora gestión de sesiones
- ✅ Eliminación de dependencias reduce bundle size
- ✅ Tailwind v4 mejora tiempo de compilación
- ✅ dayjs es más ligero que date-fns

---

## 🚀 Estado Actual del Proyecto

### ✅ Completado

- [x] Actualización a Next.js 15
- [x] Actualización a React 19
- [x] Actualización a Tailwind CSS 4
- [x] Migración a shadcn/ui (componentes base)
- [x] Migración completa a Auth.js
- [x] QueryClient singleton
- [x] Eliminación de date-fns (todo a dayjs)
- [x] Eliminación de react-datetime-picker
- [x] Configuración de imágenes mejorada
- [x] Limpieza de lógica antigua de Sanctum
- [x] Correcciones de compatibilidad React 19
- [x] Correcciones de ESLint/Prettier (errores críticos)

### ⏳ Pendiente (Próximos Pasos)

- [ ] Completar migración a shadcn/ui (21 archivos restantes)
- [ ] Eliminar componentes antiguos (Button.tsx, Input.tsx, etc.)
- [ ] Habilitar TypeScript strict mode gradualmente
- [ ] Crear Error Boundary global
- [ ] Validación de variables de entorno
- [ ] Reemplazar `<img>` con `<Image />` en Error.tsx y Loading.tsx
- [ ] Corregir warnings de ESLint restantes
- [ ] Implementar next-seo
- [ ] Agregar testing
- [ ] Crear `.env.example`

---

**Última Actualización:** Enero 2026
