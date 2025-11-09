import React, { useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiUser, FiUsers, FiZap } from 'react-icons/fi';

import axiosInstance from '~/lib/axios-instance';

export default function UserFourFieldsCard({
  userId,
  user: userProp,
  className = ''
}) {
  const [user, setUser] = useState(userProp || null);
  const [loading, setLoading] = useState(Boolean(userId && !userProp));
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchUser() {
      if (!userId || userProp) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/api/users/${userId}`);
        if (!ignore) setUser(res.data?.data || null);
      } catch (e) {
        if (!ignore) setError(e?.message || 'Failed to load user');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchUser();
    return () => {
      ignore = true;
    };
  }, [userId, userProp]);

  const age = useMemo(() => {
    const dob = user?.dob;
    if (!dob) return '—';
    const d = new Date(dob);
    if (Number.isNaN(d)) return '—';
    const now = new Date();
    let a = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
    return a;
  }, [user?.dob]);

  const genderLabel = !user?.gender
    ? '—'
    : user.gender === 'male'
      ? 'Male'
      : user.gender === 'female'
        ? 'Female'
        : 'Other';

  const tokens = Number.isFinite(Number(user?.aiMealTokens))
    ? Number(user.aiMealTokens)
    : 0;

  if (loading) {
    return (
      <div
        className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
      >
        <div className='space-y-2'>
          <SkeletonLine w='w-2/5' />
          <SkeletonLine w='w-1/3' />
          <SkeletonLine w='w-2/5' />
          <SkeletonLine w='w-1/4' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`rounded-2xl border border-rose-200 bg-white p-5 shadow-sm ${className}`}
      >
        <p className='text-sm text-rose-600'>Error: {String(error)}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
      >
        <p className='text-sm text-slate-600'>No user</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      <div className='divide-y divide-slate-100'>
        <PrettyRow
          icon={<FiUser size={18} className='text-rose-600' />}
          label='Name'
          value={user?.name || '—'}
        />
        <PrettyRow
          icon={<FiCalendar size={18} className='text-indigo-600' />}
          label='Age'
          value={age}
        />
        <PrettyRow
          icon={<FiUsers size={18} className='text-emerald-600' />}
          label='Gender'
          value={genderLabel}
        />
        <PrettyRow
          icon={<FiZap size={18} className='text-amber-600' />}
          label='AI Meal Tokens'
          value={tokens}
          badge
        />
      </div>
    </div>
  );
}

function PrettyRow({ icon, label, value, badge = false }) {
  return (
    <div className='flex items-center justify-between gap-3 py-3'>
      <div className='flex items-center gap-2'>
        <span className='inline-flex items-center'>{icon}</span>
        <span className='text-sm text-slate-600'>{label}</span>
      </div>

      {badge ? (
        <span className='rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-900'>
          {value}
        </span>
      ) : (
        <span className='max-w-[60%] truncate text-sm font-medium text-slate-900'>
          {value}
        </span>
      )}
    </div>
  );
}

function SkeletonLine({ w = 'w-1/2' }) {
  return <div className={`h-4 ${w} rounded bg-slate-100 animate-pulse`} />;
}
