'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@el-cenit/ui/components/Card';
import { Button } from '@el-cenit/ui/components/Button';
import { Input } from '@el-cenit/ui/components/Input';
import { Label } from '@el-cenit/ui/components/Label';
import { Badge } from '@el-cenit/ui/components/Badge';
import { toast } from 'sonner';
import { Package, Plus, Trash2, Euro } from 'lucide-react';

interface BienItem {
  id: string;
  descripcion: string;
  tipo: string;
  valor: number;
  moneda: string;
  ubicacion: string;
}

const TIPOS_BIEN = [
  'INMUEBLE',
  'CUENTA_BANCARIA',
  'VEHICULO',
  'JOYA',
  'ACCIONES',
  'OTROS',
];

export default function BienesPage() {
  const [bienes, setBienes] = useState<BienItem[]>([]);
  const [form, setForm] = useState({
    descripcion: '',
    tipo: 'INMUEBLE',
    valor: '',
    moneda: 'EUR',
    ubicacion: '',
  });

  const handleAdd = () => {
    if (!form.descripcion || !form.valor) {
      toast.error('Complete la descripción y el valor');
      return;
    }
    const nuevo: BienItem = {
      id: crypto.randomUUID(),
      descripcion: form.descripcion,
      tipo: form.tipo,
      valor: parseFloat(form.valor),
      moneda: form.moneda,
      ubicacion: form.ubicacion,
    };
    setBienes([...bienes, nuevo]);
    setForm({ descripcion: '', tipo: 'INMUEBLE', valor: '', moneda: 'EUR', ubicacion: '' });
    toast.success('Bien añadido');
  };

  const handleRemove = (id: string) => {
    setBienes(bienes.filter((b) => b.id !== id));
    toast.success('Bien eliminado');
  };

  const valorTotal = bienes.reduce((sum, b) => sum + b.valor, 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-serif">Bienes y patrimonio</h1>
        <p className="mt-2 text-gray-600">Inventarie los bienes que desea incluir en su testamento.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" /> Añadir bien
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Descripción</Label>
              <Input
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Piso en Santa Cruz de Tenerife, Calle Castillo 15, 3ºB"
              />
            </div>
            <div>
              <Label>Tipo</Label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {TIPOS_BIEN.map((t) => (
                  <option key={t} value={t}>
                    {t.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Valor estimado</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: e.target.value })}
                  placeholder="150000"
                />
                <select
                  value={form.moneda}
                  onChange={(e) => setForm({ ...form, moneda: e.target.value })}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label>Ubicación / Entidad</Label>
              <Input
                value={form.ubicacion}
                onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                placeholder="Santa Cruz de Tenerife, España / Banco Santander"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAdd}>Añadir bien</Button