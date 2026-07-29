import Link from 'next/link';
import { FileText, Shield, Lock, ChevronRight, Scale, Fingerprint, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-cenit-900 py-24 sm:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cenit-400 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-canarias-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-serif">
              Protege tu legado en Canarias
            </h1>
            <p className="mt-6 text-lg leading-8 text-cenit-100">
              El primer testamento digital de Tenerife. Seguro, legal y accesible. 
              Firma con tu DNIe y registra tu voluntad en blockchain Alastria.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/testamento/nuevo"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-cenit-900 shadow-sm hover:bg-cenit-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Crear mi testamento
              </Link>
              <Link href="#como-funciona" className="text-sm font-semibold leading-6 text-white flex items-center gap-1">
                Saber más <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="como-funciona" className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">
              Cómo funciona
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Tres pasos simples para asegurar el futuro de tus seres queridos.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
              {[
                {
                  icon: FileText,
                  title: '1. Redacta',
                  desc: 'Completa tu testamento paso a paso con asistencia legal. Validez conforme al Código Civil español.',
                },
                {
                  icon: Fingerprint,
                  title: '2. Firma',
                  desc: 'Autentica tu identidad con DNIe o firma electrónica avanzada. Seguridad biométrica incluida.',
                },
                {
                  icon: Lock,
                  title: '3. Registra',
                  desc: 'Tu testamento se sella en blockchain Alastria con sello de tiempo eIDAS. Inmutable y trazable.',
                },
              ].map((feature) => (
                <div key={feature.title} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-cenit-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">{feature.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-t border-gray-200 bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 font-serif">Garantías legales y técnicas</h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {[
              { icon: Scale, label: 'Código Civil español' },
              { icon: Shield, label: 'eIDAS nivel alto' },
              { icon: Globe, label: 'Blockchain Alastria' },
              { icon: Lock, label: 'Cifrado AES-256' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center">
                <item.icon className="h-10 w-10 text-cenit-600" />
                <p className="mt-4 text-sm font-semibold text-gray-900">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cenit-900 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-serif">
            Tu legado merece protección
          </h2>
          <p className="mt-4 text-lg text-cenit-100">
            Empieza hoy mismo. El primer testamento digital de Canarias está a un clic.
          </p>
          <div className="mt-8">
            <Link
              href="/testamento/nuevo"
              className="inline-flex items-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-cenit-900 shadow-sm hover:bg-cenit-50"
            >
              Comenzar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="bg-gray-900 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} El Cénit · Testamento Digital de Tenerife. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}