import React, { useState } from 'react';
import {
  FaCheckCircle,
  FaRobot,
  FaSpinner,
  FaSyncAlt,
  FaTimes
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import {
  clearAiRecommendations,
  fetchAiMeals
} from '~/store/features/meal-ai-slice';

import BodyRecordCard from './body-record-list';
import FitnessGoalCard from './fitness-goal-card';
import MealCard from './meal-card';

const formatDateForApi = dateString => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${month}/${day}/${year}`;
};

const dateToISOString = date => date?.toISOString().split('T')[0] || '';

const initialFormData = {
  query: '',
  bodyFatPercentage: '',
  skeletalMuscleMass: '',
  ecwRatio: '',
  bodyFatMass: '',
  visceralFatArea: '',
  startDate: dateToISOString(new Date()),
  endDate: dateToISOString(new Date())
};

export default function AiMealGenerator() {
  const dispatch = useDispatch();
  const {
    recommendedMeals = [],
    loading,
    error
  } = useSelector(state => state.mealAi || {});
  const userId = useSelector(state => state.auth?.user?.id);
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async e => {
    e.preventDefault();
    const payload = {
      query: formData.query,
      bodyFatPercentage: parseFloat(formData.bodyFatPercentage) || 0,
      skeletalMuscleMass: parseFloat(formData.skeletalMuscleMass) || 0,
      ecwRatio: parseFloat(formData.ecwRatio) || 0,
      bodyFatMass: parseFloat(formData.bodyFatMass) || 0,
      visceralFatArea: parseFloat(formData.visceralFatArea) || 0,
      startDate: formatDateForApi(formData.startDate),
      endDate: formatDateForApi(formData.endDate),
      title: 'AI Generated Meal Plan',
      mealType: 'Lunch',
      user: userId || 'unknown-user',
      foods: []
    };

    if (!payload.query || !payload.startDate || !payload.endDate) {
      return toast.error('Please provide a query and valid dates.');
    }

    try {
      await dispatch(fetchAiMeals(payload)).unwrap();
      toast.success('AI meals generated successfully!');
    } catch (err) {
      const message =
        typeof err === 'string'
          ? err
          : err?.message || 'Failed to generate AI meals.';
      toast.error(message);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    dispatch(clearAiRecommendations());
    toast.info('Form and results cleared.');
  };

  return (
    <div className='max-w-full mx-auto p-4 md:p-8 bg-gray-50 min-h-screen'>
      <header className='flex items-center gap-4 mb-8 p-4 bg-white rounded-2xl shadow-lg'>
        <FaRobot className='text-emerald-600 text-4xl' />
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>AI Meal Planner</h1>
          <p className='text-md text-gray-500'>
            Generate personalized meal recommendations based on your body
            metrics and fitness goals.
          </p>
        </div>
      </header>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-6'>
          <FitnessGoalCard userId={userId} />

          <BodyRecordCard
            userId={userId}
            className='bg-white p-6 rounded-2xl shadow-lg border border-gray-200'
          />

          <form
            onSubmit={handleGenerate}
            className='bg-white p-6 rounded-2xl shadow-lg space-y-6 border border-gray-200'
          >
            <h2 className='text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-3'>
              <FaSyncAlt className='text-emerald-500' /> Input Metrics & Goals
            </h2>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Goal/Query
              </label>
              <textarea
                name='query'
                value={formData.query}
                onChange={handleChange}
                rows='3'
                maxLength={200}
                required
                className='w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 resize-none'
              />
            </div>

            <div className='flex gap-3'>
              {['startDate', 'endDate'].map(field => (
                <div className='flex-1' key={field}>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    {field === 'startDate' ? 'Start Date' : 'End Date'}
                  </label>
                  <input
                    type='date'
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className='w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500'
                  />
                </div>
              ))}
            </div>

            <div className='grid grid-cols-2 gap-3'>
              {Object.entries({
                bodyFatPercentage: 'Body Fat (%)',
                skeletalMuscleMass: 'Muscle Mass',
                ecwRatio: 'ECW Ratio',
                bodyFatMass: 'Body Fat Mass',
                visceralFatArea: 'Visceral Fat Area'
              }).map(([key, label]) => (
                <div key={key}>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    {label}
                  </label>
                  <input
                    type='number'
                    step='0.1'
                    min='0.1'
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className='w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500'
                  />
                </div>
              ))}
            </div>

            <div className='flex gap-3 pt-3'>
              <button
                type='button'
                onClick={handleClear}
                className='flex-1 py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition flex items-center justify-center gap-2'
              >
                <FaTimes /> Clear
              </button>
              <button
                type='submit'
                disabled={loading}
                className={`flex-1 py-3 px-4 font-semibold rounded-xl flex items-center justify-center gap-2 text-white ${
                  loading
                    ? 'bg-emerald-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 shadow'
                }`}
              >
                {loading ? <FaSpinner className='animate-spin' /> : <FaRobot />}
                {loading ? 'Generating...' : 'Generate Meals'}
              </button>
            </div>
          </form>
        </div>

        <div className='lg:col-span-1 space-y-5'>
          {loading && (
            <div className='text-center p-10 text-gray-500'>
              <FaSpinner className='animate-spin text-4xl mx-auto mb-4 text-emerald-500' />
              <p>AI is processing your query...</p>
            </div>
          )}

          {error && (
            <div className='p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl'>
              <p className='font-bold'>Error:</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && recommendedMeals.length > 0 && (
            <div className='space-y-4'>
              <div className='flex items-start gap-3 p-4 bg-green-50 text-green-700 border-l-4 border-green-500 rounded-xl shadow-sm'>
                <FaCheckCircle className='text-green-500 text-xl mt-1' />
                <div>
                  <p className='font-semibold'>
                    {recommendedMeals.length} meal(s) generated.
                  </p>
                  <p className='text-sm italic'>
                    "Focused on: {formData.query}"
                  </p>
                </div>
              </div>

              {recommendedMeals.map((meal, index) => (
                <MealCard key={index} meal={meal} />
              ))}
            </div>
          )}

          {!loading && !error && recommendedMeals.length === 0 && (
            <div className='text-center p-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl'>
              <FaRobot className='text-5xl mx-auto mb-4' />
              <p>Enter your metrics and goal, then click "Generate Meals".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
