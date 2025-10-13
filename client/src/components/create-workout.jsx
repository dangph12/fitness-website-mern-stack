import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { createWorkout } from '~/store/features/workout-slice'; // Import createWorkout action

import ExerciseLibrary from './exercise-library'; // Import ExerciseLibrary

const CreateWorkout = () => {
  const [days, setDays] = useState([{ dayName: 'Day 1', exercises: [] }]);
  const [selectedDay, setSelectedDay] = useState(0);

  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.workouts); // Get loading and error from state

  // Add a new day
  const addDay = () => {
    const newDay = { dayName: `Day ${days.length + 1}`, exercises: [] };
    setDays([...days, newDay]);
  };

  // Add exercise to the selected day
  const handleAddExercise = exercise => {
    const updatedDays = [...days];

    // Check if the exercise already exists by its ID
    const exerciseExists = updatedDays[selectedDay].exercises.some(
      e => e.exercise._id === exercise._id
    );

    if (!exerciseExists) {
      updatedDays[selectedDay].exercises.push({
        exercise: { _id: exercise._id, title: exercise.title }, // Ensure exercise._id is passed correctly
        sets: 0, // Initialize sets with default values
        reps: 0 // Initialize reps with default values
      });

      setDays(updatedDays);
    }
  };

  // Remove exercise from the selected day
  const handleRemoveExercise = exerciseIndex => {
    const updatedDays = [...days];
    updatedDays[selectedDay].exercises.splice(exerciseIndex, 1);
    setDays(updatedDays);
  };

  // Handle input change for sets and reps
  const handleInputChange = (exerciseIndex, field, value) => {
    const updatedDays = [...days];
    updatedDays[selectedDay].exercises[exerciseIndex][field] = value;
    setDays(updatedDays);
  };

  // Handle form submission to create the workout
  const handleSubmitWorkout = () => {
    // Create FormData object
    const formData = new FormData();

    // Add basic fields to FormData
    formData.append('title', `Workout Day ${selectedDay + 1}`);
    formData.append('image', ''); // If image is required, ensure it is not undefined
    formData.append('isPublic', true);
    formData.append('user', '68dd311a1f6ef82b1f430d0f'); // User ID as string

    // Add exercises in proper format
    days[selectedDay].exercises.forEach((exercise, index) => {
      formData.append(`exercises[${index}][exercise]`, exercise.exercise._id);
      formData.append(`exercises[${index}][sets]`, exercise.sets);
      formData.append(`exercises[${index}][reps]`, exercise.reps);
    });

    // Log FormData content for debugging
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Dispatch the createWorkout action
    dispatch(createWorkout(formData));
  };

  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>Create Workout</h2>

      {/* Day selection */}
      <div className='flex space-x-4 mb-4'>
        {days.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className={`cursor-pointer p-4 rounded-full border-2 flex justify-center items-center ${
              selectedDay === dayIndex
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setSelectedDay(dayIndex)}
          >
            {day.dayName}
          </div>
        ))}
        <button onClick={addDay} className='text-blue-500 hover:text-blue-700'>
          + Add Day
        </button>
      </div>

      {/* Main content split into two sections */}
      <div className='flex space-x-8'>
        {/* Left: Exercises for the selected day */}
        <div className='w-4/5'>
          {days[selectedDay]?.exercises?.length === 0 ? (
            <p>
              No exercises added for {days[selectedDay]?.dayName}. Add exercises
              from the library.
            </p>
          ) : (
            <div>
              <h3 className='text-lg font-medium mb-3'>
                Exercises for {days[selectedDay]?.dayName}
              </h3>
              <ul className='space-y-4'>
                {days[selectedDay]?.exercises.map((exercise, exerciseIndex) => (
                  <li
                    key={exerciseIndex}
                    className='border bg-gray-100 rounded-md shadow-sm p-4 hover:shadow-lg'
                  >
                    <div className='flex items-center mb-3'>
                      <span>{exercise.exercise.title}</span>
                      <button
                        onClick={() => handleRemoveExercise(exerciseIndex)}
                        className='ml-4 text-red-500'
                      >
                        <FaTrash />
                      </button>
                    </div>
                    {/* Inputs for sets and reps */}
                    <div className='grid grid-cols-4 gap-4 mb-2'>
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
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Exercise Library */}
        <div className='w-1/2'>
          <ExerciseLibrary handleAddExercise={handleAddExercise} />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitWorkout}
        className='mt-4 bg-blue-600 text-white px-4 py-2 rounded-md'
        disabled={loading}
      >
        {loading ? 'Creating Workout...' : 'Create Workout'}
      </button>

      {/* Display Error if any */}
      {error && <p className='text-red-500 mt-2'>{error}</p>}
    </div>
  );
};

export default CreateWorkout;
