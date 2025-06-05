// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import {
    dangoStick,
    largeColorlessBall,
    minionArm,
    minionBody,
    minionEye,
    minionLeg,
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
            name: 'Pink Ball',
            userId: user1.id,
            description: 'A simple small sphere',
            text: 'pink' + largeColorlessBall
        }
    });

    const pattern2 = await prisma.pattern.create({
        data: {
            name: 'White Ball',
            userId: user1.id,
            description: 'A simple small sphere',
            text: 'white' + largeColorlessBall
        }
    })

    const pattern3 = await prisma.pattern.create({
        data: {
            name: 'Green Ball',
            userId: user1.id,
            description: 'A simple small sphere',
            text: 'lightgreen' + largeColorlessBall
        }
    })

    const pattern4 = await prisma.pattern.create({
        data: {
            name: 'Dango Stick',
            userId: user1.id,
            description: 'A stick for holding dango',
            text: dangoStick,
        }
    });

    const project1 = await prisma.project.create({
        data: {
            name: 'Hanami Dango',
            userId: user1.id,
            description: 'A rice dumpling dessert typically eaten during sakura season',
        }
    });

    const projectPattern0 = await prisma.projectPattern.create({
        data: {
            projectId: project1.id,
            patternId: pattern4.id,
            x: 0,
            y: 0,
            z: 0,
            rotX: 0,
            rotY: 0,
            rotZ: 0,
        }
    });

    const projectPattern1 = await prisma.projectPattern.create({
        data: {
            projectId: project1.id,
            patternId: pattern1.id,
            x: 0,
            y: 0,
            z: 33,
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
            y: 0,
            z: 22,
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
            z: 11,
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

    const minionBodyPattern = await prisma.pattern.create({
        data: {
            name: 'Minion Body',
            userId: user1.id,
            description: 'The body of a Minion',
            text: minionBody,
        }
    });
    const minionEyePattern = await prisma.pattern.create({
        data: {
            name: 'Minion Eye',
            userId: user1.id,
            description: 'The eye of a Minion',
            text: minionEye
        }
    });
    const minionArmPattern = await prisma.pattern.create({
        data: {
            name: 'Minion Arm',
            userId: user1.id,
            description: 'The arm of a Minion',
            text: minionArm,
        }
    });
    const minionLegPattern = await prisma.pattern.create({
        data: {
            name: 'Minion Leg',
            userId: user1.id,
            description: 'The leg of a Minion',
            text: minionLeg,
        }
    });

    const minionProject = await prisma.project.create({
        data: {
            name: 'Minion',
            userId: user1.id,
            description: 'A small yellow creature from the Despicable Me franchise',
        }
    });
    await prisma.projectPattern.create({
        data: {
            projectId: minionProject.id,
            patternId: minionBodyPattern.id,
            x: 0,
            y: 0,
            z: 0,
            rotX: 0,
            rotY: 0,
            rotZ: 0,
        }
    });
    await prisma.projectPattern.create({
        data: {
            projectId: minionProject.id,
            patternId: minionEyePattern.id,
            x: 0,
            y: 10,
            z: 8.5,
            rotX: 80,
            rotY: 0,
            rotZ: 0,
        }
    });
    await prisma.projectPattern.create({
        data: {
            projectId: minionProject.id,
            patternId: minionArmPattern.id,
            x: 22,
            y: 0,
            z: 15,
            rotX: 0,
            rotY: 270,
            rotZ: 0,
        }
    });
    await prisma.projectPattern.create({
        data: {
            projectId: minionProject.id,
            patternId: minionArmPattern.id,
            x: -22,
            y: 0,
            z: 15,
            rotX: 0,
            rotY: 90,
            rotZ: 0,
        }
    });
    await prisma.projectPattern.create({
        data: {
            projectId: minionProject.id,
            patternId: minionLegPattern.id,
            x: 4,
            y: 0,
            z: 36,
            rotX: 0,
            rotY: 180,
            rotZ: 0,
        }
    });
    await prisma.projectPattern.create({
        data: {
            projectId: minionProject.id,
            patternId: minionLegPattern.id,
            x: -4,
            y: 0,
            z: 36,
            rotX: 0,
            rotY: 180,
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
