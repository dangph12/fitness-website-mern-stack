import { motion } from 'framer-motion';
import { LogIn, XCircle } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import HistoryChart from '~/components/history-chart';
import HistoryList from '~/components/history-list';
import { Button } from '~/components/ui/button';

function Page() {
  const userId = useSelector(state => state?.auth?.user?.id);
  const navigate = useNavigate();

  if (!userId) {
    return (
      <div className='min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-white to-slate-50 px-6'>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className='w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm'
        >
          <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 ring-1 ring-rose-100'>
            <XCircle className='h-7 w-7 text-rose-600' />
          </div>

          <h1 className='text-center text-2xl font-bold text-slate-900'>
            Access Denied
          </h1>

          <p className='mt-2 text-center text-slate-600'>
            You must be logged in to view this page.
          </p>

          <div className='mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200'>
            Please login to continue. Your account is required to access this
            feature.
          </div>

          <div className='mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
            <Button
              onClick={() => navigate('/auth/login')}
              className='w-full sm:w-auto rounded-xl px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-950 inline-flex items-center gap-2'
            >
              <LogIn className='h-4 w-4' />
              Go to Login
            </Button>
          </div>

          <p className='mt-4 text-center text-xs text-slate-500'>
            Need an account? Sign up from the login page.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='space-y-10'>
      <HistoryChart />
      <HistoryList />
    </div>
  );
}

export default Page;
