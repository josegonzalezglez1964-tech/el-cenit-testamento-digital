#!/bin/bash
# =============================================================================
# SCRIPT CORREGIDO - Cenit Testamento Digital
# Usa Python embebido para evitar problemas con caracteres especiales
# =============================================================================

set -e

PROJECT_NAME="el-cenit-testamento-digital"
PARENT_DIR="$(pwd)"

echo "🚀 Creando proyecto: $PROJECT_NAME"
echo "📍 Ubicación: $PARENT_DIR/$PROJECT_NAME"
echo ""

# Verificar que no exista ya
if [ -d "$PROJECT_NAME" ]; then
    echo "❌ Error: La carpeta $PROJECT_NAME ya existe. Bórrala primero."
    exit 1
fi

mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"
PROJECT_ROOT="$(pwd)"

# =============================================================================
# PYTHON EMBEBIDO: Crea toda la estructura
# =============================================================================

python3 << 'PYEOF'
import os
import json

root = os.getcwd()

# --- 1. DIRECTORIOS ---
dirs = [
    ".github/workflows",
    "apps/web/app/(auth)/login",
    "apps/web/app/(auth)/registro",
    "apps/web/app/(dashboard)/testamento/nuevo",
    "apps/web/app/(dashboard)/testamento/[id]/editar",
    "apps/web/app/(dashboard)/herederos",
    "apps/web/app/(dashboard)/bienes",
    "apps/web/app/(dashboard)/firma",
    "apps/web/app/api/auth/[...nextauth]",
    "apps/web/app/api/testamento",
    "apps/web/app/api/firma",
    "apps/web/app/api/webhook/notario",
    "apps/web/components/ui",
    "apps/web/components/auth",
    "apps/web/components/testamento",
    "apps/web/components/firma",
    "apps/web/components/dashboard",
    "apps/web/components/layout",
    "apps/web/hooks",
    "apps/web/lib/validators",
    "apps/web/types",
    "apps/web/public/images/icons",
    "apps/web/public/fonts",
    "apps/web/styles",
    "apps/notario-panel/src/components",
    "apps/notario-panel/src/pages",
    "apps/notario-panel/src/stores",
    "apps/notario-panel/src/api",
    "packages/ui/src/components",
    "packages/ui/src/tokens",
    "packages/ui/src/theme",
    "packages/blockchain/src/contracts",
    "packages/blockchain/src/types",
    "packages/firma-electronica/src",
    "packages/shared-types/src",
    "services/api/src/auth/strategies",
    "services/api/src/auth/guards",
    "services/api/src/testamento/entities",
    "services/api/src/testamento/dto",
    "services/api/src/heredero",
    "services/api/src/bien",
    "services/api/src/firma",
    "services/api/src/notario",
    "services/api/src/blockchain",
    "services/api/src/videollamada",
    "services/api/src/common/filters",
    "services/api/src/common/interceptors",
    "services/api/src/common/pipes",
    "services/api/src/common/decorators",
    "services/api/src/config",
    "services/api/test",
    "services/worker/src/processors",
    "infrastructure/docker",
    "infrastructure/k8s/namespaces",
    "infrastructure/k8s/deployments",
    "infrastructure/k8s/services",
    "infrastructure/k8s/ingress",
    "infrastructure/k8s/configmaps",
    "infrastructure/k8s/secrets",
    "infrastructure/terraform",
    "infrastructure/scripts",
    "docs/diagrams",
    "database/migrations",
    "database/seeds",
]

for d in dirs:
    os.makedirs(os.path.join(root, d), exist_ok=True)

print("✅ Directorios creados")

# --- 2. ARCHIVOS RAIZ ---
files = {}

files["package.json"] = json.dumps({
    "name": "el-cenit-testamento-digital",
    "version": "1.0.0",
    "private": True,
    "description": "Plataforma digital para testamentos con firma electronica, blockchain y videollamada certificada",
    "scripts": {
        "build": "turbo run build",
        "dev": "turbo run dev",
        "lint": "turbo run lint",
        "test": "turbo run test",
        "format": "prettier --write \"**/*.{ts,tsx,md}\"",
        "typecheck": "turbo run typecheck",
        "docker:up": "docker-compose -f infrastructure/docker/docker-compose.yml up -d",
        "docker:down": "docker-compose -f infrastructure/docker/docker-compose.yml down"
    },
    "devDependencies": {
        "@types/node": "^20.10.0",
        "prettier": "^3.1.0",
        "turbo": "^1.11.0",
        "typescript": "^5.3.0"
    },
    "engines": {
        "node": ">=18.0.0",
        "pnpm": ">=8.0.0"
    },
    "packageManager": "pnpm@8.12.0"
}, indent=2)

files["turbo.json"] = json.dumps({
    "$schema": "https://turbo.build/schema.json",
    "globalDependencies": ["**/.env.*local"],
    "pipeline": {
        "build": {
            "dependsOn": ["^build"],
            "outputs": [".next/**", "!.next/cache/**", "dist/**"]
        },
        "dev": {"cache": False, "persistent": True},
        "lint": {"dependsOn": ["^build"]},
        "test": {"dependsOn": ["^build"]},
        "typecheck": {"dependsOn": ["^build"]}
    }
}, indent=2)

files["pnpm-workspace.yaml"] = 'packages:\n  - "apps/*"\n  - "packages/*"\n  - "services/*"\n'

files["tsconfig.json"] = json.dumps({
    "compilerOptions": {
        "target": "ES2022",
        "lib": ["dom", "dom.iterable", "ES2022"],
        "allowJs": True,
        "skipLibCheck": True,
        "strict": True,
        "noEmit": True,
        "esModuleInterop": True,
        "module": "esnext",
        "moduleResolution": "bundler",
        "resolveJsonModule": True,
        "isolatedModules": True,
        "jsx": "preserve",
        "incremental": True,
        "paths": {
            "@/*": ["./*"],
            "@cenit/ui": ["./packages/ui/src"],
            "@cenit/blockchain": ["./packages/blockchain/src"],
            "@cenit/firma": ["./packages/firma-electronica/src"],
            "@cenit/shared-types": ["./packages/shared-types/src"]
        }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
}, indent=2)

files[".gitignore"] = """node_modules/
.next/
out/
dist/
build/
.turbo/
.env
.env.local
.env.*.local
.vscode/
.idea/
.DS_Store
*.log
coverage/
*.pem
.vercel
"""

files[".env.example"] = """DATABASE_URL="postgresql://user:password@localhost:5432/cenit_db"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
BLOCKCHAIN_RPC_URL="https://rpc.alastria.io"
BLOCKCHAIN_PRIVATE_KEY=""
BLOCKCHAIN_CONTRACT_ADDRESS=""
FIRMA_URL="https://firma.electronica.gob.es"
DNIe_ENABLED=true
CLAVE_ENABLED=true
"""

files[".env.local.example"] = """NEXTAUTH_SECRET="dev-secret-change-in-production"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cenit_dev"
"""

files["LICENSE"] = """MIT License

Copyright (c) 2024 Cenit Testamento Digital

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
"""

# --- 3. APPS/WEB ---
files["apps/web/package.json"] = json.dumps({
    "name": "@cenit/web",
    "version": "1.0.0",
    "private": True,
    "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint",
        "typecheck": "tsc --noEmit"
    },
    "dependencies": {
        "next": "^14.0.4",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "next-auth": "^4.24.5",
        "@tanstack/react-query": "^5.13.0",
        "axios": "^1.6.2",
        "zustand": "^4.4.7",
        "react-hook-form": "^7.49.0",
        "zod": "^3.22.4",
        "@hookform/resolvers": "^3.3.2",
        "class-variance-authority": "^0.7.0",
        "clsx": "^2.0.0",
        "tailwind-merge": "^2.2.0",
        "lucide-react": "^0.294.0",
        "date-fns": "^3.0.0",
        "framer-motion": "^10.16.0"
    },
    "devDependencies": {
        "@types/react": "^18.2.45",
        "@types/react-dom": "^18.2.18",
        "@types/node": "^20.10.0",
        "typescript": "^5.3.0",
        "tailwindcss": "^3.4.0",
        "postcss": "^8.4.32",
        "autoprefixer": "^10.4.16",
        "eslint": "^8.56.0",
        "eslint-config-next": "^14.0.4"
    }
}, indent=2)

