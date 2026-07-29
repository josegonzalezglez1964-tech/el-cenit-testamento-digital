'use client';

import { useState } from 'react';
import { StepDatos } from '@/components/testamento/StepDatos';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Users, Package, PenTool, CheckCircle } from 'lucide-react';

const steps = [
  { id: 1, label: 'Datos', icon: FileText },
  { id: 2, label: 'Herederos', icon: Users },
  { id: 3, label: 'Bienes', icon: Package },
  { id: 4, label: 'Firma', icon: PenTool },
  { id: 5, label: 'Confirmar', icon: CheckCircle },
];

export default function NuevoTestamentoPage() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">
          Crear nuevo testamento
        </h1>
        <p className="mt-2 text-gray-600">
          Complete los siguientes pasos para redactar su testamento digital.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    isActive
                      ? 'border-cenit-600 bg-cenit-600 text-white'
                      : isCompleted
                      ? 'border-cenit-600 bg-cenit-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive || isCompleted ? 'text-cenit-700' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-0 top-5 h-0.5 w-full ${
                      isCompleted ? 'bg-cenit-600' : 'bg-gray-200'
                    }`}
                    style={{ left: '50%', width: '100%' }}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="relative mt-4">
          <div className="overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-cenit-600 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
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
          className="rounded-lg bg-white p-8 shadow-sm"
        >
          {currentStep === 1 && <StepDatos onNext={() => setCurrentStep(2)} />}
          {currentStep === 2 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Paso 2: Herederos</h3>
              <p className="mt-2 text-gray-600">Próximamente...</p>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="rounded-md bg-cenit-600 px-4 py-2 text-sm font-medium text-white hover:bg-cenit-700"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Paso 3: Bienes</h3>
              <p className="mt-2 text-gray-600">Próximamente...</p>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="rounded-md bg-cenit-600 px-4 py-2 text-sm font-medium text-white hover:bg-cenit-700"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <div className="text-center py-12">
              <PenTool className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Paso 4: Firma</h3>
              <p className="mt-2 text-gray-600">Próximamente...</p>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="rounded-md bg-cenit-600 px-4 py-2 text-sm font-medium text-white hover:bg-cenit-700"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          {currentStep === 5 && (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-canarias-600" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">¡Testamento completado!</h3>
              <p className="mt-2 text-gray-600">
                Su testamento ha sido registrado correctamente.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="rounded-md bg-cenit-600 px-4 py-2 text-sm font-medium text-white hover:bg-cenit-700"
                >
                  Crear otro testamento
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}