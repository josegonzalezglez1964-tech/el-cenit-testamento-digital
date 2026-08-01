# El Cénit · Testamento Digital de Tenerife

&gt; **Protegiendo el legado de Canarias en la era digital**

Plataforma web para la creación, firma y gestión de testamentos digitales con validez probatoria, registro en blockchain (Alastria) y cumplimiento de la Ley 59/2003 de firma electrónica.

---

## ✨ Características

- 📝 **Wizard guiado** — 5 pasos intuitivos (datos personales, herederos, bienes, disposiciones, firma)
- 🔐 **Firma digital** — DNIe / certificado digital con sello de tiempo y eIDAS
- ⛓️ **Blockchain** — Registro inmutable en Alastria con hash único
- 📄 **PDF oficial** — Generación de documento PDF formal con todos los datos
- 📊 **Panel de usuario** — Dashboard para gestionar testamentos firmados y borradores
- 🎥 **Videollamada con notario** — Firma en presencia de notario colegiado (próximamente)
- ♿ **Accesible** — Diseño responsive conforme WCAG 2.1 AA

---

## 🚀 Tecnologías

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| UI | Componentes propios `@el-cenit/ui` |
| Estado | Zustand + persist (localStorage) |
| Auth | NextAuth.js (Credentials) |
| PDF | jsPDF + jspdf-autotable |
| Blockchain | Alastria |
| Monorepo | Turborepo + pnpm workspaces |

---

## 📦 Instalación

```bash
# 1. Clonar
git clone https://github.com/josegonzalezglez1964-tech/el-cenit-testamento-digital.git
cd el-cenit-testamento-digital

# 2. Dependencias
pnpm install

# 3. Variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# 4. Base de datos (si usas Docker/Prisma)
pnpm docker:up
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 5. Arrancar
pnpm dev
