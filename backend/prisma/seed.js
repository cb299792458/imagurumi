// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      username: 'brian',
      email: 'brianrlam@gmail.com',
    }
  });

  const pattern1 = await prisma.pattern.create({
    data: {
      name: 'Small Ball',
      userId: user1.id,
      description: 'A simple small sphere'
    }
  });

  const pattern2 = await prisma.pattern.create({
    data: {
      name: 'Large Ball',
      userId: user1.id,
      description: 'A simple large sphere'
    }
  })

  const project1 = await prisma.project.create({
    data: {
      name: 'Water Molecule',
      userId: user1.id,
      description: 'A simple water molecule model',
    }
  });

  const projectPattern1 = await prisma.projectPattern.create({
    data: {
      projectId: project1.id,
      patternId: pattern1.id,
    }
  });
  const projectPattern2 = await prisma.projectPattern.create({
    data: {
      projectId: project1.id,
      patternId: pattern2.id,
    }
  });
  const projectPattern3 = await prisma.projectPattern.create({
    data: {
      projectId: project1.id,
      patternId: pattern1.id,
    }
  });

  console.log('Seed data created.');
}

// Run the seed
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
