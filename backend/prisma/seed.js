// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('wordpass', 10);
    await prisma.user.upsert({
        where: { email: 'brianrlam@gmail.com' },
        update: { password: hashedPassword },
        create: {
            username: 'brian',
            email: 'brianrlam@gmail.com',
            password: hashedPassword,
        },
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
