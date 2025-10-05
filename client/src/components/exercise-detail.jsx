import React, { useEffect } from 'react';
import {
  FaClipboardList,
  FaDumbbell,
  FaUserAlt,
  FaWeightHanging
} from 'react-icons/fa';
import { GiMuscleUp } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { fetchExerciseById } from '~/store/features/exercise-slice';

const ExerciseDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentExercise, loading, error } = useSelector(
    state => state.exercises
  );

  useEffect(() => {
    if (id) dispatch(fetchExerciseById(id));
  }, [id, dispatch]);

  if (loading)
    return (
      <div className='text-center text-gray-500 mt-10'>Loading exercise...</div>
    );
  if (error)
    return <div className='text-center text-red-500 mt-10'>{error}</div>;
  if (!currentExercise)
    return (
      <div className='text-center text-gray-500 mt-10'>No exercise found.</div>
    );

  const {
    title,
    tutorial,
    difficulty,
    type,
    instructions,
    muscles,
    equipments
  } = currentExercise;

  return (
    <div className='min-h-screen bg-white text-gray-900 px-8 lg:px-20 py-12'>
      <div className='flex flex-col lg:flex-row gap-12 items-start'>
        <div className='flex-1 flex justify-center'>
          <img
            src={tutorial}
            alt={title}
            className='rounded-lg shadow-lg w-full max-w-full border border-gray-200 object-cover'
          />
        </div>

        <div className='flex-1 space-y-6'>
          <div className='flex justify-between items-start'>
            <h1 className='text-7xl font-extrabold text-gray-900'>{title}</h1>
            <button className='bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md font-semibold text-white text-sm transition'>
              Try it out
            </button>
          </div>

          <div>
            <h3 className='text-sm font-bold uppercase text-gray-500 mb-2 flex items-center gap-2'>
              <GiMuscleUp className='text-blue-600 text-lg' /> Target Muscle
              Groups
            </h3>
            <div className='flex flex-wrap gap-3'>
              {muscles?.length ? (
                muscles.map(m => (
                  <div
                    key={m._id || m}
                    className='bg-blue-50 border border-blue-200 rounded-md px-4 py-2 text-center text-blue-700 font-medium text-sm'
                  >
                    {m.title || m}
                  </div>
                ))
              ) : (
                <p className='text-gray-500'>N/A</p>
              )}
            </div>
          </div>

          {/* Equipment */}
          <div>
            <h3 className='text-sm font-bold uppercase text-gray-500 mb-2 flex items-center gap-2'>
              <FaDumbbell className='text-blue-600 text-lg' /> Equipment
            </h3>
            <div className='flex flex-wrap gap-3'>
              {equipments?.length ? (
                equipments.map(e => (
                  <div
                    key={e._id || e}
                    className='bg-blue-50 border border-blue-200 rounded-md px-4 py-2 text-center text-blue-700 font-medium text-sm'
                  >
                    {e.title || e}
                  </div>
                ))
              ) : (
                <p className='text-gray-500'>N/A</p>
              )}
            </div>
          </div>

          {/* Metadata Row */}
          <div className='grid grid-cols-3 gap-6 mt-4'>
            <div className='flex items-center gap-3'>
              <FaUserAlt className='text-blue-600 text-xl' />
              <div>
                <h4 className='text-xs text-gray-500 uppercase'>Difficulty</h4>
                <p className='text-base font-medium text-gray-800'>
                  {difficulty}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <FaClipboardList className='text-blue-600 text-xl' />
              <div>
                <h4 className='text-xs text-gray-500 uppercase'>
                  Exercise Type
                </h4>
                <p className='text-base font-medium text-gray-800'>{type}</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <FaWeightHanging className='text-blue-600 text-xl' />
              <div>
                <h4 className='text-xs text-gray-500 uppercase'>Log Type</h4>
                <p className='text-base font-medium text-gray-800'>
                  Weight And Reps
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className='mt-6'>
            <h3 className='text-2xl font-bold mb-3 text-gray-900'>
              Instructions
            </h3>
            <div className='bg-gray-50 border border-gray-200 p-5 rounded-lg leading-relaxed text-gray-700 whitespace-pre-line'>
              {instructions || 'No instructions provided.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
