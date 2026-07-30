'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Users,
  Package,
  FileSignature,
  CheckCircle,
} from 'lucide-react';
import { StepDatos } from '@/components/testamento/StepDatos';
import { StepHerederos } from '@/components/testamento/StepHerederos';

const steps = [
  { id: 1, label: 'Datos personales', icon: User },
  { id: 2, label: 'Herederos', icon: Users },
  { id: 3, label: 'Bienes', icon: Package },
  { id: 4, label: 'Disposiciones', icon: FileSignature },
  { id: 5, label: 'Firma', icon: CheckCircle },
];

export default function NuevoTestamentoPage() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">
          Nuevo testamento
        </h1>
        <p className="text-gray-600">
          Complete los siguientes pasos para crear su testamento digital
        </p>
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
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-canarias-600 bg-canarias-600 text-white'
                      : isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
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
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700">
                Paso 3: Bienes
              </h3>
              <p className="text-gray-500 mt-2">Próximamente...</p>
            </div>
          )}
          {currentStep === 4 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700">
                Paso 4: Disposiciones
              </h3>
              <p className="text-gray-500 mt-2">Próximamente...</p>
            </div>
          )}
          {currentStep === 5 && (
            <div className="text-center py-12 space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="text-2xl font-bold text-gray-900">
                ¡Testamento completado!
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Su testamento ha sido registrado correctamente. Puede descargar el
                documento o revisarlo en cualquier momento desde su panel.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}