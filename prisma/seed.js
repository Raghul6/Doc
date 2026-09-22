const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { id: 'user_alice' },
    update: {},
    create: {
      id: 'user_alice',
      name: 'Alice',
    },
  })

  const bob = await prisma.user.upsert({
    where: { id: 'user_bob' },
    update: {},
    create: {
      id: 'user_bob',
      name: 'Bob',
    },
  })
  
  const charlie = await prisma.user.upsert({
    where: { id: 'user_charlie' },
    update: {},
    create: {
      id: 'user_charlie',
      name: 'Charlie',
    },
  })

  console.log({ alice, bob, charlie })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
