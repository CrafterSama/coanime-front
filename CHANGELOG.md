# Changelog

## [Unreleased]

## 2026-10-25

### Evitar OOM 137 en el build de Forge
- **Fecha:** 2026-10-25
- **Branch:** feature/CACMS7-nextjs-update
- `yarn build` usa heap 2 GB (`NODE_OPTIONS`) y webpack para que Next 16 no mate el deploy con exit 137.

### Next 16, dashboard staff y SunEditor v3
- **Fecha:** 2026-10-25
- **Branch:** feature/CACMS7-nextjs-update
- Next.js 16: Turbopack top-level, `images.qualities`, lint por ESLint CLI, Node `>=20.9`.
- El dashboard queda para administrator, moderator y writer; invitado va a login con `redirect`, el resto a home con toast.
- SunEditor 3 sin `suneditor-react`: `suneditor.create` en cliente, CSS del paquete, upload a `/upload-images` (S3) aceptando `File[]` del modal.
- Badge de estrenos y avatar/portada del perfil dashboard: el badge no desborda y las fotos usan `object-cover`.
