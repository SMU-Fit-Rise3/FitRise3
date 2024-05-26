const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

exports.postUserData = async function (req, res) {
    try {
        const userProfile = {
            age: req.body.age,
            height: req.body.height,
            weight: req.body.weight,
            level: req.body.selectedExerciseLevel, // 운동 수준
            exerciseGoal: req.body.exerciseGoal, // 운동 목표
            weeklyExerciseFrequency: req.body.exerciseFrequency// 주 운동 횟수
        };

        const gpt = require('../src/gpt');
        const response = await gpt.processUserInput(userProfile)
        const responseJson = JSON.parse(response)

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
                ex_plans: {
                    create: responseJson.exercisePlan.map((plan) => ({
                      day: `Day ${plan.day}`,
                      exercises: {
                        create: plan.exercises.map(exercise => ({
                          exercise: exercise.name, // 'name' 필드로 변경됨
                          sets: exercise.sets,
                          reps: exercise.reps
                        }))
                      }
                    }))
                  }
            }
        });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Server error');
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
    }
}

exports.nameCheck = async function (req, res) {
    const  name  = req.params.name
    try {
        const user = await prisma.users.findMany({
            where: {
                nickname: name,
            },
        });

        if (user.length === 0) {
            // 사용자가 없을 경우
            res.status(404).json("user not found");
        } else {
            // 사용자가 존재할 경우
            res.status(200).json(user[0].nickname);
        }
    } catch (e) {
        res.status(500).json("An error occurred while searching for the user");
    }
}
