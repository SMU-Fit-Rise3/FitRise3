const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

exports.getAnalysisData = async function (req, res) {
  const userId = req.params.id;
  try {
    const analysis = await prisma.users.findMany({
      where: {
        id: userId,
      },
      select: {
        height: true,
        calendar: {
          select: {
            day: true,
            weight: true,
            eatfood: true,
            stressIndex: true
          }
        },
        calorie: {
          select: {
            calorie_goal: true,
            carbs: true,
            protein: true,
            fat: true
          }
        }
      }
    })
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).send('Server error');
  }
}