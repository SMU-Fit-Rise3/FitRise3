const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

exports.getCalendarData = async function (req, res) {
    const userId = req.params.id;
    try {
      const cal = await prisma.users.findMany({
        where: {
          id: userId,
        },
        select: {
          id: true,
          calendar: {
            select: {
              day: true,
              doexercises: true
            }
          }
        }
      })
      res.status(200).json(cal);
    } catch (error) {
      res.status(500).send('Server error');
    } finally {
      await prisma.$disconnect();
    }
  }