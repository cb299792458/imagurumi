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
            description: 'A simple small sphere',
            text: `
                !color #white [0]
                !mr 6sc [6]
                (inc)x6 [12]
                (1sc,inc)x6 [18]
                (2sc,inc)x6 [24]
                24sc [24]
                24sc [24]
                24sc [24]
                24sc [24]
                24sc [24]
                (2sc,dec)x6 [18]
                (1sc,dec)x6 [12]
                (dec)x6 [6]
                !cut-fill-close [0]
            `
        }
    });

    const pattern2 = await prisma.pattern.create({
        data: {
            name: 'Large Ball',
            userId: user1.id,
            description: 'A simple large sphere',
            text: `
                !color #red
                !mr 6sc [6]
                (inc)x6 [12]
                (1sc,inc)x6 [18]
                (2sc,inc)x6 [24]
                (3sc,inc)x6 [30]
                (4sc,inc)x6 [36]
                36sc [36]
                36sc [36]
                36sc [36]
                36sc [36]
                36sc [36]
                36sc [36]
                36sc [36]
                (4sc,dec)x6 [30]
                (3sc,dec)x6 [24]
                (2sc,dec)x6 [18]
                (1sc,dec)x6 [12]
                (dec)x6 [6]
                !cut !fill !close [0]
            `
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
