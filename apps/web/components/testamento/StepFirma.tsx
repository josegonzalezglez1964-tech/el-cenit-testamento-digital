"use client";

import { useState } from "react";
import { useTestamentoStore } from "@/hooks/useTestamento";
import { Button, Label, Card, CardContent, Checkbox, Textarea } from "@el-cenit/ui";
import {
  FileCheck,
  Shield,
  AlertCircle,
  CheckCircle2,
  PenTool,
  Eye,
  Download,
  Send,
} from "lucide-react";

interface Testigo {
  id: string;
  nombre: string;
  dni: string;
  email?: string;
}

export function StepFirma() {
  const { datos, setTestigo, setNotasFinales } = useTestamentoStore();
  const [testigos, setLocalTestigos] = useState<Testigo[]>(
    datos.testigos || []
  );
  const [nuevoTestigo, setNuevoTestigo] = useState<Partial<Testigo>>({});
  const [aceptaciones, setAceptaciones] = useState({
    voluntad: false,
    capacidad: false,
    veracidad: false,
    revocacion: false,
  });
  const [firmado, setFirmado] = useState(false);

  const todasAceptadas = Object.values(aceptaciones).every(Boolean);

  const agregarTestigo = () => {
    if (!nuevoTestigo.nombre || !nuevoTestigo.dni) return;
    const testigo: Testigo = {
      id: crypto.randomUUID(),
      nombre: nuevoTestigo.nombre,
      dni: nuevoTestigo.dni,
      email: nuevoTestigo.email,
    };
    const actualizados = [...testigos, testigo];
    setLocalTestigos(actualizados);
    setTestigo && setTestigo(actualizados);
    setNuevoTestigo({});
  };

  const eliminarTestigo = (id: string) => {
    const actualizados = testigos.filter((t) => t.id !== id);
    setLocalTestigos(actualizados);
    setTestigo && setTestigo(actualizados);
  };

  const handleFirmar = () => {
    if (!todasAceptadas) return;
    setFirmado(true);
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-cenit-100 text-cenit-600 flex items-center justify-center text-sm font-bold">
            5
          </span>
          Revision y Firma
        </h2>
        <p className="text-slate-600 mb-6">
          Revisa todos los datos de tu testamento, acepta las declaraciones
          legales y procede a la firma digital.
        </p>
      </section>

      <Card className="border-slate-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Resumen de tu testamento
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-cenit-600">
                  {datos.herederos?.length || 0}
                </p>
                <p className="text-sm text-slate-500">Herederos</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-cenit-600">
                  {datos.bienes?.length || 0}
                </p>
                <p className="text-sm text-slate-500">Bienes registrados</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-cenit-600">
                  {datos.disposiciones?.length || 0}
                </p>
                <p className="text-sm text-slate-500">Disposiciones</p>
              </div>
            </div>

            {datos.herederos && datos.herederos.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Herederos designados:
                </p>
                <div className="flex flex-wrap gap-2">
                  {datos.herederos.map((h) => (
                    <span
                      key={h.id}
                      className="text-xs bg-cenit-50 text-cenit-700 px-2 py-1 rounded-full"
                    >
                      {h.nombre} {h.apellidos} ({h.porcentaje}%)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex gap-3">
            <Button variant="outline" className="flex-1" disabled>
              <Eye className="w-4 h-4 mr-2" />
              Previsualizar PDF
            </Button>
            <Button variant="outline" className="flex-1" disabled>
              <Download className="w-4 h-4 mr-2" />
              Descargar borrador
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cenit-600" />
            Declaraciones legales
          </h3>
          <p className="text-sm text-slate-600">
            Debes aceptar las siguientes declaraciones para validar tu testamento:
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Checkbox
                id="voluntad"
                checked={aceptaciones.voluntad}
                onChange={(e) =>
                  setAceptaciones({ ...aceptaciones, voluntad: (e.target as HTMLInputElement).checked })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="voluntad" className="font-medium cursor-pointer">
                  Declaro que actuo con plena libertad y voluntad
                </Label>
                <p className="text-sm text-slate-500">
                  Nadie me ha coaccionado, inducido o forzado a otorgar este testamento.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Checkbox
                id="capacidad"
                checked={aceptaciones.capacidad}
                onChange={(e) =>
                  setAceptaciones({ ...aceptaciones, capacidad: (e.target as HTMLInputElement).checked })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="capacidad" className="font-medium cursor-pointer">
                  Declaro tener capacidad legal para testar
                </Label>
                <p className="text-sm text-slate-500">
                  Soy mayor de edad, tengo pleno uso de mis facultades mentales y no
                  estoy incapacitado legalmente.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Checkbox
                id="veracidad"
                checked={aceptaciones.veracidad}
                onChange={(e) =>
                  setAceptaciones({ ...aceptaciones, veracidad: (e.target as HTMLInputElement).checked })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="veracidad" className="font-medium cursor-pointer">
                  Declaro la veracidad de todos los datos aportados
                </Label>
                <p className="text-sm text-slate-500">
                  Toda la informacion sobre mi identidad, bienes y herederos es
                  veraz y completa.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Checkbox
                id="revocacion"
                checked={aceptaciones.revocacion}
                onChange={(e) =>
                  setAceptaciones({ ...aceptaciones, revocacion: (e.target as HTMLInputElement).checked })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="revocacion" className="font-medium cursor-pointer">
                  Entiendo que este testamento revoca cualquier testamento anterior
                </Label>
                <p className="text-sm text-slate-500">
                  Al firmar, este documento anula todos mis testamentos previos en su
                  totalidad.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            Testigos (opcional)
          </h3>
          <p className="text-sm text-slate-600">
            Puedes designar testigos que acrediten la validez de tu firma. En
            testamento olografo no son obligatorios, pero si recomendables.
          </p>

          {testigos.length > 0 && (
            <div className="space-y-2">
              {testigos.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900">{t.nombre}</p>
                    <p className="text-sm text-slate-500">DNI: {t.dni}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => eliminarTestigo(t.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              placeholder="Nombre completo"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={nuevoTestigo.nombre || ""}
              onChange={(e) =>
                setNuevoTestigo({ ...nuevoTestigo, nombre: e.target.value })
              }
            />
            <input
              placeholder="DNI / NIE"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={nuevoTestigo.dni || ""}
              onChange={(e) =>
                setNuevoTestigo({ ...nuevoTestigo, dni: e.target.value })
              }
            />
            <Button
              variant="outline"
              onClick={agregarTestigo}
              disabled={!nuevoTestigo.nombre || !nuevoTestigo.dni}
            >
              Anadir testigo
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="notasFinales">Notas adicionales para el notario</Label>
        <Textarea
          id="notasFinales"
          placeholder="Cualquier informacion adicional que quieras comunicar al notario..."
          value={datos.notasFinales || ""}
          onChange={(e) => setNotasFinales(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-4">
        {!firmado ? (
          <>
            {!todasAceptadas && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Debes aceptar todas las declaraciones legales para poder firmar
                  el testamento.
                </p>
              </div>
            )}

            <Button
              onClick={handleFirmar}
              disabled={!todasAceptadas}
              className="w-full h-14 text-lg bg-cenit-600 hover:bg-cenit-700 text-white disabled:opacity-50"
            >
              <PenTool className="w-5 h-5 mr-2" />
              Firmar testamento digitalmente
            </Button>

            <p className="text-xs text-center text-slate-500">
              Al firmar, se generara un documento con validez probatoria y se
              registrara en blockchain para garantizar su integridad.
            </p>
          </>
        ) : (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
              <h3 className="text-xl font-bold text-green-800">
                Testamento firmado correctamente!
              </h3>
              <p className="text-green-700">
                Tu testamento ha sido firmado digitalmente y registrado con
                validez probatoria. Se ha enviado una copia a tu correo
                electronico.
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <Button variant="outline" className="bg-white">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
                <Button className="bg-cenit-600 hover:bg-cenit-700 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar al notario
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}