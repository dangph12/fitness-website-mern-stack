import React, { useState } from 'react';
import { FaBook, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { createPlan } from '~/store/features/plan-slice';

import ExerciseLibrary from './exercise-library';

const CreatePlan = () => {
  const [days, setDays] = useState([{ dayName: 'Day 1', workouts: [] }]);
  const [selectedDay, setSelectedDay] = useState(0);
  const userId = useSelector(state => state.auth.user.id);
  const { loading } = useSelector(state => state.plans);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addDay = () =>
    setDays([...days, { dayName: `Day ${days.length + 1}`, workouts: [] }]);
  const removeDay = index => {
    const updated = [...days];
    updated.splice(index, 1);
    setDays(updated);
    if (selectedDay >= updated.length) setSelectedDay(updated.length - 1);
  };
  const handleDayTitleChange = (index, value) => {
    const updated = [...days];
    updated[index].dayName = value;
    setDays(updated);
  };

  const handleAddExercise = (dayIndex, exercise) => {
    const updated = [...days];
    updated[dayIndex].workouts.push({
      title: exercise.title,
      image: null,
      exercises: [{ exercise: exercise._id, sets: [1] }]
    });
    setDays(updated);
  };
  const handleRemoveExercise = (dayIndex, workoutIndex) => {
    const updated = [...days];
    updated[dayIndex].workouts.splice(workoutIndex, 1);
    setDays(updated);
  };
  const handleWorkoutTitleChange = (dayIndex, workoutIndex, value) => {
    const updated = [...days];
    updated[dayIndex].workouts[workoutIndex].title = value;
    setDays(updated);
  };
  const handleWorkoutImageChange = (dayIndex, workoutIndex, file) => {
    const updated = [...days];
    updated[dayIndex].workouts[workoutIndex].image = file;
    setDays(updated);
  };

  const handleRepsChange = (
    dayIndex,
    workoutIndex,
    exIndex,
    setIndex,
    value
  ) => {
    const updated = [...days];
    const exercise =
      updated[dayIndex].workouts[workoutIndex].exercises[exIndex];
    if (!exercise.sets) exercise.sets = [];
    exercise.sets[setIndex] = Number(value);
    setDays(updated);
  };

  const handleAddSet = (dayIndex, workoutIndex, exIndex) => {
    const updated = [...days];
    const exercise =
      updated[dayIndex].workouts[workoutIndex].exercises[exIndex];
    if (!exercise.sets) exercise.sets = [];
    exercise.sets.push(1);
    setDays(updated);
  };
  const handleRemoveSet = (dayIndex, workoutIndex, exIndex, setIndex) => {
    const updated = [...days];
    const exercise =
      updated[dayIndex].workouts[workoutIndex].exercises[exIndex];
    if (exercise.sets && exercise.sets[setIndex] !== undefined) {
      exercise.sets.splice(setIndex, 1);
      setDays(updated);
    }
  };

  const handleSubmitPlan = () => {
    const formData = new FormData();
    formData.append('title', `Plan ${Date.now()}`);
    formData.append('description', `Description for Plan ${Date.now()}`);
    formData.append('isPublic', 'true');
    formData.append('user', userId);

    days.forEach(day =>
      day.workouts.forEach((workout, i) => {
        formData.append(`workouts[${i}][title]`, workout.title);
        formData.append(
          `workouts[${i}][isPublic]`,
          String(workout.isPublic ?? false)
        );
        formData.append(`workouts[${i}][user]`, workout.user || userId);
        if (workout.image)
          formData.append(`workouts[${i}][image]`, workout.image);

        workout.exercises.forEach((ex, j) => {
          formData.append(
            `workouts[${i}][exercises][${j}][exercise]`,
            ex.exercise
          );
          ex.sets.forEach((set, k) =>
            formData.append(
              `workouts[${i}][exercises][${j}][sets][${k}]`,
              String(set)
            )
          );
        });
      })
    );

    dispatch(createPlan(formData))
      .then(() => {
        toast.success('Plan created successfully!');
        setTimeout(() => navigate('/'), 2000);
      })
      .catch(() => toast.error('Failed to create plan'));
  };

  return (
    <div className='flex gap-6 p-6 bg-gray-50 rounded-lg shadow-md'>
      <div className='w-2/3 p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex justify-between mb-4'>
          <button
            onClick={addDay}
            className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
          >
            + Add Day
          </button>
          <button
            onClick={handleSubmitPlan}
            disabled={loading}
            className='bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700'
          >
            <FaBook className='mr-2' />{' '}
            {loading ? 'Creating...' : 'Create Plan'}
          </button>
        </div>

        {days.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className={`mb-6 p-4 rounded-lg shadow-sm border ${
              selectedDay === dayIndex ? 'border-blue-500' : 'border-gray-300'
            }`}
          >
            <div className='flex justify-between items-center mb-3'>
              <input
                type='text'
                value={day.dayName}
                onChange={e => handleDayTitleChange(dayIndex, e.target.value)}
                onClick={() => setSelectedDay(dayIndex)}
                className={`text-lg font-semibold border rounded-md p-2 focus:outline-none ${
                  selectedDay === dayIndex
                    ? 'border-blue-500 font-bold'
                    : 'border-gray-300'
                }`}
              />

              <button
                onClick={() => removeDay(dayIndex)}
                className='bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 flex items-center'
              >
                <FaTrash className='mr-1' /> Delete Day
              </button>
            </div>

            {day.workouts.length === 0 ? (
              <p className='text-gray-400'>
                No workouts yet. Add exercises from library.
              </p>
            ) : (
              <div className='grid gap-4'>
                {day.workouts.map((workout, workoutIndex) => (
                  <div
                    key={workoutIndex}
                    className='bg-gray-100 p-4 rounded-lg relative flex flex-col gap-3'
                  >
                    <button
                      onClick={() =>
                        handleRemoveExercise(dayIndex, workoutIndex)
                      }
                      className='absolute top-2 right-2 bg-red-400 text-white px-2 py-1 rounded-md hover:bg-red-600'
                    >
                      <FaTrash />
                    </button>

                    <div className='flex items-center gap-4'>
                      <input
                        type='text'
                        value={workout.title}
                        readOnly
                        className='flex-1 p-2 border rounded-md bg-gray-200 text-gray-700 cursor-not-allowed'
                      />
                      <div>
                        <input
                          type='file'
                          id={`workoutImage-${dayIndex}-${workoutIndex}`}
                          onChange={e =>
                            handleWorkoutImageChange(
                              dayIndex,
                              workoutIndex,
                              e.target.files[0]
                            )
                          }
                          className='hidden'
                        />
                        <label
                          htmlFor={`workoutImage-${dayIndex}-${workoutIndex}`}
                          className='w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md cursor-pointer overflow-hidden'
                        >
                          {workout.image ? (
                            <img
                              src={URL.createObjectURL(workout.image)}
                              alt='Workout'
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <span className='text-gray-500 text-sm'>
                              Add Image
                            </span>
                          )}
                        </label>
                      </div>
                    </div>

                    {workout.exercises.map((exercise, exIndex) => (
                      <div
                        key={exIndex}
                        className='border p-3 rounded-md flex flex-col gap-2 bg-white'
                      >
                        <div className='grid grid-cols-2 gap-20 mb-3'>
                          <span className='font-semibold text-center mr-25'>
                            Set
                          </span>
                          <span className='font-semibold text-center mr-500'>
                            Reps
                          </span>
                        </div>
                        {exercise.sets.map((set, setIndex) => (
                          <div
                            key={setIndex}
                            className='flex items-center gap-2'
                          >
                            <span className='p-2 border rounded-md w-100 text-center'>
                              {setIndex + 1}
                            </span>
                            <input
                              type='number'
                              value={set}
                              onChange={e =>
                                handleRepsChange(
                                  dayIndex,
                                  workoutIndex,
                                  exIndex,
                                  setIndex,
                                  e.target.value
                                )
                              }
                              className='p-2 border rounded-md w-100 text-center'
                              min={1}
                            />
                            <button
                              onClick={() =>
                                handleRepsChange(
                                  dayIndex,
                                  workoutIndex,
                                  exIndex,
                                  setIndex,
                                  Math.max(set - 1, 1)
                                )
                              }
                              className='bg-red-200 text-white p-2 rounded-md hover:bg-red-600'
                            >
                              -
                            </button>
                            <button
                              onClick={() =>
                                handleRepsChange(
                                  dayIndex,
                                  workoutIndex,
                                  exIndex,
                                  setIndex,
                                  Number(set) + 1
                                )
                              }
                              className='bg-green-200 text-white p-2 rounded-md hover:bg-green-600'
                            >
                              +
                            </button>
                            <button
                              onClick={() =>
                                handleRemoveSet(
                                  dayIndex,
                                  workoutIndex,
                                  exIndex,
                                  setIndex
                                )
                              }
                              className='text-red-500 ml-2'
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            handleAddSet(dayIndex, workoutIndex, exIndex)
                          }
                          className='text-blue-600 mt-1 text-left'
                        >
                          + Add Set
                        </button>
                      </div>
                    ))}
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
