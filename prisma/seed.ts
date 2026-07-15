import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const client = await prisma.user.upsert({
    where: { email: 'cliente@demo.com' },
    update: {},
    create: { name: 'Cliente Demo', email: 'cliente@demo.com', role: Role.CLIENT },
  });

  const provider = await prisma.user.upsert({
    where: { email: 'proveedor@demo.com' },
    update: {},
    create: { name: 'Proveedor Demo', email: 'proveedor@demo.com', role: Role.PROVIDER },
  });

  console.log('Usuarios de prueba creados:');
  console.log({ client, provider });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
