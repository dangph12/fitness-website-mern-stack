import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import { Button } from '~/components/ui/button';

const plans = [
  {
    key: 'normal',
    title: 'Normal',
    price: '₫0',
    period: ' / month',
    accent: 'from-sky-500 to-indigo-500',
    badge: null,
    tokensPerDay: 0,
    features: [
      'Access Workouts & Plans',
      'Create personal Workouts',
      'Create personal Plans',
      'Create Meals (manual)',
      'No AI included'
    ],
    cta: 'Start for Free',
    link: '/plan-courses/normal'
  },
  {
    key: 'vip',
    title: 'VIP',
    price: '₫40,000',
    period: ' / month',
    accent: 'from-emerald-500 to-teal-500',
    badge: 'Most Popular',
    tokensPerDay: 30,
    features: [
      'Access ALL features',
      'AI Meal creation (30 tokens/day)',
      'Unlimited Workouts & Plans',
      'Advanced analytics & reports',
      'Priority support'
    ],
    cta: 'Explore VIP',
    link: '/plan-courses/vip'
  },
  {
    key: 'premium',
    title: 'Premium',
    price: '₫60,000',
    period: ' / month',
    accent: 'from-amber-500 to-orange-500',
    badge: null,
    tokensPerDay: 60,
    features: [
      'Access ALL features',
      'AI Meal creation (60 tokens/day)',
      'Deep-dive reports & export',
      '24/7 priority support',
      'API integrations & automation'
    ],
    cta: 'Explore Premium',
    link: '/plan-courses/premium'
  }
];

export default function PlanCourses() {
  return (
    <section className='bg-white text-gray-800 py-16'>
      <div className='mx-auto max-w-3xl px-6 text-center'>
        <h1 className='text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl'>
          Pick the Plan That Fits You
        </h1>
        <p className='mt-3 text-lg text-slate-600'>
          Flexible and transparent—upgrade when you need AI and advanced
          reports.
        </p>
      </div>

      <div className='mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3'>
        {plans.map((p, i) => {
          const isVipCard = p.key === 'vip';
          return (
            <Link key={p.key} to={p.link} className='block'>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`relative rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-slate-200 transition cursor-pointer ${
                  isVipCard
                    ? 'border-emerald-300 ring-emerald-100 shadow-md'
                    : 'hover:shadow-md'
                }`}
              >
                {p.badge && (
                  <div className='absolute -top-3 right-4'>
                    <span className='rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow'>
                      {p.badge}
                    </span>
                  </div>
                )}

                <div className='mb-5'>
                  <div
                    className={`mb-4 h-1.5 w-16 rounded-full bg-gradient-to-r ${p.accent}`}
                  />
                  <h2 className='text-xl font-semibold text-slate-900'>
                    {p.title}
                  </h2>

                  <div className='mt-2 flex items-end gap-2'>
                    <span className='text-4xl font-extrabold text-slate-900'>
                      {p.price}
                    </span>
                    {p.period && (
                      <span className='pb-1 text-sm text-slate-500'>
                        {p.period}
                      </span>
                    )}
                  </div>

                  {p.tokensPerDay > 0 ? (
                    <div className='mt-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700'>
                      <Sparkles className='h-3.5 w-3.5' />
                      AI Tokens: {p.tokensPerDay}/day
                    </div>
                  ) : (
                    <div className='mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600'>
                      No AI included
                    </div>
                  )}
                </div>

                <ul className='mb-6 space-y-3'>
                  {p.features.map(f => (
                    <li key={f} className='flex items-start gap-3'>
                      <span className='mt-0.5 rounded-full bg-emerald-50 p-1 ring-1 ring-emerald-200'>
                        <Check className='h-3.5 w-3.5 text-emerald-600' />
                      </span>
                      <span className='text-slate-600'>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button className='w-full rounded-xl px-5 py-2.5 font-semibold text-white shadow-sm bg-slate-900 hover:bg-slate-950'>
                  {p.cta}
                </Button>

                <div
                  className={`mt-6 h-1 w-full rounded-full bg-gradient-to-r ${p.accent} opacity-80`}
                />
              </motion.div>
            </Link>
          );
        })}
      </div>

      <p className='mx-auto mt-8 max-w-3xl px-6 text-center text-sm text-slate-500'>
        Monthly pricing, cancel anytime. VIP: 30 AI tokens/day. Premium: 60 AI
        tokens/day.
      </p>
    </section>
  );
}
