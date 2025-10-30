import { motion } from 'framer-motion';
import React from 'react';
import { FaHeart, FaLeaf, FaRocket, FaUsers } from 'react-icons/fa';

import logo from '~/assets/logo.png';

function Page() {
  return (
    <div className='min-h-screen bg-[#f8fafc] text-slate-800 overflow-hidden relative'>
      <div className='absolute -top-20 -left-20 w-[450px] h-[450px] bg-emerald-300/30 blur-[120px] rounded-full'></div>
      <div className='absolute bottom-0 right-0 w-[450px] h-[450px] bg-emerald-400/20 blur-[140px] rounded-full'></div>

      <section className='relative w-full px-6 py-28 text-center'>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className='text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900'
        >
          We Are <span className='text-emerald-600'>Changing Lives</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className='mt-4 text-lg text-slate-600 max-w-2xl mx-auto'
        >
          Empowering individuals to live healthier, stronger, and happier
          through knowledge and community.
        </motion.p>
      </section>

      <section className='max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-14 place-items-center'>
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          src={logo}
          alt='Team working together'
          className='rounded-3xl shadow-xl object-cover h-96 w-full border border-emerald-100'
        />

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className='text-4xl font-bold mb-6 text-slate-900'>
            Our Journey
          </h2>
          <p className='text-slate-600 leading-relaxed text-lg'>
            What began as a small movement fueled by passion has grown into a
            global community. We believe that with the right support,{' '}
            <b>anyone can transform their life</b>. Together, we push
            forward—growing, evolving, and inspiring change.
          </p>
        </motion.div>
      </section>

      <section className='py-20 bg-white'>
        <h2 className='text-center text-4xl font-bold mb-14'>
          What We Stand For
        </h2>

        <div className='max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-8 px-6'>
          {[
            {
              icon: <FaHeart />,
              title: 'Passion',
              desc: 'Driven by energy and love for what we do.'
            },
            {
              icon: <FaUsers />,
              title: 'Community',
              desc: 'We rise by lifting each other up.'
            },
            {
              icon: <FaRocket />,
              title: 'Growth',
              desc: 'Always improving, always evolving.'
            },
            {
              icon: <FaLeaf />,
              title: 'Wellbeing',
              desc: 'Mind, body, and spirit in harmony.'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className='p-8 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition cursor-pointer text-center'
            >
              <div className='text-emerald-600 text-4xl mb-4 mx-auto'>
                {item.icon}
              </div>
              <h3 className='font-semibold text-xl text-slate-800 mb-2'>
                {item.title}
              </h3>
              <p className='text-slate-600 text-sm'>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className='text-center py-24 px-6 relative'>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-4xl md:text-5xl font-bold text-slate-900'
        >
          Join Our Mission
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className='max-w-2xl mx-auto text-slate-600 mt-4 text-lg'
        >
          Become part of a movement that inspires meaningful change.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className='mt-10 px-8 py-3 bg-emerald-600 text-white rounded-xl shadow hover:bg-emerald-700 hover:shadow-lg transition text-lg font-medium'
        >
          Contact Us
        </motion.button>
      </section>
    </div>
  );
}

export default Page;
