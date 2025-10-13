// import React, { useState } from 'react';
// import { FaBook, FaTrash } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import { createWorkout } from '~/store/features/workout-slice';
// import ExerciseLibrary from './exercise-library';

// const CreateWorkout = () => {
//   const [days, setDays] = useState([{ dayName: 'Day 1', exercises: [] }]);
//   const userId = useSelector(state => state.auth.user.id);
//   const [selectedDay, setSelectedDay] = useState(0);

//   const dispatch = useDispatch();
//   const { loading, error } = useSelector(state => state.workouts);

//   // Add a new day
//   const addDay = () => {
//     const newDay = { dayName: `Day ${days.length + 1}`, exercises: [] };
//     setDays([...days, newDay]);
//   };

//   // Add exercise to the selected day
//   const handleAddExercise = exercise => {
//     const updatedDays = [...days];

//     const exerciseExists = updatedDays[selectedDay].exercises.some(
//       e => e.exercise._id === exercise._id
//     );

//     if (!exerciseExists) {
//       updatedDays[selectedDay].exercises.push({
//         exercise: { _id: exercise._id, title: exercise.title },
//         sets: [{ reps: 8, weight: 10, rest: 60 }]
//       });

//       setDays(updatedDays);
//     }
//   };

//   // Remove exercise from the selected day
//   const handleRemoveExercise = exerciseIndex => {
//     const updatedDays = [...days];
//     updatedDays[selectedDay].exercises.splice(exerciseIndex, 1);
//     setDays(updatedDays);
//   };

//   // Handle input change for sets, reps
//   const handleInputChange = (exerciseIndex, setIndex, field, value) => {
//     const updatedDays = [...days];
//     updatedDays[selectedDay].exercises[exerciseIndex].sets[setIndex][field] =
//       value;
//     setDays(updatedDays);
//   };

//   // Add a new set for an exercise
//   const handleAddSet = exerciseIndex => {
//     const updatedDays = [...days];
//     updatedDays[selectedDay].exercises[exerciseIndex].sets.push({
//       reps: 8,
//       weight: 10,
//       rest: 60
//     });
//     setDays(updatedDays);
//   };

//   // Remove a set from an exercise
//   const handleRemoveSet = (exerciseIndex, setIndex) => {
//     const updatedDays = [...days];
//     updatedDays[selectedDay].exercises[exerciseIndex].sets.splice(setIndex, 1);
//     setDays(updatedDays);
//   };

//   // Handle form submission to create the workout
//   const handleSubmitWorkout = () => {
//     const workoutData = {
//       title: `Workout Day ${selectedDay + 1}`,
//       image: '',
//       isPublic: true,
//       user: userId,
//       exercises: days[selectedDay].exercises.map(exercise => ({
//         exercise: exercise.exercise._id,
//         sets: exercise.sets
//       }))
//     };

//     console.log('Workout data:', workoutData);

//     dispatch(createWorkout(workoutData));
//   };

//   return (
//     <div className='flex gap-8 p-6 bg-white rounded-lg shadow-md'>
//       {/* Left Section (Create Workout) */}
//       <div className='w-2/3 p-4 bg-white rounded-lg'>
//         <h2 className='text-2xl font-semibold mb-4'>Create Workout</h2>

//         <div className='flex justify-between mb-4'>
//           <button
//             onClick={addDay}
//             className='bg-blue-600 text-white px-4 py-2 rounded-md'
//           >
//             + Add Day
//           </button>

//           <button
//             onClick={handleSubmitWorkout}
//             className='bg-blue-600 text-white px-4 py-2 rounded-md flex items-center'
//             disabled={loading}
//           >
//             <FaBook className='mr-2' />
//             {loading ? 'Creating Workout...' : 'Create Workout'}
//           </button>
//         </div>

//         {days.map((day, dayIndex) => (
//           <div key={dayIndex} className='mt-4 border rounded-md p-4 mb-4'>
//             <div className='flex justify-between items-center mb-4'>
//               <div className='flex items-center'>
//                 <span
//                   onClick={() => setSelectedDay(dayIndex)}
//                   className={`text-lg font-semibold cursor-pointer ${
//                     selectedDay === dayIndex ? 'text-blue-600' : 'text-gray-600'
//                   }`}
//                 >
//                   {day.dayName}
//                 </span>
//                 <button
//                   onClick={() => handleRemoveExercise(dayIndex)}
//                   className='ml-4 text-red-500'
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//               <span className='text-sm text-gray-500'>
//                 Est. 0 min | {day.exercises.length} exercises
//               </span>
//             </div>

