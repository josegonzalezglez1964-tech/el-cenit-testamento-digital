'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@el-cenit/ui';
import { useTestamentoStore, Testamento } from '@/hooks/useTestamento';
import { generarPDF } from '@/lib/validators/generarPDF';
import { toast } from 'sonner';
import Link from 'next/link';

interface TestamentoGuardado extends Testamento {
  id: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { testamento } = useTestamentoStore();
  const [testamentos, setTestamentos] = useState<TestamentoGuardado[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarTestamentos = async () => {
      try {
        const res = await fetch('/api/testamento');
        const data = await res.json();

        if (data.success && data.testamentos) {
          setTestamentos(data.testamentos);
        }
      } catch (err) {
        console.error('Error cargando testamentos:', err);
        // Fallback: usar el del store
        if (testamento.estado !== 'borrador' || testamento.herederos.length > 0) {
          setTestamentos([{
            ...testamento,
            id: 'actual',
            createdAt: new Date().toISOString(),
          } as TestamentoGuardado]);
        }
      } finally {
        setCargando(false);
      }
    };

    cargarTestamentos();
  }, [testamento]);

  const handleDescargar = (t: TestamentoGuardado) => {
    try {
      generarPDF(t);
      toast.success('PDF descargado correctamente');
    } catch {
      toast.error('Error al generar el PDF');
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este testamento?')) return;

    if (id === 'actual') {
      localStorage.removeItem('el-cenit-testamento-storage');
      window.location.reload();
      return;
    }

    try {
      const res = await fetch(`/api/testamento?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTestamentos((prev) => prev.filter((t) => t.id !== id));
        toast.success('Testamento eliminado');
      }
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'firmado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3" />
            Firmado
          </span>
        );
      case 'registrado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Shield className="h-3 w-3" />
            En blockchain
          </span>
        );
      case 'borrador':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock className="h-3 w-3" />
            Borrador
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle className="h-3 w-3" />
            {estado}
          </span>
        );
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-canarias-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-serif">
                Panel de testamentos
              </h1>
              <p className="text-gray-600 mt-1">
                Gestione sus testamentos digitales
              </p>
            </div>
            <Link href="/testamento/nuevo">
              <Button className="bg-canarias-600 hover:bg-canarias-700">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo testamento
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border p-5">
            <p className="text-3xl font-bold text-canarias-600">{testamentos.length}</p>
            <p className="text-sm text-gray-500">Total testamentos</p>
          </div>
          <div className="bg-white rounded-lg border p-5">
            <p className="text-3xl font-bold text-green-600">
              {testamentos.filter((t) => t.estado === 'firmado' || t.estado === 'registrado').length}
            </p>
            <p className="text-sm text-gray-500">Firmados</p>
          </div>
          <div className="bg-white rounded-lg border p-5">
            <p className="text-3xl font-bold text-amber-600">
              {testamentos.filter((t) => t.estado === 'borrador').length}
            </p>
            <p className="text-sm text-gray-500">Borradores</p>
          </div>
        </div>

        {testamentos.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tiene testamentos
            </h3>
            <p className="text-gray-600 mb-6">
              Cree su primer testamento digital de forma segura y sencilla.
            </p>
            <Link href="/testamento/nuevo">
              <Button className="bg-canarias-600 hover:bg-canarias-700">
                <Plus className="h-4 w-4 mr-2" />
                Crear testamento
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {testamentos.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-lg border p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-canarias-50 flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6 text-canarias-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900">
                          Testamento de {(t.datosIdentidad as any)?.nombre || 'Usuario'} {(t.datosIdentidad as any)?.apellidos || ''}
                        </h3>
                        {getEstadoBadge(t.estado)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {(t.herederos as any[]).length} herederos · {(t.bienes as any[]).length} bienes ·{' '}
                        {(t.bienes as any[]).reduce((s: number, b: any) => s + (b.valorEstimado || 0), 0).toLocaleString('es-ES')} €
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Creado el {new Date(t.createdAt).toLocaleDateString('es-ES')}
                        {t.hashDocumento && ` · Hash: ${t.hashDocumento.slice(0, 12)}...`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDescargar(t)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    {t.estado === 'borrador' && (
                      <Link href="/testamento/nuevo">
                        <Button size="sm" className="bg-canarias-600 hover:bg-canarias-700">
                          Continuar
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleEliminar(t.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}