import React, { useEffect, useMemo, useState } from 'react';
import { FaBook, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { fetchExerciseById } from '~/store/features/exercise-slice';
import { fetchPlanById, updatePlan } from '~/store/features/plan-slice';

import ExerciseLibrary from './exercise-library';

const EditPlan = () => {
  const { planId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentPlan, loading } = useSelector(state => state.plans);
  const { exercises: exerciseList = [] } = useSelector(
    state => state.exercises
  );
  const userId = useSelector(state => state.auth.user.id);

  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [planImage, setPlanImage] = useState(null);
  const [planTitle, setPlanTitle] = useState('');
  const [planDescription, setPlanDescription] = useState('');

  const exerciseMap = useMemo(() => {
    const m = new Map();
    exerciseList.forEach(ex => m.set(ex._id?.toString(), ex));
    return m;
  }, [exerciseList]);

  const getExerciseMeta = exOrId => {
    if (typeof exOrId === 'object' && exOrId?._id) return exOrId;
    const id = exOrId?.toString?.() || exOrId;
    const found = exerciseMap.get(id);
    if (found) return found;
    return { _id: id, title: 'Loading...', tutorial: '' };
  };

  useEffect(() => {
    if (planId) dispatch(fetchPlanById(planId));
  }, [dispatch, planId]);

  useEffect(() => {
    if (!currentPlan) return;
    const ids = new Set();
    (currentPlan.workouts || []).forEach(w => {
      (w.exercises || []).forEach(ex => {
        const id = (
          typeof ex.exercise === 'object' ? ex.exercise?._id : ex.exercise
        )?.toString();
        if (id) ids.add(id);
      });
    });
    ids.forEach(id => {
      if (!exerciseMap.has(id)) dispatch(fetchExerciseById(id));
    });
  }, [currentPlan, exerciseMap, dispatch]);

  useEffect(() => {
    if (!currentPlan) return;

    setPlanTitle(currentPlan.title || '');
    setPlanDescription(currentPlan.description || '');
    setPlanImage(currentPlan.image || null);

    const mappedDays = (currentPlan.workouts || []).map(workout => ({
      dayName: workout.title,
      workouts: [
        {
          title: workout.title,
          image: workout.image || null,
          user: workout.user || userId,
          exercises: (workout.exercises || []).map(ex => {
            const meta = getExerciseMeta(
              typeof ex.exercise === 'object' ? ex.exercise : ex.exercise
            );
            return {
              exercise: {
                _id: meta._id,
                title: meta.title,
                tutorial: meta.tutorial
              },
              sets: Array.isArray(ex.sets) ? [...ex.sets] : [1]
            };
          })
        }
      ]
    }));

    setDays(
      mappedDays.length ? mappedDays : [{ dayName: 'Day 1', workouts: [] }]
    );
    setSelectedDay(0);
  }, [currentPlan, userId, exerciseMap]);

  const addDay = () =>
    setDays(prev => [
      ...prev,
      { dayName: `Day ${prev.length + 1}`, workouts: [] }
    ]);

  const removeDay = index => {
    const updated = [...days];
    updated.splice(index, 1);
    setDays(updated);
    if (updated.length === 0) {
      setSelectedDay(0);
      return;
    }
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
        user: userId,
        exercises: []
      });
    }

    const workout = day.workouts[0];

    const exists = workout.exercises.some(
      ex =>
        (typeof ex.exercise === 'object' &&
          ex.exercise?._id === exercise._id) ||
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

  const handleRepsChange = (
    dayIndex,
    workoutIndex,
    exIndex,
    setIndex,
    value
  ) => {
    const updated = [...days];
    const v = Math.max(1, Number(value) || 1);
    updated[dayIndex].workouts[workoutIndex].exercises[exIndex].sets[setIndex] =
      v;
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

  const handleSubmit = () => {
    if (!planTitle.trim()) {
      toast.error('Plan title is required');
      return;
    }

    const formData = new FormData();
    formData.append('title', planTitle);
    formData.append('description', planDescription);
    if (planImage) formData.append('image', planImage);
    formData.append('isPublic', 'true');
    formData.append('user', userId);

    let workoutIndex = 0;
    (days || []).forEach(day => {
      (day.workouts || []).forEach(workout => {
        formData.append(`workouts[${workoutIndex}][title]`, workout.title);
        formData.append(`workouts[${workoutIndex}][isPublic]`, 'false');
        formData.append(
          `workouts[${workoutIndex}][user]`,
          workout.user || userId
        );
        if (workout.image) {
          formData.append(`workouts[${workoutIndex}][image]`, workout.image);
        }

        (workout.exercises || []).forEach((ex, exIndex) => {
          const exId =
            typeof ex.exercise === 'object' ? ex.exercise._id : ex.exercise;
          formData.append(
            `workouts[${workoutIndex}][exercises][${exIndex}][exercise]`,
            exId
          );
          (ex.sets || [1]).forEach((set, setIndex) => {
            formData.append(
              `workouts[${workoutIndex}][exercises][${exIndex}][sets][${setIndex}]`,
              String(set)
            );
          });
        });

        workoutIndex++;
      });
    });

    dispatch(updatePlan({ id: planId, updateData: formData }))
      .unwrap?.()
      .then(() => {
        toast.success('Plan updated successfully!');
        navigate('/plans/plan-list');
      })
      .catch(() => toast.error('Failed to update plan'));
  };

  if (!currentPlan) {
    return <p className='text-center text-gray-500'>Loading plan...</p>;
  }

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

          <div>
            <label className='block font-medium mb-2 text-gray-700'>
              Plan Image
            </label>
            <div className='relative border-2 border-dashed border-gray-300 rounded-xl h-48 flex items-center justify-center cursor-pointer hover:border-blue-400 transition group overflow-hidden'>
              <input
                type='file'
                accept='image/*'
                onChange={e => setPlanImage(e.target.files?.[0] || null)}
                className='absolute inset-0 opacity-0 cursor-pointer z-10'
              />
              {planImage ? (
                <img
                  src={
                    typeof planImage === 'string'
                      ? planImage
                      : URL.createObjectURL(planImage)
                  }
                  alt='Plan'
                  className='w-full h-full object-cover rounded-xl'
                />
              ) : (
                <p className='text-gray-500'>No Image Selected</p>
              )}
            </div>
            {planImage && typeof planImage !== 'string' && (
              <button
                onClick={() => setPlanImage(null)}
                className='mt-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600'
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <div className='mb-4 flex flex-wrap items-center gap-2'>
          {days.map((_, i) => {
            const active = selectedDay === i;
            return (
              <button
                key={`day-pill-${i}`}
                onClick={() => setSelectedDay(i)}
                className={[
                  'px-3 py-1.5 text-sm rounded-full border transition',
                  active
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                ].join(' ')}
                title={`Go to Day ${i + 1}`}
              >
                Day {i + 1}
              </button>
            );
          })}
          <button
            onClick={addDay}
            className='ml-2 px-3 py-1.5 text-sm rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50'
          >
            + Add Day
          </button>
        </div>

        <div className='flex justify-between mb-4'>
          <div />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className='bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700'
          >
            <FaBook className='mr-2' />{' '}
            {loading ? 'Updating...' : 'Update Plan'}
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
              <div
                onClick={() => setSelectedDay(dayIndex)}
                className={`text-lg font-semibold px-3 py-2 rounded-md cursor-pointer ${
                  selectedDay === dayIndex
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                    : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
                }`}
              >
                Day {dayIndex + 1}
              </div>

              <div className='flex items-center gap-2'>
                <button
                  onClick={() => removeDay(dayIndex)}
                  className='bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 flex items-center'
                >
                  <FaTrash className='mr-1' /> Delete Day
                </button>
              </div>
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

                    <input
                      type='text'
                      value={workout.title}
                      readOnly
                      className='flex-1 p-2 border rounded-md bg-gray-200 text-gray-700 cursor-not-allowed'
                    />

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
                            <span className='p-2 border rounded-md w-96 text-center'>
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

export default EditPlan;
