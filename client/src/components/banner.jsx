import { motion } from 'framer-motion';
import { ChevronDown, Play } from 'lucide-react';
import React from 'react';

import { Button } from '~/components/ui/button';

import banner from '../assets/banner-1.png';

export default function Banner() {
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section
      className='relative w-full overflow-hidden'
      aria-label='Fitness hero banner'
    >
      <motion.img
        src={banner}
        alt='People training together in a bright studio'
        className='h-[48vh] w-full object-cover sm:h-[56vh] md:h-[66vh] lg:h-[76vh]'
        loading='eager'
        decoding='async'
        initial={{ scale: 1.06, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent' />
        <div className='absolute inset-0 [mask-image:radial-gradient(120%_100%_at_50%_10%,#000_40%,transparent)] bg-black/20' />
        <div className='absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_-10%,rgba(56,189,248,0.10),transparent_60%)]' />
      </div>

      <motion.div
        className='pointer-events-auto absolute right-4 top-4 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold text-slate-800 ring-1 ring-white/60 backdrop-blur-md shadow-sm sm:text-sm'
        initial={{ y: -14, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5 }}
      >
        ✨ New classes weekly
      </motion.div>

      <div className='absolute inset-0 grid place-items-center px-4'>
        <motion.div
          className='mx-auto max-w-3xl text-center'
          variants={fadeUp}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.55 }}
        >
          <h1 className='text-balance text-3xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-4xl md:text-5xl lg:text-6xl'>
            Build Healthy Habits.{' '}
            <span className='bg-gradient-to-r from-teal-300 via-cyan-200 to-sky-300 bg-clip-text text-transparent'>
              Feel Amazing.
            </span>
          </h1>

          <p className='mx-auto mt-3 max-w-2xl text-pretty text-sm text-white/90 sm:mt-4 sm:text-base md:text-lg'>
            Personalized workouts, nutrition tips, and guided
            sessions—everything you need to move better and live better.
          </p>

          <motion.ul
            className='mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-white/90 sm:text-xs'
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <li className='rounded-full border border-white/25 bg-white/10 px-3 py-1 backdrop-blur-md'>
              1000+ workouts
            </li>
            <li className='rounded-full border border-white/25 bg-white/10 px-3 py-1 backdrop-blur-md'>
              Certified coaches
            </li>
            <li className='rounded-full border border-white/25 bg-white/10 px-3 py-1 backdrop-blur-md'>
              Beginner–Advanced
            </li>
          </motion.ul>

          <motion.div
            className='mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row'
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <Button
              className='h-11 rounded-xl bg-[#3067B6] px-6 text-white shadow-lg shadow-black/30 transition hover:bg-[#275397] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 focus-visible:ring-white/70'
              onClick={() => (window.location.href = '/signup')}
              aria-label='Join now'
            >
              Join Now
            </Button>
            <Button
              variant='outline'
              className='h-11 rounded-xl border-white/60 bg-white/10 px-6 text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
              onClick={() => (window.location.href = '/plans')}
              aria-label='Explore plans'
            >
              Explore Plans
            </Button>
            <Button
              variant='outline'
              className='group inline-flex h-11 items-center gap-2 rounded-xl border-white/60 bg-white/10 px-5 text-white backdrop-blur-md hover:bg-white/20'
              onClick={() => (window.location.href = '/demo')}
              aria-label='Watch demo video'
            >
              <Play className='size-4 transition-transform group-hover:scale-110' />
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.span
        className='pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-teal-400/25 blur-3xl'
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
      <motion.span
        className='pointer-events-none absolute -top-12 -right-10 h-40 w-40 rounded-full bg-sky-400/25 blur-3xl'
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
      />

      <motion.div
        className='absolute bottom-4 left-1/2 -translate-x-1/2'
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.6 }}
        aria-hidden
      >
        <ChevronDown className='size-6 text-white/80' />
      </motion.div>
    </section>
  );
}
