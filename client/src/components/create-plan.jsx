import React, { useMemo, useState } from 'react';
import { FaBook, FaGlobeAmericas, FaLock, FaTrash } from 'react-icons/fa';
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

  const [isPublic, setIsPublic] = useState(false);

  const userId = useSelector(state => state.auth.user.id);
  const { loading } = useSelector(state => state.plans);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dayStats = useMemo(
    () =>
      days.map(d => {
        const w = d.workouts?.length || 0;
        const e =
          d.workouts?.reduce((acc, w) => acc + (w.exercises?.length || 0), 0) ||
          0;
        return { workouts: w, exercises: e };
      }),
    [days]
  );

  const addDay = () =>
    setDays(prev => [
      ...prev,
      { dayName: `Day ${prev.length + 1}`, workouts: [] }
    ]);

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

  const handleRemoveWorkout = (dayIndex, workoutIndex) => {
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
    formData.append('title', planTitle);
    formData.append('description', planDescription);
    formData.append('user', userId);
    formData.append('isPublic', String(isPublic));
    if (planImage) formData.append('image', planImage);

    let workoutIndex = 0;
    days.forEach(day => {
      day.workouts.forEach(workout => {
        formData.append(`workouts[${workoutIndex}][title]`, workout.title);
        formData.append(
          `workouts[${workoutIndex}][isPublic]`,
          String(isPublic)
        );
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
    <div className='grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-6 p-6'>
      <div className='space-y-6'>
        <div className='rounded-2xl border border-slate-200 bg-white shadow-sm'>
          <div className='flex items-center justify-between border-b border-slate-200 px-6 py-4'>
            <div>
              <h2 className='text-xl font-semibold tracking-tight'>
                Create Plan
              </h2>
              <p className='text-xs text-slate-500'>
                Name it, describe it, then add workouts.
              </p>
            </div>
            <span className='rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700'>
              {days.length} day{days.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6'>
            <div>
              <label className='mb-1 block text-sm font-medium text-slate-700'>
                Plan Title
              </label>
              <input
                type='text'
                value={planTitle}
                onChange={e => setPlanTitle(e.target.value)}
                placeholder='e.g. Push/Pull/Legs – 6 Weeks'
                className='w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
              />

              <label className='mb-1 mt-4 block text-sm font-medium text-slate-700'>
                Description
              </label>
              <textarea
                value={planDescription}
                onChange={e => setPlanDescription(e.target.value)}
                placeholder='Short blurb about goals, split, gear, etc.'
                rows={5}
                className='w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700'>
                Plan Image
              </label>
              <div className='relative h-48 overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 group'>
                <input
                  type='file'
                  accept='image/*'
                  className='absolute inset-0 z-10 cursor-pointer opacity-0'
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (!file.type.startsWith('image/')) {
                      toast.error('Please upload an image file!');
                      return;
                    }
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error('Image must be smaller than 5MB.');
                      return;
                    }
                    setPlanImage(file);
                  }}
                />
                {planImage ? (
                  <>
                    <img
                      src={
                        typeof planImage === 'string'
                          ? planImage
                          : URL.createObjectURL(planImage)
                      }
                      alt='Plan'
                      className='absolute inset-0 h-full w-full object-cover'
                    />
                    <div className='absolute inset-0 hidden items-center justify-center bg-black/40 text-white backdrop-blur-[1px] group-hover:flex'>
                      Replace Image
                    </div>
                  </>
                ) : (
                  <div className='grid h-full place-items-center text-center text-slate-500'>
                    <div>
                      <p className='font-medium'>Drop or click to upload</p>
                      <p className='text-xs'>PNG, JPG (max 5MB)</p>
                    </div>
                  </div>
                )}
              </div>

              {planImage && (
                <button
                  onClick={() => setPlanImage(null)}
                  className='mt-3 rounded-md bg-red-500 px-3 py-1.5 text-white hover:bg-red-600'
                >
                  Remove
                </button>
              )}

              <div className='mt-6'>
                <label className='mb-2 block text-sm font-medium text-slate-700'>
                  Visibility
                </label>

                <button
                  onClick={() => setIsPublic(!isPublic)}
                  type='button'
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition
      ${isPublic ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}
    `}
                >
                  {isPublic ? (
                    <>
                      <FaGlobeAmericas className='h-4 w-4' />
                      Public (Anyone can view)
                    </>
                  ) : (
                    <>
                      <FaLock className='h-4 w-4' />
                      Private (Only you)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className='sticky bottom-0 flex flex-col gap-3 items-center justify-between border-t border-slate-200 bg-white/80 px-6 py-4 backdrop-blur sm:flex-row'>
            <div className='flex items-center gap-2 text-xs text-slate-500'>
              <span className='rounded-full bg-slate-100 px-2 py-1'>
                Total workouts: {dayStats.reduce((a, b) => a + b.workouts, 0)}
              </span>
              <span className='rounded-full bg-slate-100 px-2 py-1'>
                Total exercises: {dayStats.reduce((a, b) => a + b.exercises, 0)}
              </span>
            </div>

            <div className='flex gap-2'>
              <button
                onClick={addDay}
                className='rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700'
              >
                + Add Day
              </button>
              <button
                onClick={handleSubmitPlan}
                disabled={loading}
                className={`rounded-lg px-4 py-2 text-white shadow-sm transition ${
                  loading
                    ? 'cursor-not-allowed bg-slate-400'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } flex items-center gap-2`}
              >
                <FaBook />
                {loading ? 'Creating...' : 'Create Plan'}
              </button>
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white shadow-sm'>
          <div className='flex w-full gap-2 overflow-x-auto border-b border-slate-200 p-3'>
            {days.map((day, i) => {
              const isActive = i === selectedDay;
              const stats = dayStats[i];
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(i)}
                  className={`group inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className='font-medium'>Day {i + 1}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${
                      isActive
                        ? 'border-white/30 bg-white/20 text-white'
                        : 'border-slate-300 bg-white text-slate-600'
                    }`}
                    title={`${stats.workouts} workout(s), ${stats.exercises} exercise(s)`}
                  >
                    {stats.exercises}
                  </span>
                </button>
              );
            })}
          </div>

          <div className='p-6'>
            {days.map((day, dayIndex) => {
              if (selectedDay !== dayIndex) return null;

              return (
                <div key={dayIndex} className='space-y-5'>
                  <div className='flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
                    <input
                      type='text'
                      value={day.dayName}
                      onChange={e =>
                        handleDayTitleChange(dayIndex, e.target.value)
                      }
                      className='w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-lg font-semibold outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
                    />
                    <button
                      onClick={() => removeDay(dayIndex)}
                      className='inline-flex items-center gap-2 rounded-md bg-red-500 px-3 py-2 text-white transition hover:bg-red-600'
                    >
                      <FaTrash /> Delete Day
                    </button>
                  </div>

                  {day.workouts.length === 0 ? (
                    <div className='rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500'>
                      No workouts yet. Use the library on the right to add an
                      exercise.
                    </div>
                  ) : (
                    <div className='grid gap-4'>
                      {day.workouts.map((workout, workoutIndex) => (
                        <div
                          key={workoutIndex}
                          className='relative rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm'
                        >
                          <button
                            onClick={() =>
                              handleRemoveWorkout(dayIndex, workoutIndex)
                            }
                            className='absolute right-3 top-3 rounded-md bg-red-500 p-2 text-white hover:bg-red-600'
                            title='Remove workout'
                          >
                            <FaTrash />
                          </button>

                          <div className='mb-3 flex flex-col gap-3 sm:flex-row sm:items-center'>
                            <input
                              type='text'
                              value={workout.title}
                              onChange={e =>
                                handleWorkoutTitleChange(
                                  dayIndex,
                                  workoutIndex,
                                  e.target.value
                                )
                              }
                              className='flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
                            />

                            <label className='inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50'>
                              <input
                                type='file'
                                accept='image/*'
                                className='hidden'
                                onChange={e =>
                                  handleWorkoutImageChange(
                                    dayIndex,
                                    workoutIndex,
                                    e.target.files?.[0] || null
                                  )
                                }
                              />
                              Upload Image
                            </label>
                          </div>

                          <div className='space-y-3'>
                            {workout.exercises.map((exercise, exIndex) => (
                              <div
                                key={exIndex}
                                className='rounded-xl border border-slate-200 bg-white p-3'
                              >
                                <div className='mb-2 flex items-center gap-3'>
                                  <div className='relative h-12 w-12 overflow-hidden rounded-md ring-1 ring-slate-200'>
                                    <img
                                      src={
                                        exercise.exercise?.tutorial?.endsWith?.(
                                          '.gif'
                                        )
                                          ? exercise.exercise.tutorial.replace(
                                              '/upload/',
                                              '/upload/f_jpg/so_0/'
                                            )
                                          : exercise.exercise?.tutorial
                                      }
                                      alt={
                                        exercise.exercise?.title || 'Exercise'
                                      }
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
                                  <div className='min-w-0'>
                                    <p className='truncate font-semibold'>
                                      {exercise.exercise?.title || 'Exercise'}
                                    </p>
                                    <p className='text-xs text-slate-500'>
                                      {exercise.sets.length} set(s)
                                    </p>
                                  </div>
                                </div>

                                <div className='mb-2 grid grid-cols-[80px_1fr_42px] items-center gap-2 px-1 text-sm font-medium text-slate-600'>
                                  <span className='text-center'>Set</span>
                                  <span>Reps</span>
                                  <span />
                                </div>

                                {exercise.sets.map((set, setIndex) => (
                                  <div
                                    key={setIndex}
                                    className='mb-2 grid grid-cols-[80px_1fr_42px] items-center gap-2'
                                  >
                                    <span className='rounded-md border border-slate-300 bg-white py-2 text-center'>
                                      {setIndex + 1}
                                    </span>
                                    <input
                                      type='number'
                                      min={1}
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
                                      className='rounded-md border border-slate-300 bg-white px-3 py-2 text-center outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
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
                                      className='rounded-md p-2 text-red-500 hover:bg-red-50'
                                      title='Remove set'
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                ))}

                                <button
                                  onClick={() =>
                                    handleAddSet(
                                      dayIndex,
                                      workoutIndex,
                                      exIndex
                                    )
                                  }
                                  className='mt-1 text-left text-blue-600 hover:underline'
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
              );
            })}
          </div>
        </div>
      </div>

      <div className='h-[78vh]'>
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
