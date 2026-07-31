'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge } from '@el-cenit/ui';
import { toast } from 'sonner';
import { PenTool, Fingerprint, Video, Shield, CheckCircle, AlertCircle } from 'lucide-react';

type EstadoFirma = 'PENDIENTE' | 'FIRMANDO' | 'COMPLETADA' | 'ERROR';

export default function FirmaPage() {
  const [estado, setEstado] = useState<EstadoFirma>('PENDIENTE');

  const firmarConDNIe = async () => {
    setEstado('FIRMANDO');
    toast.info('Conectando con el lector de DNIe...');
    // Simulación
    setTimeout(() => {
      setEstado('COMPLETADA');
      toast.success('Documento firmado correctamente con DNIe');
    }, 3000);
  };

  const firmarConVideo = async () => {
    setEstado('FIRMANDO');
    toast.info('Iniciando videollamada con notario...');
    setTimeout(() => {
      setEstado('COMPLETADA');
      toast.success('Firma por videollamada completada');
    }, 3000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-serif">Firma del testamento</h1>
        <p className="mt-2 text-gray-600">
          Elija el método de firma electrónica para validar legalmente su testamento.
        </p>
      </div>

      {estado === 'COMPLETADA' && (
        <div className="rounded-lg bg-canarias-50 border border-canarias-200 p-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-canarias-600" />
          <h3 className="mt-4 text-lg font-semibold text-canarias-800">Firma completada</h3>
          <p className="mt-2 text-canarias-700">
            Su testamento ha sido firmado y registrado en blockchain Alastria.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
            <Shield className="h-4 w-4 text-cenit-600" />
            Hash: 0x7f83...b165
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className={`transition-opacity ${estado === 'COMPLETADA' ? 'opacity-50' : ''}`}>
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cenit-100">
              <Fingerprint className="h-6 w-6 text-cenit-600" />
            </div>
            <CardTitle className="mt-4">DNIe / Firma electrónica</CardTitle>
            <CardDescription>
              Firme con su DNI electrónico o certificado digital cualificado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="mb-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-canarias-600" /> Validez legal plena
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-canarias-600" /> Reconocimiento eIDAS
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-canarias-600" /> Sello de tiempo incluido
              </li>
            </ul>
            <Button
              onClick={firmarConDNIe}
              disabled={estado === 'FIRMANDO' || estado === 'COMPLETADA'}
              className="w-full"
            >
              {estado === 'FIRMANDO' ? 'Procesando...' : 'Firmar con DNIe'}
            </Button>
          </CardContent>
        </Card>

        <Card className={`transition-opacity ${estado === 'COMPLETADA' ? 'opacity-50' : ''}`}>
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-canarias-100">
              <Video className="h-6 w-6 text-canarias-600" />
            </div>
            <CardTitle className="mt-4">Videollamada con notario</CardTitle>
            <CardDescription>
              Firme en presencia de un notario mediante videoconferencia segura.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="mb-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-canarias-600" /> Notario colegiado
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-canarias-600" /> Grabación certificada
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-canarias-600" /> Fe pública digital
              </li>
            </ul>
            <Button
              variant="outline"
              onClick={firmarConVideo}
              disabled={estado === 'FIRMANDO' || estado === 'COMPLETADA'}
              className="w-full"
            >
              {estado === 'FIRMANDO' ? 'Conectando...' : 'Iniciar videollamada'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900">Información legal</p>
            <p className="mt-1">
              Conforme al artículo 25 de la Ley 59/2003, de 19 de diciembre, de firma electrónica,
              ambos métodos tienen plena validez jurídica en el territorio español y en la Unión Europea.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}