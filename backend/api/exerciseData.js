const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

exports.getExerciseData = async function (req, res) {
    const userId = req.params.id;
    try {
        const ex = await prisma.users.findMany({
            where: {
                id: userId,
            },
            select: {
              id: true,
              ex_plans: {
                select: {
                  day: true,
                  exercises: true
                }
              }
            }
          })
          res.status(200).json(ex);
    } catch (error) {
        res.status(500).send('Server error');
    } finally {
        await prisma.$disconnect();
    }
}