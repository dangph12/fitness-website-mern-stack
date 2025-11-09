import React, { useState } from 'react';
import {
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaFireAlt,
  FaLeaf,
  FaRobot,
  FaRulerVertical,
  FaSpinner,
  FaSyncAlt,
  FaTimes,
  FaUtensils
} from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import {
  clearAiRecommendations,
  fetchAiMeals,
  updateMealFoods
} from '~/store/features/meal-ai-slice';
import { createMultipleMeals } from '~/store/features/meal-slice';

import BodyRecordCard from './body-record-list';
import FitnessGoalCard from './fitness-goal-card';
import MealCard from './meal-card';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import UserBasicInfo from './user-basic-info';

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
  const [creating, setCreating] = useState(false);
  const MEAL_TYPES = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack',
    'Brunch',
    'Dessert'
  ];
  const navigate = useNavigate();
  const [showOptional, setShowOptional] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async e => {
    e.preventDefault();

    const { query, startDate, endDate } = formData;
    if (!query || !startDate || !endDate)
      return toast.error('Please provide a query and valid dates.');

    const payload = {
      query,
      bodyFatPercentage: parseFloat(formData.bodyFatPercentage) || 0,
      skeletalMuscleMass: parseFloat(formData.skeletalMuscleMass) || 0,
      ecwRatio: parseFloat(formData.ecwRatio) || 0,
      bodyFatMass: parseFloat(formData.bodyFatMass) || 0,
      visceralFatArea: parseFloat(formData.visceralFatArea) || 0,
      startDate: formatDateForApi(startDate),
      endDate: formatDateForApi(endDate),
      user: userId || 'unknown-user'
    };

    try {
      await dispatch(fetchAiMeals(payload)).unwrap();
      toast.success('AI meals generated successfully!');
    } catch (err) {
      toast.error(err?.message || 'Failed to generate AI meals.');
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    dispatch(clearAiRecommendations());
    toast.info('Form and results cleared.');
  };

  const handleCreateMeals = async () => {
    if (!recommendedMeals.length) return toast.info('No AI meals to create.');

    try {
      setCreating(true);

      const formattedMeals = recommendedMeals.map((meal, index) => ({
        title: meal.title || `AI Meal Plan #${index + 1}`,
        totalCalories: meal.totalCalories || 0,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        fat: meal.fat || 0,
        foods: meal.foods || [],
        scheduledAt: meal.scheduledAt || new Date().toISOString(),
        user: userId,
        mealType:
          meal.mealType && MEAL_TYPES.includes(meal.mealType)
            ? meal.mealType
            : MEAL_TYPES[index % MEAL_TYPES.length]
      }));

      await dispatch(createMultipleMeals(formattedMeals)).unwrap();
      toast.success('Meals successfully created and saved!');
      navigate('/nutrition');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Failed to create meals.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className='max-w-full mx-auto p-4 md:p-8 bg-gray-50 min-h-screen'>
      <header className='flex flex-wrap justify-between items-center gap-4 mb-8 p-4 bg-white rounded-2xl shadow-lg'>
        <div className='flex items-center gap-4'>
          <FaRobot className='text-emerald-600 text-4xl' />
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>
              AI Meal Planner
            </h1>
            <p className='text-md text-gray-500'>
              Generate personalized meal recommendations based on your body
              metrics and fitness goals.
            </p>
          </div>
        </div>

        {recommendedMeals.length > 0 && (
          <button
            onClick={handleCreateMeals}
            disabled={creating}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold shadow-md transition-all ${
              creating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800'
            }`}
          >
            {creating ? (
              <FaSpinner className='animate-spin' />
            ) : (
              <FaUtensils className='text-lg' />
            )}
            {creating ? 'Saving...' : 'Create Meals'}
          </button>
        )}
      </header>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-6'>
          <UserBasicInfo userId={userId} />
          <FitnessGoalCard userId={userId} />

          <BodyRecordCard
            userId={userId}
            className='bg-white p-6 rounded-2xl shadow-lg border border-gray-200'
          />

          <form
            onSubmit={handleGenerate}
            className='bg-white p-6 rounded-2xl shadow-lg space-y-8 border border-gray-200'
          >
            <h2 className='text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-3'>
              <FaSyncAlt className='text-emerald-500' /> Input Metrics & Goals
            </h2>

            <div className='bg-emerald-50 border border-emerald-200 rounded-xl p-4'>
              <label className='block text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-2'>
                <FaChartLine className='text-emerald-500' /> Goal / Query
              </label>
              <textarea
                name='query'
                value={formData.query}
                onChange={handleChange}
                rows='3'
                maxLength={200}
                required
                placeholder='Example: Plan a 5-day high-protein, low-fat diet for muscle gain...'
                className='w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 resize-none'
              />
            </div>

            <div className='bg-gray-50 border border-dashed border-emerald-200 rounded-xl p-5 md:p-6'>
              <h3 className='text-md font-semibold text-emerald-700 mb-4 flex items-center gap-2'>
                <FaCalendarAlt /> Date Range
              </h3>

              <div className='flex flex-col sm:flex-row gap-3'>
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
                      className='w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500'
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className='border border-emerald-200 rounded-xl bg-white'>
              <button
                type='button'
                onClick={() => setShowOptional(prev => !prev)}
                className='w-full flex items-center justify-between px-5 py-4'
                aria-expanded={showOptional}
                aria-controls='optional-metrics-panel'
              >
                <span className='text-md font-semibold text-emerald-700 flex items-center gap-2'>
                  <FaLeaf /> Optional: Add your body metrics
                </span>
                {showOptional ? (
                  <FaChevronUp className='text-emerald-600' />
                ) : (
                  <FaChevronDown className='text-emerald-600' />
                )}
              </button>

              <div
                id='optional-metrics-panel'
                className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
                  showOptional ? 'max-h-[1000px]' : 'max-h-0'
                }`}
              >
                <div className='px-5 pb-5 pt-0 border-t border-emerald-100 bg-gray-50'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4'>
                    {Object.entries({
                      bodyFatPercentage: {
                        label: 'Body Fat (%)',
                        icon: <FaFireAlt className='text-orange-500' />
                      },
                      skeletalMuscleMass: {
                        label: 'Muscle Mass (kg)',
                        icon: <FaRulerVertical className='text-blue-500' />
                      },
                      ecwRatio: {
                        label: 'ECW Ratio',
                        icon: <FaLeaf className='text-green-500' />
                      },
                      bodyFatMass: {
                        label: 'Body Fat Mass (kg)',
                        icon: <FaFireAlt className='text-rose-500' />
                      },
                      visceralFatArea: {
                        label: 'Visceral Fat Area (cm²)',
                        icon: <FaChartLine className='text-teal-500' />
                      }
                    }).map(([key, { label, icon }]) => (
                      <div key={key}>
                        <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'>
                          {icon} {label}
                        </label>
                        <input
                          type='number'
                          step='0.1'
                          min='0'
                          name={key}
                          value={formData[key]}
                          onChange={handleChange}
                          placeholder='Enter value'
                          className='w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='flex gap-3 pt-4'>
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

          {!loading && !error && (
            <ScrollArea className='h-[100vh] bg-white border border-slate-200 rounded-2xl shadow-inner p-4'>
              <div className='space-y-4'>
                {recommendedMeals.length > 0 ? (
                  <>
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
                      <MealCard
                        key={index}
                        meal={meal}
                        onUpdateFoods={updatedFoods => {
                          const newMeals = [...recommendedMeals];
                          newMeals[index] = { ...meal, foods: updatedFoods };
                          dispatch(updateMealFoods(newMeals));
                        }}
                      />
                    ))}
                  </>
                ) : (
                  <div className='text-center p-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl'>
                    <FaRobot className='text-5xl mx-auto mb-4' />
                    <p>
                      Enter your metrics and goal, then click "Generate Meals".
                    </p>
                  </div>
                )}
              </div>
              <ScrollBar orientation='vertical' />
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
