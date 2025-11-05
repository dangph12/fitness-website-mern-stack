import { motion } from 'framer-motion';
import React from 'react';
import {
  FaBicycle,
  FaChild,
  FaDumbbell,
  FaFire,
  FaFistRaised,
  FaHeartbeat,
  FaRunning,
  FaSpa,
  FaSwimmer,
  FaUsers
} from 'react-icons/fa';

import { Button } from '~/components/ui/button';

const categories = [
  {
    name: 'Boxing',
    trainers: 12,
    hue: 'from-rose-500 to-rose-600',
    icon: <FaFistRaised />
  },
  {
    name: 'Yoga',
    trainers: 13,
    hue: 'from-emerald-500 to-teal-600',
    icon: <FaHeartbeat />
  },
  {
    name: 'Cardio',
    trainers: 14,
    hue: 'from-sky-500 to-blue-600',
    icon: <FaRunning />
  },
  {
    name: 'Strength Training',
    trainers: 15,
    hue: 'from-amber-500 to-yellow-600',
    icon: <FaDumbbell />
  },
  {
    name: 'Pilates',
    trainers: 8,
    hue: 'from-violet-500 to-purple-600',
    icon: <FaHeartbeat />
  },
  {
    name: 'CrossFit',
    trainers: 9,
    hue: 'from-fuchsia-500 to-pink-600',
    icon: <FaFire />
  },
  {
    name: 'Cycling',
    trainers: 10,
    hue: 'from-teal-500 to-cyan-600',
    icon: <FaBicycle />
  },
  {
    name: 'Martial Arts',
    trainers: 11,
    hue: 'from-orange-500 to-amber-600',
    icon: <FaUsers />
  },
  {
    name: 'Running',
    trainers: 7,
    hue: 'from-pink-500 to-rose-600',
    icon: <FaRunning />
  },
  {
    name: 'Zumba',
    trainers: 6,
    hue: 'from-red-500 to-rose-600',
    icon: <FaChild />
  },
  {
    name: 'Stretching',
    trainers: 15,
    hue: 'from-lime-500 to-green-600',
    icon: <FaSpa />
  },
  {
    name: 'Swimming',
    trainers: 10,
    hue: 'from-blue-500 to-indigo-600',
    icon: <FaSwimmer />
  }
];

const container = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, duration: 0.4, ease: 'easeOut' }
  }
};

const card = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } }
};

export default function CategoryBanner() {
  return (
    <section className='relative overflow-hidden bg-white py-12 sm:py-16 dark:bg-gray-950'>
      <div aria-hidden className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute -top-40 left-[-6rem] h-80 w-80 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-400/10' />
        <div className='absolute -bottom-40 right-[-6rem] h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-400/10' />
        <div className='absolute left-1/2 top-0 h-56 w-[70rem] -translate-x-1/2 rounded-b-[3rem] bg-gradient-to-b from-gray-50 to-transparent blur-2xl dark:from-white/5' />
      </div>

      <div className='mx-auto max-w-7xl px-6'>
        <header className='mx-auto mb-10 max-w-3xl text-center'>
          <h1 className='text-3xl font-extrabold tracking-tight text-[#3067B6] sm:text-4xl dark:text-[#95B7EF]'>
            Workout Categories
          </h1>
          <p className='mt-3 text-base text-[#3067B6]/80 sm:text-lg dark:text-[#95B7EF]/80'>
            Find workouts tailored to your fitness goals. Choose a category and
            get started today!
          </p>
        </header>

        <motion.div
          variants={container}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.25 }}
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        >
          {categories.map(c => (
            <motion.article
              key={c.name}
              variants={card}
              whileHover={{
                y: -6,
                scale: 1.015,
                rotateX: 2,
                rotateY: -2,
                transition: { type: 'spring', stiffness: 240, damping: 18 }
              }}
              whileTap={{ scale: 0.99 }}
              className='group relative rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition dark:border-white/10 dark:bg-white/5'
            >
              <div
                className={`absolute inset-x-5 -top-0.5 h-1 rounded-full bg-gradient-to-r ${c.hue} opacity-90`}
              />

              <div
                className={`mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br ${c.hue} text-white shadow-sm ring-1 ring-white/20`}
              >
                <span className='text-2xl'>{c.icon}</span>
              </div>

              <h2 className='mt-4 line-clamp-2 text-center text-lg font-semibold text-slate-900 dark:text-slate-100'>
                {c.name}
              </h2>

              <div className='mt-2 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300'>
                <span className='rounded-full bg-slate-100 px-2 py-0.5 ring-1 ring-inset ring-slate-200 dark:bg-white/10 dark:ring-white/10'>
                  {c.trainers} Trainers
                </span>
              </div>

              <div
                className={`pointer-events-none absolute -inset-px -z-10 rounded-2xl opacity-0 blur-[18px] transition-opacity duration-300 group-hover:opacity-60 bg-gradient-to-br ${c.hue}`}
              />
            </motion.article>
          ))}
        </motion.div>

        <div className='mx-auto mt-10 max-w-3xl'>
          <div className='relative overflow-hidden rounded-2xl border border-slate-100 bg-white/70 p-4 text-center shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5'>
            <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_16rem_at_50%_0%,rgba(99,102,241,0.12),transparent_60%)]' />
            <p className='text-sm text-slate-700 dark:text-slate-200'>
              Not sure where to start?{' '}
              <span className='font-semibold'>Tell us your goal</span> and get a
              personalized plan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
