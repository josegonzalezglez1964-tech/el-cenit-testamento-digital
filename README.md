# ð# ð#  #l CÃ©nit Â·# ð# ð#ent# Digital de Tenerife

**Protegiendo el legado de Canarias en la era digital** **ProtegiendðŸš**Protegiendo el legrincipal**Protegiendo el legado de Canarias en la era digital** **ProtegiendðŸš**Proca **Protegiendo el legado de Canaro l**Protegiendo el legado de Canarias en la era digital** **ProtegiendðŸš**Protegiendo el legrincipal**Protegiendo el legado de Canarias en la era digital** **ProtegiendðŸš**Proca **Protegiendo el legado de Canaro l**Protegiendo el legado de Canarias en la era digital** **ProtegiendðŸšegistro blockchain
- ðŸ‘¥ Test- ðŸ‘¥ Test- ðŸ‘¥ Test- ðŸ‘¥ Test- ðŸ‘¥ Tes
------------------------------lockchain (Alastria)
- ðŸ“± DiseÃ±o responsive accesible (WCAG 2.1 AA)

## ðŸ“¦ InstalaciÃ³n

```bash
git clone https://github.com/tu-orggit clone https://githugital.git
cd el-cenit-testamento-digital
pnpm install
cp .env.example .env
pnpm docker:up
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev

---

## ðŸ“‹ PASO 3: ConfiguraciÃ³n de Next.js

Copia y pega:

```bash
cd ~/proyectos/el-cenit-testamento-digital

# apps/web/package.json
cat > apps/web/package.json << 'EOF'
{
  "name": "@el-cenit/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@el-cenit/ui": "workspace:*",
    "@el-cenit/shared-types": "workspace:*",
    "@el-cenit/firma-electronica": "workspace:*",
    "@el-cenit/blockchain": "workspace:*",
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next-auth": "^4.24.5",
    "@auth/prisma-adapter": "^1.0.9",
    "@prisma/client": "^5.7.0",
    "zustand": "^4.4.7",
    "@tanstack/react-query": "^5.13.0",
    "@tanstack/react-table": "^8.10.7",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.294.0",    "lucide-react": "^0.294.0",    "lt-dropzone": "^14.2.3",
    "    "    "    "    "    "    "    "   eer":     "    "    "    "et.io-client": "^4.7.2",
    "qrcode.react"    "qrcode.react"    "qr": "^2.10.3",
    "sonner": "^1.2.4",
    "tailwind-merge": "^2.2.0",
    "clsx": "^2.0.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "    "@types/react-dom": imple-peer"    "@types/react-dom": "    "@types/rea
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "@tail    "@tail    "@ta0.5.    "@tail    "@tdcss/ty    "@tail    "@tail,
    "eslint": "^8.55.0",
    "eslint-config-next": "14.0.4"
  }
}
