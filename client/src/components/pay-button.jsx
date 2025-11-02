import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import axiosInstance from '~/lib/axios-instance';
import { buildCancelUrl, buildReturnUrl } from '~/lib/pay-urls';

export default function PayButton({ level, amount }) {
  const [loading, setLoading] = useState(false);
  const userId = useSelector(s => s.auth.user?._id || s.auth.user?.id);

  const handlePay = async () => {
    if (!userId) {
      toast.error('Please login to upgrade.');
      return;
    }
    try {
      setLoading(true);

      const payload = {
        amount,
        userId,
        targetMembership: level, // 'vip' | 'premium'
        returnUrl: buildReturnUrl({ level }),
        cancelUrl: buildCancelUrl({ level }),
        redirect: false
      };

      const res = await axiosInstance.post(
        '/api/payments/create-payment-link',
        payload
      );
      const data = res?.data?.data;

      if (!data?.checkoutUrl) {
        throw new Error('Missing checkoutUrl');
      }

      window.location.href = data.checkoutUrl;
    } catch (e) {
      toast.error(
        e?.response?.data?.message || e.message || 'Create payment failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className='w-full rounded-xl px-5 py-2.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700'
      disabled={loading}
      onClick={handlePay}
    >
      {loading ? 'Redirecting…' : `Upgrade to ${level.toUpperCase()}`}
    </Button>
  );
}
