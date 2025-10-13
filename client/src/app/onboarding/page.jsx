import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiAlertOctagon,
  FiAlertTriangle,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiTrendingDown,
  FiTrendingUp
} from 'react-icons/fi';
import { IoMaleFemale, IoManSharp, IoWomanSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Progress } from '~/components/ui/progress';
import axiosInstance from '~/lib/axios-instance';
import { calculateBMI, getBMIClassification, getBMIPosition } from '~/lib/bmi';
import { onboardingSchema } from '~/lib/validations/onboarding';
import { loadUser } from '~/store/features/auth-slice';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [bmi, setBmi] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const form = useForm({
    resolver: yupResolver(onboardingSchema),
    defaultValues: {
      gender: '',
      dob: '',
      height: '',
      weight: ''
    },
    mode: 'onChange'
  });

  const watchedHeight = form.watch('height');
  const watchedWeight = form.watch('weight');

  React.useEffect(() => {
    if (watchedHeight && watchedWeight) {
      const calculatedBMI = calculateBMI(
        parseFloat(watchedWeight),
        parseFloat(watchedHeight)
      );
      setBmi(calculatedBMI);
    }
  }, [watchedHeight, watchedWeight]);

  const onSubmit = async data => {
    try {
      const finalBMI = calculateBMI(
        parseFloat(data.weight),
        parseFloat(data.height)
      );

      const response = await axiosInstance.put('/api/users/onboarding', {
        dob: data.dob,
        gender: data.gender,
        height: parseFloat(data.height),
        weight: parseFloat(data.weight),
        bmi: finalBMI
      });

      if (response.data.success) {
        toast.success('Profile completed successfully!');
        await dispatch(loadUser());
        navigate('/');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to complete onboarding. Please try again.');
      }
    }
  };

  const handleNext = async () => {
    const isValid = await form.trigger(
      step === 1 ? ['gender', 'dob'] : ['height', 'weight']
    );
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progressPercentage = (step / 3) * 100;
  const bmiClassification = getBMIClassification(bmi);

  return (
    <div className='flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100'>
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <div className='mb-4'>
            <Progress value={progressPercentage} className='h-2' />
            <p className='text-sm text-muted-foreground mt-2'>
              Step {step} of 3
            </p>
          </div>
          <CardTitle className='text-2xl'>
            {step === 1 && "Let's get to know you"}
            {step === 2 && 'Your body metrics'}
            {step === 3 && 'Your fitness profile is ready! 🎉'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Help us personalize your fitness journey'}
            {step === 2 && "We'll calculate your BMI and recommend goals"}
            {step === 3 && 'Start your journey to a healthier you'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {step === 1 && (
                <div className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='gender'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <div className='grid grid-cols-3 gap-3'>
                            <button
                              type='button'
                              onClick={() => field.onChange('male')}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                field.value === 'male'
                                  ? 'border-primary bg-primary/10'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className='flex justify-center mb-2'>
                                <IoManSharp className='text-4xl' />
                              </div>
                              <div className='text-sm font-medium capitalize'>
                                Male
                              </div>
                            </button>
                            <button
                              type='button'
                              onClick={() => field.onChange('female')}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                field.value === 'female'
                                  ? 'border-primary bg-primary/10'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className='flex justify-center mb-2'>
                                <IoWomanSharp className='text-4xl' />
                              </div>
                              <div className='text-sm font-medium capitalize'>
                                Female
                              </div>
                            </button>
                            <button
                              type='button'
                              onClick={() => field.onChange('other')}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                field.value === 'other'
                                  ? 'border-primary bg-primary/10'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className='flex justify-center mb-2'>
                                <IoMaleFemale className='text-4xl' />
                              </div>
                              <div className='text-sm font-medium capitalize'>
                                Other
                              </div>
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='dob'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <FiCalendar className='text-lg' />
                          Date of Birth
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='date'
                            placeholder='Select your date of birth'
                            {...field}
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 2 && (
                <div className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='height'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Enter your height'
                            {...field}
                            min='50'
                            max='300'
                            step='0.1'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='weight'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Enter your weight'
                            {...field}
                            min='20'
                            max='500'
                            step='0.1'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {bmi > 0 && (
                    <div
                      className={`p-4 rounded-lg ${bmiClassification.bgColor} border`}
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium'>Your BMI:</span>
                        <span
                          className={`text-2xl font-bold ${bmiClassification.color} flex items-center gap-2`}
                        >
                          {bmiClassification.icon === 'FiCheckCircle' && (
                            <FiCheckCircle className='text-2xl' />
                          )}
                          {bmiClassification.icon === 'FiTrendingDown' && (
                            <FiTrendingDown className='text-2xl' />
                          )}
                          {bmiClassification.icon === 'FiTrendingUp' && (
                            <FiTrendingUp className='text-2xl' />
                          )}
                          {bmiClassification.icon === 'FiBarChart2' && (
                            <FiBarChart2 className='text-2xl' />
                          )}
                          {bmiClassification.icon === 'FiAlertTriangle' && (
                            <FiAlertTriangle className='text-2xl' />
                          )}
                          {bmiClassification.icon === 'FiAlertOctagon' && (
                            <FiAlertOctagon className='text-2xl' />
                          )}
                          {bmi}
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2 mb-2'>
                        <div
                          className={`h-2 rounded-full ${bmiClassification.color.replace('text-', 'bg-')}`}
                          style={{ width: `${getBMIPosition(bmi)}%` }}
                        />
                      </div>
                      <p
                        className={`text-sm font-medium ${bmiClassification.color}`}
                      >
                        {bmiClassification.category}
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {bmiClassification.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className='space-y-6'>
                  <div className='text-center p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-200'>
                    <div className='flex justify-center mb-4'>
                      {bmiClassification.icon === 'FiCheckCircle' && (
                        <FiCheckCircle
                          className={`text-6xl ${bmiClassification.color}`}
                        />
                      )}
                      {bmiClassification.icon === 'FiTrendingDown' && (
                        <FiTrendingDown
                          className={`text-6xl ${bmiClassification.color}`}
                        />
                      )}
                      {bmiClassification.icon === 'FiTrendingUp' && (
                        <FiTrendingUp
                          className={`text-6xl ${bmiClassification.color}`}
                        />
                      )}
                      {bmiClassification.icon === 'FiBarChart2' && (
                        <FiBarChart2
                          className={`text-6xl ${bmiClassification.color}`}
                        />
                      )}
                      {bmiClassification.icon === 'FiAlertTriangle' && (
                        <FiAlertTriangle
                          className={`text-6xl ${bmiClassification.color}`}
                        />
                      )}
                      {bmiClassification.icon === 'FiAlertOctagon' && (
                        <FiAlertOctagon
                          className={`text-6xl ${bmiClassification.color}`}
                        />
                      )}
                    </div>
                    <h3 className='text-2xl font-bold mb-2'>
                      {bmiClassification.category}
                    </h3>
                    <p className='text-3xl font-bold text-primary mb-4'>
                      BMI: {bmi}
                    </p>

                    <div className='w-full bg-gray-200 rounded-full h-3 mb-4'>
                      <div
                        className={`h-3 rounded-full ${bmiClassification.color.replace('text-', 'bg-')}`}
                        style={{ width: `${getBMIPosition(bmi)}%` }}
                      />
                    </div>

                    <p className='text-muted-foreground mb-6'>
                      {bmiClassification.description}
                    </p>

                    <div className='bg-white p-4 rounded-lg'>
                      <h4 className='font-semibold mb-2'>Your Profile:</h4>
                      <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                          <p className='text-muted-foreground'>Gender:</p>
                          <p className='font-medium capitalize'>
                            {form.getValues('gender')}
                          </p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>
                            Date of Birth:
                          </p>
                          <p className='font-medium'>
                            {new Date(
                              form.getValues('dob')
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Height:</p>
                          <p className='font-medium'>
                            {form.getValues('height')} cm
                          </p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Weight:</p>
                          <p className='font-medium'>
                            {form.getValues('weight')} kg
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className='flex justify-between pt-4'>
                {step > 1 && step < 3 && (
                  <Button type='button' variant='outline' onClick={handleBack}>
                    Back
                  </Button>
                )}
                {step < 2 && (
                  <Button
                    type='button'
                    onClick={handleNext}
                    className='ml-auto'
                  >
                    Continue
                  </Button>
                )}
                {step === 2 && (
                  <Button
                    type='button'
                    onClick={handleNext}
                    className='ml-auto'
                    disabled={!bmi || bmi === 0}
                  >
                    Review Profile
                  </Button>
                )}
                {step === 3 && (
                  <Button
                    type='submit'
                    className='w-full'
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? 'Completing...'
                      : 'Start Your Journey'}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