files["apps/web/tsconfig.json"] = json.dumps({
    "extends": "../../tsconfig.json",
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["./*"],
            "@cenit/ui": ["../../packages/ui/src"],
            "@cenit/shared-types": ["../../packages/shared-types/src"]
        }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
}, indent=2)

files["apps/web/next.config.js"] = '''/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  images: { domains: ['localhost'] },
  async rewrites() {
    return [{
      source: '/api/:path*',
      destination: `${process.env.API_URL || 'http://localhost:3001'}/:path*`,
    }];
  },
};
module.exports = nextConfig;
'''

files["apps/web/tailwind.config.ts"] = '''import type { Config } from 'tailwindcss';
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cenit: { navy: '#1e3a5f', gold: '#c9a227', cream: '#faf8f5' },
      },
      fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
export default config;
'''

files["apps/web/postcss.config.js"] = '''module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
'''

files["apps/web/app/globals.css"] = '''@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-inter: 'Inter', system-ui, sans-serif;
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 201 96% 32%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 201 96% 32%;
    --radius: 0.5rem;
  }
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
'''

files["apps/web/app/layout.tsx"] = '''import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Cenit - Testamento Digital',
  description: 'Plataforma segura para crear y gestionar testamentos digitales',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
'''

files["apps/web/app/providers.tsx"] = """'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
"""

files["apps/web/app/page.tsx"] = """import Link from 'next/link';

export default function Home() {
  return (
    <main className=\"min-h-screen bg-cenit-cream\">
      <nav className=\"flex items-center justify-between px-8 py-6\">
        <div className=\"text-2xl font-bold text-cenit-navy\">Cenit</div>
        <div className=\"flex gap-4\">
          <Link href=\"/login\" className=\"px-4 py-2 text-cenit-navy hover:underline\">Iniciar sesion</Link>
          <Link href=\"/registro\" className=\"rounded-lg bg-cenit-navy px-4 py-2 text-white hover:bg-cenit-navy/90\">Registrarse</Link>
        </div>
      </nav>
      <section className=\"flex flex-col items-center justify-center px-4 py-24 text-center\">
        <h1 className=\"max-w-4xl text-5xl font-bold leading-tight text-cenit-navy\">Tu testamento digital con validez legal</h1>
        <p className=\"mt-6 max-w-2xl text-lg text-gray-600\">Crea, firma y almacena tu testamento de forma segura.</p>
        <div className=\"mt-10 flex gap-4\">
          <Link href=\"/registro\" className=\"rounded-lg bg-cenit-gold px-8 py-3 font-semibold text-cenit-navy hover:bg-cenit-gold/90\">Comenzar ahora</Link>
          <Link href=\"/login\" className=\"rounded-lg border-2 border-cenit-navy px-8 py-3 font-semibold text-cenit-navy hover:bg-cenit-navy/5\">Ya tengo cuenta</Link>
        </div>
      </section>
    </main>
  );
}
"""

files["apps/web/app/(auth)/layout.tsx"] = """export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=\"flex min-h-screen items-center justify-center bg-cenit-cream\">
      <div className=\"w-full max-w-md rounded-2xl bg-white p-8 shadow-lg\">{children}</div>
    </div>
  );
}
"""

files["apps/web/app/(auth)/login/page.tsx"] = """'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [method, setMethod] = useState<'dnie' | 'clave'>('dnie');
  return (
    <div className=\"space-y-6\">
      <div className=\"text-center\">
        <h1 className=\"text-2xl font-bold text-cenit-navy\">Iniciar sesion</h1>
        <p className=\"mt-2 text-sm text-gray-500\">Accede a tu testamento digital</p>
      </div>
      <div className=\"flex rounded-lg bg-gray-100 p-1\">
        <button onClick={() => setMethod('dnie')} className={`flex-1 rounded-md py-2 text-sm font-medium transition ${method === 'dnie' ? 'bg-white shadow text-cenit-navy' : 'text-gray-500'}`}>DNIe</button>
        <button onClick={() => setMethod('clave')} className={`flex-1 rounded-md py-2 text-sm font-medium transition ${method === 'clave' ? 'bg-white shadow text-cenit-navy' : 'text-gray-500'}`}>Cl@ve PIN</button>
      </div>
      <form className=\"space-y-4\">
        <div>
          <label className=\"block text-sm font-medium text-gray-700\">DNI / NIE</label>
          <input type=\"text\" placeholder=\"12345678A\" className=\"mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cenit-navy focus:outline-none focus:ring-1 focus:ring-cenit-navy\" />
        </div>
        <button type=\"submit\" className=\"w-full rounded-lg bg-cenit-navy py-2.5 font-semibold text-white hover:bg-cenit-navy/90\">{method === 'dnie' ? 'Acceder con DNIe' : 'Acceder con Cl@ve'}</button>
      </form>
      <p className=\"text-center text-sm text-gray-500\">No tienes cuenta? <Link href=\"/registro\" className=\"text-cenit-navy hover:underline\">Registrate</Link></p>
    </div>
  );
}
"""

files["apps/web/app/(auth)/registro/page.tsx"] = """'use client';
import Link from 'next/link';

export default function RegistroPage() {
  return (
    <div className=\"space-y-6\">
      <div className=\"text-center\">
        <h1 className=\"text-2xl font-bold text-cenit-navy\">Crear cuenta</h1>
        <p className=\"mt-2 text-sm text-gray-500\">Registrate para crear tu testamento digital</p>
      </div>
      <form className=\"space-y-4\">
        <div><label className=\"block text-sm font-medium text-gray-700\">Nombre completo</label><input type=\"text\" className=\"mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cenit-navy focus:outline-none focus:ring-1 focus:ring-cenit-navy\" /></div>
        <div><label className=\"block text-sm font-medium text-gray-700\">DNI / NIE</label><input type=\"text\" placeholder=\"12345678A\" className=\"mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cenit-navy focus:outline-none focus:ring-1 focus:ring-cenit-navy\" /></div>
        <div><label className=\"block text-sm font-medium text-gray-700\">Email</label><input type=\"email\" className=\"mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cenit-navy focus:outline-none focus:ring-1 focus:ring-cenit-navy\" /></div>
        <button type=\"submit\" className=\"w-full rounded-lg bg-cenit-navy py-2.5 font-semibold text-white hover:bg-cenit-navy/90\">Crear cuenta</button>
      </form>
      <p className=\"text-center text-sm text-gray-500\">Ya tienes cuenta? <Link href=\"/login\" className=\"text-cenit-navy hover:underline\">Inicia sesion</Link></p>
    </div>
  );
}
"""

files["apps/web/app/(dashboard)/layout.tsx"] = """import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=\"flex h-screen bg-gray-50\">
      <Sidebar />
      <div className=\"flex flex-1 flex-col\">
        <Navbar />
        <main className=\"flex-1 overflow-y-auto p-8\">{children}</main>
      </div>
    </div>
  );
}
"""

files["apps/web/app/(dashboard)/page.tsx"] = """import { StatCards } from '@/components/dashboard/StatCards';
import { TestamentList } from '@/components/dashboard/TestamentList';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';

export default function DashboardPage() {
  return (
    <div className=\"space-y-8\">
      <div>
        <h1 className=\"text-3xl font-bold text-cenit-navy\">Panel de control</h1>
        <p className=\"mt-1 text-gray-500\">Gestiona tus testamentos y herederos</p>
      </div>
      <StatCards />
      <div className=\"grid grid-cols-1 gap-8 lg:grid-cols-3\">
        <div className=\"lg:col-span-2\"><TestamentList /></div>
        <div><ActivityTimeline /></div>
      </div>
    </div>
  );
}
"""

