import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

import yoga from '../assets/yoga.png';

export default function IntroSection() {
  return (
    <section className='relative overflow-hidden bg-white'>
      <div
        aria-hidden
        className='pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-teal-200/40 blur-3xl'
      />
      <div
        aria-hidden
        className='pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl'
      />

      <div className='mx-auto max-w-7xl px-4 py-14 sm:py-20 lg:px-8'>
        <div className='grid items-center gap-10 lg:grid-cols-2'>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className='relative'
          >
            <div className='absolute inset-0 -z-10 mx-auto size-[420px] sm:size-[520px] rounded-full bg-gradient-to-br from-teal-300 via-emerald-200 to-cyan-200 opacity-60 blur-2xl' />
            <div className='mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 shadow-xl backdrop-blur'>
              <img
                src={yoga}
                alt='Yoga session'
                className='h-full w-full object-cover'
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.25 }}
              className='absolute -bottom-4 left-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-lg ring-1 ring-slate-200'
            >
              <span className='inline-block size-2 rounded-full bg-emerald-500' />
              <p className='text-sm font-medium text-slate-700'>
                Live • Mind & Body Flow
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <div className='inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-200'>
              Holistic Wellness
            </div>

            <h1 className='mt-3 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl md:text-5xl'>
              Bring the <span className='text-teal-600'>Healthiest Change</span>
              <br className='hidden sm:block' /> to Your Life with Yoga
            </h1>

            <p className='mt-4 max-w-xl text-slate-600 sm:text-lg'>
              Build balance, strength, and mental clarity with guided flows,
              mindful breathing, and sustainable routines designed for every
              level.
            </p>

            <ul className='mt-6 space-y-3'>
              {[
                'Personalized programs for all levels',
                'Guided breathing and mindfulness practice',
                'Progress tracking & gentle accountability'
              ].map((text, i) => (
                <li key={i} className='flex items-start gap-3'>
                  <CheckCircle className='mt-0.5 h-5 w-5 flex-none text-emerald-600' />
                  <span className='text-slate-700'>{text}</span>
                </li>
              ))}
            </ul>

            <div className='mt-8 flex flex-wrap items-center gap-3'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500'
              >
                Start Free Session
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition hover:bg-slate-50'
              >
                Discover More
              </motion.button>

              <div className='ml-1 flex items-center gap-4 text-xs text-slate-500'>
                <div className='inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 ring-1 ring-inset ring-slate-200'>
                  <span className='inline-block size-2 rounded-full bg-green-500' />
                  25k+ happy learners
                </div>
                <div className='hidden sm:inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 ring-1 ring-inset ring-slate-200'>
                  <span className='inline-block size-2 rounded-full bg-teal-500' />
                  New classes weekly
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
