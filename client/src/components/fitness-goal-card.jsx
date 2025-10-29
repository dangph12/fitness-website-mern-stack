import { Dumbbell, Salad, Scale } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { fetchGoalByUser, updateGoalByUser } from '~/store/features/goal-slice';

const DIETS = [
  'Mediterranean',
  'Ketogenic (Keto)',
  'Paleo',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Low-Carb'
];

const GOALS = ['Lose Weight', 'Build Muscle', 'To be Healthy'];

const FitnessGoalCard = ({ userId }) => {
  const dispatch = useDispatch();
  const { userGoal, loading: goalLoading, error } = useSelector(s => s.goals);

  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      targetWeight: '',
      diet: '',
      fitnessGoal: ''
    }
  });

  useEffect(() => {
    if (userId) dispatch(fetchGoalByUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (userGoal) {
      reset({
        targetWeight:
          typeof userGoal.targetWeight === 'number'
            ? userGoal.targetWeight
            : '',
        diet: userGoal.diet || '',
        fitnessGoal: userGoal.fitnessGoal || ''
      });
    }
  }, [userGoal, reset]);

  const onSubmit = async values => {
    const payload = {
      ...values,
      targetWeight:
        values.targetWeight === '' || values.targetWeight === null
          ? undefined
          : Number(values.targetWeight)
    };

    try {
      await dispatch(updateGoalByUser({ userId, goalData: payload })).unwrap();
      toast.success('Goal updated successfully!');
      setEditing(false);
    } catch (err) {
      toast.error(String(err || 'Failed to update goal'));
    }
  };

  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
      <h3 className='mb-3 text-sm font-semibold uppercase text-slate-500'>
        Fitness Goal
      </h3>

      {goalLoading && (
        <p className='text-slate-600 text-sm animate-pulse'>Loading goal...</p>
      )}

      {!goalLoading && error && (
        <p className='text-sm text-rose-600'>Error: {String(error)}</p>
      )}

      {!goalLoading && !error && (
        <>
          {!editing ? (
            <>
              {userGoal ? (
                <div className='space-y-3'>
                  <Row icon={<Scale size={16} />} label='Target Weight'>
                    <span className='font-semibold text-slate-900'>
                      {userGoal.targetWeight ?? '—'} kg
                    </span>
                  </Row>

                  <Row icon={<Salad size={16} />} label='Diet Plan'>
                    <span className='font-semibold text-slate-900'>
                      {userGoal.diet || '—'}
                    </span>
                  </Row>

                  <Row icon={<Dumbbell size={16} />} label='Goal'>
                    <span className='font-semibold text-slate-900'>
                      {userGoal.fitnessGoal || '—'}
                    </span>
                  </Row>
                </div>
              ) : (
                <p className='text-slate-500 text-sm'>
                  You haven’t set any fitness goal yet.
                </p>
              )}

              <div className='pt-4'>
                <button
                  onClick={() => setEditing(true)}
                  className='rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800'
                >
                  {userGoal ? 'Edit Goal' : 'Create Goal'}
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='flex items-center gap-3'>
                <label className='w-36 text-sm font-medium text-slate-700'>
                  Target Weight (kg)
                </label>
                <input
                  type='number'
                  step='0.1'
                  inputMode='decimal'
                  className='w-40 rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-900'
                  placeholder='e.g. 64'
                  {...register('targetWeight', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Must be ≥ 0' }
                  })}
                />
              </div>
              {errors?.targetWeight && (
                <p className='-mt-2 pl-36 text-xs text-rose-600'>
                  {errors.targetWeight.message}
                </p>
              )}

              <div className='flex items-center gap-3'>
                <label className='w-36 text-sm font-medium text-slate-700'>
                  Diet
                </label>
                <select
                  className='w-60 rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-900'
                  {...register('diet')}
                >
                  <option value=''>— Select diet —</option>
                  {DIETS.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex items-center gap-3'>
                <label className='w-36 text-sm font-medium text-slate-700'>
                  Goal
                </label>
                <select
                  className='w-60 rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-900'
                  {...register('fitnessGoal')}
                >
                  <option value=''>— Select goal —</option>
                  {GOALS.map(g => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex items-center gap-2 pt-2'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className={`rounded-md px-3 py-2 text-sm font-medium text-white ${
                    isSubmitting
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Saving…' : 'Save'}
                </button>
                <button
                  type='button'
                  onClick={() => {
                    reset({
                      targetWeight:
                        typeof userGoal?.targetWeight === 'number'
                          ? userGoal.targetWeight
                          : '',
                      diet: userGoal?.diet || '',
                      fitnessGoal: userGoal?.fitnessGoal || ''
                    });
                    setEditing(false);
                  }}
                  className='rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

function Row({ icon, label, children }) {
  return (
    <div className='flex items-center justify-between border-b border-slate-100 pb-2 last:border-b-0'>
      <span className='flex items-center gap-2 text-slate-600 font-medium'>
        <span className='grid place-items-center rounded-md bg-slate-100 p-1.5 text-slate-700 ring-1 ring-slate-200'>
          {icon}
        </span>
        {label}
      </span>
      {children}
    </div>
  );
}

export default FitnessGoalCard;
