import React, { useEffect, useState } from 'react';
import { FaBook, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { createWorkout } from '~/store/features/workout-slice';

import ExerciseLibrary from './exercise-library';

const CreateWorkout = () => {
  const [exercises, setExercises] = useState([]);
  const [title, setTitle] = useState('My Workout');
  const [image, setImage] = useState(null);
  const userId = useSelector(state => state.auth.user.id);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.workouts);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddExercise = exercise => {
    const exerciseExists = exercises.some(e => e.exercise._id === exercise._id);

    if (!exerciseExists) {
      setExercises([
        ...exercises,
        {
          exercise: {
            _id: exercise._id,
            title: exercise.title,
            tutorial: exercise.tutorial
          },
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

  const handleTitleChange = e => {
    setTitle(e.target.value);
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmitWorkout = () => {
    if (!title.trim()) {
      toast.error('Please fill in title!');
      return;
    }

    if (exercises.length === 0) {
      toast.error('Please add at least one exercise!');
      return;
    }

    const workoutData = new FormData();
    workoutData.append('title', title);
    workoutData.append('image', image);
    workoutData.append('isPublic', true);
    workoutData.append('user', userId);

    exercises.forEach((exercise, index) => {
      workoutData.append(
        `exercises[${index}][exercise]`,
        exercise.exercise._id
      );
      exercise.sets.forEach((set, setIndex) => {
        workoutData.append(`exercises[${index}][sets][${setIndex}]`, set);
      });
    });

    dispatch(createWorkout(workoutData))
      .then(() => {
        toast.success('Workout created successfully!');
        navigate('/workouts');
      })
      .catch(error => {
        toast.error('Failed to create workout');
      });
  };

  return (
    <div className='flex gap-8 p-6 bg-white rounded-lg shadow-md'>
      <div className='w-2/3 p-4 bg-white rounded-lg border border-gray-200 border-opacity-50'>
        <h2 className='text-2xl font-semibold mb-4'>Create Workout</h2>

        <div className='flex gap-8 mb-10'>
          <div className='w-1/2'>
            <div className='font-semibold mb-5'>Workout Title</div>
            <input
              type='text'
              value={title}
              onChange={handleTitleChange}
              className='p-2 border rounded-md w-full mb-4'
              placeholder='Enter workout title'
            />
          </div>

          <div className='w-1/2'>
            <div className='font-semibold mb-5'>Workout Image</div>
            <div className='border-2 border-dashed p-6 text-center rounded-lg'>
              <input
                type='file'
                onChange={handleImageChange}
                className='hidden'
                id='imageInput'
              />
              <label
                htmlFor='imageInput'
                className='cursor-pointer text-gray-500'
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt='Workout Preview'
                    className='w-full h-full object-cover mx-auto'
                  />
                ) : (
                  <div>
                    <p>No Image Selected</p>
                    <p className='text-sm'>Upload Image</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

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
              className='relative p-4 bg-gray-100 rounded-md mb-4'
            >
              <button
                onClick={() => handleRemoveExercise(exerciseIndex)}
                className='absolute top-3 right-3 bg-red-200 text-white font-medium px-3 py-2 rounded-md flex items-center justify-center hover:bg-red-700'
              >
                <FaTrash className='mr-2' />
                Delete Exercise
              </button>

              <div className='flex items-center mb-3'>
                <img
                  src={
                    exercise.exercise.tutorial.endsWith('.gif')
                      ? exercise.exercise.tutorial.replace(
                          '/upload/',
                          '/upload/f_jpg/so_0/'
                        )
                      : exercise.exercise.tutorial
                  }
                  onMouseEnter={e =>
                    (e.currentTarget.src = exercise.exercise.tutorial)
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.src = exercise.exercise.tutorial.replace(
                      '/upload/',
                      '/upload/f_jpg/so_0/'
                    ))
                  }
                  alt={exercise.exercise.title}
                  className='w-16 h-16 object-cover rounded-md mr-2'
                />
                <span className='font-bold'>{exercise.exercise.title}</span>
              </div>

              <div className='grid grid-cols-2 gap-50 mb-3'>
                <span className='font-semibold text-center'>Set</span>
                <span className='font-semibold text-left'>Reps</span>
              </div>

              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className='flex items-center gap-2 mb-4'>
                  <span className='p-2 border rounded-md w-md'>
                    {setIndex + 1}
                  </span>
                  <input
                    type='number'
                    value={set}
                    onChange={e =>
                      handleInputChange(exerciseIndex, setIndex, e.target.value)
                    }
                    className='p-2 border rounded-md w-md'
                    placeholder='Reps'
                    min={1}
                  />
                  <button
                    onClick={() =>
                      handleInputChange(
                        exerciseIndex,
                        setIndex,
                        Math.max(set - 1, 1)
                      )
                    }
                    className='bg-red-200 text-white p-2 rounded-md hover:bg-red-600'
                  >
                    <FaMinus />
                  </button>
                  <button
                    onClick={() =>
                      handleInputChange(exerciseIndex, setIndex, set + 1)
                    }
                    className='bg-green-200 text-white p-2 rounded-md hover:bg-green-600'
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                    className='text-red-500 ml-2'
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
