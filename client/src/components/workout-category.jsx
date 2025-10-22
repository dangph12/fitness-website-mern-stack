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
    hint: 'Lộ trình nhập môn 4–8 tuần'
  },
  {
    name: 'Home',
    icon: <FaHome />,
    gradient: 'from-sky-400 to-sky-600',
    hint: 'Tập tại nhà, tối thiểu dụng cụ'
  },
  {
    name: 'Gym',
    icon: <FaDumbbell />,
    gradient: 'from-rose-400 to-rose-600',
    hint: 'Máy móc đầy đủ tại phòng gym'
  },
  {
    name: 'Men',
    icon: <FaMale />,
    gradient: 'from-indigo-400 to-indigo-600',
    hint: 'Tối ưu khối cơ & sức mạnh'
  },
  {
    name: 'Women',
    icon: <FaFemale />,
    gradient: 'from-pink-400 to-pink-600',
    hint: 'Săn chắc, đốt mỡ an toàn'
  },
  {
    name: 'Muscle Building',
    icon: <FaDumbbell />,
    gradient: 'from-amber-400 to-amber-600',
    hint: 'Hypertrophy, progressive overload'
  },
  {
    name: 'Fat Burning',
    icon: <FaFireAlt />,
    gradient: 'from-orange-400 to-orange-600',
    hint: 'HIIT/MetCon đốt calo hiệu quả'
  },
  {
    name: 'Leg',
    icon: <FaRunning />,
    gradient: 'from-teal-400 to-teal-600',
    hint: 'Leg day: quads, hamstrings, glutes'
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
        <h1 className='text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
          F‑Fitness Workout Routine{' '}
          <span className='bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent'>
            Database
          </span>
        </h1>
        <p className='mt-3 max-w-3xl text-slate-600 sm:text-lg'>
          Khám phá thư viện bài tập đa dạng theo mục tiêu của bạn. Chọn danh mục
          phù hợp để bắt đầu hành trình tập luyện hiệu quả hơn.
        </p>

        <div className='mt-4 flex flex-wrap gap-2 text-xs text-slate-700'>
          <span className='rounded-full border border-slate-200 bg-white px-3 py-1'>
            Beginner–Advanced
          </span>
          <span className='rounded-full border border-slate-200 bg-white px-3 py-1'>
            Home & Gym
          </span>
          <span className='rounded-full border border-slate-200 bg-white px-3 py-1'>
            Goal‑based plans
          </span>
        </div>
      </div>

      <div className='mx-auto mt-8 max-w-6xl'>
        <div className='mb-5 flex items-end justify-between'>
          <div>
            <h2 className='text-2xl font-semibold text-slate-900'>
              Popular Categories
            </h2>
            <p className='text-sm text-slate-500'>
              Chạm vào một danh mục để xem các routine liên quan
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'>
          {CATEGORIES.map(c => (
            <button
              key={c.name}
              onClick={() => handleCategoryClick(c.name)}
              className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-transform hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'
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

              <div className='flex items-center justify-between'>
                <h3 className='truncate text-base font-semibold text-slate-900'>
                  {c.name}
                </h3>
                <span
                  className={`ml-2 hidden rounded-full bg-gradient-to-br ${c.gradient} px-2 py-0.5 text-[10px] font-medium text-white sm:inline-block`}
                >
                  Explore
                </span>
              </div>

              <p className='mt-1 line-clamp-2 text-sm text-slate-500'>
                {c.hint}
              </p>

              <span
                className={`pointer-events-none absolute inset-x-4 bottom-2 h-0.5 rounded-full bg-gradient-to-r ${c.gradient} opacity-0 transition-opacity group-hover:opacity-80`}
              />
            </button>
          ))}
        </div>

        <div className='mx-auto mt-8 max-w-3xl'>
          <div className='relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm'>
            <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_16rem_at_50%_0%,rgba(56,189,248,0.12),transparent_60%)]' />
            <p className='text-sm text-slate-700'>
              Không chắc nên chọn gì?{' '}
              <span className='font-semibold'>
                Hãy cho chúng tôi biết mục tiêu
              </span>{' '}
              để nhận kế hoạch cá nhân hoá.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
