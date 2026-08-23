'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Users,
  Package,
  FileSignature,
  CheckCircle,
  ArrowLeft,
  Download,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@el-cenit/ui';
import { StepDatos } from '@/components/testamento/StepDatos';
import { StepHerederos } from '@/components/testamento/StepHerederos';
import { StepBienes } from '@/components/testamento/StepBienes';
import { StepDisposiciones } from '@/components/testamento/StepDisposiciones';
import { useTestamentoStore } from '@/hooks/useTestamento';
import { generarPDF } from '@/lib/validators/generarPDF';
import { toast } from 'sonner';
import Link from 'next/link';

const steps = [
  { id: 1, label: 'Datos personales', icon: User },
  { id: 2, label: 'Herederos', icon: Users },
  { id: 3, label: 'Bienes', icon: Package },
  { id: 4, label: 'Disposiciones', icon: FileSignature },
  { id: 5, label: 'Firma', icon: CheckCircle },
];

export default function NuevoTestamentoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [guardando, setGuardando] = useState(false);
  const {
    testamento,
    firmarTestamento,
    guardarBorrador,
    guardando: guardandoBorrador,
    ultimoGuardado,
  } = useTestamentoStore();

  // Autoguardado del borrador al avanzar de paso (silencioso, sin toast salvo error)
  const primerRender = useRef(true);
  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    guardarBorrador().then((ok) => {
      if (!ok && testamento.datosIdentidad?.nombre) {
        toast.error('No se pudo guardar el borrador automáticamente');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handleGuardarBorrador = async () => {
    const ok = await guardarBorrador();
    if (ok) {
      toast.success('Borrador guardado');
    } else if (!testamento.datosIdentidad?.nombre) {
      toast.error('Completa al menos el paso 1 antes de guardar');
    } else {
      toast.error('Error al guardar el borrador. Inténtalo de nuevo.');
    }
  };

  const handleFirmar = async () => {
    setGuardando(true);
    try {
      // 1. Generar hash simulado de blockchain
      const hash = '0x' + Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      // 2. Actualizar estado en store
      await firmarTestamento();

      // 3. Preparar testamento completo
      const testamentoCompleto = {
        ...testamento,
        estado: 'firmado' as const,
        hashDocumento: hash,
        selloTiempo: new Date().toISOString(),
        blockchainTx: hash,
      };

      // 4. Guardar en backend (API)
      const res = await fetch('/api/testamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testamentoCompleto),
      });

      if (!res.ok) {
        throw new Error('Error al guardar en el servidor');
      }

      const data = await res.json();

      // 5. Guardar ID en localStorage para referencia
      if (data.id) {
        const guardados = JSON.parse(localStorage.getItem('el-cenit-testamentos-ids') || '[]');
        guardados.push(data.id);
        localStorage.setItem('el-cenit-testamentos-ids', JSON.stringify(guardados));
      }

      toast.success('Testamento firmado y registrado correctamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al firmar el testamento. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const handleDescargarPDF = () => {
    try {
      generarPDF(testamento);
      toast.success('PDF descargado correctamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al generar el PDF');
    }
  };

  const handleReiniciar = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('el-cenit-testamento-storage');
      window.location.reload();
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-2 relative">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">
          Nuevo testamento
        </h1>
        <p className="text-gray-600">
          Complete los siguientes pasos para crear su testamento digital
        </p>

        <div className="flex items-center justify-center gap-3 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGuardarBorrador}
            disabled={guardandoBorrador}
          >
            {guardandoBorrador ? 'Guardando...' : 'Guardar borrador'}
          </Button>
          {ultimoGuardado && (
            <span className="text-xs text-gray-400">
              Guardado {new Date(ultimoGuardado).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
      </div>

      {/* Stepper */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <button
                  onClick={() => {
                    if (step.id <= currentStep) setCurrentStep(step.id);
                  }}
                  disabled={step.id > currentStep}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-canarias-600 bg-canarias-600 text-white'
                      : isCompleted
                      ? 'border-green-500 bg-green-500 text-white cursor-pointer'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </button>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive
                      ? 'text-canarias-700'
                      : isCompleted
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>

                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 h-0.5 w-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{ transform: 'translateX(50%)' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <StepDatos onNext={() => setCurrentStep(2)} />
          )}
          {currentStep === 2 && (
            <StepHerederos
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <StepBienes
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 4 && (
            <StepDisposiciones
              onNext={() => setCurrentStep(5)}
              onBack={() => setCurrentStep(3)}
            />
          )}
          {currentStep === 5 && (
            <div className="space-y-6">
              {/* Resumen final */}
              <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">
                  ¡Testamento completado!
                </h3>
                <p className="text-gray-600 mt-2 max-w-lg mx-auto">
                  Ha completado todos los pasos. Revise el resumen antes de firmar
                  digitalmente su testamento.
                </p>
              </div>

              {/* Datos resumen */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-white p-5">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-canarias-600" />
                    Datos del testador
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Nombre:</span> {testamento.datosIdentidad?.nombre} {testamento.datosIdentidad?.apellidos}</p>
                    <p><span className="font-medium">DNI:</span> {testamento.datosIdentidad?.dni}</p>
                    <p><span className="font-medium">Email:</span> {(testamento.datosIdentidad as any)?.email || '—'}</p>
                  </div>
                </div>

                <div className="rounded-lg border bg-white p-5">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-canarias-600" />
                    Herederos ({testamento.herederos.length})
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    {testamento.herederos.map((h) => (
                      <p key={h.id}>{h.nombre} {h.apellidos} — {h.porcentaje}% ({h.tipo})</p>
                    ))}
                    <p className="pt-1 font-medium text-canarias-700">
                      Total asignado: {testamento.herederos.reduce((s, h) => s + h.porcentaje, 0)}%
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border bg-white p-5">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-canarias-600" />
                    Bienes ({testamento.bienes.length})
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    {testamento.bienes.map((b) => (
                      <p key={b.id}>{b.descripcion} — {b.valorEstimado.toLocaleString('es-ES')} €</p>
                    ))}
                    <p className="pt-1 font-medium text-canarias-700">
                      Patrimonio total: {testamento.bienes.reduce((s, b) => s + b.valorEstimado, 0).toLocaleString('es-ES')} €
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border bg-white p-5">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileSignature className="h-4 w-4 text-canarias-600" />
                    Disposiciones
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Albacea:</span> {testamento.disposiciones?.albacea || 'No designado'}</p>
                    <p><span className="font-medium">Testamento vital:</span> {testamento.disposiciones?.testamentoVital ? 'Sí' : 'No'}</p>
                    <p><span className="font-medium">Tutela menores:</span> {testamento.disposiciones?.tutelaMenores || 'No designada'}</p>
                    {testamento.disposiciones?.legadoSolidario && (
                      <p><span className="font-medium">Legado:</span> {testamento.disposiciones.legadoSolidario.ong} ({testamento.disposiciones.legadoSolidario.porcentaje}%)</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Acciones finales */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(4)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleReiniciar}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Empezar de nuevo
                  </Button>
                  <Button 
                    onClick={handleFirmar} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={guardando}
                  >
                    <FileSignature className="h-4 w-4 mr-2" />
                    {guardando ? 'Firmando...' : 'Firmar testamento'}
                  </Button>
                </div>
              </div>

              {testamento.estado === 'firmado' && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
                  <CheckCircle className="inline h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    Testamento firmado digitalmente el {new Date().toLocaleDateString('es-ES')}
                  </span>
                  <div className="mt-3 flex justify-center gap-3">
                    <Button variant="outline" size="sm" onClick={handleDescargarPDF}>
                      <Download className="h-4 w-4 mr-1" />
                      Descargar PDF
                    </Button>
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm">
                        Ir al panel
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}