// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.create({
        data: {
            username: 'brian',
            email: 'brianrlam@gmail.com',
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
