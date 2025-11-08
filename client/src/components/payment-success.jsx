import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { updateMembershipPaymentStatus } from '~/store/features/payment-slice';

const normalizeOrderCode = sp => {
  const raw =
    sp.get('orderCode') ||
    sp.get('code') ||
    sp.get('order_id') ||
    sp.get('order');
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? String(Math.trunc(n)) : null;
};

export default function PaymentSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const ran = useRef(false);

  const orderCode = normalizeOrderCode(sp);
  const level = sp.get('level');
  const cancelledFlag =
    sp.get('cancelled') === '1' || sp.get('status') === 'cancelled';

  const confirmPayment = useCallback(async () => {
    if (!orderCode) return;
    try {
      setLoading(true);
      await dispatch(
        updateMembershipPaymentStatus({ orderCode, status: 'completed' })
      ).unwrap();
      setOk(true);
      toast.success(
        `Payment confirmed${level ? ` • ${level.toUpperCase()}` : ''}!`
      );
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || '';
      if (/already|completed/i.test(msg)) {
        setOk(true);
        toast.success('Payment already confirmed.');
      } else {
        toast.error('Failed to confirm payment.');
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, orderCode, level]);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (cancelledFlag) {
      navigate(
        `/payments/cancel?status=cancelled${orderCode ? `&orderCode=${orderCode}` : ''}${level ? `&level=${level}` : ''}`,
        { replace: true }
      );
      return;
    }

    if (!orderCode) {
      toast.error('Missing orderCode.');
      return;
    }
    confirmPayment();
  }, [confirmPayment, cancelledFlag, orderCode, level, navigate]);

  return (
    <div className='min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-white to-slate-50 px-6'>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center'
      >
        <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100'>
          {ok ? (
            <CheckCircle2 className='h-7 w-7 text-emerald-600' />
          ) : (
            <Loader2 className='h-7 w-7 animate-spin text-slate-600' />
          )}
        </div>

        <h1 className='text-2xl font-bold text-slate-900'>
          {ok ? 'Payment Successful' : 'Processing your payment…'}
        </h1>

        <p className='mt-2 text-slate-600'>
          {orderCode ? (
            <>
              Order{' '}
              <span className='font-semibold text-slate-800'>#{orderCode}</span>
            </>
          ) : (
            'Waiting for order code'
          )}
          {level ? (
            <>
              {' '}
              • Plan: <b>{level.toUpperCase()}</b>
            </>
          ) : null}
        </p>

        <div className='mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200'>
          {!ok && <span className='animate-pulse'>Please wait…</span>}
          {ok && <span>Your membership has been updated.</span>}
        </div>

        <div className='mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
          <Button
            onClick={() => navigate('/profile', { replace: true })}
            className='w-full sm:w-auto rounded-xl px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-950'
          >
            Go to Profile
          </Button>
          <Button
            variant='outline'
            onClick={() => navigate('/', { replace: true })}
            className='w-full sm:w-auto rounded-xl px-5 py-2.5'
          >
            Back to Home
          </Button>
        </div>

        {!ok && orderCode && (
          <button
            onClick={confirmPayment}
            className='mt-4 text-xs text-slate-500 underline underline-offset-4'
          >
            Retry confirmation
          </button>
        )}
      </motion.div>
    </div>
  );
}
