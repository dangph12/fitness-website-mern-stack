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
  const [planImage, setPlanImage] = useState(null);
  const [planTitle, setPlanTitle] = useState('');
  const [planDescription, setPlanDescription] = useState('');

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
    if (selectedDay >= updated.length)
      setSelectedDay(Math.max(0, updated.length - 1));
  };

  const handleDayTitleChange = (index, value) => {
    const updated = [...days];
    updated[index].dayName = value;
    setDays(updated);
  };

  const handleAddExercise = (dayIndex, exercise) => {
    const updated = [...days];
    const day = updated[dayIndex];

    if (day.workouts.length === 0) {
      day.workouts.push({
        title: `Workout ${dayIndex + 1}`,
        image: null,
        exercises: []
      });
    }

    const workout = day.workouts[0];

    const exists = workout.exercises.some(
      ex =>
        (ex.exercise && ex.exercise._id === exercise._id) ||
        ex.exercise === exercise._id
    );

    if (!exists) {
      workout.exercises.push({
        exercise: {
          _id: exercise._id,
          title: exercise.title,
          tutorial: exercise.tutorial
        },
        sets: [1]
      });
    }

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
    updated[dayIndex].workouts[workoutIndex].exercises[exIndex].sets[setIndex] =
      Math.max(1, Number(value) || 1);
    setDays(updated);
  };

  const handleAddSet = (dayIndex, workoutIndex, exIndex) => {
    const updated = [...days];
    updated[dayIndex].workouts[workoutIndex].exercises[exIndex].sets.push(1);
    setDays(updated);
  };

  const handleRemoveSet = (dayIndex, workoutIndex, exIndex, setIndex) => {
    const updated = [...days];
    const arr =
      updated[dayIndex].workouts[workoutIndex].exercises[exIndex].sets;
    if (arr.length > 1) arr.splice(setIndex, 1);
    setDays(updated);
  };

  const handleSubmitPlan = () => {
    if (!planTitle.trim() || !planDescription.trim()) {
      toast.error('Please fill in both title and description !');
      return;
    }
    const hasWorkout = days.some(
      d => Array.isArray(d.workouts) && d.workouts.length > 0
    );
    if (!hasWorkout) {
      toast.error('Please add at least one workout!');
      return;
    }
    const hasExercise = days.some(d =>
      d.workouts?.some(
        w => Array.isArray(w.exercises) && w.exercises.length > 0
      )
    );
    if (!hasExercise) {
      toast.error('Please add at least one exercise!');
      return;
    }

    const formData = new FormData();
    formData.append('title', planTitle || `Plan ${Date.now()}`);
    formData.append(
      'description',
      planDescription || `Description for Plan ${Date.now()}`
    );
    if (planImage) formData.append('image', planImage);
    formData.append('isPublic', 'true');
    formData.append('user', userId);

    let workoutIndex = 0;
    days.forEach(day => {
      day.workouts.forEach(workout => {
        formData.append(`workouts[${workoutIndex}][title]`, workout.title);
        formData.append(`workouts[${workoutIndex}][isPublic]`, 'false');
        formData.append(`workouts[${workoutIndex}][user]`, userId);
        if (workout.image)
          formData.append(`workouts[${workoutIndex}][image]`, workout.image);

        workout.exercises.forEach((ex, exIndex) => {
          const exId =
            typeof ex.exercise === 'object' ? ex.exercise._id : ex.exercise;
          formData.append(
            `workouts[${workoutIndex}][exercises][${exIndex}][exercise]`,
            exId
          );
          ex.sets.forEach((set, setIndex) => {
            formData.append(
              `workouts[${workoutIndex}][exercises][${exIndex}][sets][${setIndex}]`,
              String(set)
            );
          });
        });

        workoutIndex++;
      });
    });

    dispatch(createPlan(formData))
      .then(() => {
        toast.success('Plan created successfully!');
        navigate('/plans/plan-list');
      })
      .catch(() => toast.error('Failed to create plan'));
  };

  return (
    <div className='flex gap-6 p-6 bg-gray-50 rounded-lg shadow-md'>
      <div className='w-2/3 p-4 bg-white rounded-lg border border-gray-200'>
        <div className='mb-6 grid grid-cols-2 gap-6'>
          <div>
            <label className='block font-medium mb-1 text-gray-700'>
              Plan Title
            </label>
            <input
              type='text'
              value={planTitle}
              onChange={e => setPlanTitle(e.target.value)}
              placeholder='Enter plan title...'
              className='w-full border p-2 rounded-md mb-3'
            />
            <label className='block font-medium mb-1 text-gray-700'>
              Description
            </label>
            <textarea
              value={planDescription}
              onChange={e => setPlanDescription(e.target.value)}
              placeholder='Enter plan description...'
              className='w-full border p-2 rounded-md'
              rows='4'
            />
          </div>

          <div className='w-full'>
            <label className='block font-medium mb-2 text-gray-700'>
              Plan Image
            </label>
            <div className='relative border-2 border-dashed border-gray-300 rounded-xl h-48 flex items-center justify-center cursor-pointer hover:border-blue-400 transition group overflow-hidden'>
              <input
                type='file'
                accept='image/*'
                id='planImage'
                onChange={e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (!file.type.startsWith('image/'))
                    return alert('Please upload an image file!');
                  if (file.size > 5 * 1024 * 1024)
                    return alert('Image must be smaller than 5MB.');
                  setPlanImage(file);
                }}
                className='absolute inset-0 opacity-0 cursor-pointer z-10'
              />
              {planImage ? (
                <div className='relative w-full h-full'>
                  <img
                    src={
                      typeof planImage === 'string'
                        ? planImage
                        : URL.createObjectURL(planImage)
                    }
                    alt='Plan'
                    className='w-full h-full object-cover rounded-xl'
                  />
                  <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition'>
                    <p className='text-white text-sm font-medium'>
                      Replace Image
                    </p>
                  </div>
                </div>
              ) : (
                <div className='text-center text-gray-500'>
                  <p className='font-medium'>No Image Selected</p>
                  <p className='text-sm text-blue-500'>Upload Image</p>
                </div>
              )}
            </div>
            {planImage && (
              <div className='flex justify-center mt-3'>
                <button
                  onClick={() => setPlanImage(null)}
                  className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition'
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

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
            <FaBook className='mr-2' />
            {loading ? 'Creating...' : 'Create Plan'}
          </button>
        </div>

        {days.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className={`mb-6 p-4 rounded-lg shadow-sm border ${selectedDay === dayIndex ? 'border-blue-500' : 'border-gray-300'}`}
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
                readOnly
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
                    </div>

                    {workout.exercises.map((exercise, exIndex) => (
                      <div
                        key={exIndex}
                        className='border p-3 rounded-md flex flex-col gap-2 bg-white'
                      >
                        <div className='flex items-center gap-3 mb-2'>
                          <div className='relative h-12 w-12 overflow-hidden rounded-md ring-1 ring-slate-200'>
                            <img
                              src={
                                exercise.exercise?.tutorial?.endsWith?.('.gif')
                                  ? exercise.exercise.tutorial.replace(
                                      '/upload/',
                                      '/upload/f_jpg/so_0/'
                                    )
                                  : exercise.exercise?.tutorial
                              }
                              alt={exercise.exercise?.title || 'Exercise'}
                              className='absolute inset-0 h-full w-full object-cover'
                              onMouseEnter={e => {
                                const t = exercise.exercise?.tutorial;
                                if (t && t.endsWith('.gif'))
                                  e.currentTarget.src = t;
                              }}
                              onMouseLeave={e => {
                                const t = exercise.exercise?.tutorial;
                                if (t && t.endsWith('.gif'))
                                  e.currentTarget.src = t.replace(
                                    '/upload/',
                                    '/upload/f_jpg/so_0/'
                                  );
                              }}
                            />
                          </div>
                          <span className='font-semibold'>
                            {exercise.exercise?.title || 'Exercise'}
                          </span>
                        </div>

                        <div className='grid grid-cols-2 gap-20 mb-3'>
                          <span className='font-semibold text-center mr-30'>
                            Set
                          </span>
                          <span className='font-semibold text-left'>Reps</span>
                        </div>

                        {exercise.sets.map((set, setIndex) => (
                          <div
                            key={setIndex}
                            className='flex items-center gap-2'
                          >
                            <span className='p-2 border rounded-md w-95 text-center'>
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
                              className='p-2 border rounded-md w-110 text-center'
                              min={1}
                            />
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
