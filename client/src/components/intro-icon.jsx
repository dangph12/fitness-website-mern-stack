import { motion } from 'framer-motion';
import { BiDumbbell, BiLeaf, BiLemon, BiVideo } from 'react-icons/bi';

const items = [
  { icon: BiLeaf, title: 'HEALTHY Life', subtitle: 'Mind • Body • Balance' },
  { icon: BiDumbbell, title: 'YOGA Studio', subtitle: 'Strength & Flow' },
  {
    icon: BiLemon,
    title: 'ORGANIC Cosmetics',
    subtitle: 'Clean • Gentle • Pure'
  },
  { icon: BiLeaf, title: 'FLORA BEAUTY', subtitle: 'Glow from Nature' },
  { icon: BiVideo, title: 'YOGA', subtitle: 'On-demand Classes' }
];

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: i => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: 'easeOut' }
  })
};

export default function IntroIcon() {
  return (
    <section className='relative bg-white py-8 sm:py-10'>
      <div
        aria-hidden
        className='pointer-events-none absolute -top-16 left-10 h-40 w-40 rounded-full bg-teal-200/30 blur-3xl'
      />
      <div
        aria-hidden
        className='pointer-events-none absolute -bottom-16 right-10 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl'
      />

      <div className='mx-auto max-w-6xl px-6'>
        <motion.div
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.4 }}
          className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-6'
        >
          {items.map(({ icon: Icon, title, subtitle }, i) => (
            <motion.div
              key={title}
              variants={cardVariants}
              custom={i}
              whileHover={{ y: -4, scale: 1.02 }}
              className='group relative overflow-hidden rounded-2xl border border-teal-100 bg-white/70 p-5 text-center shadow-sm backdrop-blur-sm transition'
            >
              <div className='absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                <div className='absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-teal-300/20 blur-2xl' />
              </div>

              <div className='mx-auto grid size-14 place-items-center rounded-xl bg-teal-50 ring-1 ring-inset ring-teal-100 transition group-hover:bg-teal-100'>
                <Icon className='h-7 w-7 text-teal-600 transition group-hover:text-teal-700' />
              </div>

              <h3 className='mt-3 text-base font-semibold text-slate-800'>
                {title}
              </h3>
              <p className='mt-1 text-xs text-slate-500'>{subtitle}</p>

              <span className='mt-3 inline-block rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200'>
                Featured
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
