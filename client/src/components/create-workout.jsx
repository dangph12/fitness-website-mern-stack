import React, { useState } from 'react';
import { FaBook, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { createWorkout } from '~/store/features/workout-slice';

import ExerciseLibrary from './exercise-library';

const CreateWorkout = () => {
  const [exercises, setExercises] = useState([]);
  const userId = useSelector(state => state.auth.user.id);

  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.workouts);

  const handleAddExercise = exercise => {
    const exerciseExists = exercises.some(e => e.exercise._id === exercise._id);

    if (!exerciseExists) {
      setExercises([
        ...exercises,
        {
          exercise: { _id: exercise._id, title: exercise.title },
          sets: [1]
        }
      ]);
    }
  };

  const handleRemoveExercise = exerciseIndex => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(exerciseIndex, 1);
    setExercises(updatedExercises);
  };

  const handleInputChange = (exerciseIndex, setIndex, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex] = value;
    setExercises(updatedExercises);
  };

  const handleAddSet = exerciseIndex => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.push(1);
    setExercises(updatedExercises);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    setExercises(updatedExercises);
  };

  const handleSubmitWorkout = () => {
    const workoutData = {
      title: 'My Workout',
      image: '',
      isPublic: true,
      user: userId,
      exercises: exercises.map(exercise => ({
        exercise: exercise.exercise._id,
        sets: exercise.sets
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
            onClick={handleSubmitWorkout}
            className='bg-blue-600 text-white px-4 py-2 rounded-md flex items-center'
            disabled={loading}
          >
            <FaBook className='mr-2' />
            {loading ? 'Creating Workout...' : 'Create Workout'}
          </button>
        </div>

        {exercises.length > 0 ? (
          exercises.map((exercise, exerciseIndex) => (
            <div
              key={exerciseIndex}
              className='p-4 bg-gray-100 rounded-md mb-4'
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

              <div className='grid grid-cols-4 gap-4'>
                <span className='font-semibold'>Set</span>
                <span className='font-semibold'>Reps</span>
              </div>

              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className='grid grid-cols-4 gap-4'>
                  <span>{setIndex + 1}</span>
                  <input
                    type='number'
                    value={set}
                    onChange={e =>
                      handleInputChange(exerciseIndex, setIndex, e.target.value)
                    }
                    className='p-2 border rounded-md'
                    placeholder='Reps'
                  />
                  <button
                    onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                    className='text-red-500'
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddSet(exerciseIndex)}
                className='mt-2 text-blue-600'
              >
                + Add Set
              </button>
            </div>
          ))
        ) : (
          <p>Please select exercises from the library.</p>
        )}
      </div>

      <div className='w-1/3 border-l p-4 rounded-lg shadow-lg'>
        <ExerciseLibrary handleAddExercise={handleAddExercise} />
      </div>
    </div>
  );
};

export default CreateWorkout;
