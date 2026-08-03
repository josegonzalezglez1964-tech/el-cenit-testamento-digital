const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const nombre = process.argv[4] || 'Jose Gonzalez';

  if (!email || !password) {
    console.error('Uso: node scripts/create-user.js email@ejemplo.com miContraseñaSegura "Nombre completo"');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('La contraseña debe tener al menos 8 caracteres.');
    process.exit(1);
  }

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) {
    console.error('Ya existe un usuario con ese email.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email: email.trim().toLowerCase(),
      passwordHash,
      nombre,
      role: 'TESTADOR',
    },
  });

  console.log('Usuario creado con éxito:');
  console.log({ id: user.id, email: user.email, nombre: user.nombre });
}

main()
  .catch((e) => {
    console.error('Error:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());