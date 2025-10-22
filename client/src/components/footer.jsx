import React from 'react';
import { FaFacebookF, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router';

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    { Icon: FaTwitter, label: 'Twitter', href: '#' },
    { Icon: FaFacebookF, label: 'Facebook', href: '#' },
    { Icon: FaInstagram, label: 'Instagram', href: '#' },
    { Icon: FaGithub, label: 'GitHub', href: '#' }
  ];
  const col = 'space-y-2 text-base/7 text-white/90';
  const link =
    'transition hover:text-[#cfe0ff] focus:outline-none focus:ring-2 focus:ring-white/60 rounded';

  return (
    <footer className='relative rounded-t-2xl overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#3067B6] to-[#2563eb] text-white'>
      <div className='pointer-events-none absolute -top-10 left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl' />
      <div className='mx-auto max-w-7xl px-6 py-12 sm:px-10'>
        <div className='mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5'>
          <div className='lg:col-span-2'>
            <Link to='/' className='block'>
              <span className='text-4xl font-extrabold tracking-tight'>
                F-FITNESS
              </span>
            </Link>
            <p className='mt-3 max-w-md text-white/85 text-lg'>
              Build healthy habits and feel amazing — workouts, nutrition, cộng
              đồng hỗ trợ.
            </p>
            <div className='mt-5 flex gap-3'>
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className='group inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60'
                >
                  <Icon className='h-5 w-5 transition group-hover:scale-110' />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className='mb-4 text-2xl font-semibold'>Product</h3>
            <ul className={col}>
              <li>
                <Link className={link} to='/workouts'>
                  Workouts
                </Link>
              </li>
              <li>
                <Link className={link} to='/plans/routine-database'>
                  Routine Database
                </Link>
              </li>
              <li>
                <Link className={link} to='/plans/plan-list'>
                  Routine Builder
                </Link>
              </li>
              <li>
                <Link className={link} to='/nutrition'>
                  Nutrition
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 text-2xl font-semibold'>Company</h3>
            <ul className={col}>
              <li>
                <Link className={link} to='/about'>
                  About
                </Link>
              </li>
              <li>
                <a className={link} href='#'>
                  Features
                </a>
              </li>
              <li>
                <a className={link} href='#'>
                  Careers
                </a>
              </li>
              <li>
                <a className={link} href='#'>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 text-2xl font-semibold'>Newsletter</h3>
            <p className='text-white/85'>
              Nhận tips tập luyện & dinh dưỡng mỗi tuần.
            </p>
            <form
              onSubmit={e => e.preventDefault()}
              className='mt-4 flex items-center gap-2'
            >
              <input
                type='email'
                required
                placeholder='you@email.com'
                className='w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-slate-800 placeholder:slate-500 outline-none focus:ring-2 focus:ring-white/60'
              />
              <button
                type='submit'
                className='rounded-xl bg-white px-4 py-3 font-semibold text-[#3067B6] shadow-sm transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/60'
              >
                Subscribe
              </button>
            </form>
            <p className='mt-2 text-sm text-white/75'>
              Chúng tôi tôn trọng quyền riêng tư của bạn.
            </p>
          </div>
        </div>

        <div className='flex flex-col items-start justify-between gap-6 border-t border-white/20 pt-6 text-base text-white/90 sm:flex-row sm:items-center'>
          <div className='flex flex-wrap gap-x-6 gap-y-2'>
            <a className={link} href='#'>
              Privacy Policy
            </a>
            <a className={link} href='#'>
              Terms & Conditions
            </a>
            <a className={link} href='#'>
              Support
            </a>
          </div>
          <p className='text-white/75'>
            © {year} F-Fitness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
