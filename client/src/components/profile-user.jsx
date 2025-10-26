import { yupResolver } from '@hookform/resolvers/yup';
import {
  CalendarDays,
  CheckCheck,
  Clock4,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  User2
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import axiosInstance from '~/lib/axios-instance';
import { avatarSchema } from '~/lib/validations/avatar';
import { logout } from '~/store/features/auth-slice';
import { setAvatar, updateAvatar } from '~/store/features/avatar-slice';
import { updateUser } from '~/store/features/users-slice';

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading: authLoading } = useSelector(s => s.auth);
  const { url: avatarUrl, uploading } = useSelector(s => s.avatar);
  const { updateLoading, updateError } = useSelector(s => s.users);

  const [userData, setUserData] = useState(null);
  const [fetching, setFetching] = useState(false);

  const {
    register: registerAvatar,
    handleSubmit: handleSubmitAvatar,
    watch: watchAvatar,
    formState: { errors: avatarErrors }
  } = useForm({ resolver: yupResolver(avatarSchema) });
  const watchedAvatar = watchAvatar('avatar');
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { name: '', email: '', gender: '', dob: '' }
  });

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setFetching(true);
      try {
        const res = await axiosInstance.get(`/api/users/${user.id}`);
        const d = res.data?.data;
        setUserData(d);
        if (d?.avatar) dispatch(setAvatar(d.avatar));
        reset({
          name: d?.name || '',
          email: d?.email || '',
          gender: d?.gender || '',
          dob: d?.dob ? new Date(d.dob).toISOString().slice(0, 10) : ''
        });
      } finally {
        setFetching(false);
      }
    };
    if (!authLoading) load();
  }, [user?.id, authLoading, dispatch, reset]);

  useEffect(() => {
    if (watchedAvatar?.[0]) handleSubmitAvatar(onSubmitAvatar)();
  }, [watchedAvatar, handleSubmitAvatar]);

  const onSubmitAvatar = data => {
    if (!data?.avatar?.[0]) return;
    dispatch(updateAvatar({ userId: user.id, file: data.avatar[0] }));
  };

  const onSubmitProfile = values => {
    const form = new FormData();
    if (values.name) form.append('name', values.name.trim());
    if (values.email) form.append('email', values.email.trim());
    if (values.gender) form.append('gender', values.gender);
    if (values.dob) form.append('dob', new Date(values.dob).toISOString());

    const safeRole = (values.role || userData?.role || 'user').toLowerCase();
    form.append('role', safeRole === 'admin' ? 'admin' : 'user');

    const active =
      typeof values.isActive === 'boolean'
        ? values.isActive
        : Boolean(userData?.isActive);
    form.append('isActive', String(active));

    dispatch(updateUser({ id: user.id, data: form }))
      .unwrap()
      .then(updated => {
        setUserData(updated);
        toast.success('Profile updated successfully!');
      })
      .catch(err => toast.error(err || 'Profile update failed'));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const age = useMemo(() => {
    if (!userData?.dob) return null;
    const d = new Date(userData.dob);
    if (Number.isNaN(d)) return null;
    const now = new Date();
    let a = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
    return a;
  }, [userData?.dob]);

  const formatDateTime = v => (v ? new Date(v).toLocaleString('en-US') : '—');

  if (authLoading || fetching) {
    return (
      <div className='min-h-screen grid place-items-center text-slate-600'>
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen grid place-items-center p-6'>
        <div className='rounded-xl border p-6 text-center'>
          <p className='text-slate-700 mb-3'>
            Please log in to view your profile.
          </p>
          <button
            onClick={() => navigate('/login')}
            className='px-4 py-2 rounded-lg bg-blue-600 text-white'
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-4xl p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Profile</h1>
          <p className='text-sm text-slate-600'>
            Update your avatar & personal information
          </p>
        </div>
        <button
          onClick={handleLogout}
          className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800'
        >
          <LogOut size={18} /> Log Out
        </button>
      </div>

      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
        <form onSubmit={handleSubmitAvatar(onSubmitAvatar)}>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <div
              className={`relative h-28 w-28 shrink-0 rounded-full overflow-hidden ring-2 ring-slate-200 cursor-pointer ${
                uploading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              onClick={() => !uploading && fileInputRef.current?.click()}
              title={
                uploading ? 'Uploading image...' : 'Click to change avatar'
              }
            >
              <img
                className='h-full w-full object-cover'
                src={
                  watchedAvatar?.[0]
                    ? URL.createObjectURL(watchedAvatar[0])
                    : avatarUrl || ''
                }
                alt={userData?.name || 'avatar'}
              />
              {!uploading && (
                <div className='pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 to-transparent'>
                  <span className='mb-2 text-xs text-white'>Change</span>
                </div>
              )}
              {uploading && (
                <div className='absolute inset-0 grid place-items-center bg-black/40 text-white text-sm'>
                  Uploading…
                </div>
              )}
            </div>

            <div className='min-w-0 flex-1'>
              <div className='flex items-center gap-2'>
                <h2 className='text-lg font-semibold text-slate-900 truncate'>
                  {userData?.name || '—'}
                </h2>
                {userData?.isActive && (
                  <span className='inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200'>
                    <ShieldCheck size={14} /> Active
                  </span>
                )}
              </div>
              <p className='text-slate-600 truncate'>{userData?.email}</p>

              <div className='mt-3 flex flex-wrap gap-2'>
                <Chip color='blue'>Role: {userData?.role || 'user'}</Chip>
                {userData?.profileCompleted ? (
                  <Chip color='green'>
                    <CheckCheck size={14} className='mr-1' />
                    Profile Completed
                  </Chip>
                ) : (
                  <Chip color='amber'>Profile Incomplete</Chip>
                )}
                {userData?.gender && (
                  <Chip color='slate'>Gender: {userData.gender}</Chip>
                )}
                {userData?.dob && <Chip color='slate'>Age: {age ?? '—'}</Chip>}
              </div>
            </div>
          </div>

          <input
            type='file'
            accept='image/*'
            className='hidden'
            {...registerAvatar('avatar')}
            ref={e => {
              registerAvatar('avatar').ref(e);
              fileInputRef.current = e;
            }}
            disabled={uploading}
          />
          {avatarErrors?.avatar && (
            <p className='mt-2 text-sm text-rose-600'>
              {avatarErrors.avatar.message}
            </p>
          )}
        </form>
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
          <h3 className='mb-3 text-sm font-semibold uppercase text-slate-500'>
            Account Information
          </h3>
          <IconRow
            icon={<User2 size={18} />}
            label='Email'
            value={userData?.email || '—'}
          />
          <IconRow
            icon={<CalendarDays size={18} />}
            label='Created At'
            value={formatDateTime(userData?.createdAt)}
          />
          <IconRow
            icon={<Clock4 size={18} />}
            label='Last Updated'
            value={formatDateTime(userData?.updatedAt)}
          />
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
          <h3 className='mb-3 text-sm font-semibold uppercase text-slate-500'>
            Edit Profile
          </h3>

          <form onSubmit={handleSubmit(onSubmitProfile)} className='space-y-3'>
            <div>
              <label className='mb-1 block text-sm font-medium text-slate-700'>
                Full Name
              </label>
              <input
                {...register('name', { required: 'Please enter your name' })}
                className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
                placeholder='Enter your name'
              />
              {errors?.name && (
                <p className='mt-1 text-xs text-rose-600'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-slate-700'>
                Email
              </label>
              <div className='relative'>
                <span className='pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-slate-400'>
                  <Mail size={16} />
                </span>
                <input
                  {...register('email', {
                    required: 'Please enter your email',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                      message: 'Invalid email format'
                    }
                  })}
                  className='w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
                  placeholder='you@example.com'
                />
              </div>
              {errors?.email && (
                <p className='mt-1 text-xs text-rose-600'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-slate-700'>
                Gender
              </label>
              <select
                {...register('gender')}
                className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
              >
                <option value=''>— Select gender —</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-slate-700'>
                Date of Birth
              </label>
              <input
                type='date'
                {...register('dob')}
                className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
              />
            </div>

            {updateError && (
              <p className='text-sm text-rose-600'>
                Error: {String(updateError)}
              </p>
            )}

            <div className='pt-2'>
              <button
                type='submit'
                disabled={updateLoading}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white shadow-sm transition ${
                  updateLoading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Save size={18} />
                {updateLoading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function IconRow({ icon, label, value }) {
  return (
    <div className='flex items-center justify-between gap-3 py-2'>
      <div className='flex items-center gap-2 text-slate-600'>
        <span className='grid place-items-center rounded-md bg-slate-100 p-1.5 text-slate-700 ring-1 ring-slate-200'>
          {icon}
        </span>
        <span className='text-sm'>{label}</span>
      </div>
      <span className='max-w-[60%] truncate text-sm font-medium text-slate-900'>
        {value ?? '—'}
      </span>
    </div>
  );
}

function Chip({ children, color = 'slate' }) {
  const styles = {
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    blue: 'bg-blue-50 text-blue-700 ring-blue-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200'
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        styles[color] || styles.slate
      }`}
    >
      {children}
    </span>
  );
}

export default ProfilePage;
