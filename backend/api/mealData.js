const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

exports.getTodayMealData = async function (req, res) {
    const userId = req.params.id;
    const today = new Date().toISOString().split('T')[0];
    try {
        const meal = await prisma.calendarDay.findFirst({
            where: {
                day: today,
                userId: userId
            },
            select: {
                eatfood: {
                    select: {
                        mealType: true,
                        food: true,
                        calories: true,
                        carbs: true,
                        protein: true,
                        fat: true
                    }
                }
            }
        });

        const calories = await prisma.calorie.findFirst({
            where: {
                userId: userId
            },
            select: {
                calorie_goal: true,
                carbs: true,
                protein: true,
                fat: true
            }
        });

        const response = {
            meal: meal,
            calories: calories
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).send('Server error');
    }
}
