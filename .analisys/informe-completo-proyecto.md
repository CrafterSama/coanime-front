# Informe Completo del Proyecto CoAnime Frontend

**Fecha de creación:** 2026-01-07
**Versión del proyecto:** 1.0.4
**Framework:** Next.js 13.5.4 (Pages Router)
**Propósito:** Frontend y Panel de Administración para CoAnime

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura y Estructura](#arquitectura-y-estructura)
4. [Funcionalidades Principales](#funcionalidades-principales)
5. [APIs y Servicios](#apis-y-servicios)
6. [Autenticación y Autorización](#autenticación-y-autorización)
7. [Interfaces y Tipos](#interfaces-y-tipos)
8. [Componentes Principales](#componentes-principales)
9. [Problemas Identificados](#problemas-identificados)
10. [Mejoras Propuestas](#mejoras-propuestas)
11. [Plan de Migración](#plan-de-migración)

---

## 📖 Descripción General

CoAnime Frontend es una aplicación web completa que combina un **frontend público** para usuarios finales y un **panel de administración (dashboard)** para gestión de contenido. La aplicación está diseñada para ser una plataforma de noticias, información y gestión de contenido relacionado con anime, manga y cultura otaku.

### Características Principales

- **Frontend Público**: Portal web para visualización de artículos, títulos de anime/manga, eventos, personas, revistas y más
- **Panel de Administración**: Dashboard completo para gestión de contenido (CRUD de posts, títulos, personas, eventos, etc.)
- **Sistema de Usuarios**: Autenticación, perfiles, listas personalizadas
- **Búsqueda Avanzada**: Integración con Algolia para búsqueda en tiempo real
- **Integración con APIs Externas**: Jikan API para datos de anime/manga
- **SEO Optimizado**: Meta tags, Open Graph, Twitter Cards
- **Responsive Design**: Diseño adaptable a diferentes dispositivos

---

## 🛠 Stack Tecnológico

### Framework y Lenguaje

- **Next.js 13.5.4** (Pages Router)
  - SSR (Server-Side Rendering)
  - SSG (Static Site Generation) donde aplica
  - API Routes para endpoints internos
- **React 18.2.0**
- **TypeScript 5.1.6** (modo no estricto)

### Estilos y UI

- **Tailwind CSS 3.3.3**
  - Plugins: `@tailwindcss/typography`, `@tailwindcss/forms`
  - Fuente: Red Hat Text
- **Headless UI 1.7.17** - Componentes UI sin estilos
- **Heroicons 2.0.18** - Iconos SVG
- **React Icons 4.11.0** - Librería adicional de iconos
- **Swiper 9.2.4** - Carruseles y sliders

### Estado y Data Fetching

- **TanStack Query (React Query) v4.35.7** - Principal para data fetching
- **SWR 2.2.4** - Solo usado en autenticación (debe migrarse)
- **React Hook Form 7.47.0** - Manejo de formularios
- **Yup 1.3.2** - Validación de esquemas

### HTTP y APIs

- **Axios 1.5.1** - Cliente HTTP
- **camelcase-keys 9.1.0** - Transformación de respuestas
- **snakecase-keys 5.4.7** - Transformación de requests

### Editores y Formularios

- **SunEditor 2.45.1** + **suneditor-react 3.6.1** - Editor WYSIWYG
- **React Select 5.7.7** - Selects avanzados
- **React Tag Input Component 2.0.2** - Input de tags
- **React Datetime Picker 5.5.2** - Selector de fechas

### Utilidades

- **date-fns 2.30.0** - Manejo de fechas (duplicado con dayjs)
- **dayjs 1.11.10** - Manejo de fechas (duplicado con date-fns)
- **classnames 2.3.2** - Utilidad para clases CSS
- **react-hot-toast 2.4.1** - Notificaciones toast
- **nextjs-progressbar 0.0.16** - Barra de progreso de navegación

### Búsqueda

- **Algolia Search 4.20.0** - Motor de búsqueda
- **react-instantsearch-dom 6.40.4** - Componentes de búsqueda

### Otras Librerías

- **Disqus React 1.1.5** - Sistema de comentarios
- **React Charts 3.0.0-beta.55** - Gráficos (usado en dashboard)
- **@react-google-maps/api 2.19.2** - Integración con Google Maps
- **next-auth 4.23.2** - Autenticación (instalado pero uso limitado)

### Herramientas de Desarrollo

- **ESLint 8.45.0** - Linter
- **Prettier 3.0.0** - Formateador de código
- **TypeScript ESLint** - Reglas de TypeScript
- **PostCSS 8.4.26** - Procesador CSS
- **Autoprefixer 10.4.14** - Prefijos CSS

---

## 🏗 Arquitectura y Estructura

### Estructura de Directorios

```
coanime-front/
├── public/                    # Archivos estáticos
│   ├── images/               # Imágenes del sitio
│   └── [iconos y logos]
├── src/
│   ├── components/           # Componentes React
│   │   ├── icons/           # Componentes de iconos (23 archivos)
│   │   ├── Layouts/         # Layouts principales (6 archivos)
│   │   │   ├── AppLayout.tsx      # Layout del dashboard
│   │   │   ├── WebLayout.tsx      # Layout del frontend público
│   │   │   ├── GuestLayout.tsx    # Layout para invitados
│   │   │   ├── Navigation.tsx     # Navegación del dashboard
│   │   │   ├── WebNavigation.tsx  # Navegación pública
│   │   │   └── Footer.tsx         # Footer
│   │   ├── modules/         # Módulos de funcionalidad (43 archivos)
│   │   │   ├── common/      # Componentes comunes
│   │   │   ├── entities/    # Entidades
│   │   │   ├── events/      # Eventos
│   │   │   ├── home/        # Componentes de inicio (8 archivos)
│   │   │   ├── magazine/    # Revistas
│   │   │   ├── people/      # Personas
│   │   │   ├── posts/       # Posts/Artículos (9 archivos)
│   │   │   ├── search/      # Búsqueda
│   │   │   ├── titles/      # Títulos (9 archivos)
│   │   │   └── users/       # Usuarios
│   │   └── ui/              # Componentes UI reutilizables (40 archivos)
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── TextEditor.tsx
│   │       ├── UploadImage.tsx
│   │       ├── Modal.tsx
│   │       ├── Table.tsx
│   │       └── [otros 34 componentes]
│   ├── constants/            # Constantes globales
│   │   ├── common.ts
│   │   ├── menu.tsx          # Menú del dashboard
│   │   └── suneditor.ts      # Configuración del editor
│   ├── hoc/                  # Higher Order Components
│   │   └── Portal/           # Portal para modales
│   ├── hooks/                # Custom React Hooks (13 archivos)
│   │   ├── auth.ts           # Hook de autenticación (usa SWR)
│   │   ├── posts.ts
│   │   ├── titles.ts
│   │   ├── users.ts
│   │   ├── events.ts
│   │   ├── people.ts
│   │   ├── magazine.ts
│   │   ├── categories.ts
│   │   ├── companies.ts
│   │   ├── entities.ts
│   │   ├── dashboard.ts
│   │   ├── images.ts
│   │   └── random-images.ts
│   ├── interface/            # Definiciones de tipos TypeScript
│   │   ├── articles.ts       # Interface Article
│   │   ├── categories.ts     # Interface Category
│   │   ├── tags.ts           # Interface Tag
│   │   ├── titles.ts         # Interface Title
│   │   └── users.ts          # Interface User
│   ├── lib/                  # Configuraciones de librerías
│   │   ├── axios.ts          # Configuración de Axios (CSRF)
│   │   ├── http.ts           # Clientes HTTP (internal/external/auth)
│   │   └── gtag.js           # Google Analytics
│   ├── pages/                # Rutas de Next.js (Pages Router)
│   │   ├── _app.tsx          # App principal (QueryClient, GA)
│   │   ├── _document.tsx     # Document HTML
│   │   ├── index.tsx         # Página de inicio
│   │   ├── login.tsx         # Login
│   │   ├── register.tsx      # Registro
│   │   ├── forgot-password.tsx
│   │   ├── password-reset/[token].tsx
│   │   ├── verify-email.tsx
│   │   ├── perfil/           # Perfil de usuario
│   │   ├── mi-lista/         # Lista personal del usuario
│   │   ├── posts/            # Páginas públicas de posts
│   │   ├── categorias/       # Categorías
│   │   ├── tags/             # Tags
│   │   ├── users/            # Perfiles públicos de usuarios
│   │   ├── eventos/         # Eventos públicos
│   │   ├── ecma/             # Páginas ECMA (entidades, personas, etc.)
│   │   │   ├── entidades/
│   │   │   ├── generos/
│   │   │   ├── personas/
│   │   │   ├── revistas/
│   │   │   └── titulos/
│   │   ├── dashboard/        # Panel de administración
│   │   │   ├── index.tsx     # Dashboard principal
│   │   │   ├── posts/       # CRUD de posts
│   │   │   ├── titles/      # CRUD de títulos
│   │   │   ├── people/      # CRUD de personas
│   │   │   ├── magazine/    # Gestión de revistas
│   │   │   ├── companies/   # Gestión de compañías
│   │   │   ├── events/      # Gestión de eventos
│   │   │   └── profile/      # Perfil del admin
│   │   └── api/              # API Routes de Next.js
│   │       ├── auth/         # Endpoints de autenticación
│   │       └── maps/         # Endpoints de mapas
│   ├── services/            # Servicios para llamadas a API (12 archivos)
│   │   ├── posts.ts
│   │   ├── titles.ts
│   │   ├── users.ts
│   │   ├── events.ts
│   │   ├── people.ts
│   │   ├── magazine.ts
│   │   ├── categories.ts
│   │   ├── tags.ts
│   │   ├── entities.ts
│   │   ├── home.ts
│   │   ├── jikan.ts         # Integración con Jikan API
│   │   └── mapServices.ts
│   ├── styles/              # Archivos CSS
│   │   ├── app.css          # Estilos globales
│   │   ├── algolia.css      # Estilos de búsqueda
│   │   ├── posts.css
│   │   ├── Calendar.css
│   │   ├── Clock.css
│   │   └── DateTimePicker.css
│   └── utils/               # Funciones de utilidad
│       ├── common.ts
│       ├── date.ts
│       ├── scroll.ts
│       └── string.ts
├── .analisys/               # Análisis del proyecto
├── next.config.js           # Configuración de Next.js
├── tailwind.config.js       # Configuración de Tailwind
├── tsconfig.json            # Configuración de TypeScript
├── package.json
└── README.md
```

### Patrones Arquitectónicos

1. **Pages Router de Next.js**: Rutas basadas en archivos en `src/pages/`
2. **Separación de Concerns**:
   - `services/` para lógica de API
   - `hooks/` para lógica de estado
   - `components/` para UI
3. **Layouts Múltiples**: Diferentes layouts para diferentes secciones
4. **Cliente HTTP Centralizado**: Configuración en `lib/http.ts` con múltiples instancias
5. **Transformación de Datos**: snake_case ↔ camelCase automático

---

## 🎯 Funcionalidades Principales

### Frontend Público

#### 1. Página de Inicio (`/`)

- **Top Slider**: Carrusel de posts relevantes
- **Posts Recientes**: Lista de artículos más recientes
- **Broadcast Today**: Animes en emisión hoy (integración con Jikan API)
- **Próximos Estrenos**: Series que estrenarán próximamente
- **Cultura Otaku**: Artículos de cultura occidental y japonesa
- **Otras Noticias**: Listado paginado de artículos
- **SEO**: Meta tags completos, Open Graph, Twitter Cards

#### 2. Gestión de Posts/Artículos

- **Listado de Posts** (`/posts`): Lista paginada de todos los artículos
- **Detalle de Post** (`/posts/[slug]`): Vista completa del artículo
  - Contenido completo
  - Imágenes
  - Tags y categorías
  - Títulos relacionados
  - Sistema de comentarios (Disqus)
  - Contador de visitas

#### 3. Gestión de Títulos (Anime/Manga)

- **Listado por Tipo** (`/ecma/titulos/[type]`):
  - TV, Película, OVA, Especial, ONA, Music
  - Manga, Manhua, Manhwa, Novela Ligera, One-shot, Doujinshi
- **Listado por Género** (`/ecma/generos/[genre]`)
- **Próximos Estrenos** (`/ecma/titulos/estrenos`)
- **Detalle de Título** (`/ecma/titulos/[type]/[title]`):
  - Información completa del título
  - Sinopsis
  - Géneros
  - Imágenes
  - Posts relacionados
  - Trailer (si existe)
  - Fechas de emisión

#### 4. Personas (Seiyuus, Mangakas, etc.)

- **Listado** (`/ecma/personas`)
- **Por País** (`/ecma/personas/pais/[slug]`)
- **Detalle** (`/ecma/personas/[slug]`)

#### 5. Revistas

- **Listado** (`/ecma/revistas`)
- **Por Demografía** (`/ecma/revistas/demografia/[slug]`)
- **Detalle** (`/ecma/revistas/[slug]`)

#### 6. Entidades

- **Listado** (`/ecma/entidades`)
- **Por País** (`/ecma/entidades/pais/[slug]`)
- **Detalle** (`/ecma/entidades/[slug]`)

#### 7. Eventos

- **Listado** (`/eventos`)
- **Por País** (`/eventos/pais/[slug]`)
- **Detalle** (`/eventos/[slug]`)

#### 8. Categorías y Tags

- **Categorías** (`/categorias/[category]`)
- **Tags** (`/tags/[tag]`)

#### 9. Usuarios

- **Perfil Público** (`/users/[slug]`)
- **Perfil Propio** (`/perfil` y `/perfil/edit`)
- **Mi Lista** (`/mi-lista`): Lista personal de títulos del usuario

#### 10. Búsqueda

- **Búsqueda con Algolia**: Búsqueda en tiempo real
- **Búsqueda de Posts**: Búsqueda de artículos
- **Búsqueda de Títulos**: Búsqueda de anime/manga

### Panel de Administración (Dashboard)

#### 1. Dashboard Principal (`/dashboard`)

- **Estadísticas**:
  - Total de artículos
  - Total de títulos
  - Post más visitado
  - Categoría con más posts
- **Accesos rápidos** a las diferentes secciones

#### 2. Gestión de Posts (`/dashboard/posts`)

- **Listado**: Tabla con todos los posts (paginación)
- **Crear Post** (`/dashboard/posts/create`):
  - Editor WYSIWYG (SunEditor)
  - Upload de imágenes
  - Selección de categoría
  - Tags
  - Títulos relacionados
  - Fecha de publicación
  - Estado (borrador/publicado)
- **Editar Post** (`/dashboard/posts/[id]`): Misma funcionalidad que crear
- **Eliminar Post**: Soft delete

#### 3. Gestión de Títulos (`/dashboard/titles`)

- **Listado**: Tabla con todos los títulos
- **Crear Título** (`/dashboard/titles/create`):
  - Información básica (nombre, sinopsis, tipo)
  - Géneros
  - Fechas (emisión, finalización)
  - Upload de imágenes
  - Trailer URL
  - Integración con Jikan API para datos
- **Editar Título** (`/dashboard/titles/[id]`)
- **Eliminar Título**: Soft delete

#### 4. Gestión de Personas (`/dashboard/people`)

- **Listado**: Tabla con todas las personas
- **Crear Persona** (`/dashboard/people/create`)
- **Editar Persona** (`/dashboard/people/[id]`)

#### 5. Gestión de Revistas (`/dashboard/magazine`)

- **Listado y gestión** de revistas

#### 6. Gestión de Compañías (`/dashboard/companies`)

- **Listado y gestión** de compañías

#### 7. Gestión de Eventos (`/dashboard/events`)

- **Listado y gestión** de eventos
- **Integración con Google Maps** para ubicaciones

#### 8. Perfil de Administrador (`/dashboard/profile`)

- Edición de perfil personal

### Sistema de Autenticación

- **Login** (`/login`)
- **Registro** (`/register`)
- **Recuperación de Contraseña** (`/forgot-password`)
- **Reset de Contraseña** (`/password-reset/[token]`)
- **Verificación de Email** (`/verify-email`)
- **Logout**
- **Protección de Rutas**: Middleware para rutas protegidas
- **CSRF Protection**: Tokens CSRF en todas las requests

---

## 🔌 APIs y Servicios

### Clientes HTTP

El proyecto utiliza **tres instancias de Axios** configuradas en `src/lib/http.ts`:

1. **`httpClient`**: Para endpoints internos (`/internal`)

   - Usado en el dashboard
   - Transformación snake_case ↔ camelCase
   - Interceptores para manejo de errores 401

2. **`httpClientExternal`**: Para endpoints externos (`/external`)

   - Usado en el frontend público
   - Transformación snake_case ↔ camelCase

3. **`httpClientAuth`**: Para endpoints de autenticación (`/`)
   - Login, registro, logout, etc.

### Servicios Principales

#### Posts (`src/services/posts.ts`)

```typescript
-postCreate(params) -
  postUpdate(id, params) -
  postDelete(id) -
  getArticleData(slug) -
  getArticlesData({ page }) -
  getArticlesJapan({ page }) -
  getPosts({ page });
```

#### Títulos (`src/services/titles.ts`)

```typescript
-getAllTitles() -
  getTitles({ page }) -
  getUpcomingTitles({ page }) -
  getTitlesByType({ type, page }) -
  getTitlesByGenre({ genre, page }) -
  getTitle({ type, title }) -
  getRandomImageByTitle({ title }) -
  titleCreate(params) -
  titleUpdate(id, params) -
  getUserTitleList({ page });
```

#### Usuarios (`src/services/users.ts`)

```typescript
-getUser();
```

#### Eventos (`src/services/events.ts`)

```typescript
-getEvents({ page }) -
  getEventsByCountry({ country, page }) -
  getEvent({ slug });
```

#### Personas (`src/services/people.ts`)

```typescript
-getPeople({ page }) -
  getPeopleByCountry({ country, page }) -
  getPerson({ slug });
```

#### Revistas (`src/services/magazine.ts`)

```typescript
-getMagazines({ page }) -
  getMagazine({ slug }) -
  getMagazinesByDemography({ demography, page });
```

#### Home (`src/services/home.ts`)

```typescript
-getHomeData() -
  getBroadcastToday() - // Integración con Jikan API
  getSeriesSoon(); // Integración con Jikan API
```

#### Jikan API (`src/services/jikan.ts`)

```typescript
-getJikanAnime({ type, title }) - getJikanManga({ type, title });
```

### Integraciones Externas

1. **Jikan API** (`https://api.jikan.moe/v4/`)

   - Datos de anime y manga
   - Schedules (programación)
   - Búsqueda de títulos

2. **Algolia Search**

   - Búsqueda en tiempo real
   - Indexación de contenido

3. **Google Maps API**

   - Ubicaciones de eventos
   - Mapas interactivos

4. **Disqus**

   - Sistema de comentarios en posts

5. **Google Analytics**
   - Tracking de páginas
   - Eventos personalizados

### Variables de Entorno Requeridas

```env
NEXT_PUBLIC_BACKEND_URL=          # URL base de la API backend
NEXT_PUBLIC_GA_ID=            # Google Analytics Tracking ID
ALGOLIA_APP_ID=               # Algolia Application ID
ALGOLIA_SECRET=               # Algolia Search API Key
```

---

## 🔐 Autenticación y Autorización

### Sistema de Autenticación

El proyecto utiliza **Laravel Sanctum** en el backend para autenticación basada en cookies.

#### Hook `useAuth` (`src/hooks/auth.ts`)

**Funcionalidades:**

- `login({ setErrors, setStatus, ...props })`: Inicio de sesión
- `register({ setErrors, ...props })`: Registro de usuario
- `logout(redirect?)`: Cierre de sesión
- `forgotPassword({ setErrors, setStatus, email })`: Recuperación de contraseña
- `resetPassword({ setErrors, setStatus, ...props })`: Reset de contraseña
- `resendEmailVerification({ setStatus })`: Reenvío de verificación
- `user`: Estado del usuario actual (vía SWR)

**Middleware:**

- `middleware: 'auth'`: Requiere autenticación
- `middleware: 'guest'`: Solo para usuarios no autenticados

**Rutas Protegidas:**

```typescript
const securePaths = [
  'dashboard',
  'dashboard/posts',
  'dashboard/titles',
  'dashboard/events',
  'dashboard/companies',
  'dashboard/users',
  'dashboard/people',
  'perfil',
  'mi-lista',
];
```

#### CSRF Protection

- Token CSRF obtenido de cookies (`XSRF-TOKEN`)
- Agregado automáticamente a todas las requests en `src/lib/axios.ts`
- Endpoint `/sanctum/csrf-cookie` para obtener el token

#### Autorización

- **Roles de Usuario**: Sistema de roles (detectado en código)
- **Permisos**: Verificación de permisos con `hasRole()` utility
- **Protección de Componentes**: `AdminPermissions` component

---

## 📝 Interfaces y Tipos

### Article (`src/interface/articles.ts`)

```typescript
interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  categoryId: number;
  postponedTo: string;
  approved: string;
  userId: number;
  editedBy: number;
  video: string | null;
  draft: string | number;
  viewCounter: number;
  postCreatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categories: Category;
  tags: Tag[];
  titles: Title[];
  users: User;
}
```

### Title (`src/interface/titles.ts`)

```typescript
interface Title {
  id: number;
  name: string;
  slug: string;
  sinopsis: string;
  otherTitles: string;
  episodies: number | null;
  status: string;
  broadTime: string | null;
  broadFinish: string | null;
  publicTime: string | null;
  justYear: string | boolean | null;
  trailerUrl: string | null;
  ratingId: number;
  typeId: number;
  userId: number;
  editedBy: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  type: { id: number; name: string; slug: string };
  genres: any[];
  images: { id: number; titleId: number; name: string | null };
  posts: Article[];
  users: User;
  pivot: { postId: number; titleId: number };
}
```

### User (`src/interface/users.ts`)

```typescript
interface User {
  id: number;
  name: string | null;
  username: string | null;
  email: string | null;
  slug: string | null;
  bio: string | null;
  birthday: string | null;
  genre: number;
  profilePhotoPath: string | null;
  profileCoverPath: string | null;
  coverPhotoPath: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  youtube: string | null;
  tiktok: string | null;
  // ... más redes sociales
  emailVerifiedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}
```

### Category (`src/interface/categories.ts`)

```typescript
interface Category {
  id: number;
  name: string;
  slug: string;
}
```

### Tag (`src/interface/tags.ts`)

```typescript
interface Tag {
  id: number;
  name: string;
  slug: string;
  postId: number;
  tagId: number;
  pivot: { postId: number; tagId: number };
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}
```

---

## 🧩 Componentes Principales

### Layouts

1. **AppLayout**: Layout del dashboard con sidebar y navegación
2. **WebLayout**: Layout del frontend público con header y footer
3. **GuestLayout**: Layout para páginas de invitados (login, register)

### Componentes UI (40 componentes)

**Formularios:**

- `Button`, `Input`, `TextArea`, `Select`, `Checkbox`, `ToggleCheckbox`
- `Form`, `FormHeader`, `Label`
- `TextEditor` (SunEditor wrapper)
- `UploadImage`

**Navegación:**

- `NavLink`, `ResponsiveNavLink`, `MenuLink`, `Dropdown`, `DropdownLink`

**Feedback:**

- `Loading`, `Alert`, `Errors`, `AuthValidationErrors`
- `Modal`, `Tabs`

**Datos:**

- `Table`, `Paginator`, `RowRender`
- `ItemInfo`, `ImageDetails`

**Layout:**

- `Section`, `SectionHeader`, `SectionTitle`
- `FlexLayout`, `Aside`

**Otros:**

- `ApplicationLogo`, `AuthCard`, `AuthSessionStatus`
- `CloudLinks`, `Icon`, `Show`, `Text`

### Módulos de Funcionalidad

#### Home (8 componentes)

- `TopSlider`: Carrusel principal
- `RecentPosts`: Posts recientes
- `BroadcastToday`: Animes en emisión
- `UpcomingSeries`: Próximos estrenos
- `OtherNews`: Otras noticias

#### Posts (9 componentes)

- Componentes para listado, detalle, cards, etc.

#### Titles (9 componentes)

- Componentes para listado, detalle, cards, etc.

#### Search

- `AlgoliaSearch`: Componente de búsqueda con Algolia
- `SearchBox`: Caja de búsqueda personalizada

---

## ⚠️ Problemas Identificados

### 🔴 Críticos

1. **Error de Sintaxis en `tailwind.config.js`**

   - Falta la propiedad `plugins:` en la línea 19
   - **Impacto**: Tailwind puede no funcionar correctamente
   - **Solución**:

   ```javascript
   plugins: [
     require('@tailwindcss/typography'),
     require('@tailwindcss/forms')({
       strategy: 'class',
     }),
   ],
   ```

2. **TypeScript Strict Mode Deshabilitado**

   - `strict: false` en `tsconfig.json`
   - **Impacto**: 138 ocurrencias de `any`, menos seguridad de tipos
   - **Recomendación**: Habilitar gradualmente

3. **Uso de `document.cookie` sin verificación SSR**
   - En `src/lib/axios.ts:17-20`
   - **Impacto**: Puede causar errores en SSR
   - **Solución**:
   ```typescript
   if (typeof window !== 'undefined') {
     const token = document.cookie
       .split('; ')
       .find((row) => row.startsWith('XSRF-TOKEN='))
       ?.split('=')[1];
   }
   ```

### 🟠 Alta Prioridad

4. **Dependencias Duplicadas**

   - `date-fns` y `dayjs` (ambos en uso)
   - `swr` y `@tanstack/react-query` (swr solo en auth)
   - `react-select-search` (posiblemente no usado)
   - `@tinymce/tinymce-react` (no usado, solo suneditor)

5. **Next.js Desactualizado**

   - Versión 13.5.4 (actual: 14.x)
   - **Beneficios de actualizar**: Mejoras de rendimiento, Server Actions, mejor App Router

6. **Manejo de Errores Inconsistente**

   - Diferentes patrones en diferentes partes
   - No hay logging centralizado
   - Errores no manejados pueden causar crashes

7. **Console.logs en Producción**
   - 8 ocurrencias encontradas
   - **Impacto**: Información sensible en consola

### 🟡 Media Prioridad

8. **Configuración de TypeScript Subóptima**

   - `target: "es5"` (muy antiguo)
   - Falta `noUnusedLocals`, `noUnusedParameters`

9. **Falta `.env.example`**

   - Mencionado en README pero no existe

10. **Plugin de Tailwind Redundante**

    - `@tailwindcss/line-clamp` ya incluido en Tailwind 3.3+

11. **QueryClient Creado en Cada Render**

    - En `src/pages/_app.tsx:35`
    - Mejor práctica: crear fuera del componente

12. **Falta Validación de Variables de Entorno**
    - No hay validación al inicio de la app

### 🟢 Baja Prioridad

13. **Optimización de Imágenes**

    - No todos los lugares usan `next/image`

14. **SEO**

    - Meta tags manuales, podría usar `next-seo`

15. **Testing**

    - No hay tests implementados

16. **Documentación de Código**

    - Falta JSDoc en funciones públicas

17. **Performance Monitoring**

    - Solo Google Analytics básico

18. **Accesibilidad (a11y)**
    - No auditado

---

## 🚀 Mejoras Propuestas

### Mejoras Inmediatas (Semana 1-2)

1. **Corregir `tailwind.config.js`**

```javascript
plugins: [
  require('@tailwindcss/typography'),
  require('@tailwindcss/forms')({
    strategy: 'class',
  }),
],
```

2. **Eliminar `console.log` de producción**

   - Reemplazar con sistema de logging apropiado

3. **Mejorar manejo de errores en `axios.ts`**

```typescript
if (typeof window !== 'undefined') {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  // ...
}
```

### Mejoras de Limpieza (Semana 3-4)

4. **Estandarizar librería de fechas**

   - Opción A: Mantener `dayjs` (más ligero)
   - Opción B: Mantener `date-fns` (mejor tree-shaking)
   - **Recomendación**: `dayjs` por simplicidad y tamaño

5. **Migrar `useAuth` de SWR a React Query**

   - Unificar estrategia de data fetching
   - Reducir bundle size

6. **Eliminar dependencias no usadas**

   - `@tinymce/tinymce-react`
   - `react-select-search` (verificar primero)
   - `@tailwindcss/line-clamp`

7. **Crear `.env.example`**

```env
NEXT_PUBLIC_BACKEND_URL=https://api.coanime.net
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
ALGOLIA_APP_ID=your_app_id
ALGOLIA_SECRET=your_search_key
```

### Mejoras de Actualización (Mes 2)

8. **Actualizar Next.js a 14.x**

   - Revisar breaking changes
   - Actualizar APIs obsoletas
   - Aprovechar nuevas características

9. **Habilitar TypeScript Strict Mode gradualmente**

   - Empezar con `noImplicitAny: true`
   - Reducir uso de `any` progresivamente
   - Actualizar `target` a `ES2020` o `ES2022`

10. **Sistema centralizado de manejo de errores**

    - Error boundary global
    - Interceptor de errores en Axios
    - Utilidad para formatear errores
    - Logging estructurado

11. **Validación de variables de entorno**

```typescript
// src/lib/env.ts
const requiredEnvVars = {
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = requiredEnvVars;
```

### Mejoras de Optimización (Mes 3+)

12. **Optimizar QueryClient**

```typescript
// Crear fuera del componente
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30000,
    },
  },
});
```

13. **Implementar `next-seo`**

    - Manejo centralizado de meta tags
    - Open Graph y Twitter Cards automáticos

14. **Auditar y optimizar imágenes**

    - Reemplazar todos los `<img>` con `next/image`
    - Configurar dominios permitidos

15. **Agregar testing**

    - Jest + React Testing Library
    - Tests unitarios para componentes críticos
    - Tests de integración para flujos principales

16. **Mejorar documentación**

    - JSDoc en funciones públicas
    - Documentación de componentes
    - Guías de contribución

17. **Implementar error tracking**

    - Sentry o LogRocket
    - Monitoreo de errores en producción

18. **Auditar accesibilidad**
    - ESLint plugin `jsx-a11y`
    - Auditoría con herramientas
    - Mejorar navegación por teclado

### Mejoras Arquitectónicas (Futuro)

19. **Considerar migración a App Router** (Next.js 13+)

    - Mejor rendimiento
    - Server Components
    - Mejor SEO
    - **Nota**: Requiere refactorización significativa

20. **Estructura por Features** (si el proyecto crece)

```
src/
├── features/
│   ├── auth/
│   ├── posts/
│   ├── titles/
│   └── dashboard/
└── shared/
```

21. **State Management**

    - Considerar Zustand o Jotai si el estado global crece
    - Actualmente React Query es suficiente

22. **Optimización de Bundle**
    - Code splitting más agresivo
    - Lazy loading de componentes pesados
    - Análisis de bundle size

---

## 📋 Plan de Migración

### Fase 1: Preparación (Semana 1)

**Objetivo**: Corregir errores críticos y preparar el proyecto

1. ✅ Corregir `tailwind.config.js`
2. ✅ Eliminar `console.log` de producción
3. ✅ Mejorar manejo de errores en `axios.ts`
4. ✅ Crear `.env.example`
5. ✅ Documentar todas las variables de entorno

**Resultado**: Proyecto estable sin errores críticos

### Fase 2: Limpieza (Semana 2-3)

**Objetivo**: Eliminar dependencias duplicadas y código innecesario

1. ✅ Estandarizar librería de fechas (elegir `dayjs` o `date-fns`)
2. ✅ Migrar `useAuth` de SWR a React Query
3. ✅ Eliminar dependencias no usadas
4. ✅ Eliminar plugin redundante de Tailwind
5. ✅ Optimizar QueryClient

**Resultado**: Bundle más pequeño, código más limpio

### Fase 3: Actualización (Semana 4-6)

**Objetivo**: Actualizar dependencias principales

1. ✅ Actualizar Next.js a 14.x
   - Revisar breaking changes
   - Actualizar APIs
   - Probar todas las funcionalidades
2. ✅ Actualizar otras dependencias
   - React Query a v5 (si aplica)
   - Otras dependencias menores
3. ✅ Habilitar TypeScript strict mode gradualmente
   - Empezar con reglas específicas
   - Corregir errores progresivamente

**Resultado**: Proyecto con dependencias actualizadas

### Fase 4: Mejoras de Calidad (Semana 7-10)

**Objetivo**: Mejorar calidad de código y experiencia de desarrollo

1. ✅ Sistema centralizado de manejo de errores
2. ✅ Validación de variables de entorno
3. ✅ Implementar `next-seo`
4. ✅ Optimizar imágenes
5. ✅ Agregar JSDoc a funciones públicas
6. ✅ Mejorar documentación

**Resultado**: Código más mantenible y documentado

### Fase 5: Testing y Monitoreo (Semana 11-12)

**Objetivo**: Agregar testing y monitoreo

1. ✅ Configurar Jest + React Testing Library
2. ✅ Escribir tests para componentes críticos
3. ✅ Implementar error tracking (Sentry)
4. ✅ Configurar CI/CD si no existe
5. ✅ Auditar accesibilidad

**Resultado**: Proyecto con testing y monitoreo

### Fase 6: Optimización (Ongoing)

**Objetivo**: Optimizaciones continuas

1. ✅ Análisis de bundle size
2. ✅ Code splitting optimizado
3. ✅ Performance monitoring
4. ✅ SEO improvements
5. ✅ Considerar migración a App Router (futuro)

**Resultado**: Proyecto optimizado y escalable

---

## 🎯 Checklist de Migración a Proyecto Nuevo

### Pre-Migración

- [ ] Documentar todas las funcionalidades actuales
- [ ] Listar todas las dependencias y su propósito
- [ ] Documentar todas las APIs y endpoints
- [ ] Crear diagrama de flujo de autenticación
- [ ] Documentar estructura de datos
- [ ] Listar todas las variables de entorno

### Durante la Migración

- [ ] Configurar nuevo proyecto con stack actualizado
- [ ] Migrar componentes UI uno por uno
- [ ] Migrar servicios y hooks
- [ ] Migrar páginas y rutas
- [ ] Configurar autenticación
- [ ] Configurar integraciones externas (Algolia, Jikan, etc.)
- [ ] Migrar estilos y temas
- [ ] Configurar SEO

### Post-Migración

- [ ] Testing completo de todas las funcionalidades
- [ ] Verificar integraciones externas
- [ ] Optimización de performance
- [ ] Documentación actualizada
- [ ] Training del equipo

---

## 📊 Métricas del Proyecto Actual

### Código

- **Archivos TypeScript/TSX**: ~150+ archivos
- **Componentes UI**: 40 componentes
- **Módulos de funcionalidad**: 43 archivos
- **Hooks personalizados**: 13 hooks
- **Servicios**: 12 servicios
- **Páginas**: 50+ páginas

### Dependencias

- **Dependencias de producción**: 38
- **Dependencias de desarrollo**: 25
- **Total**: 63 dependencias

### Problemas

- **Uso de `any`**: 138 ocurrencias en 58 archivos
- **Console.logs**: 8 ocurrencias
- **Errores de sintaxis**: 1 (tailwind.config.js)
- **Dependencias duplicadas**: 4 pares identificados

### Configuración

- **TypeScript strict mode**: ❌ Deshabilitado
- **ESLint configurado**: ✅ Sí
- **Prettier configurado**: ✅ Sí
- **Archivo .env.example**: ❌ No existe

---

## 🔗 Integraciones Externas

### APIs Externas

1. **Backend API** (`NEXT_PUBLIC_BACKEND_URL`)

   - Endpoints internos: `/internal/*`
   - Endpoints externos: `/external/*`
   - Autenticación: Laravel Sanctum

2. **Jikan API** (`https://api.jikan.moe/v4/`)

   - Datos de anime y manga
   - Schedules (programación diaria)
   - Búsqueda

3. **Algolia Search**

   - Búsqueda en tiempo real
   - Indexación de contenido

4. **Google Maps API**

   - Mapas para eventos
   - Geocoding

5. **Disqus**

   - Comentarios en posts

6. **Google Analytics**
   - Tracking de páginas
   - Eventos

### Servicios de Almacenamiento

- **AWS S3** (`coanime.s3.us-east-2.amazonaws.com`)
  - Almacenamiento de imágenes
  - Archivos estáticos

---

## 📝 Notas Finales

Este proyecto es una aplicación completa y funcional con una base sólida. Las mejoras propuestas son principalmente para:

- **Mantenibilidad**: Reducir dependencias duplicadas, mejorar tipado
- **Rendimiento**: Actualizar dependencias, optimizar código
- **Calidad**: Mejorar manejo de errores, agregar testing
- **Developer Experience**: Mejor documentación, herramientas

La mayoría de las mejoras son incrementales y pueden implementarse gradualmente sin afectar la funcionalidad actual.

### Prioridades para Nuevo Proyecto

1. **Usar Next.js 14+ con App Router** (si es posible)
2. **TypeScript strict mode desde el inicio**
3. **Una sola librería de fechas** (recomendado: `dayjs`)
4. **React Query para todo el data fetching**
5. **Sistema de manejo de errores desde el inicio**
6. **Testing desde el principio**
7. **Documentación continua**

---

**Generado por**: Análisis completo del proyecto CoAnime Frontend
**Última actualización**: 2026-01-07
**Versión del documento**: 1.0.0
