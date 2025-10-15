import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { fetchExerciseById } from '~/store/features/exercise-slice';
import { fetchWorkouts } from '~/store/features/workout-slice';

import logo from '../assets/logo.png';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from './ui/pagination';

const WorkoutList = () => {
  const dispatch = useDispatch();
  const {
    workouts,
    loading,
    error,
    totalPages = 1
  } = useSelector(state => state.workouts);
  const { exercises, currentExercise } = useSelector(state => state.exercises);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchWorkouts({ page: currentPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (!exercises.some(ex => ex._id === exercise.exercise)) {
          dispatch(fetchExerciseById(exercise.exercise));
        }
      });
    });
  }, [dispatch, workouts, exercises]);

  const handleDelete = workoutId => {
    dispatch(deleteWorkout(workoutId))
      .then(() => {
        toast.success('Workout deleted successfully!');
      })
      .catch(error => {
        toast.error('Failed to delete workout');
      });
  };

  const handleViewDetails = workoutId => {
    navigate(`/workouts/workout-detail/${workoutId}`);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  };

  const getMusclesAndEquipment = exerciseId => {
    const exercise = exercises.find(ex => ex._id === exerciseId);

    if (exercise) {
      const muscles =
        exercise.muscles?.map(muscle => muscle.title).join(', ') ||
        'No muscles data';
      const equipment =
        exercise.equipments?.map(equipment => equipment.title).join(', ') ||
        'No equipment data';

      return { muscles, equipment };
    }
    return { muscles: 'Loading...', equipment: 'Loading...' };
  };

  return (
    <div className='p-8 bg-gray-100'>
      <h2 className='text-3xl font-semibold mb-6 text-center'>
        My Workout List
      </h2>

      <div className='mb-6 flex justify-end'>
        <button className='bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700'>
          <Link to={`/workouts/create-workout`}>+ Add Workout</Link>
        </button>
      </div>

      <div className='overflow-x-auto bg-white shadow-lg rounded-lg border'>
        <table className='min-w-full table-auto border-collapse'>
          <thead>
            <tr className='bg-gray-800 text-white'>
              <th className='px-6 py-4 text-left'>Workout Name</th>
              <th className='px-6 py-4 text-left'>Image</th>
              <th className='px-6 py-4 text-left'>Exercises</th>
              <th className='px-6 py-4 text-left'>Muscles</th>
              <th className='px-6 py-4 text-left'>Equipment</th>
              <th className='px-6 py-4 text-left'>Created At</th>
              <th className='px-6 py-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {workouts?.map(workout => (
              <tr
                key={workout._id}
                className='border-b hover:bg-gray-100 transition-colors'
                onClick={() => handleViewDetails(workout._id)}
              >
                <td className='px-6 py-4'>
                  <span className='inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full'>
                    {workout.title}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <img
                    src={workout.image || logo}
                    alt={workout.title}
                    className='w-20 h-20 object-cover rounded-md'
                  />
                </td>
                <td className='px-6 py-4'>
                  <span className='inline-block bg-green-100 text-gray-800 px-4 py-2 rounded-full'>
                    {workout.exercises.length} exercises
                  </span>
                </td>
                <td className='px-6 py-4'>
                  {workout.exercises?.map(exercise => {
                    const { muscles } = getMusclesAndEquipment(
                      exercise.exercise
                    );
                    return (
                      <div key={exercise._id}>
                        <span className='inline-block bg-gray-200 text-gray-700 px-4 py-1 rounded-full mr-2 mb-2'>
                          {muscles}
                        </span>
                      </div>
                    );
                  })}
                </td>
                <td className='px-6 py-4'>
                  {workout.exercises?.map(exercise => {
                    const { equipment } = getMusclesAndEquipment(
                      exercise.exercise
                    );
                    return (
                      <div key={exercise._id}>
                        <span className='inline-block bg-gray-200 text-gray-700 px-4 py-1 rounded-full mr-2 mb-2'>
                          {equipment}
                        </span>
                      </div>
                    );
                  })}
                </td>
                <td className='px-6 py-4'>{formatDate(workout.createdAt)}</td>
                <td className='px-6 py-4'>
                  <button className='text-yellow-500'>
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(workout._id)}
                    className='ml-4 text-red-500'
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination className='mt-8'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default WorkoutList;
