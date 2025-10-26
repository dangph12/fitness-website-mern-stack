import React from 'react';
import {
  FaDumbbell,
  FaFemale,
  FaFireAlt,
  FaHome,
  FaMale,
  FaRunning
} from 'react-icons/fa';

const CATEGORIES = [
  {
    name: 'Beginner',
    icon: <FaDumbbell />,
    gradient: 'from-emerald-400 to-emerald-600',
    hint: '4–8 week foundational training roadmap'
  },
  {
    name: 'Home',
    icon: <FaHome />,
    gradient: 'from-sky-400 to-sky-600',
    hint: 'Train at home with minimal equipment'
  },
  {
    name: 'Gym',
    icon: <FaDumbbell />,
    gradient: 'from-rose-400 to-rose-600',
    hint: 'Full equipment & machine-based workouts'
  },
  {
    name: 'Men',
    icon: <FaMale />,
    gradient: 'from-indigo-400 to-indigo-600',
    hint: 'Focused on muscle mass & strength building'
  },
  {
    name: 'Women',
    icon: <FaFemale />,
    gradient: 'from-pink-400 to-pink-600',
    hint: 'Toning & fat loss with safe progression'
  },
  {
    name: 'Muscle Building',
    icon: <FaDumbbell />,
    gradient: 'from-amber-400 to-amber-600',
    hint: 'Hypertrophy & progressive overload focused'
  },
  {
    name: 'Fat Burning',
    icon: <FaFireAlt />,
    gradient: 'from-orange-400 to-orange-600',
    hint: 'HIIT & MetCon for effective calorie burn'
  },
  {
    name: 'Leg',
    icon: <FaRunning />,
    gradient: 'from-teal-400 to-teal-600',
    hint: 'Lower body focus: quads, hamstrings, glutes'
  }
];

export default function WorkoutCategory() {
  const handleCategoryClick = category => {
    console.log(`Category selected: ${category}`);
  };

  return (
    <section className='relative overflow-hidden px-6 py-12'>
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute -top-24 left-1/2 h-72 w-[70rem] -translate-x-1/2 rounded-b-[3rem] bg-gradient-to-b from-sky-100 to-transparent blur-3xl dark:from-sky-400/10' />
      </div>

      <div className='mx-auto max-w-6xl'>
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
          F-Fitness Workout Routine{' '}
          <span className='bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent'>
            Database
          </span>
        </h1>
        <p className='mt-3 max-w-3xl text-slate-600 sm:text-lg'>
          Explore a wide library of workouts tailored to your goals. Choose a
          category to begin your fitness journey more effectively.
        </p>
      </div>

      <div className='mx-auto mt-8 max-w-6xl'>
        <div className='mb-5'>
          <h2 className='text-2xl font-semibold text-slate-900'>
            Popular Categories
          </h2>
          <p className='text-sm text-slate-500'>
            Tap a category to view related workout routines
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {CATEGORIES.map(c => (
            <button
              key={c.name}
              onClick={() => handleCategoryClick(c.name)}
              className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:shadow-md'
              title={c.name}
            >
              <span
                className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${c.gradient} opacity-20 blur-2xl transition group-hover:opacity-30`}
              />

              <div
                className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} text-white shadow ring-1 ring-white/30`}
              >
                <span className='text-xl'>{c.icon}</span>
              </div>

              <h3 className='truncate text-base font-semibold text-slate-900'>
                {c.name}
              </h3>

              <p className='mt-1 line-clamp-2 text-sm text-slate-500'>
                {c.hint}
              </p>

              <span
                className={`pointer-events-none absolute inset-x-4 bottom-2 h-0.5 rounded-full bg-gradient-to-r ${c.gradient} opacity-0 transition-opacity group-hover:opacity-80`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
