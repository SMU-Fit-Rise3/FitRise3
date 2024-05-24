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

exports.postEatFood = async function (req, res) {
  const userId = req.params.id;
  const { mealType, newMeals } = req.body;
  console.log("dd"+JSON.stringify(newMeals));
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

    await prisma.eatFood.deleteMany({
      where: {
        CalendarDayId: calendarDay.id,
        mealType: mealType
      }
    });
    const meals= JSON.parse(newMeals);

    const newEatFoods = meals.map(meal => ({
      mealType: mealType,
      food: meal.name,
      calories: parseInt(meal.calories, 10),
      carbs: parseInt(meal.nutrients.carbs_gram, 10),
      protein: parseInt(meal.nutrients.protein_gram, 10), 
      fat: parseInt(meal.nutrients.fat_gram, 10),
      CalendarDayId: calendarDay.id
    }));

    await prisma.eatFood.createMany({
      data: newEatFoods
    });
    res.status(200).json({ message: 'Meals updated successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  } finally {
    await prisma.$disconnect();
  }
}