files["apps/web/app/(dashboard)/testamento/page.tsx"] = """import Link from 'next/link';

export default function TestamentosPage() {
  return (
    <div className=\"space-y-6\">
      <div className=\"flex items-center justify-between\">
        <div>
          <h1 className=\"text-2xl font-bold text-cenit-navy\">Mis Testamentos</h1>
          <p className=\"text-gray-500\">Gestiona tus testamentos digitales</p>
        </div>
        <Link href=\"/testamento/nuevo\" className=\"rounded-lg bg-cenit-navy px-4 py-2 text-white hover:bg-cenit-navy/90\">+ Nuevo testamento</Link>
      </div>
      <div className=\"rounded-xl border bg-white p-8 text-center\">
        <p className=\"text-gray-500\">No tienes testamentos creados todavia.</p>
        <Link href=\"/testamento/nuevo\" className=\"mt-4 inline-block rounded-lg bg-cenit-gold px-6 py-2 font-medium text-cenit-navy\">Crear mi primer testamento</Link>
      </div>
    </div>
  );
}
"""

files["apps/web/app/(dashboard)/testamento/nuevo/page.tsx"] = """'use client';
import { useState } from 'react';
const steps = ['Identidad', 'Herederos', 'Bienes', 'Disposiciones', 'Firma'];

export default function NuevoTestamentoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <div className=\"mx-auto max-w-3xl space-y-8\">
      <div>
        <h1 className=\"text-2xl font-bold text-cenit-navy\">Nuevo Testamento</h1>
        <p className=\"text-gray-500\">Completa los pasos para crear tu testamento digital</p>
      </div>
      <div className=\"flex items-center justify-between\">
        {steps.map((step, index) => (
          <div key={step} className=\"flex flex-1 items-center\">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${index <= currentStep ? 'bg-cenit-navy text-white' : 'bg-gray-200 text-gray-500'}`}>{index + 1}</div>
            <span className=\"ml-2 hidden text-sm font-medium sm:inline\">{step}</span>
            {index < steps.length - 1 && <div className={`mx-4 h-1 flex-1 ${index < currentStep ? 'bg-cenit-navy' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>
      <div className=\"rounded-xl border bg-white p-8\">
        <h2 className=\"text-lg font-semibold text-cenit-navy\">{steps[currentStep]}</h2>
        <p className=\"mt-2 text-gray-500\">Contenido del paso {currentStep + 1}...</p>
        <div className=\"mt-8 flex justify-between\">
          <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className=\"rounded-lg border px-4 py-2 disabled:opacity-50\">Anterior</button>
          <button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} className=\"rounded-lg bg-cenit-navy px-4 py-2 text-white\">{currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}</button>
        </div>
      </div>
    </div>
  );
}
"""

files["apps/web/app/(dashboard)/testamento/[id]/page.tsx"] = """export default function TestamentoDetallePage({ params }: { params: { id: string } }) {
  return (
    <div className=\"space-y-6\">
      <h1 className=\"text-2xl font-bold text-cenit-navy\">Testamento #{params.id}</h1>
      <p className=\"text-gray-500\">Detalle del testamento...</p>
    </div>
  );
}
"""

files["apps/web/app/(dashboard)/testamento/[id]/editar/page.tsx"] = """export default function EditarTestamentoPage({ params }: { params: { id: string } }) {
  return (
    <div className=\"space-y-6\">
      <h1 className=\"text-2xl font-bold text-cenit-navy\">Editar Testamento #{params.id}</h1>
    </div>
  );
}
"""

files["apps/web/app/(dashboard)/herederos/page.tsx"] = """export default function HerederosPage() {
  return <div className=\"space-y-6\"><h1 className=\"text-2xl font-bold text-cenit-navy\">Herederos</h1><p className=\"text-gray-500\">Gestiona los herederos de tu testamento</p></div>;
}
"""

files["apps/web/app/(dashboard)/bienes/page.tsx"] = """export default function BienesPage() {
  return <div className=\"space-y-6\"><h1 className=\"text-2xl font-bold text-cenit-navy\">Bienes</h1><p className=\"text-gray-500\">Inventario de bienes y activos</p></div>;
}
"""

files["apps/web/app/(dashboard)/firma/page.tsx"] = """export default function FirmaPage() {
  return <div className=\"space-y-6\"><h1 className=\"text-2xl font-bold text-cenit-navy\">Firma Digital</h1><p className=\"text-gray-500\">Firma tu testamento electronicamente</p></div>;
}
"""

# API Routes
files["apps/web/app/api/auth/[...nextauth]/route.ts"] = """import NextAuth from 'next-auth';
const handler = NextAuth({ providers: [], session: { strategy: 'jwt' } });
export { handler as GET, handler as POST };
"""

files["apps/web/app/api/testamento/route.ts"] = """import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ testamentos: [] }); }
export async function POST(request: Request) { const body = await request.json(); return NextResponse.json({ id: '1', ...body }, { status: 201 }); }
"""

files["apps/web/app/api/firma/route.ts"] = """import { NextResponse } from 'next/server';
export async function POST() { return NextResponse.json({ status: 'signed', timestamp: new Date().toISOString() }); }
"""

files["apps/web/app/api/webhook/notario/route.ts"] = """import { NextResponse } from 'next/server';
export async function POST(request: Request) { const payload = await request.json(); console.log('Webhook notario:', payload); return NextResponse.json({ received: true }); }
"""

# Lib
files["apps/web/lib/utils.ts"] = """import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
"""

files["apps/web/lib/constants.ts"] = """export const APP_NAME = 'Cenit';
export const APP_VERSION = '1.0.0';
export const LEGITIMA_PORCENTAJE = 0.33;
export const TERCIO_LIBRE_PORCENTAJE = 0.33;
export const TERCIO_MEJORA_PORCENTAJE = 0.34;
export const ESTADOS_TESTAMENTO = { BORRADOR: 'borrador', PENDIENTE_FIRMA: 'pendiente_firma', FIRMADO: 'firmado', REGISTRADO: 'registrado', COMPLETADO: 'completado' } as const;
"""

files["apps/web/lib/api-client.ts"] = """import axios from 'axios';
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
"""

# Types
files["apps/web/types/auth.ts"] = """export interface User { id: string; dni: string; nombre: string; apellidos: string; email: string; emailVerified?: Date; createdAt: Date; }
export interface Session { user: User; expires: string; }
"""

files["apps/web/types/testamento.ts"] = """export interface Testamento { id: string; titulo: string; estado: 'borrador' | 'pendiente_firma' | 'firmado' | 'registrado' | 'completado'; contenido: string; testadorId: string; herederos: string[]; bienes: string[]; createdAt: Date; updatedAt: Date; firmadoAt?: Date; hashBlockchain?: string; }
"""

files["apps/web/types/heredero.ts"] = """export interface Heredero { id: string; nombre: string; apellidos: string; dni: string; parentesco: string; porcentaje: number; email?: string; telefono?: string; }
"""

files["apps/web/types/bien.ts"] = """export interface Bien { id: string; tipo: 'inmueble' | 'cuenta_bancaria' | 'vehiculo' | 'joya' | 'accion' | 'otro'; descripcion: string; valorEstimado?: number; ubicacion?: string; documentos?: string[]; }
"""

files["apps/web/types/firma.ts"] = """export interface Firma { id: string; testamentoId: string; firmanteId: string; tipo: 'electronica' | 'biometrica' | 'videollamada'; hash: string; selloTiempo: Date; certificado?: string; }
"""

files["apps/web/types/notario.ts"] = """export interface Notario { id: string; numeroColegiado: string; nombre: string; colegioNotarial: string; email: string; }
"""

# Validators
files["apps/web/lib/validators/testamento.schema.ts"] = """import { z } from 'zod';
export const testamentoSchema = z.object({ titulo: z.string().min(5, 'El titulo debe tener al menos 5 caracteres'), contenido: z.string().min(50, 'El contenido debe tener al menos 50 caracteres'), herederos: z.array(z.string().uuid()).min(1, 'Debe haber al menos un heredero') });
export type TestamentoInput = z.infer<typeof testamentoSchema>;
"""

files["apps/web/lib/validators/heredero.schema.ts"] = """import { z } from 'zod';
export const herederoSchema = z.object({ nombre: z.string().min(2), apellidos: z.string().min(2), dni: z.string().regex(/^[0-9]{8}[A-Z]$/, 'DNI invalido'), parentesco: z.string().min(1), porcentaje: z.number().min(0).max(100), email: z.string().email().optional() });
export type HerederoInput = z.infer<typeof herederoSchema>;
"""

