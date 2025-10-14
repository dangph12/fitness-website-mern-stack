import React, { useState } from 'react';
import { FaBook, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { createPlan } from '~/store/features/plan-slice';

import ExerciseLibrary from './exercise-library';

const CreatePlan = () => {
  const [days, setDays] = useState([{ dayName: 'Day 1', workouts: [] }]);
  const userId = useSelector(state => state.auth.user.id);
  const [selectedDay, setSelectedDay] = useState(0);

  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.plans);

  const addDay = () => {
    const newDay = { dayName: `Day ${days.length + 1}`, workouts: [] };
    setDays([...days, newDay]);
  };

  const handleAddExercise = (dayIndex, exercise) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].workouts.push({
      title: exercise.title,
      exercises: [
        {
          exercise: exercise._id,
          sets: [1]
        }
      ]
    });
    setDays(updatedDays);
  };

  const handleRemoveExercise = (dayIndex, exerciseIndex) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].workouts.splice(exerciseIndex, 1);
    setDays(updatedDays);
  };

  const handleRepsChange = (
    dayIndex,
    workoutIndex,
    exerciseIndex,
    setIndex,
    value
  ) => {
    const updatedDays = [...days];
    const currentExercise =
      updatedDays[dayIndex].workouts[workoutIndex].exercises[exerciseIndex];

    if (!currentExercise?.sets) {
      currentExercise.sets = [];
    }

    currentExercise.sets[setIndex] = value;

    setDays(updatedDays);
  };

  const handleAddSet = (dayIndex, workoutIndex, exerciseIndex) => {
    const updatedDays = [...days];

    const currentExercise =
      updatedDays[dayIndex]?.workouts[workoutIndex]?.exercises[exerciseIndex];

    if (currentExercise) {
      if (!currentExercise.sets) {
        currentExercise.sets = [];
      }

      currentExercise.sets.push(1);

      setDays(updatedDays);
    } else {
      console.error('Exercise not found. Please check your indices.');
    }
  };

  const handleRemoveSet = (dayIndex, workoutIndex, exerciseIndex, setIndex) => {
    const updatedDays = [...days];
    const currentExercise =
      updatedDays[dayIndex].workouts[workoutIndex].exercises[exerciseIndex];

    if (currentExercise.sets && currentExercise.sets[setIndex] !== undefined) {
      currentExercise.sets.splice(setIndex, 1);

      setDays(updatedDays);
    }
  };

  const handleSubmitPlan = () => {
    const planData = {
      title: `Plan ${new Date().getTime()}`,
      description: `Description for Plan ${new Date().getTime()}`,
      image: '',
      isPublic: true,
      user: userId,
      workouts: days.flatMap(day =>
        day.workouts.map(workout => ({
          title: workout.title,
          isPublic: workout.isPublic ?? false,
          user: workout.user || userId,
          exercises:
            workout.exercises?.map(exercise => ({
              exercise: exercise.exercise,
              sets: exercise.sets
            })) || []
        }))
      )
    };

    dispatch(createPlan(planData));
  };

  return (
    <div className='flex gap-8 p-6 bg-white rounded-lg shadow-md'>
      <div className='w-2/3 p-4 bg-white rounded-lg'>
        <h2 className='text-2xl font-semibold mb-4'>Create Plan</h2>

        <div className='flex justify-between mb-4'>
          <button
            onClick={addDay}
            className='bg-blue-600 text-white px-4 py-2 rounded-md'
          >
            + Add Day
          </button>

          <button
            onClick={handleSubmitPlan}
            className='bg-blue-600 text-white px-4 py-2 rounded-md flex items-center'
            disabled={loading}
          >
            <FaBook className='mr-2' />
            {loading ? 'Creating Plan...' : 'Create Plan'}
          </button>
        </div>

        {days.map((day, dayIndex) => (
          <div key={dayIndex} className='mt-4 border rounded-md p-4 mb-4'>
            <div className='flex justify-between items-center mb-4'>
              <span
                onClick={() => setSelectedDay(dayIndex)}
                className={`text-lg font-semibold cursor-pointer ${
                  selectedDay === dayIndex ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {day.dayName}
              </span>
              <span className='text-sm text-gray-500'>
                {day.workouts.length} workouts
              </span>
            </div>

            {day.workouts.length === 0 ? (
              <p>This day is empty. Add exercises from the library.</p>
            ) : (
              <div className='space-y-4'>
                {day.workouts.map((workout, workoutIndex) => (
                  <div
                    key={workoutIndex}
                    className='p-4 bg-gray-100 rounded-md'
                  >
                    <div className='flex items-center justify-between mb-3'>
                      <span>{workout.title}</span>
                      <button
                        onClick={() =>
                          handleRemoveExercise(dayIndex, workoutIndex)
                        }
                        className='text-red-500'
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className='space-y-4'>
                      <div className='grid grid-cols-4 gap-'>
                        <span className='font-semibold'>Set</span>
                        <span className='font-semibold'>Reps</span>
                      </div>

                      {workout?.exercises?.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex}>
                          <div className='space-y-4'>
                            {exercise.sets.map((set, setIndex) => (
                              <div
                                key={setIndex}
                                className='grid grid-cols-4 gap-4'
                              >
                                <span>{setIndex + 1}</span>
                                <input
                                  type='number'
                                  value={set}
                                  onChange={e =>
                                    handleRepsChange(
                                      dayIndex,
                                      workoutIndex,
                                      exerciseIndex,
                                      setIndex,
                                      e.target.value
                                    )
                                  }
                                  className='ml-2 p-2 border rounded-md'
                                  placeholder='Reps'
                                />
                                <button
                                  onClick={() =>
                                    handleRemoveSet(
                                      dayIndex,
                                      workoutIndex,
                                      exerciseIndex,
                                      setIndex
                                    )
                                  }
                                  className='ml-2 text-red-500'
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() =>
                              handleAddSet(
                                dayIndex,
                                workoutIndex,
                                exerciseIndex
                              )
                            }
                            className='mt-2 text-blue-600'
                          >
                            + Add Set
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='w-1/3 border-l p-4 rounded-lg shadow-lg'>
        <ExerciseLibrary
          handleAddExercise={exercise =>
            handleAddExercise(selectedDay, exercise)
          }
        />
      </div>
    </div>
  );
};

export default CreatePlan;
