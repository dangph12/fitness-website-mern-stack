import { motion } from 'framer-motion';
import { FaDumbbell, FaHeart, FaLemon, FaVideo } from 'react-icons/fa';

const items = [
  {
    icon: <FaHeart />,
    title: 'Support & Motivation',
    desc: 'We feel greatly happy with what learners can do to be healthy and peaceful in mind.',
    tint: 'from-rose-500 to-pink-500',
    pill: 'bg-rose-50 text-rose-600 ring-rose-200'
  },
  {
    icon: <FaDumbbell />,
    title: 'Experienced Trainers',
    desc: 'We feel greatly happy with what learners can do to be healthy and peaceful in mind.',
    tint: 'from-blue-600 to-indigo-600',
    pill: 'bg-blue-50 text-blue-700 ring-blue-200'
  },
  {
    icon: <FaLemon />,
    title: 'Right Nutrition',
    desc: 'We feel greatly happy with what learners can do to be healthy and peaceful in mind.',
    tint: 'from-emerald-500 to-teal-500',
    pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200'
  },
  {
    icon: <FaVideo />,
    title: 'Online Courses',
    desc: 'We feel greatly happy with what learners can do to be healthy and peaceful in mind.',
    tint: 'from-violet-600 to-purple-600',
    pill: 'bg-violet-50 text-violet-700 ring-violet-200'
  }
];

export default function Features() {
  return (
    <section className='mx-auto w-full max-w-6xl px-4 py-10'>
      <div className='mb-8 text-center'>
        <h2 className='text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl'>
          Why Train With Us
        </h2>
        <p className='mt-2 text-sm text-slate-600'>
          Practical guidance, motivating support, and results that last.
        </p>
      </div>

      <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        {items.map((it, i) => (
          <FeatureCard key={i} {...it} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, tint, pill }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className='relative rounded-2xl p-[1px] transition'
    >
      <div
        className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${tint} opacity-20 blur-[10px]`}
        aria-hidden
      />
      <div className='relative h-full rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200'>
        <div className='mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-inset ring-slate-200 text-xl'>
          {icon}
        </div>

        <h3 className='text-base font-semibold text-slate-900'>{title}</h3>
        <p className='mt-1.5 text-sm leading-relaxed text-slate-600'>{desc}</p>

        <div className='mt-4'>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${pill}`}
          >
            Learn more
          </span>
        </div>

        <div className='pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 hover:opacity-100'>
          <div
            className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${tint} opacity-10`}
          />
        </div>
      </div>
    </motion.div>
  );
}
