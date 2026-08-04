const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const nuevaPassword = process.argv[3];

  if (!email || !nuevaPassword) {
    console.error('Uso: node scripts/reset-password.js email@ejemplo.com NuevaContraseñaSegura');
    process.exit(1);
  }

  if (nuevaPassword.length < 8) {
    console.error('La contraseña debe tener al menos 8 caracteres.');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) {
    console.error('No existe ningún usuario con ese email.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(nuevaPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  console.log('Contraseña actualizada con éxito para:', user.email);
}

main()
  .catch((e) => {
    console.error('Error:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());