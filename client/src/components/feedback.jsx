import { motion } from 'framer-motion';
import React from 'react';
import { FaQuoteRight, FaStar } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Chloe Moore',
    role: 'Business Management',
    title: 'Best Yoga Club Ever',
    text: 'Không gian cực chill, giáo trình rõ ràng. Sau 1 tháng mình thấy cơ thể linh hoạt và ngủ ngon hơn hẳn!',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400',
    rating: 5
  },
  {
    name: 'Sofia Jones',
    role: 'Yoga Trainer',
    title: 'Amazing Classes',
    text: 'Lớp học giàu năng lượng, giảng viên nhiệt tình, động tác được chỉnh tỉ mỉ. Rất đáng tiền!',
    avatar:
      'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=400',
    rating: 5
  },
  {
    name: 'John Doe',
    role: 'Product Manager',
    title: 'Excellent Experience',
    text: 'App đặt lịch mượt, bài tập có video minh hoạ chuẩn. Trải nghiệm tổng thể tuyệt vời.',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400',
    rating: 4
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

export default function Feedback() {
  return (
    <section className='relative bg-gradient-to-b from-slate-50 to-white py-14 sm:py-20 px-6'>
      <div
        aria-hidden
        className='pointer-events-none absolute -top-10 left-10 h-44 w-44 rounded-full bg-teal-200/30 blur-3xl'
      />
      <div
        aria-hidden
        className='pointer-events-none absolute -bottom-10 right-10 h-44 w-44 rounded-full bg-emerald-200/30 blur-3xl'
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className='mx-auto mb-10 max-w-3xl text-center'
      >
        <h2 className='text-3xl font-extrabold tracking-tight text-teal-600 sm:text-4xl'>
          What People Say About Us
        </h2>
        <p className='mt-3 text-slate-600'>
          Những trải nghiệm chân thực từ học viên & huấn luyện viên.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.2 }}
        className='mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
      >
        {testimonials.map((t, i) => (
          <motion.article
            key={t.name + i}
            variants={item}
            whileHover={{ y: -6, scale: 1.01 }}
            className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition'
          >
            <div className='absolute right-5 top-5 text-teal-500/20'>
              <FaQuoteRight size={36} />
            </div>

            <div className='mb-4 flex items-center gap-4'>
              <div className='relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-teal-100'>
                <img
                  src={t.avatar}
                  alt={t.name}
                  className='h-full w-full object-cover'
                />
              </div>
              <div>
                <h3 className='text-base font-semibold text-slate-900'>
                  {t.name}
                </h3>
                <p className='text-sm text-slate-500'>{t.role}</p>
              </div>
            </div>

            <div className='mb-3 flex items-center gap-1'>
              {Array.from({ length: 5 }).map((_, idx) => (
                <FaStar
                  key={idx}
                  className={
                    idx < t.rating ? 'text-amber-400' : 'text-slate-300'
                  }
                  size={16}
                />
              ))}
            </div>

            <h4 className='text-lg font-semibold text-teal-600'>{t.title}</h4>
            <p className='mt-2 line-clamp-4 text-slate-600'>{t.text}</p>

            <div className='mt-5 h-1 w-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-80 group-hover:opacity-100' />
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