files["apps/web/lib/validators/bien.schema.ts"] = """import { z } from 'zod';
export const bienSchema = z.object({ tipo: z.enum(['inmueble', 'cuenta_bancaria', 'vehiculo', 'joya', 'accion', 'otro']), descripcion: z.string().min(5), valorEstimado: z.number().positive().optional(), ubicacion: z.string().optional() });
export type BienInput = z.infer<typeof bienSchema>;
"""

# Hooks
files["apps/web/hooks/useAuth.ts"] = """'use client';
import { useQuery } from '@tanstack/react-query';
export function useAuth() { const { data: user, isLoading } = useQuery({ queryKey: ['auth'], queryFn: async () => null }); return { user, isLoading, isAuthenticated: !!user }; }
"""

files["apps/web/hooks/useTestamento.ts"] = """'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Testamento } from '@/types/testamento';
export function useTestamentos() { return useQuery<Testamento[]>({ queryKey: ['testamentos'], queryFn: async () => { const { data } = await apiClient.get('/testamentos'); return data; } }); }
export function useCrearTestamento() { return useMutation({ mutationFn: async (testamento: Partial<Testamento>) => { const { data } = await apiClient.post('/testamentos', testamento); return data; } }); }
"""

files["apps/web/hooks/useFirma.ts"] = """'use client';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
export function useFirmarTestamento() { return useMutation({ mutationFn: async (testamentoId: string) => { const { data } = await apiClient.post(`/testamentos/${testamentoId}/firmar`); return data; } }); }
"""

files["apps/web/hooks/useNotificacion.ts"] = """'use client';
import { useState, useCallback } from 'react';
interface Notificacion { id: string; mensaje: string; tipo: 'success' | 'error' | 'info'; }
export function useNotificacion() { const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]); const mostrar = useCallback((mensaje: string, tipo: Notificacion['tipo'] = 'info') => { const id = Math.random().toString(36).slice(2); setNotificaciones((prev) => [...prev, { id, mensaje, tipo }]); setTimeout(() => { setNotificaciones((prev) => prev.filter((n) => n.id !== id)); }, 5000); }, []); return { notificaciones, mostrar }; }
"""

files["apps/web/hooks/useVideollamada.ts"] = """'use client';
import { useState, useCallback } from 'react';
export function useVideollamada() { const [isConnected, setIsConnected] = useState(false); const [isRecording, setIsRecording] = useState(false); const iniciar = useCallback(() => setIsConnected(true), []); const finalizar = useCallback(() => { setIsConnected(false); setIsRecording(false); }, []); const toggleRecording = useCallback(() => setIsRecording((prev) => !prev), []); return { isConnected, isRecording, iniciar, finalizar, toggleRecording }; }
"""

# UI Components
files["apps/web/components/ui/button.tsx"] = """import * as React from 'react';
import { cn } from '@/lib/utils';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'default' | 'outline' | 'ghost' | 'destructive'; size?: 'default' | 'sm' | 'lg'; }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'default', size = 'default', ...props }, ref) => (
  <button ref={ref} className={cn('inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cenit-navy disabled:pointer-events-none disabled:opacity-50', variant === 'default' && 'bg-cenit-navy text-white hover:bg-cenit-navy/90', variant === 'outline' && 'border border-gray-300 bg-white hover:bg-gray-50', variant === 'ghost' && 'hover:bg-gray-100', variant === 'destructive' && 'bg-red-600 text-white hover:bg-red-700', size === 'default' && 'h-10 px-4 py-2', size === 'sm' && 'h-8 px-3 text-sm', size === 'lg' && 'h-12 px-6 text-lg', className)} {...props} />
));
Button.displayName = 'Button';
export { Button };
"""

files["apps/web/components/ui/input.tsx"] = """import * as React from 'react';
import { cn } from '@/lib/utils';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn('flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-cenit-navy focus:outline-none focus:ring-1 focus:ring-cenit-navy disabled:cursor-not-allowed disabled:opacity-50', className)} ref={ref} {...props} />
));
Input.displayName = 'Input';
export { Input };
"""

files["apps/web/components/ui/card.tsx"] = """import * as React from 'react';
import { cn } from '@/lib/utils';
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} className={cn('rounded-xl border bg-white shadow-sm', className)} {...props} />); Card.displayName = 'Card';
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />); CardHeader.displayName = 'CardHeader';
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => <h3 ref={ref} className={cn('font-semibold leading-none tracking-tight', className)} {...props} />); CardTitle.displayName = 'CardTitle';
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />); CardContent.displayName = 'CardContent';
export { Card, CardHeader, CardTitle, CardContent };
"""

files["apps/web/components/ui/dialog.tsx"] = """import * as React from 'react';
import { cn } from '@/lib/utils';
const DialogContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} });
export function Dialog({ children }: { children: React.ReactNode }) { const [open, setOpen] = React.useState(false); return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>; }
export function DialogTrigger({ children }: { children: React.ReactNode }) { const { setOpen } = React.useContext(DialogContext); return <div onClick={() => setOpen(true)}>{children}</div>; }
export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) { const { open, setOpen } = React.useContext(DialogContext); if (!open) return null; return <div className=\"fixed inset-0 z-50 flex items-center justify-center bg-black/50\"><div className={cn('rounded-xl bg-white p-6 shadow-lg', className)}>{children}<button onClick={() => setOpen(false)} className=\"mt-4 text-sm text-gray-500\">Cerrar</button></div></div>; }
"""

files["apps/web/components/ui/stepper.tsx"] = """import { cn } from '@/lib/utils';
interface StepperProps { steps: string[]; currentStep: number; }
export function Stepper({ steps, currentStep }: StepperProps) { return <div className=\"flex items-center justify-between\">{steps.map((step, index) => (<div key={step} className=\"flex flex-1 items-center\"><div className={cn('flex h-10 w-10 items-center justify-center rounded-full font-semibold', index <= currentStep ? 'bg-cenit-navy text-white' : 'bg-gray-200 text-gray-500')}>{index + 1}</div><span className=\"ml-2 hidden text-sm font-medium sm:inline\">{step}</span>{index < steps.length - 1 && <div className={cn('mx-4 h-1 flex-1', index < currentStep ? 'bg-cenit-navy' : 'bg-gray-200')} />}</div>))}</div>; }
"""

files["apps/web/components/ui/toast.tsx"] = """import { cn } from '@/lib/utils';
interface ToastProps { message: string; type?: 'success' | 'error' | 'info'; onClose?: () => void; }
export function Toast({ message, type = 'info', onClose }: ToastProps) { return <div className={cn('rounded-lg px-4 py-3 text-sm font-medium shadow-lg', type === 'success' && 'bg-green-100 text-green-800', type === 'error' && 'bg-red-100 text-red-800', type === 'info' && 'bg-blue-100 text-blue-800')}>{message}{onClose && <button onClick={onClose} className=\"ml-4 text-xs underline\">Cerrar</button>}</div>; }
"""

files["apps/web/components/ui/tooltip.tsx"] = """import { useState, ReactNode } from 'react';
interface TooltipProps { children: ReactNode; content: string; }
export function Tooltip({ children, content }: TooltipProps) { const [visible, setVisible] = useState(false); return <div className=\"relative inline-block\"><div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>{children}</div>{visible && <div className=\"absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white\">{content}</div>}</div>; }
"""

# Layout
files["apps/web/components/layout/Navbar.tsx"] = """'use client';
import { NotificationBell } from './NotificationBell';
export function Navbar() { return <header className=\"flex h-16 items-center justify-between border-b bg-white px-8\"><h2 className=\"text-lg font-semibold text-cenit-navy\">Cenit</h2><div className=\"flex items-center gap-4\"><NotificationBell /><div className=\"h-8 w-8 rounded-full bg-cenit-navy text-white flex items-center justify-center text-sm font-medium\">U</div></div></header>; }
"""

