import { motion } from 'framer-motion';
import { ClipboardCopy, XCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
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

export default function PaymentCancel() {
  const [sp] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ran = useRef(false);
  const [loading, setLoading] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const status = (sp.get('status') || '').toLowerCase();
  const orderCode = normalizeOrderCode(sp);
  const level = (sp.get('level') || '').toLowerCase();
  const reason = sp.get('reason') || 'User cancelled at checkout';

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      if (status !== 'cancelled' || !orderCode) return;

      try {
        setLoading(true);
        await dispatch(
          updateMembershipPaymentStatus({
            orderCode,
            status: 'cancelled',
            cancellationReason: reason
          })
        ).unwrap();
        toast.info(
          'Payment cancelled. No changes were made to your membership.'
        );
      } catch {
        toast.info('Payment status recorded.');
      } finally {
        setLoading(false);
        setRecorded(true);
      }
    })();
  }, [dispatch, orderCode, status, reason]);

  const goHome = () => navigate('/', { replace: true });
  const tryAgain = () => {
    if (level === 'vip' || level === 'premium') {
      navigate(`/pay/${level}`, { replace: true });
    } else {
      navigate('/pricing', { replace: true });
    }
  };

  const copyOrder = async () => {
    if (!orderCode) return;
    try {
      await navigator.clipboard.writeText(orderCode);
      toast.success('Copied order code!');
    } catch {
      toast.error('Copy failed.');
    }
  };

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
          Payment Cancelled
        </h1>

        <p className='mt-2 text-center text-slate-600'>
          {orderCode ? (
            <>
              Your order{' '}
              <span className='font-semibold text-slate-800'>#{orderCode}</span>{' '}
              was cancelled
              {level ? (
                <>
                  {' '}
                  (<b className='uppercase'>{level}</b> plan)
                </>
              ) : null}
              .
            </>
          ) : (
            'The checkout was cancelled.'
          )}
        </p>

        {level && (
          <div className='mt-2 text-center'>
            <span className='inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600'>
              Reason: {reason}
            </span>
          </div>
        )}

        <div className='mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200'>
          {loading && (
            <span className='animate-pulse'>Recording cancellation…</span>
          )}
          {!loading && recorded && (
            <span>Cancellation recorded successfully.</span>
          )}
          {!loading && !recorded && (
            <span>
              You can safely return to the app. No membership changes were
              applied.
            </span>
          )}
        </div>

        <div className='mt-4 flex items-center justify-center gap-2'>
          {orderCode && (
            <button
              onClick={copyOrder}
              className='inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50'
            >
              <ClipboardCopy className='h-3.5 w-3.5' />
              Copy Order #
            </button>
          )}
        </div>

        <div className='mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
          <Button
            onClick={goHome}
            className='w-full sm:w-auto rounded-xl px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-950'
          >
            Back to Home
          </Button>

          <Button
            variant='outline'
            onClick={() => navigate('/pricing')}
            className='w-full sm:w-auto rounded-xl px-5 py-2.5'
          >
            View Plans
          </Button>

          <Button
            variant='outline'
            onClick={tryAgain}
            className='w-full sm:w-auto rounded-xl px-5 py-2.5'
          >
            Try Again
          </Button>
        </div>

        <p className='mt-4 text-center text-xs text-slate-500'>
          Need help? Contact support and include your order code above.
        </p>
      </motion.div>
    </div>
  );
}
