const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, nombre: true, createdAt: true },
  });
  console.log('Usuarios encontrados:', users.length);
  console.log(users);
}

main()
  .catch((e) => console.error('Error:', e.message))
  .finally(() => prisma.$disconnect());