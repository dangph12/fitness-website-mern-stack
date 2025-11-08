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
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import { DateOfBirthPicker } from '~/components/ui/date-picker';
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

const OnboardingComponent = () => {
  const [step, setStep] = useState(1);
  const [bmi, setBmi] = useState(0);
  const dispatch = useDispatch();

  const form = useForm({
    resolver: yupResolver(onboardingSchema),
    defaultValues: {
      gender: '',
      dob: '',
      height: '',
      weight: '',
      targetWeight: '',
      diet: '',
      fitnessGoal: ''
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
        bmi: finalBMI,
        targetWeight: parseFloat(data.targetWeight),
        diet: data.diet,
        fitnessGoal: data.fitnessGoal
      });

      const { accessToken } = response.data.data;
      const { message } = response.data;

      dispatch(loadUser({ accessToken }));

      toast.success(message || 'Onboarding completed successfully!');
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
    let fieldsToValidate;
    if (step === 1) {
      fieldsToValidate = ['gender', 'dob'];
    } else if (step === 2) {
      fieldsToValidate = ['height', 'weight'];
    } else if (step === 3) {
      fieldsToValidate = ['targetWeight', 'diet', 'fitnessGoal'];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progressPercentage = (step / 4) * 100;
  const bmiClassification = getBMIClassification(bmi);

  const getBMIIndicatorColor = () => {
    const colorMap = {
      'text-red-600': 'bg-red-600',
      'text-red-700': 'bg-red-700',
      'text-orange-600': 'bg-orange-600',
      'text-green-600': 'bg-green-600',
      'text-yellow-600': 'bg-yellow-600'
    };
    return colorMap[bmiClassification.color] || 'bg-primary';
  };

  const dietOptions = [
    {
      value: 'Mediterranean',
      label: 'Mediterranean',
      description: 'Heart-healthy with fish, olive oil, and fresh produce'
    },
    {
      value: 'Ketogenic (Keto)',
      label: 'Ketogenic (Keto)',
      description: 'Low-carb, high-fat for weight loss'
    },
    {
      value: 'Paleo',
      label: 'Paleo',
      description: 'Whole foods, no processed items'
    },
    {
      value: 'Vegetarian',
      label: 'Vegetarian',
      description: 'Plant-based with dairy and eggs'
    },
    { value: 'Vegan', label: 'Vegan', description: 'Completely plant-based' },
    {
      value: 'Gluten-Free',
      label: 'Gluten-Free',
      description: 'No wheat, barley, or rye'
    },
    {
      value: 'Low-Carb',
      label: 'Low-Carb',
      description: 'Reduced carbohydrate intake'
    }
  ];

  const fitnessGoalOptions = [
    {
      value: 'Lose Weight',
      label: 'Lose Weight',
      icon: '🔥',
      description: 'Shed extra pounds and get lean'
    },
    {
      value: 'Build Muscle',
      label: 'Build Muscle',
      icon: '💪',
      description: 'Gain strength and muscle mass'
    },
    {
      value: 'To be Healthy',
      label: 'Stay Healthy',
      icon: '❤️',
      description: 'Maintain overall wellness'
    }
  ];

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4'>
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <div className='mb-4'>
            <div className='flex items-center justify-between mb-2'>
              <div className='flex-1'>
                <Progress value={progressPercentage} className='h-2' />
              </div>
            </div>
            <p className='text-sm text-muted-foreground mt-2'>
              Step {step} of 4
            </p>
          </div>
          <CardTitle className='text-2xl'>
            {step === 1 && "Let's get to know you"}
            {step === 2 && 'Your body metrics'}
            {step === 3 && 'Your fitness goals'}
            {step === 4 && 'Your fitness profile is ready!'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Help us personalize your fitness journey'}
            {step === 2 && "We'll calculate your BMI and recommend goals"}
            {step === 3 &&
              'Tell us about your fitness goals and diet preferences'}
            {step === 4 && 'Start your journey to a healthier you'}
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
                          <DateOfBirthPicker
                            value={field.value ? new Date(field.value) : null}
                            onChange={date => {
                              if (date) {
                                const pad = n => n.toString().padStart(2, '0');
                                const formattedDate = [
                                  date.getFullYear(),
                                  pad(date.getMonth() + 1),
                                  pad(date.getDate())
                                ].join('-');
                                field.onChange(formattedDate);
                              } else {
                                field.onChange('');
                              }
                            }}
                            placeholder='Select your date of birth'
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
                      <Progress
                        value={getBMIPosition(bmi)}
                        className={`h-2 mb-2 ${bmiClassification.bgColor}`}
                        indicatorClassName={getBMIIndicatorColor()}
                      />
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
                  <FormField
                    control={form.control}
                    name='targetWeight'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Enter your target weight'
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

                  <FormField
                    control={form.control}
                    name='fitnessGoal'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What's your fitness goal?</FormLabel>
                        <FormControl>
                          <div className='grid grid-cols-1 gap-3'>
                            {fitnessGoalOptions.map(option => (
                              <button
                                key={option.value}
                                type='button'
                                onClick={() => field.onChange(option.value)}
                                className={`p-4 rounded-lg border-2 transition-all text-left ${
                                  field.value === option.value
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className='flex items-center gap-3'>
                                  <span className='text-3xl'>
                                    {option.icon}
                                  </span>
                                  <div>
                                    <div className='text-base font-semibold'>
                                      {option.label}
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                      {option.description}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='diet'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Diet</FormLabel>
                        <FormControl>
                          <div className='grid grid-cols-1 gap-2'>
                            {dietOptions.map(option => (
                              <button
                                key={option.value}
                                type='button'
                                onClick={() => field.onChange(option.value)}
                                className={`p-3 rounded-lg border-2 transition-all text-left ${
                                  field.value === option.value
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className='text-sm font-semibold'>
                                  {option.label}
                                </div>
                                <div className='text-xs text-muted-foreground'>
                                  {option.description}
                                </div>
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 4 && (
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

                    <Progress
                      value={getBMIPosition(bmi)}
                      className={`h-3 mb-4 ${bmiClassification.bgColor}`}
                      indicatorClassName={getBMIIndicatorColor()}
                    />

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
                        <div>
                          <p className='text-muted-foreground'>
                            Target Weight:
                          </p>
                          <p className='font-medium'>
                            {form.getValues('targetWeight')} kg
                          </p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Fitness Goal:</p>
                          <p className='font-medium'>
                            {form.getValues('fitnessGoal')}
                          </p>
                        </div>
                        <div className='col-span-2'>
                          <p className='text-muted-foreground'>
                            Diet Preference:
                          </p>
                          <p className='font-medium'>
                            {form.getValues('diet')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className='flex justify-between pt-4'>
                {step > 1 && step < 4 && (
                  <Button type='button' variant='outline' onClick={handleBack}>
                    Back
                  </Button>
                )}
                {step < 3 && (
                  <Button
                    type='button'
                    onClick={handleNext}
                    className='ml-auto'
                  >
                    Continue
                  </Button>
                )}
                {step === 3 && (
                  <Button
                    type='button'
                    onClick={handleNext}
                    className='ml-auto'
                  >
                    Review Profile
                  </Button>
                )}
                {step === 4 && (
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

export default OnboardingComponent;