//             {/* Exercises for the selected day */}
//             {day.exercises.length === 0 ? (
//               <p>This day is empty. Add exercises from the library.</p>
//             ) : (
//               <div className='space-y-4'>
//                 {day.exercises.map((exercise, exerciseIndex) => (
//                   <div
//                     key={exerciseIndex}
//                     className='p-4 bg-gray-100 rounded-md'
//                   >
//                     <div className='flex items-center justify-between mb-3'>
//                       <span>{exercise.exercise.title}</span>
//                       <button
//                         onClick={() => handleRemoveExercise(exerciseIndex)}
//                         className='text-red-500'
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                     <div className='grid grid-cols-4 gap-4'>
//                       <span className='font-semibold'>Set</span>
//                       <span className='font-semibold'>Reps</span>
//                     </div>
//                     {exercise.sets.map((set, setIndex) => (
//                       <div key={setIndex} className='grid grid-cols-4 gap-4'>
//                         <span>{setIndex + 1}</span>
//                         <input
//                           type='number'
//                           value={set.reps}
//                           onChange={e =>
//                             handleInputChange(
//                               exerciseIndex,
//                               setIndex,
//                               'reps',
//                               e.target.value
//                             )
//                           }
//                           className='p-2 border rounded-md'
//                           placeholder='Reps'
//                         />
//                         <input
//                           type='number'
//                           value={set.rest}
//                           onChange={e =>
//                             handleInputChange(
//                               exerciseIndex,
//                               setIndex,
//                               'rest',
//                               e.target.value
//                             )
//                           }
//                           className='p-2 border rounded-md'
//                           placeholder='Rest'
//                         />
//                         <button
//                           onClick={() =>
//                             handleRemoveSet(exerciseIndex, setIndex)
//                           }
//                           className='text-red-500'
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                     ))}
//                     <button
//                       onClick={() => handleAddSet(exerciseIndex)}
//                       className='mt-2 text-blue-600'
//                     >
//                       + Add Set
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Right Section (Exercise Library) */}
//       <div className='w-1/3 border-l p-4 rounded-lg shadow-lg'>
//         <ExerciseLibrary handleAddExercise={handleAddExercise} />
//       </div>
//     </div>
//   );
// };

// export default CreateWorkout;

import React, { useState } from 'react';
import { FaBook, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { createWorkout } from '~/store/features/workout-slice';

import ExerciseLibrary from './exercise-library';

const CreateWorkout = () => {
  const [days, setDays] = useState([{ dayName: 'Day 1', exercises: [] }]);
  const userId = useSelector(state => state.auth.user.id);
  const [selectedDay, setSelectedDay] = useState(0);

  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.workouts);

  // Add a new day
  const addDay = () => {
    const newDay = { dayName: `Day ${days.length + 1}`, exercises: [] };
    setDays([...days, newDay]);
  };

  // Add exercise to the selected day
  const handleAddExercise = exercise => {
    const updatedDays = [...days];

    const exerciseExists = updatedDays[selectedDay].exercises.some(
      e => e.exercise._id === exercise._id
    );

    if (!exerciseExists) {
      updatedDays[selectedDay].exercises.push({
        exercise: { _id: exercise._id, title: exercise.title },
        sets: 2,
        reps: 8
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

  // Handle input change for sets, reps
  const handleInputChange = (exerciseIndex, field, value) => {
    const updatedDays = [...days];
    updatedDays[selectedDay].exercises[exerciseIndex][field] = value;
    setDays(updatedDays);
  };

  // Handle form submission to create the workout
  const handleSubmitWorkout = () => {
    const workoutData = {
      title: `Workout Day ${selectedDay + 1}`,
      image: '',
      isPublic: true,
      user: userId,
      exercises: days[selectedDay].exercises.map(exercise => ({
        exercise: exercise.exercise._id,
        sets: exercise.sets,
        reps: exercise.reps
      }))
    };

    console.log('Workout data:', workoutData);

    dispatch(createWorkout(workoutData));
  };

  return (
    <div className='flex gap-8 p-6 bg-white rounded-lg shadow-md'>
      {/* Left Section (Create Workout) */}
      <div className='w-2/3 p-4 bg-white rounded-lg'>
        <h2 className='text-2xl font-semibold mb-4'>Create Workout</h2>

        <div className='flex justify-between mb-4'>
          <button
            onClick={addDay}
            className='bg-blue-600 text-white px-4 py-2 rounded-md'
          >
            + Add Day
          </button>

          <button
            onClick={handleSubmitWorkout}
            className='bg-blue-600 text-white px-4 py-2 rounded-md flex items-center'
            disabled={loading}
          >
            <FaBook className='mr-2' />
            {loading ? 'Creating Workout...' : 'Create Workout'}
          </button>
        </div>

        {days.map((day, dayIndex) => (
          <div key={dayIndex} className='mt-4 border rounded-md p-4 mb-4'>
            <div className='flex justify-between items-center mb-4'>
              <div className='flex items-center'>
                <span
                  onClick={() => setSelectedDay(dayIndex)}
                  className={`text-lg font-semibold cursor-pointer ${
                    selectedDay === dayIndex ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {day.dayName}
                </span>
                <button
                  onClick={() => handleRemoveExercise(dayIndex)}
                  className='ml-4 text-red-500'
                >
                  <FaTrash />
                </button>
              </div>
              <span className='text-sm text-gray-500'>
                Est. 0 min | {day.exercises.length} exercises
              </span>
            </div>

            {/* Exercises for the selected day */}
            {day.exercises.length === 0 ? (
              <p>This day is empty. Add exercises from the library.</p>
            ) : (
              <div className='space-y-4'>
                {day.exercises.map((exercise, exerciseIndex) => (
                  <div
                    key={exerciseIndex}
                    className='p-4 bg-gray-100 rounded-md'
                  >
                    <div className='flex items-center justify-between mb-3'>
                      <span>{exercise.exercise.title}</span>
                      <button
                        onClick={() => handleRemoveExercise(exerciseIndex)}
                        className='text-red-500'
                      >
                        <FaTrash />
                      </button>
                    </div>
                    {/* Table-like structure for sets and reps */}
                    <div className='grid grid-cols-4 gap-4'>
                      <span className='font-semibold'>Set</span>
                      <span className='font-semibold'>Reps</span>
                    </div>
                    <div className='grid grid-cols-4 gap-4'>
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
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right Section (Exercise Library) */}
      <div className='w-1/3 border-l p-4 rounded-lg shadow-lg'>
        <ExerciseLibrary handleAddExercise={handleAddExercise} />
      </div>
    </div>
  );
};

export default CreateWorkout;
