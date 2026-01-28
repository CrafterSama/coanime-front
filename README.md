# CoAnime Dashboard

Este proyecto es el panel de administración y frontend para CoAnime, construido con Next.js, TypeScript y Tailwind CSS.

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Librería UI:** [React 19](https://react.dev/)
- **Estado & Data Fetching:**
  - [TanStack Query v4](https://tanstack.com/query/v4) (Principal)
  - [SWR](https://swr.vercel.app/) (Usado en autenticación)
- **Formularios:** [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup)
- **UI Components:**
  - Headless UI
  - React Select
  - SunEditor (Editor de texto)
  - React Hot Toast (Notificaciones)
- **Utilidades:**
  - Axios (HTTP Client)
  - Date-fns & Dayjs (Manejo de fechas)

## 🚀 Getting Started

### Prerrequisitos

- Node.js (v16 o superior recomendado)
- Yarn o NPM

### Instalación

1. Clonar el repositorio:

   ```bash
   git clone <repo-url>
   cd coanime-front
   ```

2. Instalar dependencias:

   ```bash
   yarn install
   # o
   npm install
   ```

3. Configurar variables de entorno:
   Copia el archivo `.env.example` a `.env` y configura las variables necesarias.
   ```bash
   cp .env.example .env
   ```

### Ejecución

- **Desarrollo:**

  ```bash
  yarn dev
  ```

  El servidor iniciará en `http://localhost:3000`.

- **Producción:**

  ```bash
  yarn build
  yarn start
  ```

- **Linting & Formatting:**
  ```bash
  yarn lint
  yarn format
  ```

## 📂 Estructura del Proyecto

```
src/
├── components/   # Componentes reutilizables de UI
├── constants/    # Constantes globales
├── hoc/          # Higher Order Components
├── hooks/        # Custom React Hooks (incl. useAuth)
├── interface/    # Definiciones de tipos TypeScript
├── lib/          # Configuraciones de librerías (axios, gtag, etc.)
├── pages/        # Rutas de la aplicación (Next.js Pages Router)
├── services/     # Servicios para llamadas a API
├── styles/       # Archivos CSS globales y de componentes
└── utils/        # Funciones de utilidad
```

## 🔍 Auditoría y Posibles Mejoras

Tras analizar el proyecto, se han identificado las siguientes áreas de mejora para optimizar el rendimiento, mantenibilidad y calidad del código:

### 1. Limpieza de Dependencias (High Priority)

- **Librerías Duplicadas:**
  - **Fechas:** Se están usando `date-fns` Y `dayjs`. Recomendación: Estandarizar en una sola (preferiblemente `dayjs` por tamaño o `date-fns` por tree-shaking) y remover la otra.
  - **Data Fetching:** Se usa `swr` (solo en `useAuth`) y `react-query` (en el resto). Recomendación: Migrar la lógica de autenticación a `react-query` para eliminar la dependencia de `swr`.
  - **Selects:** `react-select` está en uso, pero `react-select-search` parece no utilizarse. Verificar y eliminar si es redundante.
  - **Editores:** `suneditor` se usa, pero `@tinymce/tinymce-react` parece estar instalado sin uso. Eliminar si no es necesario.

### 2. Actualización de Tecnologías (Medium Priority)

- **Next.js:** Actualizar a la última versión estable (14.x) para mejoras de rendimiento y seguridad.
- **Tailwind CSS:** Revisar plugins. `@tailwindcss/line-clamp` ya está incluido en Tailwind 3.3+, por lo que el plugin explícito puede eliminarse.

### 3. Calidad de Código y Tipado (Medium Priority)

- **TypeScript:** Mejorar el tipado en hooks como `useAuth` donde se usa inferencia implícita o `any` en algunos props.
- **Estructura de Carpetas:** Evaluar si la estructura actual escala bien. Considerar agrupar por "features" (ej: `features/auth`, `features/posts`) en lugar de por tipo técnico si el proyecto crece.

### 4. Optimización (Low Priority)

- **Imágenes:** Asegurar el uso del componente `next/image` en lugar de etiquetas `<img>` estándar para aprovechar la optimización automática de Next.js.
- **SEO:** Implementar `next-seo` para un manejo centralizado de etiquetas meta, Open Graph, etc.

---

_Generado por Antigravity AI Audit_
