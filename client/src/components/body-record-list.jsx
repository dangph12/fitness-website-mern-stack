import React, { useEffect } from 'react';
import {
  FaCalendarAlt,
  FaHeartbeat,
  FaRulerVertical,
  FaSyncAlt,
  FaWeight
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import {
  fetchUserBodyRecords,
  selectBodyRecordsLoading,
  selectUserBodyRecords
} from '~/store/features/body-records-slice';

export default function UserBodyRecordList({ userId }) {
  const dispatch = useDispatch();
  const records = useSelector(selectUserBodyRecords) || [];
  const loading = useSelector(selectBodyRecordsLoading);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserBodyRecords(userId))
        .unwrap()
        .then(() => toast.success('Body records loaded!'))
        .catch(() => toast.error('Failed to load body records.'));
    }
  }, [dispatch, userId]);

  const handleRefresh = () => {
    if (!userId) return;
    dispatch(fetchUserBodyRecords(userId))
      .unwrap()
      .then(() => toast.success('Refreshed body records'))
      .catch(() => toast.error('Refresh failed'));
  };

  return (
    <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
      <div>
        <div className='flex items-center justify-between gap-4 px-6 py-5 md:py-6'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center justify-center w-14 h-14 rounded-lg bg-rose-100 text-rose-600 shadow-inner'>
              <FaHeartbeat className='text-2xl' />
            </div>
            <div>
              <h3 className='text-lg md:text-xl font-semibold text-slate-800'>
                Body Records
              </h3>
              <p className='text-sm text-slate-500 mt-0.5'>
                Latest measurements for the user
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition ${
                loading
                  ? 'bg-rose-200 text-rose-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700'
              }`}
            >
              <FaSyncAlt className={`${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className='px-6 pb-6'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6'>
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
                  onClick={handleRefresh}
                  className='mt-4 px-4 py-2 rounded-lg bg-rose-100 text-rose-700 text-sm font-medium hover:bg-rose-200'
                >
                  Try refresh
                </button>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full table-auto'>
                  <thead>
                    <tr className='text-left'>
                      <th className='px-4 py-3 text-sm font-medium text-slate-600'>
                        Date
                      </th>
                      <th className='px-4 py-3 text-sm font-medium text-slate-600'>
                        Height
                      </th>
                      <th className='px-4 py-3 text-sm font-medium text-slate-600'>
                        Weight
                      </th>
                      <th className='px-4 py-3 text-sm font-medium text-slate-600'>
                        BMI
                      </th>
                    </tr>
                  </thead>

                  <tbody className='divide-y divide-gray-100'>
                    {records.map(r => {
                      const dateStr = r.createdAt
                        ? new Date(r.createdAt).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : '—';

                      const timeStr = r.createdAt
                        ? new Date(r.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '';

                      const bmi =
                        typeof r.bmi === 'number' ? r.bmi : Number(r.bmi || 0);
                      const bmiColor =
                        bmi < 18.5
                          ? 'text-blue-500 bg-blue-50'
                          : bmi < 25
                            ? 'text-green-700 bg-green-50'
                            : 'text-rose-600 bg-rose-50';

                      return (
                        <tr key={r._id} className='hover:bg-rose-50 transition'>
                          <td className='px-4 py-3 align-middle text-sm text-slate-700 whitespace-nowrap'>
                            <div className='flex items-center gap-3'>
                              <div className='w-9 h-9 rounded-md bg-rose-50 flex items-center justify-center text-rose-500'>
                                <FaCalendarAlt />
                              </div>
                              <div>
                                <div className='text-sm font-medium text-slate-800'>
                                  {dateStr}
                                </div>
                                <div className='text-xs text-slate-400'>
                                  {timeStr}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className='px-4 py-3 text-sm text-slate-700'>
                            <div className='flex items-center gap-2'>
                              <FaRulerVertical className='text-sky-400' />
                              <div>
                                <div className='font-medium'>
                                  {r.height ?? '—'}
                                </div>
                                <div className='text-xs text-slate-400'>cm</div>
                              </div>
                            </div>
                          </td>

                          <td className='px-4 py-3 text-sm text-slate-700'>
                            <div className='flex items-center gap-2'>
                              <FaWeight className='text-green-500' />
                              <div>
                                <div className='font-medium'>
                                  {r.weight ?? '—'}
                                </div>
                                <div className='text-xs text-slate-400'>kg</div>
                              </div>
                            </div>
                          </td>

                          <td className='px-4 py-3 text-sm'>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${bmiColor}`}
                            >
                              {Number.isFinite(bmi) ? bmi.toFixed(1) : '—'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className='mt-4 flex items-center justify-between text-sm text-slate-500'>
                  <div>
                    {records.length} record{records.length > 1 ? 's' : ''}
                  </div>
                  <div className='hidden sm:flex items-center gap-4'>
                    <div className='flex items-center gap-2'>
                      <span className='w-3 h-3 bg-green-50 rounded-full border border-green-200' />
                      <span className='text-xs'>Healthy BMI</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='w-3 h-3 bg-rose-50 rounded-full border border-rose-200' />
                      <span className='text-xs'>Overweight</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
