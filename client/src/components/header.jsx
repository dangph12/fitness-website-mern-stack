import React, { useState } from 'react';
import { Link, NavLink } from 'react-router';

import logo from '../assets/logo.png';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openPlans, setOpenPlans] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-lg font-semibold transition-colors ${
      isActive
        ? 'text-[#3067B6] bg-[#E6EEF9]'
        : 'text-[#3067B6] hover:text-slate-700'
    }`;

  return (
    <header className='sticky top-0 z-50 border-b border-slate-200 bg-[#F5F2EC]'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3'>
        <Link to='/' className='flex items-center gap-3'>
          <img src={logo} alt='F-Fitness' className='h-12 w-12 rounded' />
          <span className='text-2xl font-extrabold tracking-tight text-[#3067B6] md:text-3xl'>
            F-Fitness
          </span>
        </Link>

        <button
          className='rounded-lg p-2 text-[#3067B6] hover:bg-white lg:hidden'
          aria-label='Mở menu'
          onClick={() => setOpen(v => !v)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-7 w-7'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path strokeLinecap='round' d='M4 6h16M4 12h16M4 18h16' />
          </svg>
        </button>

        <nav className='hidden items-center gap-3 lg:flex'>
          <NavLink to='/workouts' className={navLinkClass}>
            Workouts
          </NavLink>

          <div className='group relative'>
            <button
              className='flex items-center gap-1 rounded-lg px-3 py-2 text-lg font-semibold text-[#3067B6] transition-colors hover:text-slate-700 focus:outline-none'
              aria-haspopup='true'
              aria-expanded='false'
            >
              Plans
              <svg
                className='h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180'
                viewBox='0 0 20 20'
                fill='currentColor'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z'
                  clipRule='evenodd'
                />
              </svg>
            </button>

            <div
              className='
                pointer-events-none absolute left-0 mt-2 origin-top
                scale-y-95 transform opacity-0 translate-y-1
                rounded-xl border border-slate-200 bg-white p-2 shadow-xl
                transition-all duration-200 ease-out
                group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-y-100 group-hover:opacity-100
                group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:scale-y-100 group-focus-within:opacity-100
                min-w-[14rem]
              '
              role='menu'
            >
              <Link
                to='/plans/routine-database'
                className='block rounded-lg px-3 py-2 text-base text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none'
                role='menuitem'
              >
                Routine Database
              </Link>
              <Link
                to='/plans/plan-list'
                className='block rounded-lg px-3 py-2 text-base text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none'
                role='menuitem'
              >
                Routine Builder
              </Link>
            </div>
          </div>

          <NavLink to='/nutrition' className={navLinkClass}>
            Nutrition
          </NavLink>
          <NavLink to='/community' className={navLinkClass}>
            Community
          </NavLink>
          <NavLink to='/exercise' className={navLinkClass}>
            Exercise
          </NavLink>
          <NavLink to='/history' className={navLinkClass}>
            History
          </NavLink>
          <NavLink to='/about' className={navLinkClass}>
            About
          </NavLink>
        </nav>

        <div className='hidden items-center gap-3 lg:flex'>
          <Link
            to='/auth/login'
            className='rounded-full bg-yellow-400 px-5 py-2.5 text-base font-semibold text-black hover:bg-yellow-500'
          >
            Login
          </Link>
          <Link
            to='/auth/sign-up'
            className='rounded-full bg-[#3067B6] px-5 py-2.5 text-base font-semibold text-white hover:bg-[#275397]'
          >
            Sign Up
          </Link>
        </div>
      </div>

      {open && (
        <div className='bg-white border-t border-slate-200 lg:hidden'>
          <nav className='mx-auto max-w-7xl px-4 py-4'>
            <ul className='space-y-2'>
              <li>
                <NavLink
                  to='/workouts'
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-lg font-semibold ${
                      isActive
                        ? 'bg-[#E6EEF9] text-[#3067B6]'
                        : 'text-slate-800'
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  Workouts
                </NavLink>
              </li>

              <li>
                <button
                  className='flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-lg font-semibold text-slate-800 hover:bg-slate-50'
                  onClick={() => setOpenPlans(v => !v)}
                  aria-expanded={openPlans}
                >
                  Plans
                  <span
                    className={`transition-transform ${
                      openPlans ? 'rotate-180' : ''
                    }`}
                  >
                    ▾
                  </span>
                </button>
                {openPlans && (
                  <div className='mt-1 space-y-1 pl-4'>
                    <Link
                      to='/plans/routine-database'
                      className='block rounded-lg px-3 py-2 text-base text-slate-700 hover:bg-slate-50'
                      onClick={() => setOpen(false)}
                    >
                      Routine Database
                    </Link>
                    <Link
                      to='/plans/plan-list'
                      className='block rounded-lg px-3 py-2 text-base text-slate-700 hover:bg-slate-50'
                      onClick={() => setOpen(false)}
                    >
                      Routine Builder
                    </Link>
                  </div>
                )}
              </li>

              {[
                ['Nutrition', '/nutrition'],
                ['Community', '/community'],
                ['Exercise', '/exercise'],
                ['History', '/history'],
                ['About', '/about']
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    to={href}
                    className='block rounded-lg px-3 py-2 text-lg text-slate-800 hover:bg-slate-50'
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className='mt-4 flex gap-3'>
              <Link
                to='/auth/login'
                className='flex-1 rounded-full bg-yellow-400 px-4 py-2.5 text-center text-base font-semibold text-black hover:bg-yellow-500'
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                to='/auth/sign-up'
                className='flex-1 rounded-full bg-[#3067B6] px-4 py-2.5 text-center text-base font-semibold text-white hover:bg-[#275397]'
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
