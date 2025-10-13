import React, { useState } from 'react';
import { FaBook, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { createWorkout } from '~/store/features/workout-slice';

import ExerciseLibrary from './exercise-library';

const CreateWorkout = () => {
  const [days, setDays] = useState([{ dayName: 'Day 1', exercises: [] }]);
  const [selectedDay, setSelectedDay] = useState(0);

  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.workouts);

  const addDay = () => {
    const newDay = { dayName: `Day ${days.length + 1}`, exercises: [] };
    setDays([...days, newDay]);
  };

  const handleAddExercise = exercise => {
    const updatedDays = [...days];

    const exerciseExists = updatedDays[selectedDay].exercises.some(
      e => e.exercise._id === exercise._id
    );

    if (!exerciseExists) {
      updatedDays[selectedDay].exercises.push({
        exercise: { _id: exercise._id, title: exercise.title },
        sets: 0,
        reps: 0
      });

      setDays(updatedDays);
    }
  };

  const handleRemoveExercise = exerciseIndex => {
    const updatedDays = [...days];
    updatedDays[selectedDay].exercises.splice(exerciseIndex, 1);
    setDays(updatedDays);
  };

  const handleInputChange = (exerciseIndex, field, value) => {
    const updatedDays = [...days];
    updatedDays[selectedDay].exercises[exerciseIndex][field] = value;
    setDays(updatedDays);
  };

  const handleSubmitWorkout = () => {
    const workoutData = {
      title: `Workout Day ${selectedDay + 1}`,
      image: '',
      isPublic: true,
      user: '68dd311a1f6ef82b1f430d0f',
      exercises: days[selectedDay].exercises.map(exercise => ({
        exercise: exercise.exercise._id,
        sets: exercise.sets,
        reps: exercise.reps
      }))
    };

    console.log('Workout data:', workoutData);

    dispatch(createWorkout(workoutData));
  };

  return (
    <div className='flex gap-8 p-6 bg-white rounded-lg shadow-md'>
      <div className='w-2/3 p-4 bg-white rounded-lg'>
        <h2 className='text-2xl font-semibold mb-4'>Create Workout</h2>

        <div className='flex justify-between mb-4'>
          <button
            onClick={addDay}
            className='bg-blue-600 text-white px-4 py-2 rounded-md'
          >
            + Add Day
          </button>

          <button
            onClick={handleSubmitWorkout}
            className='bg-blue-600 text-white px-4 py-2 rounded-md flex items-center'
            disabled={loading}
          >
            <FaBook className='mr-2' />
            {loading ? 'Creating Workout...' : 'Create Workout'}
          </button>
        </div>

        {days.map((day, dayIndex) => (
          <div key={dayIndex} className='mt-4 border rounded-md p-4 mb-4'>
            <div className='flex justify-between items-center mb-4'>
              <div className='flex items-center'>
                <span
                  onClick={() => setSelectedDay(dayIndex)}
                  className={`text-lg font-semibold cursor-pointer ${
                    selectedDay === dayIndex ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {day.dayName}
                </span>
                <button
                  onClick={() => handleRemoveExercise(dayIndex)}
                  className='ml-4 text-red-500'
                >
                  <FaTrash />
                </button>
              </div>
              <span className='text-sm text-gray-500'>
                Est. 0 min | {day.exercises.length} exercises
              </span>
            </div>

            {day.exercises.length === 0 ? (
              <p>This day is empty. Add exercises from the library.</p>
            ) : (
              <div className='space-y-4'>
                {day.exercises.map((exercise, exerciseIndex) => (
                  <div
                    key={exerciseIndex}
                    className='p-4 bg-gray-100 rounded-md'
                  >
                    <div className='flex items-center justify-between mb-3'>
                      <span>{exercise.exercise.title}</span>
                      <button
                        onClick={() => handleRemoveExercise(exerciseIndex)}
                        className='text-red-500'
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className='flex space-x-4'>
                      <input
                        type='number'
                        value={exercise.sets}
                        onChange={e =>
                          handleInputChange(
                            exerciseIndex,
                            'sets',
                            e.target.value
                          )
                        }
                        className='p-2 border rounded-md'
                        placeholder='Sets'
                      />
                      <input
                        type='number'
                        value={exercise.reps}
                        onChange={e =>
                          handleInputChange(
                            exerciseIndex,
                            'reps',
                            e.target.value
                          )
                        }
                        className='p-2 border rounded-md'
                        placeholder='Reps'
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='w-1/3 border-l p-4 rounded-lg shadow-lg'>
        <ExerciseLibrary handleAddExercise={handleAddExercise} />
      </div>

      {error && <p className='text-red-500 mt-2 text-center'>{error}</p>}
    </div>
  );
};

export default CreateWorkout;
