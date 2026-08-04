const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const nuevoEmail = process.argv[2];
  const nuevaPassword = process.argv[3];

  if (!nuevoEmail || !nuevaPassword) {
    console.error('Uso: node scripts/fix-user.js email@real.com NuevaContraseñaSegura');
    process.exit(1);
  }

  if (nuevaPassword.length < 8) {
    console.error('La contraseña debe tener al menos 8 caracteres.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(nuevaPassword, 12);

  const user = await prisma.user.update({
    where: { email: 'tu@email.com' },
    data: {
      email: nuevoEmail.trim().toLowerCase(),
      passwordHash,
    },
  });

  console.log('Usuario actualizado con éxito:');
  console.log({ id: user.id, email: user.email });
}

main()
  .catch((e) => console.error('Error:', e.message))
  .finally(() => prisma.$disconnect());