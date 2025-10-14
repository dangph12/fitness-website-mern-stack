import React, { useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { fetchEquipments } from '~/store/features/equipment-slice';
import { fetchMuscles } from '~/store/features/muscles-slice';
import { deleteWorkout, fetchWorkouts } from '~/store/features/workout-slice';

const WorkoutList = () => {
  const dispatch = useDispatch();
  const { workouts, loading, error } = useSelector(state => state.workouts);
  const { muscles } = useSelector(state => state.muscles);
  const { equipments } = useSelector(state => state.equipments);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchWorkouts());
    dispatch(fetchMuscles());
    dispatch(fetchEquipments());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

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

  const handleDelete = workoutId => {
    dispatch(deleteWorkout(workoutId))
      .then(() => {
        toast.success('workout delete successfully!');
      })
      .catch(error => {
        toast.error('Failed to create plan');
      });
  };

  const handleViewDetails = workoutId => {
    navigate(`/workouts/workout-detail/${workoutId}`);
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
                  <span className='inline-block bg-green-100 text-gray-800 px-4 py-2 rounded-full'>
                    {workout.exercises.length} exercises
                  </span>
                </td>
                <td className='px-6 py-4'>
                  {workout.exercises.map(exercise => (
                    <div key={exercise._id}>
                      {exercise.exercise.muscles.map(muscleId => {
                        const muscle = muscles.find(m => m._id === muscleId);
                        return muscle ? (
                          <span
                            key={muscle._id}
                            className='inline-block bg-gray-200 text-gray-700 px-4 py-1 rounded-full mr-2 mb-2'
                          >
                            {muscle.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  ))}
                </td>
                <td className='px-6 py-4'>
                  {workout.exercises.map(exercise => (
                    <div key={exercise._id}>
                      {exercise.exercise.equipments.map(equipmentId => {
                        const equipment = equipments.find(
                          e => e._id === equipmentId
                        );
                        return equipment ? (
                          <span
                            key={equipment._id}
                            className='inline-block bg-gray-200 text-gray-700 px-4 py-1 rounded-full mr-2 mb-2'
                          >
                            {equipment.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  ))}
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
    </div>
  );
};

export default WorkoutList;
