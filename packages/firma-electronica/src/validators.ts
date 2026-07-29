/**
 * Validadores para documentos y firmas electrónicas
 */

const DNI_REGEX = /^[0-9]{8}[A-Z]$/;
const NIE_REGEX = /^[XYZ][0-9]{7}[A-Z]$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[67][0-9]{8}$/;

export function validarDNI(dni: string): boolean {
  if (!DNI_REGEX.test(dni)) return false;

  const numero = parseInt(dni.slice(0, 8), 10);
  const letra = dni.slice(8);
  const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const letraCalculada = letras[numero % 23];

  return letra === letraCalculada;
}

export function validarNIE(nie: string): boolean {
  if (!NIE_REGEX.test(nie)) return false;

  let numeroStr = nie.slice(1, 8);
  const primeraLetra = nie[0];

  if (primeraLetra === 'X') numeroStr = '0' + numeroStr;
  else if (primeraLetra === 'Y') numeroStr = '1' + numeroStr;
  else if (primeraLetra === 'Z') numeroStr = '2' + numeroStr;

  const dniEquivalente = numeroStr + nie[8];
  return validarDNI(dniEquivalente);
}

export function validarDocumentoIdentidad(documento: string): boolean {
  return validarDNI(documento) || validarNIE(documento);
}

export function validarEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validarTelefono(telefono: string): boolean {
  return PHONE_REGEX.test(telefono.replace(/\s/g, ''));
}

export function validarPorcentajeHerencia(porcentaje: number): boolean {
  return porcentaje > 0 && porcentaje <= 100;
}

export function validarSumaPorcentajes(porcentajes: number[]): boolean {
  const suma = porcentajes.reduce((acc, p) => acc + p, 0);
  return Math.abs(suma - 100) < 0.01; // Tolerancia de 0.01%
}

export function validarMayorEdad(fechaNacimiento: Date): boolean {
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    return edad - 1 >= 18;
  }
  return edad >= 18;
}

export interface ValidacionResult {
  valido: boolean;
  errores: string[];
}

export function validarTestamentoCompleto(data: {
  testadorDNI: string;
  testadorFechaNacimiento: Date;
  herederos: { dni: string; porcentajeHerencia: number }[];
  bienes: { descripcion: string; tipo: string }[];
}): ValidacionResult {
  const errores: string[] = [];

  if (!validarDocumentoIdentidad(data.testadorDNI)) {
    errores.push('El DNI/NIE del testador no es válido');
  }

  if (!validarMayorEdad(data.testadorFechaNacimiento)) {
    errores.push('El testador debe ser mayor de edad');
  }

  if (data.herederos.length === 0) {
    errores.push('Debe haber al menos un heredero');
  }

  const porcentajes = data.herederos.map((h) => h.porcentajeHerencia);
  if (!validarSumaPorcentajes(porcentajes)) {
    errores.push('La suma de porcentajes de herencia debe ser exactamente 100%');
  }

  data.herederos.forEach((h, i) => {
    if (!validarDocumentoIdentidad(h.dni)) {
      errores.push(`El DNI/NIE del heredero ${i + 1} no es válido`);
    }
    if (!validarPorcentajeHerencia(h.porcentajeHerencia)) {
      errores.push(`El porcentaje del heredero ${i + 1} debe estar entre 0 y 100`);
    }
  });

  if (data.bienes.length === 0) {
    errores.push('Debe haber al menos un bien en el testamento');
  }

  data.bienes.forEach((b, i) => {
    if (!b.descripcion || b.descripcion.trim().length < 3) {
      errores.push(`La descripción del bien ${i + 1} es demasiado corta`);
    }
    if (!b.tipo) {
      errores.push(`El tipo del bien ${i + 1} es obligatorio`);
    }
  });

  return {
    valido: errores.length === 0,
    errores,
  };
}