import React from 'react';
import { FaTrash } from 'react-icons/fa';

const CreateWorkout = ({ selectedExercises, setSelectedExercises }) => {
  const handleRemoveExercise = index => {
    const updatedExercises = [...selectedExercises];
    updatedExercises.splice(index, 1);
    setSelectedExercises(updatedExercises);
  };

  const handleSubmit = () => {
    // Submit logic for creating workout
    const workoutData = {
      title: 'New Workout',
      exercises: selectedExercises.map(ex => ({
        exercise: ex._id,
        sets: 2,
        reps: 8
      })),
      user: 'user-id-placeholder',
      isPublic: true
    };
    console.log(workoutData); // Call your create workout action here
  };

  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>Create Workout</h2>

      {selectedExercises?.length === 0 ? (
        <p>No exercises selected. Add exercises from the library.</p>
      ) : (
        <div>
          <h3 className='text-lg font-medium mb-3'>Exercises for Workout</h3>
          <ul className='space-y-4'>
            {selectedExercises?.map((exercise, index) => (
              <li
                key={index}
                className='flex justify-between items-center p-4 border bg-gray-100 rounded-md shadow-sm hover:shadow-lg'
              >
                <div className='flex items-center'>
                  <span>{exercise.title}</span>
                </div>
                <button
                  onClick={() => handleRemoveExercise(index)}
                  className='text-red-500'
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className='mt-4 bg-blue-600 text-white px-4 py-2 rounded-md'
      >
        Create Workout
      </button>
    </div>
  );
};

export default CreateWorkout;
