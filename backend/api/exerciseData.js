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

exports.completedExercise = async function (req, res) {
  const gpt = require('../src/gpt');
  const user_Id = req.params.id;
  const exercise_Id = req.params.exerciseId;

  try {
    const today = new Date().toISOString().split('T')[0];
    let calendarDay = await prisma.calendarDay.findFirst({
      where: {
        day: today,
        userId: user_Id
      }
    });
    if (!calendarDay) {
      calendarDay = await prisma.calendarDay.create({
        data: {
          day: today,
          userId: user_Id,
        }
      });
    }
    
      const exercise = await prisma.exercise.findUnique({
        where: { id: exercise_Id }
      });

      // Exercise 정보를 기반으로 doExercise 추가
      if (exercise) {
        await prisma.doExercise.create({
          data: {
            exercise: exercise.exercise,
            sets: exercise.sets,
            reps: exercise.reps,
            CalendarDayId: calendarDay.id
          }
        });
        //체크된 운동 삭제
        const deletedExercise = await prisma.Exercise.delete({
          where: {
            id: exercise_Id
          },
        });
        // 해당 WorkoutDay의 남은 Exercise 개수 확인
        const remainingExercises = await prisma.Exercise.count({
          where: { workoutDayId: deletedExercise.workoutDayId },
        });

        // Exercise가 더 이상 없으면 WorkoutDay 삭제
        if (remainingExercises === 0) {
          await prisma.workoutDay.delete({
            where: { id: deletedExercise.workoutDayId },
          });
        }
      }
    
    //plans user확인
    const user_plan = await prisma.users.findUnique({
      where: {
        id: user_Id,
      },
      select: {
        height: true,
        weight: true,
        ex_frequency: true,
        ex_level: true,
        ex_goal: true,
        ex_plans: true, // plans도 포함
      },
    });

    if (user_plan && user_plan.ex_plans.length > 0) {
      // plans 배열에 항목이 남아 있음
      console.log("남은 plans가 있습니다.");
    } else {
      // 해당 사용자에게 plans가 없는 경우, 새로운 plans를 생성
      const response = await gpt.processUserInput({
        age: user_plan.age,
        height: user_plan.height,
        weight: user_plan.weight,
        level: user_plan.level, // 운동 수준
        exerciseGoal: user_plan.ex_goal, // 운동 목표
        weeklyExerciseFrequency: user_plan.ex_frequency // 주 운동 횟수
      })
      const responseJson = JSON.parse(response)
      console.log(responseJson);
      const createdPlans = await prisma.users.update({
        where: {
          id: user_Id,
        },
        data: {
          ex_plans: {
            create: responseJson.exercisePlan.map(plan => ({
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
        },
      });
    }
     
    //업데이트된 유저 read
    const user = await prisma.users.findMany({
      where: {
        id: user_Id,
      },
      select: {
        id: true,
        ex_plans: {
          select: {
            day: true,
            exercises: true,
          }
        }
      }
    });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

//다한 운동
exports.getDoExerciseData = async function (req, res) {
  const userId = req.params.id;
  const today = new Date().toISOString().split('T')[0];
  try {
    const calendarDay = await prisma.calendarDay.findFirst({
      where: {
        day: today,
        userId: userId,
      },
      include: {
        doexercises: true,
      },
    });
    if (calendarDay) {
      const exercises = calendarDay.doexercises.map((exercise) => exercise.exercise);
      res.status(200).json(exercises);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).send('Server error');
  } finally {
    await prisma.$disconnect();
  }
}