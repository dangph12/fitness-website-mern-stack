import React, { useEffect, useLayoutEffect } from 'react';
import {
  FaClipboardList,
  FaDumbbell,
  FaUserAlt,
  FaWeightHanging
} from 'react-icons/fa';
import { GiMuscleUp } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { formatInstructions } from '~/lib/utils';
import { fetchExerciseById } from '~/store/features/exercise-slice';

export default function ExerciseDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentExercise, loading, error } = useSelector(
    state => state.exercises
  );

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (id) dispatch(fetchExerciseById(id));
  }, [id, dispatch]);

  if (loading)
    return (
      <div className='grid min-h-[40vh] place-items-center'>
        <p className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-600 shadow-sm'>
          Loading exercise…
        </p>
      </div>
    );
  if (error)
    return (
      <div className='grid min-h-[40vh] place-items-center'>
        <p className='rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-red-600 shadow-sm'>
          {error}
        </p>
      </div>
    );
  if (!currentExercise)
    return (
      <div className='grid min-h-[40vh] place-items-center'>
        <p className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-600 shadow-sm'>
          No exercise found.
        </p>
      </div>
    );

  const {
    title,
    tutorial,
    difficulty,
    type,
    instructions,
    muscles = [],
    equipments = []
  } = currentExercise;

  const Chip = ({ children, tone = 'sky' }) => {
    const toneMap = {
      sky: 'border-sky-200 bg-sky-50 text-sky-700',
      emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      amber: 'border-amber-200 bg-amber-50 text-amber-700'
    };
    return (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${toneMap[tone]}`}
      >
        {children}
      </span>
    );
  };

  return (
    <section className='relative bg-gradient-to-b from-[#F5F2EC] to-white'>
      <div className='mx-auto max-w-7xl px-6 py-10'>
        <header className='mb-6'>
          <h1 className='text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl'>
            {title}
          </h1>
          <div className='mt-4 flex flex-wrap gap-2'>
            <Chip tone='sky'>
              <FaUserAlt className='mr-2' />
              Difficulty: {difficulty || '—'}
            </Chip>
            <Chip tone='emerald'>
              <FaClipboardList className='mr-2' />
              Type: {type || '—'}
            </Chip>
            <Chip tone='amber'>
              <FaWeightHanging className='mr-2' />
              Log: Weight & Reps
            </Chip>
          </div>
        </header>

        <div className='grid gap-8 lg:grid-cols-2'>
          <div className='lg:sticky lg:top-6 h-fit'>
            <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
              <img
                src={tutorial}
                alt={title}
                className='block h-auto w-full object-cover'
              />
              <div className='flex items-center justify-end gap-3 border-t border-slate-100 p-4'>
                <button className='rounded-xl bg-[#3067B6] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#275397]'>
                  Try it out
                </button>
              </div>
            </div>
          </div>

          <div className='space-y-8'>
            <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
              <h3 className='mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500'>
                <GiMuscleUp className='text-sky-600 text-lg' />
                Target Muscle Groups
              </h3>
              {muscles.length ? (
                <ul className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  {muscles.map(m => (
                    <li
                      key={m._id || m}
                      className='group flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50/60 px-3 py-2 text-sky-800 ring-1 ring-white/40 transition hover:bg-sky-50'
                    >
                      {m.image ? (
                        <img
                          src={m.image}
                          alt={m.title}
                          className='h-12 w-12 rounded-lg object-contain ring-1 ring-white/60'
                        />
                      ) : (
                        <span className='grid h-12 w-12 place-items-center rounded-lg bg-white text-sky-500 ring-1 ring-sky-100'>
                          <GiMuscleUp />
                        </span>
                      )}
                      <span className='truncate text-sm font-semibold'>
                        {m.title || m}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-slate-500'>N/A</p>
              )}
            </section>

            <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
              <h3 className='mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500'>
                <FaDumbbell className='text-indigo-600 text-lg' />
                Equipment
              </h3>
              {equipments.length ? (
                <ul className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  {equipments.map(e => (
                    <li
                      key={e._id || e}
                      className='group flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50/60 px-3 py-2 text-indigo-800 ring-1 ring-white/40 transition hover:bg-indigo-50'
                    >
                      {e.image ? (
                        <img
                          src={e.image}
                          alt={e.title}
                          className='h-12 w-12 rounded-lg object-contain ring-1 ring-white/60'
                        />
                      ) : (
                        <span className='grid h-12 w-12 place-items-center rounded-lg bg-white text-indigo-500 ring-1 ring-indigo-100'>
                          <FaDumbbell />
                        </span>
                      )}
                      <span className='truncate text-sm font-semibold'>
                        {e.title || e}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-slate-500'>N/A</p>
              )}
            </section>

            <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
              <h3 className='mb-3 text-2xl font-bold text-slate-900'>
                Instructions
              </h3>
              <div className='whitespace-pre-line leading-relaxed text-slate-700'>
                {formatInstructions(instructions) ||
                  'No instructions provided.'}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
