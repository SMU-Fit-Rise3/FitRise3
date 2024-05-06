const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

exports.postUserData = async function (req, res) {
    try {
        const user = await prisma.users.create({
            data: {
                nickname: req.body.nickname,
                gender: req.body.selectedGender,
                age: req.body.age,
                height: req.body.height,
                weight: req.body.weight,
                ex_frequency: req.body.exerciseFrequency,
                ex_level: req.body.selectedExerciseLevel,
                ex_goal: req.body.exerciseGoal,
            }
        });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Server error');
    } finally {
        await prisma.$disconnect();
    }
}

exports.insertCalorieData = async function (req, res) {
    const userId = req.params.id;
    const { calorie_goal, carbs, protein, fat } = req.body;
    try {
        const existingCalorie = await prisma.calorie.findFirst({
            where: { userId: userId },
        });
        let updateCalorie;
        if (!existingCalorie) {
            updateCalorie = await prisma.calorie.create({
                data: {
                    calorie_goal: calorie_goal,
                    carbs: carbs,
                    protein: protein,
                    fat: fat,
                    userId: userId
                },
            });
            console.log('Calorie record created for user');
        } else {
            updateCalorie = await prisma.calorie.update({
                where: { id: existingCalorie.id },
                data: {
                    calorie_goal: calorie_goal,
                    carbs: carbs,
                    protein: protein,
                    fat: fat
                },
            });
            console.log('Calorie record updated for user');
        }
        res.status(200).json({ message: 'Calorie information updated successfully', updateCalorie });
    } catch (error) {
        console.error('Error updating calorie information:', error);
        res.status(500).json({ message: 'An error occurred while updating calorie information' });
    } finally {
        await prisma.$disconnect();
    }
}