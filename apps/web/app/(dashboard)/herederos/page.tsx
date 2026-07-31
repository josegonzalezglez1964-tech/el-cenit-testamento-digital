'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge } from '@el-cenit/ui';
import { toast } from 'sonner';
import { Users, Plus, Trash2, Percent } from 'lucide-react';

interface HerederoItem {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  tipo: 'UNIVERSAL' | 'POR_CUOTA' | 'LEGITIMARIO';
  porcentaje: number;
}

export default function HerederosPage() {
  const [herederos, setHerederos] = useState<HerederoItem[]>([]);
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    tipo: 'POR_CUOTA' as const,
    porcentaje: '',
  });

  const totalPorcentaje = herederos.reduce((sum, h) => sum + h.porcentaje, 0);

  const handleAdd = () => {
    if (!form.nombre || !form.apellidos || !form.dni || !form.porcentaje) {
      toast.error('Complete todos los campos');
      return;
    }
    const nuevo: HerederoItem = {
      id: crypto.randomUUID(),
      nombre: form.nombre,
      apellidos: form.apellidos,
      dni: form.dni,
      tipo: form.tipo,
      porcentaje: parseFloat(form.porcentaje),
    };
    setHerederos([...herederos, nuevo]);
    setForm({ nombre: '', apellidos: '', dni: '', tipo: 'POR_CUOTA', porcentaje: '' });
    toast.success('Heredero añadido');
  };

  const handleRemove = (id: string) => {
    setHerederos(herederos.filter((h) => h.id !== id));
    toast.success('Heredero eliminado');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-serif">Herederos</h1>
        <p className="mt-2 text-gray-600">Gestione las personas que heredarán sus bienes.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" /> Añadir heredero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <Label>Nombre</Label>
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre" />
            </div>
            <div>
              <Label>Apellidos</Label>
              <Input value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} placeholder="Apellidos" />
            </div>
            <div>
              <Label>DNI/NIE</Label>
              <Input value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} placeholder="12345678A" />
            </div>
            <div>
              <Label>Tipo</Label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as HerederoItem['tipo'] })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="UNIVERSAL">Universal</option>
                <option value="POR_CUOTA">Por cuota</option>
                <option value="LEGITIMARIO">Legitimario</option>
              </select>
            </div>
            <div>
              <Label>%</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={form.porcentaje}
                onChange={(e) => setForm({ ...form, porcentaje: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm">
              Total asignado:{' '}
              <span className={`font-semibold ${totalPorcentaje === 100 ? 'text-canarias-600' : 'text-red-600'}`}>
                {totalPorcentaje}%
              </span>
              {totalPorcentaje === 100 && ' ✅'}
            </div>
            <Button onClick={handleAdd}>Añadir</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {herederos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
            <Users className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2">No hay herederos registrados</p>
          </div>
        ) : (
          herederos.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-canarias-100 text-canarias-700">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {h.nombre} {h.apellidos}
                  </p>
                  <p className="text-sm text-gray-500">DNI: {h.dni}</p>
                </div>
                <Badge variant="outline">{h.tipo.replace('_', ' ')}</Badge>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <Percent className="h-4 w-4" />
                  {h.porcentaje}%
                </span>
                <button
                  onClick={() => handleRemove(h.id)}
                  className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}