files["apps/web/components/layout/Sidebar.tsx"] = """'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
const navItems = [{ href: '/', label: 'Dashboard', icon: 'D' }, { href: '/testamento', label: 'Testamentos', icon: 'T' }, { href: '/herederos', label: 'Herederos', icon: 'H' }, { href: '/bienes', label: 'Bienes', icon: 'B' }, { href: '/firma', label: 'Firma Digital', icon: 'F' }];
export function Sidebar() { const pathname = usePathname(); return <aside className=\"flex w-64 flex-col border-r bg-white\"><div className=\"flex h-16 items-center px-6\"><span className=\"text-xl font-bold text-cenit-navy\">Cenit</span></div><nav className=\"flex-1 space-y-1 px-4 py-4\">{navItems.map((item) => (<Link key={item.href} href={item.href} className={cn('flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition', pathname === item.href ? 'bg-cenit-navy text-white' : 'text-gray-600 hover:bg-gray-100')}><span className=\"flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-xs font-bold text-gray-700\">{item.icon}</span>{item.label}</Link>))}</nav></aside>; }
"""

files["apps/web/components/layout/Footer.tsx"] = """export function Footer() { return <footer className=\"border-t bg-white py-6 text-center text-sm text-gray-500\">&copy; 2024 Cenit Testamento Digital. Todos los derechos reservados.</footer>; }
"""

files["apps/web/components/layout/Breadcrumbs.tsx"] = """'use client';
import Link from 'next/link';
interface BreadcrumbItem { label: string; href?: string; }
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) { return <nav className=\"flex items-center gap-2 text-sm text-gray-500\">{items.map((item, index) => (<span key={item.label} className=\"flex items-center gap-2\">{index > 0 && <span>/</span>}{item.href ? <Link href={item.href} className=\"hover:text-cenit-navy\">{item.label}</Link> : <span className=\"text-gray-900\">{item.label}</span>}</span>))}</nav>; }
"""

files["apps/web/components/layout/NotificationBell.tsx"] = """'use client';
import { useState } from 'react';
export function NotificationBell() { const [count] = useState(2); return <button className=\"relative rounded-lg p-2 hover:bg-gray-100\"><svg className=\"h-5 w-5 text-gray-600\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9\" /></svg>{count > 0 && <span className=\"absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white\">{count}</span>}</button>; }
"""

# Dashboard
files["apps/web/components/dashboard/StatCards.tsx"] = """import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const stats = [{ label: 'Testamentos', value: '0', color: 'text-cenit-navy' }, { label: 'Herederos', value: '0', color: 'text-cenit-gold' }, { label: 'Bienes registrados', value: '0', color: 'text-green-600' }, { label: 'Firmas pendientes', value: '0', color: 'text-orange-600' }];
export function StatCards() { return <div className=\"grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4\">{stats.map((stat) => (<Card key={stat.label}><CardHeader className=\"flex flex-row items-center justify-between pb-2\"><CardTitle className=\"text-sm font-medium text-gray-500\">{stat.label}</CardTitle></CardHeader><CardContent><div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div></CardContent></Card>))}</div>; }
"""

files["apps/web/components/dashboard/TestamentList.tsx"] = """import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
export function TestamentList() { return <Card><CardHeader><CardTitle>Ultimos Testamentos</CardTitle></CardHeader><CardContent><p className=\"text-sm text-gray-500\">No hay testamentos registrados todavia.</p></CardContent></Card>; }
"""

files["apps/web/components/dashboard/ActivityTimeline.tsx"] = """import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
export function ActivityTimeline() { return <Card><CardHeader><CardTitle>Actividad reciente</CardTitle></CardHeader><CardContent><p className=\"text-sm text-gray-500\">Sin actividad reciente.</p></CardContent></Card>; }
"""

# Auth
files["apps/web/components/auth/DNIeReader.tsx"] = """'use client';
export function DNIeReader() { return <div className=\"rounded-lg border border-dashed border-gray-300 p-8 text-center\"><p className=\"text-gray-500\">Inserta tu DNIe en el lector</p><p className=\"mt-2 text-sm text-gray-400\">Asegurate de tener el lector conectado</p></div>; }
"""

files["apps/web/components/auth/ClavePINForm.tsx"] = """'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export function ClavePINForm() { return <form className=\"space-y-4\"><div><label className=\"block text-sm font-medium text-gray-700\">DNI / NIE</label><Input placeholder=\"12345678A\" /></div><div><label className=\"block text-sm font-medium text-gray-700\">Contrasena Cl@ve</label><Input type=\"password\" /></div><Button className=\"w-full\">Acceder con Cl@ve</Button></form>; }
"""

files["apps/web/components/auth/BiometricCheck.tsx"] = """'use client';
export function BiometricCheck() { return <div className=\"rounded-lg border border-dashed border-gray-300 p-8 text-center\"><p className=\"text-gray-500\">Verificacion biometrica</p><p className=\"mt-2 text-sm text-gray-400\">Usa tu huella dactilar o reconocimiento facial</p></div>; }
"""

# Testamento
files["apps/web/components/testamento/WizardContainer.tsx"] = """'use client';
import { ReactNode } from 'react';
interface WizardContainerProps { children: ReactNode; currentStep: number; totalSteps: number; }
export function WizardContainer({ children, currentStep, totalSteps }: WizardContainerProps) { return <div className=\"space-y-6\"><div className=\"h-2 w-full rounded-full bg-gray-200\"><div className=\"h-2 rounded-full bg-cenit-navy transition-all\" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }} /></div>{children}</div>; }
"""

files["apps/web/components/testamento/StepIdentidad.tsx"] = """export function StepIdentidad() { return <div className=\"space-y-4\"><h3 className=\"text-lg font-semibold\">Verificacion de identidad</h3><p className=\"text-gray-500\">Confirma tus datos personales para continuar.</p></div>; }
"""

files["apps/web/components/testamento/StepHerederos.tsx"] = """export function StepHerederos() { return <div className=\"space-y-4\"><h3 className=\"text-lg font-semibold\">Herederos</h3><p className=\"text-gray-500\">Anade los herederos de tu testamento.</p></div>; }
"""

files["apps/web/components/testamento/StepBienes.tsx"] = """export function StepBienes() { return <div className=\"space-y-4\"><h3 className=\"text-lg font-semibold\">Bienes y activos</h3><p className=\"text-gray-500\">Inventaria tus bienes para distribuirlos.</p></div>; }
"""

files["apps/web/components/testamento/StepDisposiciones.tsx"] = """export function StepDisposiciones() { return <div className=\"space-y-4\"><h3 className=\"text-lg font-semibold\">Disposiciones especiales</h3><p className=\"text-gray-500\">Anade disposiciones adicionales.</p></div>; }
"""

files["apps/web/components/testamento/StepFirma.tsx"] = """export function StepFirma() { return <div className=\"space-y-4\"><h3 className=\"text-lg font-semibold\">Firma del testamento</h3><p className=\"text-gray-500\">Firma electronicamente tu testamento.</p></div>; }
"""

files["apps/web/components/testamento/HerederoCard.tsx"] = """import { Card, CardContent } from '@/components/ui/card';
import type { Heredero } from '@/types/heredero';
interface HerederoCardProps { heredero: Heredero; }
export function HerederoCard({ heredero }: HerederoCardProps) { return <Card><CardContent className=\"p-4\"><div className=\"flex items-center justify-between\"><div><p className=\"font-medium\">{heredero.nombre} {heredero.apellidos}</p><p className=\"text-sm text-gray-500\">{heredero.parentesco}</p></div><span className=\"rounded-full bg-cenit-navy/10 px-3 py-1 text-sm font-medium text-cenit-navy\">{heredero.porcentaje}%</span></div></CardContent></Card>; }
"""

files["apps/web/components/testamento/BienForm.tsx"] = """'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export function BienForm() { return <form className=\"space-y-4\"><div><label className=\"block text-sm font-medium\">Tipo de bien</label><select className=\"mt-1 w-full rounded-lg border border-gray-300 px-3 py-2\"><option>Inmueble</option><option>Cuenta bancaria</option><option>Vehiculo</option><option>Joya</option><option>Acciones</option><option>Otro</option></select></div><div><label className=\"block text-sm font-medium\">Descripcion</label><Input placeholder=\"Descripcion del bien\" /></div><div><label className=\"block text-sm font-medium\">Valor estimado (EUR)</label><Input type=\"number\" placeholder=\"0,00\" /></div><Button type=\"submit\">Anadir bien</Button></form>; }
"""

