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

exports.updateWeightData = async function (req, res) {
  const userId = req.params.id;
  const today = new Date().toISOString().split('T')[0];
  try {
    let calendarDay = await prisma.calendarDay.findFirst({
      where: {
        day: today,
        userId: userId
      }
    });
    if (!calendarDay) {
      calendarDay = await prisma.calendarDay.create({
        data: {
          day: today,
          userId: userId,
        }
      });
    }
    const updatedUser = await prisma.calendarDay.update({
      where: { id: calendarDay.id },
      data: { weight: req.body.weight }
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await prisma.$disconnect();
  }
}