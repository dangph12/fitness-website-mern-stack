import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import React from 'react';

import { Button } from '~/components/ui/button';

const plans = [
  {
    title: 'Free Plan',
    price: '$0',
    period: 'per month',
    accent: 'from-cyan-500 to-blue-500',
    badge: null,
    features: [
      'No credit card required',
      'Manage up to 10 members',
      'Access basic gym analytics',
      'Limited trainer scheduling tools',
      'Free support',
      'Track gym revenue'
    ],
    cta: 'Get Started',
    link: '/'
  },
  {
    title: 'Pro Plan',
    price: '$49',
    period: 'per month',
    accent: 'from-emerald-500 to-teal-500',
    badge: 'Most Popular',
    features: [
      'Manage up to 100 members',
      'Advanced gym analytics',
      'Unlimited trainer scheduling tools',
      'Custom member insights',
      'Priority support',
      'Integrated marketing tools'
    ],
    cta: 'Get Started',
    link: '/'
  },
  {
    title: 'Enterprise Plan',
    price: 'Custom',
    period: '',
    accent: 'from-amber-500 to-orange-500',
    badge: null,
    features: [
      'Unlimited members',
      'Personalized dashboard',
      'Custom reporting and analytics',
      'Dedicated account manager',
      '24/7 priority support',
      'API integrations and more'
    ],
    cta: 'Let’s Talk',
    link: '/'
  }
];

export default function PlanCourses() {
  return (
    <section className='bg-white text-gray-800 py-16'>
      <div className='mx-auto max-w-3xl px-6 text-center'>
        <h1 className='text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl'>
          Easy For Your Bank Account
        </h1>
        <p className='mt-3 text-lg text-slate-600'>
          Our flexible pricing ensures you get the features you need—without
          breaking the bank.
        </p>
      </div>

      <div className='mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3'>
        {plans.map((p, i) => {
          const isPro = p.badge === 'Most Popular';
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`relative rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-slate-200 transition ${
                isPro
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

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  className={`w-full rounded-xl px-5 py-2.5 font-semibold text-white shadow-sm transition hover:brightness-95 ${
                    isPro
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-slate-900 hover:bg-slate-950'
                  }`}
                  onClick={() => (window.location.href = p.link)}
                >
                  {p.cta}
                </Button>
              </motion.div>

              <div
                className={`mt-6 h-1 w-full rounded-full bg-gradient-to-r ${p.accent} opacity-80`}
              />
            </motion.div>
          );
        })}
      </div>

      <p className='mx-auto mt-8 max-w-3xl px-6 text-center text-sm text-slate-500'>
        Prices shown are in USD. Cancel anytime. Enterprise includes a tailored
        solution for your organization.
      </p>
    </section>
  );
}