files["apps/web/components/testamento/CalculadoraLegitima.tsx"] = """'use client';
import { useState } from 'react';
import { LEGITIMA_PORCENTAJE, TERCIO_LIBRE_PORCENTAJE, TERCIO_MEJORA_PORCENTAJE } from '@/lib/constants';
export function CalculadoraLegitima() { const [patrimonio, setPatrimonio] = useState(''); const valor = parseFloat(patrimonio) || 0; return <div className=\"rounded-xl border bg-white p-6\"><h3 className=\"text-lg font-semibold text-cenit-navy\">Calculadora de Legitima</h3><div className=\"mt-4\"><label className=\"block text-sm font-medium\">Patrimonio total (EUR)</label><input type=\"number\" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)} className=\"mt-1 w-full rounded-lg border px-3 py-2\" placeholder=\"0,00\" /></div><div className=\"mt-4 space-y-2\"><div className=\"flex justify-between text-sm\"><span>Legitima ({(LEGITIMA_PORCENTAJE * 100).toFixed(0)}%)</span><span className=\"font-medium\">EUR {(valor * LEGITIMA_PORCENTAJE).toLocaleString()}</span></div><div className=\"flex justify-between text-sm\"><span>Tercio de mejora ({(TERCIO_MEJORA_PORCENTAJE * 100).toFixed(0)}%)</span><span className=\"font-medium\">EUR {(valor * TERCIO_MEJORA_PORCENTAJE).toLocaleString()}</span></div><div className=\"flex justify-between text-sm\"><span>Tercio libre ({(TERCIO_LIBRE_PORCENTAJE * 100).toFixed(0)}%)</span><span className=\"font-medium\">EUR {(valor * TERCIO_LIBRE_PORCENTAJE).toLocaleString()}</span></div></div></div>; }
"""

files["apps/web/components/testamento/PreviewDocumento.tsx"] = """export function PreviewDocumento() { return <div className=\"rounded-xl border bg-gray-50 p-8\"><div className=\"mx-auto max-w-lg space-y-6 bg-white p-8 shadow-sm\"><div className=\"text-center\"><h2 className=\"text-xl font-bold uppercase\">Testamento</h2><p className=\"text-sm text-gray-500\">Vista previa del documento</p></div><div className=\"space-y-4 text-sm\"><p>Yo, D./Dna. _______________, mayor de edad, con DNI _______________,</p><p>declaro que este es mi testamento...</p></div></div></div>; }
"""

# Firma
files["apps/web/components/firma/FirmaElectronica.tsx"] = """'use client';
import { Button } from '@/components/ui/button';
export function FirmaElectronica() { return <div className=\"space-y-4\"><h3 className=\"text-lg font-semibold\">Firma Electronica</h3><p className=\"text-gray-500\">Firma tu testamento con certificado digital.</p><Button>Firmar con certificado</Button></div>; }
"""

files["apps/web/components/firma/SelloTiempo.tsx"] = """export function SelloTiempo() { return <div className=\"rounded-lg border bg-gray-50 p-4\"><p className=\"text-sm font-medium\">Sello de tiempo</p><p className=\"text-xs text-gray-500\">Timestamp: {new Date().toISOString()}</p></div>; }
"""

files["apps/web/components/firma/TestigoDigital.tsx"] = """export function TestigoDigital() { return <div className=\"space-y-2\"><p className=\"text-sm font-medium\">Testigo digital</p><p className=\"text-xs text-gray-500\">Hash del documento: 0x...</p></div>; }
"""

files["apps/web/components/firma/VideollamadaCertificada.tsx"] = """'use client';
import { Button } from '@/components/ui/button';
import { useVideollamada } from '@/hooks/useVideollamada';
export function VideollamadaCertificada() { const { isConnected, iniciar, finalizar } = useVideollamada(); return <div className=\"space-y-4\"><h3 className=\"text-lg font-semibold\">Videollamada certificada</h3><p className=\"text-gray-500\">Realiza una videollamada con el notario.</p>{!isConnected ? <Button onClick={iniciar}>Iniciar videollamada</Button> : <div className=\"space-y-2\"><div className=\"aspect-video rounded-lg bg-gray-900\" /><Button variant=\"destructive\" onClick={finalizar}>Finalizar</Button></div>}</div>; }
"""

# Public & Styles
files["apps/web/styles/variables.css"] = """:root { --color-navy: #1e3a5f; --color-gold: #c9a227; --color-cream: #faf8f5; }
"""

# --- 4. PACKAGES ---
files["packages/ui/package.json"] = json.dumps({ "name": "@cenit/ui", "version": "1.0.0", "main": "./src/index.ts", "types": "./src/index.ts", "dependencies": { "react": "^18.2.0" }, "devDependencies": { "@types/react": "^18.2.45", "typescript": "^5.3.0" } }, indent=2)
files["packages/ui/src/index.ts"] = "export * from './components';\n"
files["packages/ui/src/components/.gitkeep"] = ""
files["packages/ui/src/tokens/.gitkeep"] = ""
files["packages/ui/src/theme/.gitkeep"] = ""

files["packages/blockchain/package.json"] = json.dumps({ "name": "@cenit/blockchain", "version": "1.0.0", "main": "./src/index.ts", "types": "./src/index.ts", "dependencies": { "ethers": "^6.9.0", "typescript": "^5.3.0" } }, indent=2)
files["packages/blockchain/src/index.ts"] = "export { BlockchainClient } from './client';\n"
files["packages/blockchain/src/client.ts"] = "export class BlockchainClient { async connect() { console.log('Connecting to Alastria...'); } async registerTestament(hash: string) { return { txHash: '0x...', blockNumber: 1 }; } }\n"
files["packages/blockchain/src/contracts/TestamentoRegistry.sol"] = """// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
contract TestamentoRegistry {
  mapping(bytes32 => bool) public testamentos;
  event TestamentoRegistrado(bytes32 indexed hash, uint256 timestamp);
  function registrar(bytes32 hash) public {
    testamentos[hash] = true;
    emit TestamentoRegistrado(hash, block.timestamp);
  }
}
"""
files["packages/blockchain/src/types/.gitkeep"] = ""

files["packages/firma-electronica/package.json"] = json.dumps({ "name": "@cenit/firma", "version": "1.0.0", "main": "./src/index.ts", "types": "./src/index.ts", "dependencies": { "typescript": "^5.3.0" } }, indent=2)
files["packages/firma-electronica/src/index.ts"] = "export * from './dnie';\nexport * from './clave';\nexport * from './utils';\n"
files["packages/firma-electronica/src/dnie.ts"] = "export async function firmarConDNIe(documento: string) { return { firma: '0x...', certificado: 'cert-dnie' }; }\n"
files["packages/firma-electronica/src/clave.ts"] = "export async function firmarConClave(documento: string, pin: string) { return { firma: '0x...', certificado: 'cert-clave' }; }\n"
files["packages/firma-electronica/src/utils.ts"] = "export function verificarFirma(firma: string, documento: string) { return true; }\n"

files["packages/shared-types/package.json"] = json.dumps({ "name": "@cenit/shared-types", "version": "1.0.0", "main": "./src/index.ts", "types": "./src/index.ts" }, indent=2)
files["packages/shared-types/src/index.ts"] = "export interface BaseEntity { id: string; createdAt: Date; updatedAt: Date; }\nexport type EstadoTestamento = 'borrador' | 'pendiente_firma' | 'firmado' | 'registrado' | 'completado';\n"

