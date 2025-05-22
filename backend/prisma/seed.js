// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const text1 = 
`white
6
12
16
20
22
22
20
16
12
6
`
// `!color #white [0]
// !mr 6sc [6]
// (inc)x6 [12]
// (1sc,inc)x6 [18]
// (2sc,inc)x6 [24]
// 24sc [24]
// 24sc [24]
// 24sc [24]
// 24sc [24]
// 24sc [24]
// (2sc,dec)x6 [18]
// (1sc,dec)x6 [12]
// (dec)x6 [6]
// !cut-fill-close [0]`

const text2 =
`!color #red [0]
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
!cut !fill !close [0]`

const text3 = 
`!color #white [0]
!mr 6sc [6]
(inc)x6 [12]
(1sc,inc)x6 [18]
(2sc,inc)x6 [24]
(5sc,inc)x4 [28]
(6sc,inc)x4 [32]
32sc [32]
32sc [32]
32sc [32]
(6sc,dec)x4 [28]
(5sc,dec)x4 [24]
(2sc,dec)x6 [18]
(1sc,dec)x6 [12]
(dec)x6 [6]
!cut-fill-close [0]`

const text4 = 
`!color #white [0]
!mr 6sc [6]
(inc)x6 [12]
1sc (inc,2sc)x4 1sc [16]
(3sc,inc)x4 [20]
4sc inc 10sc inc 4sc [22]
22 sc [22]
4sc dec 10sc dec 4sc [20]
(dec,3sc) x4 [16]
1sc (dec,2sc)x4 1sc [12]
(dec)x6 [6]
!cut !fill !close [0]`

const text5 = 
`!color #white [0]
!mr 6sc [6]
(inc)x6 [12]
(1sc,inc)x6 [18]
sc inc 2sc inc 3sc inc 2sc inc 3sc inc 2sc [23]
inc 4sc inc 3sc inc 4sc inc 3sc inc 4sc [28]
3sc (inc,6sc)x3 inc 3sc [32]
5sc (inc,9sc)x2 inc 6sc [35]
3sc inc 10sc inc 11sc inc 8sc [38]
12sc inc 25sc [39]
inc 38sc [40]
40sc [40]
38sc dec [39]
25sc dec 12sc [38]
8sc dec 11sc dec 10sc dec 3sc [35]
6sc dec 9sc dec 3sc dec 5sc [32]
3sc (dec,6sc)x3 dec 3sc [28]
4sc dec 3sc dec 4sc dec 3sc dec 4sc dec [23]
2sc dec 3sc dec 2sc dec 3sc dec 2sc dec 1sc [18]
(1sc,dec)x6 [12]
(dec)x6 [6]
!cut-fill-close [0]
`

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
            text: text1
        }
    });

    // const pattern2 = await prisma.pattern.create({
    //     data: {
    //         name: 'Large Ball',
    //         userId: user1.id,
    //         description: 'A simple large sphere',
    //         text: text2
    //     }
    // })

    // const pattern3 = await prisma.pattern.create({
    //     data: {
    //         name: 'A Rounder Sphere',
    //         userId: user1.id,
    //         description: 'changes circumference gradually',
    //         text: text3
    //     }
    // })

    // const pattern4 = await prisma.pattern.create({
    //     data: {
    //         name: 'Ideal Sphere (small)',
    //         userId: user1.id,
    //         description: 'https://mspremiseconclusion.wordpress.com/wp-content/uploads/2010/03/ideal-sphere3.pdf',
    //         text: text4
    //     }
    // })
    // const pattern5 = await prisma.pattern.create({
    //     data: {
    //         name: 'Ideal Sphere (large)',
    //         userId: user1.id,
    //         description: 'https://mspremiseconclusion.wordpress.com/wp-content/uploads/2010/03/ideal-sphere3.pdf',
    //         text: text5
    //     }
    // })

    // const project1 = await prisma.project.create({
    //     data: {
    //         name: 'Water Molecule',
    //         userId: user1.id,
    //         description: 'A simple water molecule model',
    //         }
    //     });

    // const projectPattern1 = await prisma.projectPattern.create({
    //     data: {
    //     projectId: project1.id,
    //     patternId: pattern1.id,
    //     }
    // });
    // const projectPattern2 = await prisma.projectPattern.create({
    //     data: {
    //     projectId: project1.id,
    //     patternId: pattern2.id,
    //     }
    // });
    // const projectPattern3 = await prisma.projectPattern.create({
    //     data: {
    //     projectId: project1.id,
    //     patternId: pattern1.id,
    //     }
    // });

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
