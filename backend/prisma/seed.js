// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import {
    colorlessBall,
    pokeballBody,
    pokeballButton,
} from './seedPatterns.js';
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
            name: 'Red Ball',
            userId: user1.id,
            description: 'A simple small sphere',
            text: 'red' + colorlessBall
        }
    });

    const pattern2 = await prisma.pattern.create({
        data: {
            name: 'Green Ball',
            userId: user1.id,
            description: 'A simple small sphere',
            text: 'green' + colorlessBall
        }
    })

    const pattern3 = await prisma.pattern.create({
        data: {
            name: 'A Blue Sphere',
            userId: user1.id,
            description: 'A simple small sphere',
            text: 'blue' + colorlessBall
        }
    })

    const project1 = await prisma.project.create({
        data: {
                name: 'Three Balls',
                userId: user1.id,
                description: 'Three colored balls arranged in a triangle',
            }
        });

    const projectPattern1 = await prisma.projectPattern.create({
        data: {
            projectId: project1.id,
            patternId: pattern1.id,
            x: 5,
            y: 0,
            z: 0,
            rotX: 0,
            rotY: 0,
            rotZ: 0,
        }
    });
    const projectPattern2 = await prisma.projectPattern.create({
        data: {
            projectId: project1.id,
            patternId: pattern2.id,
            x: 0,
            y: 5,
            z: 0,
            rotX: 0,
            rotY: 0,
            rotZ: 0,
        }
    });
    const projectPattern3 = await prisma.projectPattern.create({
        data: {
            projectId: project1.id,
            patternId: pattern3.id,
            x: 0,
            y: 0,
            z: 5,
            rotX: 0,
            rotY: 0,
            rotZ: 0,
        }
    });

    const pokeballProject = await prisma.project.create({
        data: {
            name: 'Pokéball',
            userId: user1.id,
            description: 'A device used to catch and store Pokémon',
        }
    });
    const pokeballBodyPattern = await prisma.pattern.create({
        data: {
            name: 'Pokéball Body',
            userId: user1.id,
            description: 'The body of a Pokéball',
            text: pokeballBody,
        }
    });
    const pokeballButtonPattern = await prisma.pattern.create({
        data: {
            name: 'Pokéball Button',
            userId: user1.id,
            description: 'The button of a Pokéball',
            text: pokeballButton,
        }
    });
    const pokeballBodyProjectPattern = await prisma.projectPattern.create({
        data: {
            projectId: pokeballProject.id,
            patternId: pokeballBodyPattern.id,
            x: 0,
            y: 0,
            z: 0,
            rotX: 0,
            rotY: 0,
            rotZ: 0,
        }
    });
    const pokeballButtonProjectPattern = await prisma.projectPattern.create({
        data: {
            projectId: pokeballProject.id,
            patternId: pokeballButtonPattern.id,
            x: 7,
            y: 0,
            z: 6.4,
            rotX: 0,
            rotY: 270,
            rotZ: 0,
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
