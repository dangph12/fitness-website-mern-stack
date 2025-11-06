import React, { useEffect, useMemo, useState } from 'react';
import {
  FaCalendarAlt,
  FaEdit,
  FaHeartbeat,
  FaRulerVertical,
  FaSave,
  FaTimes,
  FaWeight
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import {
  createBodyRecord,
  fetchUserBodyRecords,
  selectBodyRecordsLoading,
  selectUserBodyRecords,
  updateBodyRecord
} from '~/store/features/body-records-slice';

export default function UserBodyRecordList({ userId }) {
  const dispatch = useDispatch();
  const records = useSelector(selectUserBodyRecords) || [];
  const loading = useSelector(selectBodyRecordsLoading);
  const latest = records?.[0];

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ height: '', weight: '' });

  useEffect(() => {
    if (!userId) return;
    dispatch(fetchUserBodyRecords(userId))
      .unwrap()
      .catch(() => toast.error('Failed to load body records.'));
  }, [dispatch, userId]);

  useEffect(() => {
    if (!isEditing) return;
    setForm({
      height: latest?.height ?? '',
      weight: latest?.weight ?? ''
    });
  }, [isEditing, latest]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const bmi = useMemo(() => {
    const h = parseFloat(form.height);
    const w = parseFloat(form.weight);
    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0) return '';
    const v = w / Math.pow(h / 100, 2);
    return Number.isFinite(v) ? v.toFixed(1) : '';
  }, [form.height, form.weight]);

  const cancelEdit = () => {
    setIsEditing(false);
    setForm({ height: '', weight: '' });
  };

  const saveEdit = async () => {
    const heightNum = parseFloat(form.height);
    const weightNum = parseFloat(form.weight);

    if (!Number.isFinite(heightNum) || heightNum <= 0) {
      return toast.error('Height must be a number > 0');
    }
    if (!Number.isFinite(weightNum) || weightNum <= 0) {
      return toast.error('Weight must be a number > 0');
    }

    const data = {
      user: String(userId),
      height: heightNum,
      weight: weightNum
    };

    try {
      setSaving(true);
      if (latest?._id) {
        await dispatch(updateBodyRecord({ id: latest._id, data })).unwrap();
        toast.success('Body record updated!');
      } else {
        await dispatch(createBodyRecord(data)).unwrap();
        toast.success('Body record created!');
      }
      setIsEditing(false);
      await dispatch(fetchUserBodyRecords(userId)).unwrap();
    } catch (err) {
      toast.error(err?.message || 'Failed to save body record.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
      <div className='flex items-center justify-between gap-4 px-1 py-1 md:py-2'>
        <div className='flex items-center gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100 text-rose-600 shadow-inner'>
            <FaHeartbeat className='text-xl' />
          </div>
          <div>
            <h3 className='text-base md:text-lg font-semibold text-slate-800'>
              Body Records
            </h3>
            <p className='text-xs text-slate-500 mt-0.5'>
              Latest measurements for the user
            </p>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className='mt-4 rounded-xl border border-slate-200 bg-white p-5'>
          <div className='space-y-4'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
              <div className='sm:w-56 flex items-center gap-2 text-slate-700 font-medium'>
                <span className='inline-grid place-items-center h-8 w-8 rounded-md bg-sky-50 text-sky-500 ring-1 ring-sky-100'>
                  <FaRulerVertical />
                </span>
                Height (cm)
              </div>
              <input
                type='number'
                name='height'
                inputMode='decimal'
                min='0'
                step='0.1'
                value={form.height}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
                placeholder='170'
                aria-label='Height in centimeters'
              />
            </div>

            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
              <div className='sm:w-56 flex items-center gap-2 text-slate-700 font-medium'>
                <span className='inline-grid place-items-center h-8 w-8 rounded-md bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'>
                  <FaWeight />
                </span>
                Weight (kg)
              </div>
              <input
                type='number'
                name='weight'
                inputMode='decimal'
                min='0'
                step='0.1'
                value={form.weight}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
                placeholder='65'
                aria-label='Weight in kilograms'
              />
            </div>

            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
              <div className='sm:w-56 flex items-center gap-2 text-slate-700 font-medium'>
                <span className='inline-grid place-items-center h-8 w-8 rounded-md bg-violet-50 text-violet-600 ring-1 ring-violet-100'>
                  <FaHeartbeat />
                </span>
                BMI (auto)
              </div>
              <input
                type='text'
                value={bmi}
                readOnly
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600'
                placeholder='—'
                aria-readonly
              />
            </div>

            <div className='mt-2 flex items-center justify-end gap-3'>
              <button
                type='button'
                onClick={cancelEdit}
                disabled={saving}
                className='inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-60'
              >
                <FaTimes /> Cancel
              </button>
              <button
                type='button'
                onClick={saveEdit}
                disabled={saving}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                  saving
                    ? 'bg-rose-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
                }`}
              >
                <FaSave /> {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {!isEditing && (
        <div className='mt-4 space-y-3'>
          {loading ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <div className='animate-pulse flex items-center gap-3'>
                <div className='w-12 h-12 rounded-full bg-rose-100' />
                <div className='space-y-2'>
                  <div className='w-56 h-4 bg-slate-100 rounded' />
                  <div className='w-40 h-3 bg-slate-100 rounded' />
                </div>
              </div>
              <p className='mt-4 text-sm text-slate-500'>Loading records…</p>
            </div>
          ) : records.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mb-4'>
                <FaCalendarAlt className='text-2xl' />
              </div>
              <p className='text-sm text-slate-500 italic'>
                No body records found.
              </p>
              <button
                type='button'
                onClick={() => setIsEditing(true)}
                className='mt-4 px-4 py-2 rounded-lg bg-rose-100 text-rose-700 text-sm font-medium hover:bg-rose-200'
              >
                Add record
              </button>
            </div>
          ) : (
            <div className='space-y-3'>
              {[...records]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((r, idx) => {
                  const date = r.createdAt ? new Date(r.createdAt) : null;
                  const dateStr = date
                    ? date.toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })
                    : '—';
                  const timeStr = date
                    ? date.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '';

                  const bmiVal =
                    typeof r.bmi === 'number' ? r.bmi : Number(r.bmi || 0);

                  const bmiColor = !Number.isFinite(bmiVal)
                    ? 'text-slate-700'
                    : bmiVal < 18.5
                      ? 'text-sky-600'
                      : bmiVal < 25
                        ? 'text-emerald-700'
                        : bmiVal < 30
                          ? 'text-amber-700'
                          : 'text-rose-700';

                  const latestRow = idx === 0;

                  return (
                    <div
                      key={r._id}
                      className={`rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition ${
                        latestRow ? 'ring-1 ring-rose-200 bg-rose-50/40' : ''
                      }`}
                    >
                      <div className='flex items-center justify-between px-4 md:px-5 py-3'>
                        <div className='flex items-center gap-3'>
                          <span className='inline-flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500'>
                            <FaCalendarAlt />
                          </span>
                          <div>
                            <div className='text-sm font-semibold text-slate-800'>
                              {dateStr}
                            </div>
                            <div className='text-xs text-slate-400'>
                              {timeStr}
                            </div>
                          </div>
                        </div>
                        {latestRow && (
                          <span className='rounded-full bg-rose-100 text-rose-700 text-xs font-medium px-3 py-1'>
                            Latest
                          </span>
                        )}
                      </div>

                      <div className='divide-y divide-slate-100'>
                        <div className='flex items-center justify-between px-4 md:px-5 py-3'>
                          <div className='flex items-center gap-2 text-slate-600'>
                            <span className='inline-grid place-items-center h-7 w-7 rounded-md bg-sky-50 text-sky-500 ring-1 ring-sky-100'>
                              <FaRulerVertical />
                            </span>
                            <span className='text-sm font-medium'>Height</span>
                          </div>
                          <div className='text-sm font-semibold text-slate-900'>
                            {r.height ?? '—'}{' '}
                            <span className='text-slate-400 font-normal'>
                              cm
                            </span>
                          </div>
                        </div>

                        <div className='flex items-center justify-between px-4 md:px-5 py-3'>
                          <div className='flex items-center gap-2 text-slate-600'>
                            <span className='inline-grid place-items-center h-7 w-7 rounded-md bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'>
                              <FaWeight />
                            </span>
                            <span className='text-sm font-medium'>Weight</span>
                          </div>
                          <div className='text-sm font-semibold text-slate-900'>
                            {r.weight ?? '—'}{' '}
                            <span className='text-slate-400 font-normal'>
                              kg
                            </span>
                          </div>
                        </div>

                        <div className='flex items-center justify-between px-4 md:px-5 py-3'>
                          <div className='flex items-center gap-2 text-slate-600'>
                            <span className='inline-grid place-items-center h-7 w-7 rounded-md bg-violet-50 text-violet-600 ring-1 ring-violet-100'>
                              <FaHeartbeat />
                            </span>
                            <span className='text-sm font-medium'>BMI</span>
                          </div>
                          <div className={`text-sm font-semibold ${bmiColor}`}>
                            {Number.isFinite(bmiVal) ? bmiVal.toFixed(1) : '—'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {!isEditing && records.length > 0 && (
        <div className='mt-3 flex justify-end'>
          <button
            type='button'
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white ${
              loading
                ? 'bg-rose-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
            }`}
          >
            <FaEdit /> Edit Record
          </button>
        </div>
      )}
    </section>
  );
}