# --- 5. SERVICES/API ---
files["services/api/package.json"] = json.dumps({
    "name": "@cenit/api", "version": "1.0.0", "private": True,
    "scripts": { "build": "nest build", "dev": "nest start --watch", "start": "nest start", "test": "jest" },
    "dependencies": {
        "@nestjs/common": "^10.3.0", "@nestjs/core": "^10.3.0", "@nestjs/platform-express": "^10.3.0",
        "@nestjs/jwt": "^10.2.0", "@nestjs/passport": "^10.0.3",
# =============================================================================
# SERVICES/API - NestJS
# =============================================================================

write("services/api/package.json", json.dumps({
    "name": "@cenit/api",
    "version": "1.0.0",
    "private": True,
    "scripts": {
        "build": "nest build",
        "dev": "nest start --watch",
        "start": "nest start",
        "test": "jest"
    },
    "dependencies": {
        "@nestjs/common": "^10.3.0",
        "@nestjs/core": "^10.3.0",
        "@nestjs/platform-express": "^10.3.0",
        "@nestjs/jwt": "^10.2.0",
        "@nestjs/passport": "^10.0.3",
        "@nestjs/swagger": "^7.1.0",
        "@prisma/client": "^5.7.0",
        "bcrypt": "^5.1.1",
        "class-transformer": "^0.5.1",
        "class-validator": "^0.14.0",
        "passport": "^0.7.0",
        "passport-jwt": "^4.0.1",
        "reflect-metadata": "^0.1.13",
        "rxjs": "^7.8.1"
    },
    "devDependencies": {
        "@nestjs/cli": "^10.2.1",
        "@nestjs/testing": "^10.3.0",
        "@types/bcrypt": "^5.0.2",
        "@types/express": "^4.17.21",
        "@types/node": "^20.10.0",
        "jest": "^29.7.0",
        "prisma": "^5.7.0",
        "ts-jest": "^29.1.0",
        "typescript": "^5.3.0"
    }
}, indent=2))

write("services/api/tsconfig.json", json.dumps({
    "compilerOptions": {
        "module": "commonjs",
        "declaration": True,
        "removeComments": True,
        "emitDecoratorMetadata": True,
        "experimentalDecorators": True,
        "allowSyntheticDefaultImports": True,
        "target": "ES2021",
        "sourceMap": True,
        "outDir": "./dist",
        "baseUrl": "./",
        "incremental": True,
        "skipLibCheck": True,
        "strictNullChecks": False,
        "noImplicitAny": False,
        "strictBindCallApply": False,
        "forceConsistentCasingInFileNames": False,
        "noFallthroughCasesInSwitch": False
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}, indent=2))

write("services/api/src/main.ts", """import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  
  const config = new DocumentBuilder()
    .setTitle('Cenit API')
    .setDescription('API de Testamento Digital')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3001);
  console.log('🚀 API running on http://localhost:3001');
}
bootstrap();
""")

write("services/api/src/app.module.ts", """import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TestamentoModule } from './testamento/testamento.module';

@Module({
  imports: [AuthModule, TestamentoModule],
})
export class AppModule {}
""")

write("services/api/src/auth/auth.module.ts", """import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET || 'secret', signOptions: { expiresIn: '1d' } })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
""")

write("services/api/src/auth/auth.controller.ts", """import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { dni: string; password: string }) {
    return this.authService.login(body.dni, body.password);
  }
}
""")

write("services/api/src/auth/auth.service.ts", """import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(dni: string, password: string) {
    const payload = { sub: '1', dni };
    return { access_token: this.jwtService.sign(payload) };
  }
}
""")

write("services/api/src/auth/guards/jwt-auth.guard.ts", """import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
""")

write("services/api/src/auth/strategies/dnie.strategy.ts", """import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class DnieStrategy extends PassportStrategy(Strategy, 'dnie') {
  async validate() {
    return { userId: '1' };
  }
}
""")

write("services/api/src/auth/strategies/clave.strategy.ts", """import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class ClaveStrategy extends PassportStrategy(Strategy, 'clave') {
  async validate() {
    return { userId: '1' };
  }
}
""")

write("services/api/src/testamento/testamento.module.ts", """import { Module } from '@nestjs/common';
import { TestamentoController } from './testamento.controller';
import { TestamentoService } from './testamento.service';

@Module({
  controllers: [TestamentoController],
  providers: [TestamentoService],
})
export class TestamentoModule {}
""")

write("services/api/src/testamento/testamento.controller.ts", """import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TestamentoService } from './testamento.service';

@Controller('testamentos')
export class TestamentoController {
  constructor(private readonly testamentoService: TestamentoService) {}

  @Get()
  findAll() {
    return this.testamentoService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.testamentoService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testamentoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.testamentoService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testamentoService.remove(id);
  }
}
""")

write("services/api/src/testamento/testamento.service.ts", """import { Injectable } from '@nestjs/common';

@Injectable()
export class TestamentoService {
  private testamentos = [];

  findAll() {
    return this.testamentos;
  }

  create(data: any) {
    const testamento = { id: String(this.testamentos.length + 1), ...data };
    this.testamentos.push(testamento);
    return testamento;
  }

  findOne(id: string) {
    return this.testamentos.find((t) => t.id === id);
  }

  update(id: string, data: any) {
    const index = this.testamentos.findIndex((t) => t.id === id);
    if (index >= 0) this.testamentos[index] = { ...this.testamentos[index], ...data };
    return this.testamentos[index];
  }

  remove(id: string) {
    const index = this.testamentos.findIndex((t) => t.id === id);
    if (index >= 0) this.testamentos.splice(index, 1);
    return { deleted: true };
  }
}
""")

write("services/api/src/testamento/entities/testamento.entity.ts", """export class TestamentoEntity {
  id: string;
  titulo: string;
  contenido: string;
  estado: string;
  testadorId: string;
  createdAt: Date;
  updatedAt: Date;
}
""")

write("services/api/src/testamento/dto/create-testamento.dto.ts", """export class CreateTestamentoDto {
  titulo: string;
  contenido: string;
  testadorId: string;
}
""")

write("services/api/src/testamento/dto/update-testamento.dto.ts", """export class UpdateTestamentoDto {
  titulo?: string;
  contenido?: string;
  estado?: string;
}
""")

# Placeholders for other API modules
for mod in ['heredero', 'bien', 'firma', 'notario', 'blockchain', 'videollamada']:
    write(f"services/api/src/{mod}/.gitkeep", "")

write("services/api/src/blockchain/blockchain.service.ts", """import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockchainService {
  async registerHash(hash: string) {
    return { txHash: '0x...', blockNumber: 1 };
  }
}
""")

write("services/api/src/blockchain/blockchain.controller.ts", """import { Controller, Post, Body } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('register')
  async register(@Body('hash') hash: string) {
    return this.blockchainService.registerHash(hash);
  }
}
""")

write("services/api/src/videollamada/videollamada.gateway.ts", """import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class VideollamadaGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join-room')
  handleJoin(client: any, room: string) {
    client.join(room);
    client.to(room).emit('user-connected', client.id);
  }
}
""")

write("services/api/src/videollamada/videollamada.service.ts", """import { Injectable } from '@nestjs/common';

@Injectable()
export class VideollamadaService {
  async createRoom() {
    return { roomId: Math.random().toString(36).substring(7) };
  }
}
""")

for sub in ['filters', 'interceptors', 'pipes', 'decorators']:
    write(f"services/api/src/common/{sub}/.gitkeep", "")

write("services/api/src/config/database.config.ts", """export default () => ({
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/cenit',
  },
});
""")

write("services/api/src/config/redis.config.ts", """export default () => ({
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
});
""")

write("services/api/src/config/blockchain.config.ts", """export default () => ({
  blockchain: {
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL,
    privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY,
    contractAddress: process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
  },
});
""")

write("services/api/test/.gitkeep", "")
write("services/api/Dockerfile", """FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "dist/main"]
""")

print("✅ API creada")

# =============================================================================
# SERVICES/WORKER - BullMQ
# =============================================================================

write("services/worker/package.json", json.dumps({
    "name": "@cenit/worker",
    "version": "1.0.0",
    "private": True,
    "scripts": {
        "dev": "ts-node src/app.ts",
        "build": "tsc",
        "start": "node dist/app.js"
    },
    "dependencies": {
        "bullmq": "^4.15.0",
        "ioredis": "^5.3.0"
    },
    "devDependencies": {
        "@types/node": "^20.10.0",
        "ts-node": "^10.9.0",
        "typescript": "^5.3.0"
    }
}, indent=2))

write("services/worker/src/app.ts", """import { Worker } from 'bullmq';
import { firmaProcessor } from './processors/firma.processor';
import { notificacionProcessor } from './processors/notificacion.processor';
import { blockchainProcessor } from './processors/blockchain.processor';

console.log('🚀 Worker iniciado');

const connection = { host: process.env.REDIS_HOST || 'localhost', port: Number(process.env.REDIS_PORT) || 6379 };

new Worker('firma', firmaProcessor, { connection });
new Worker('notificacion', notificacionProcessor, { connection });
new Worker('blockchain', blockchainProcessor, { connection });
""")

write("services/worker/src/processors/firma.processor.ts", """export async function firmaProcessor(job: any) {
  console.log('Procesando firma:', job.id);
  return { status: 'ok' };
}
""")

write("services/worker/src/processors/notificacion.processor.ts", """export async function notificacionProcessor(job: any) {
  console.log('Enviando notificacion:', job.id);
  return { status: 'sent' };
}
""")

write("services/worker/src/processors/blockchain.processor.ts", """export async function blockchainProcessor(job: any) {
  console.log('Registrando en blockchain:', job.id);
  return { txHash: '0x...' };
}
""")

print("✅ Worker creado")

# =============================================================================
# INFRASTRUCTURE
# =============================================================================

write("infrastructure/docker/docker-compose.yml", """version: '3.8'
services:
  web:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile.web
    ports:
      - "3000:3000"
    env_file: ../../.env.local
  api:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile.api
    ports:
      - "3001:3001"
    env_file: ../../.env
    depends_on:
      - db
      - redis
  worker:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile.worker
    env_file: ../../.env
    depends_on:
      - redis
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: cenit_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
volumes:
  postgres_data:
""")

write("infrastructure/docker/docker-compose.prod.yml", """version: '3.8'
services:
  web:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile.web
    ports:
      - "3000:3000"
  api:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile.api
    ports:
      - "3001:3001"
""")

write("infrastructure/docker/Dockerfile.web", """FROM node:18-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install
RUN pnpm --filter @cenit/web build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
CMD ["pnpm", "start"]
""")

write("infrastructure/docker/Dockerfile.api", """FROM node:18-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install
RUN pnpm --filter @cenit/api build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/services/api/dist ./dist
COPY --from=builder /app/services/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main"]
""")

write("infrastructure/docker/Dockerfile.worker", """FROM node:18-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install
CMD ["pnpm\", \"--filter\", \"@cenit/worker\", \"start\"]
""")

for k8s_dir in ['namespaces', 'deployments', 'services', 'ingress', 'configmaps', 'secrets']:
    write(f"infrastructure/k8s/{k8s_dir}/.gitkeep", "")

write("infrastructure/terraform/main.tf", """terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}
""")

write("infrastructure/terraform/variables.tf", """variable "region" {
  description = "AWS region"
  default     = "eu-west-1"
}
""")

write("infrastructure/terraform/outputs.tf", """output "cluster_endpoint" {
  value = "https://example.com"
}
""")

write("infrastructure/scripts/setup.sh", """#!/bin/bash
set -e
echo "🔧 Setup inicial de Cenit"
pnpm install
pnpm db:migrate
""")

write("infrastructure/scripts/deploy.sh", """#!/bin/bash
set -e
echo "🚀 Deploying Cenit"
docker-compose -f infrastructure/docker/docker-compose.prod.yml up --build -d
""")

write("infrastructure/scripts/backup.sh", """#!/bin/bash
set -e
echo "💾 Backup de base de datos"
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
""")

print("✅ Infraestructura creada")

# =============================================================================
# DOCS
# =============================================================================

write("docs/README.md", """# El Cenit - Testamento Digital

Plataforma oficial para la creación, firma y gestión de testamentos digitales en la provincia de Santa Cruz de Tenerife.

## Características Principales

- 🔐 Autenticación segura mediante DNIe, Cl@ve PIN o firma electrónica cualificada
- ⚖️ Cumplimiento legal completo con el Código Civil español y regulación eIDAS
- 🧮 Calculadora de legítima automática con herederos forzosos
- 🏠 Importación de bienes desde Catastro, Registro de la Propiedad y entidades bancarias
- ✍️ Firma electrónica con sello de tiempo RFC 3161 y registro blockchain
- 👥 Testigos digitales con videollamada certificada
- 🔗 Registro inmutable en blockchain (Alastria)
- ♿ Diseño responsive accesible (WCAG 2.1 AA)
""")

write("docs/ARCHITECTURE.md", """# Arquitectura

## Stack Tecnológico

- **Frontend**: Next.js 14 + React + Tailwind CSS + shadcn/ui
- **Backend**: NestJS + Prisma ORM
- **Blockchain**: Alastria (red permissionada española)
- **Firma**: @firma (plataforma de firma electrónica del Ministerio)
- **Videollamada**: WebRTC + Twilio
- **Colas**: BullMQ + Redis
- **Infraestructura**: Docker + Kubernetes + Terraform (AWS)
""")

write("docs/API.md", "# API Documentation\\n\\nVer Swagger en http://localhost:3001/api/docs")
write("docs/SECURITY.md", "# Seguridad\\n\\n- JWT tokens con refresh\\n- Hashing bcrypt\\n- Rate limiting\\n- CORS configurado")
write("docs/DEPLOYMENT.md", "# Deployment\\n\\n1. `pnpm install`\\n2. `pnpm docker:up`\\n3. `pnpm dev`")
write("docs/LEGAL.md", "# Marco Legal\\n\\n- Código Civil español (arts. 675-727)\\n- Reglamento eIDAS 910/2014\\n- Ley 39/2015 de Procedimiento Administrativo")
write("docs/diagrams/arquitectura.png", "")
write("docs/diagrams/flujo-testamento.png", "")
write("docs/diagrams/modelo-datos.png", "")

print("✅ Documentacion creada")

# =============================================================================
# DATABASE
# =============================================================================

write("database/schema.prisma", """generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  dni       String   @unique
  nombre    String
  apellidos String
  email     String   @unique
  password  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  testamentos Testamento[]
}

model Testamento {
  id            String   @id @default(uuid())
  titulo        String
  contenido     String
  estado        String   @default("borrador")
  testadorId    String
  testador      User     @relation(fields: [testadorId], references: [id])
  hashBlockchain String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
""")

write("database/migrations/.gitkeep", "")
write("database/seeds/.gitkeep", "")

print("✅ Base de datos creada")

# =============================================================================
# GITHUB
# =============================================================================

write(".github/workflows/ci.yml", """name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
""")

print("✅ GitHub Actions creado")

# =============================================================================
# NOTARIO PANEL (React + Vite placeholder)
# =============================================================================

write("apps/notario-panel/package.json", json.dumps({
    "name": "@cenit/notario-panel",
    "version": "1.0.0",
    "private": True,
    "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
    },
    "devDependencies": {
        "@types/react": "^18.2.45",
        "@types/react-dom": "^18.2.18",
        "@vitejs/plugin-react": "^4.2.0",
        "typescript": "^5.3.0",
        "vite": "^5.0.0"
    }
}, indent=2))

write("apps/notario-panel/vite.config.ts", """import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3002 },
});
""")

for np in ['src/components/.gitkeep', 'src/pages/.gitkeep', 'src/stores/.gitkeep', 'src/api/.gitkeep']:
    write(f"apps/notario-panel/{np}", "")

print("✅ Notario Panel creado")

# =============================================================================
# FINAL
# =============================================================================

print("")
print("=" * 60)
print("🎉 PROYECTO CREADO COMPLETAMENTE")
print(f"📁 Ubicacion: {ROOT}")
print("=" * 60)
print("")
print("Pasos siguientes:")
print("  1. cd el-cenit-testamento-digital")
print("  2. pnpm install")
print("  3. pnpm dev")
print("")
print("Para subir a GitHub:")
print("  git init")
print("  git add .")
print("  git commit -m 'feat: estructura inicial del proyecto'")
print("  gh repo create el-cenit-testamento-digital --public --source=. --push")

