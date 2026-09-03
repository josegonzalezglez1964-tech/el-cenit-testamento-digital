import { z } from 'zod';

const dniNieSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/,
    'DNI/NIE no válido'
  );

const telefonoSchema = z
  .string()
  .trim()
  .regex(/^[67][0-9]{8}$/, 'Teléfono no válido');

const emailSchema = z
  .string()
  .trim()
  .email('Email no válido');

export const datosIdentidadSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'El nombre es obligatorio')
    .max(100, 'El nombre es demasiado largo'),

  apellidos: z
    .string()
    .trim()
    .min(2, 'Los apellidos son obligatorios')
    .max(150, 'Los apellidos son demasiado largos'),

  dni: dniNieSchema,

  fechaNacimiento: z
    .string()
    .trim()
    .min(1, 'La fecha de nacimiento es obligatoria'),

  estadoCivil: z
    .string()
    .trim()
    .max(50, 'El estado civil es demasiado largo'),

  domicilio: z.object({
    calle: z
      .string()
      .trim()
      .min(5, 'La dirección es obligatoria')
      .max(250, 'La dirección es demasiado larga'),

    telefono: telefonoSchema,

    email: emailSchema,
  }),
});

export const herederoSchema = z.object({
  id: z
    .string()
    .uuid('Identificador de heredero no válido'),

  nombre: z
    .string()
    .trim()
    .min(2, 'El nombre es obligatorio')
    .max(100, 'El nombre es demasiado largo'),

  apellidos: z
    .string()
    .trim()
    .min(2, 'Los apellidos son obligatorios')
    .max(150, 'Los apellidos son demasiado largos'),

  dni: dniNieSchema,

  parentesco: z.enum([
    'conyuge',
    'hijo',
    'nieto',
    'padre',
    'hermano',
    'otro',
  ]),

  porcentaje: z
    .number()
    .finite('El porcentaje debe ser un número válido')
    .min(1, 'El porcentaje mínimo es 1%')
    .max(100, 'El porcentaje máximo es 100%'),

  tipo: z.enum(['forzoso', 'voluntario']),
});

export const bienSchema = z.object({
  id: z
    .string()
    .uuid('Identificador de bien no válido'),

  tipo: z.enum([
    'inmueble',
    'cuenta_bancaria',
    'vehiculo',
    'acciones',
    'cripto',
    'otro',
  ]),

  descripcion: z
    .string()
    .trim()
    .min(3, 'La descripción es obligatoria')
    .max(500, 'La descripción es demasiado larga'),

  valorEstimado: z
    .number()
    .finite('El valor estimado debe ser un número válido')
    .min(0, 'El valor estimado no puede ser negativo'),

  referencia: z
    .string()
    .trim()
    .max(250, 'La referencia es demasiado larga')
    .optional(),

  ubicacion: z
    .string()
    .trim()
    .max(250, 'La ubicación es demasiado larga')
    .optional(),
});

export const disposicionesSchema = z.object({
  albacea: z
    .string()
    .trim()
    .max(250, 'Los datos del albacea son demasiado largos')
    .optional(),

  testamentoVital: z.boolean(),

  tutelaMenores: z
    .string()
    .trim()
    .max(250, 'Los datos de tutela son demasiado largos')
    .optional(),

  legadoSolidario: z
    .object({
      ong: z
        .string()
        .trim()
        .min(2, 'El nombre de la ONG es obligatorio')
        .max(200, 'El nombre de la ONG es demasiado largo'),

      porcentaje: z
        .number()
        .finite('El porcentaje debe ser un número válido')
        .min(1, 'El porcentaje mínimo es 1%')
        .max(100, 'El porcentaje máximo es 100%'),
    })
    .optional(),
});

export const testamentoBorradorSchema = z
  .object({
    id: z
      .string()
      .uuid('Identificador de testamento no válido')
      .optional(),

    datosIdentidad: datosIdentidadSchema,

    herederos: z
      .array(herederoSchema)
      .max(100, 'No se pueden registrar más de 100 herederos'),

    bienes: z
      .array(bienSchema)
      .max(500, 'No se pueden registrar más de 500 bienes'),

    disposiciones: disposicionesSchema,
  })
  .superRefine((data, ctx) => {
    const totalHerederos = data.herederos.reduce(
      (total, heredero) => total + heredero.porcentaje,
      0
    );

    if (totalHerederos > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['herederos'],
        message: 'La suma de los porcentajes de los herederos no puede superar el 100%',
      });
    }
  });

export type DatosIdentidadInput = z.infer<typeof datosIdentidadSchema>;
export type HerederoInput = z.infer<typeof herederoSchema>;
export type BienInput = z.infer<typeof bienSchema>;
export type DisposicionesInput = z.infer<typeof disposicionesSchema>;
export type TestamentoBorradorInput = z.infer<
  typeof testamentoBorradorSchema
>;
