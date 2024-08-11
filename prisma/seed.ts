import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    password: bcrypt.hashSync('password123', 10),
    todos: {
      create: [
        { title: 'Buy groceries' },
        { title: 'Clean the house' },
      ],
    },
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    password: bcrypt.hashSync('password456', 10),
    todos: {
      create: [
        { title: 'Finish project report' },
        { title: 'Call mom' },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data
  await prisma.todo.deleteMany();
  await prisma.user.deleteMany();

  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });

    console.log(`Created user with id: ${user.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });