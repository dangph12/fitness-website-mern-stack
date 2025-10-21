import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import * as yup from 'yup';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import { Spinner } from '~/components/ui/spinner';
import { Textarea } from '~/components/ui/textarea';
import {
  fetchExerciseById,
  fetchReferenceLists,
  updateExercise
} from '~/store/features/exercise-slice';

// Validation schema - Tutorial is optional for update
const updateExerciseSchema = yup
  .object({
    title: yup
      .string()
      .required('Exercise name is required')
      .trim()
      .min(3, 'Exercise name must be at least 3 characters'),
    difficulty: yup
      .string()
      .required('Difficulty level is required')
      .oneOf(
        ['Beginner', 'Intermediate', 'Advanced'],
        'Invalid difficulty level'
      ),
    type: yup
      .string()
      .required('Exercise type is required')
      .oneOf(
        [
          'Strength',
          'Stretching',
          'Power',
          'Olympic',
          'Explosive',
          'Mobility',
          'Dynamic',
          'Yoga'
        ],
        'Invalid exercise type'
      ),
    tutorial: yup
      .mixed()
      .nullable()
      .test('fileSize', 'File size must be less than 10MB', value => {
        if (!value) return true; // Optional for update
        return value.size <= 10 * 1024 * 1024;
      })
      .test(
        'fileType',
        'Only image files are allowed (GIF, JPG, PNG, WEBP)',
        value => {
          if (!value) return true; // Optional for update
          return /^image\/(gif|jpeg|jpg|png|webp)$/.test(value.type);
        }
      ),
    instructions: yup
      .string()
      .required('Instructions are required')
      .trim()
      .min(10, 'Instructions must be at least 10 characters'),
    muscles: yup
      .array()
      .of(yup.string())
      .min(1, 'Please select at least one target muscle')
      .required('Target muscles are required'),
    equipments: yup
      .array()
      .of(yup.string())
      .min(1, 'Please select at least one equipment')
      .required('Equipment is required')
  })
  .required();

const UpdateExercise = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentExercise,
    loading,
    musclesMap = {},
    equipmentsMap = {},
    referencesLoading
  } = useSelector(state => state.exercises);

  const [formLoading, setFormLoading] = useState(false);
  const [tutorialPreview, setTutorialPreview] = useState(null);
  const [existingTutorialUrl, setExistingTutorialUrl] = useState('');

  // React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(updateExerciseSchema),
    defaultValues: {
      title: '',
      difficulty: '',
      type: '',
      tutorial: null,
      instructions: '',
      muscles: [],
      equipments: []
    }
  });

  // Watch form values
  const watchTutorial = watch('tutorial');
  const watchMuscles = watch('muscles');
  const watchEquipments = watch('equipments');

  // Exercise types matching backend validation
  const exerciseTypes = [
    'Strength',
    'Stretching',
    'Power',
    'Olympic',
    'Explosive',
    'Mobility',
    'Dynamic',
    'Yoga'
  ];

  // Convert maps to arrays for dropdowns
  const musclesList = Object.entries(musclesMap).map(([id, name]) => ({
    id,
    name
  }));
  const equipmentsList = Object.entries(equipmentsMap).map(([id, name]) => ({
    id,
    name
  }));

  // Fetch exercise and reference lists on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchExerciseById(id));
      dispatch(fetchReferenceLists());
    }
  }, [dispatch, id]);

  // Populate form when currentExercise loads
  useEffect(() => {
    if (currentExercise) {
      reset({
        title: currentExercise.title || '',
        difficulty: currentExercise.difficulty || '',
        type: currentExercise.type || '',
        tutorial: null,
        instructions: currentExercise.instructions || '',
        muscles: Array.isArray(currentExercise.muscles)
          ? currentExercise.muscles.map(m => m._id || m)
          : [],
        equipments: Array.isArray(currentExercise.equipments)
          ? currentExercise.equipments.map(e => e._id || e)
          : []
      });

      // Store existing tutorial URL
      if (currentExercise.tutorial) {
        setExistingTutorialUrl(currentExercise.tutorial);
      }
    }
  }, [currentExercise, reset]);

  // Update preview when tutorial changes
  useEffect(() => {
    if (watchTutorial) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTutorialPreview(reader.result);
      };
      reader.readAsDataURL(watchTutorial);
    } else {
      setTutorialPreview(null);
    }
  }, [watchTutorial]);

  const handleTutorialUpload = e => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('tutorial', file, { shouldValidate: true });
    }
  };

  const removeTutorial = () => {
    setValue('tutorial', null);
    setTutorialPreview(null);
  };

  const handleMuscleToggle = muscleId => {
    const currentMuscles = watchMuscles || [];
    const newMuscles = currentMuscles.includes(muscleId)
      ? currentMuscles.filter(id => id !== muscleId)
      : [...currentMuscles, muscleId];
    setValue('muscles', newMuscles, { shouldValidate: true });
  };

  const handleEquipmentToggle = equipmentId => {
    const currentEquipments = watchEquipments || [];
    const newEquipments = currentEquipments.includes(equipmentId)
      ? currentEquipments.filter(id => id !== equipmentId)
      : [...currentEquipments, equipmentId];
    setValue('equipments', newEquipments, { shouldValidate: true });
  };

  const onSubmit = async data => {
    setFormLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', data.title.trim());
      submitData.append('difficulty', data.difficulty);
      submitData.append('type', data.type);
      submitData.append('instructions', data.instructions.trim());

      // Only append tutorial if new file is uploaded
      if (data.tutorial) {
        submitData.append('tutorial', data.tutorial);
      }

      // Append each muscle and equipment as separate form field
      data.muscles.forEach((muscleId, index) => {
        submitData.append(`muscles[${index}]`, muscleId);
      });

      data.equipments.forEach((equipmentId, index) => {
        submitData.append(`equipments[${index}]`, equipmentId);
      });

      console.log('Updating exercise with data:');
      for (const [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      await dispatch(updateExercise({ id, updateData: submitData })).unwrap();
      toast.success('Exercise updated successfully!');
      navigate('/admin/manage-exercises');
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update exercise';
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/manage-exercises');
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!currentExercise) {
    return (
      <div className='text-center space-y-4'>
        <h2 className='text-2xl font-bold'>Exercise not found</h2>
        <Button onClick={handleGoBack}>Back to Exercises</Button>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleGoBack}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Exercises
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Exercise</CardTitle>
          <p className='text-muted-foreground'>
            Modify the exercise details below.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Exercise Name */}
              <div className='space-y-2'>
                <Label htmlFor='title'>
                  Exercise Name <span className='text-red-500'>*</span>
                </Label>
                <Controller
                  name='title'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='title'
                      placeholder='e.g. Push-ups'
                      className={errors.title ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.title && (
                  <p className='text-sm text-red-500'>{errors.title.message}</p>
                )}
              </div>

              {/* Difficulty */}
              <div className='space-y-2'>
                <Label htmlFor='difficulty'>
                  Difficulty <span className='text-red-500'>*</span>
                </Label>
                <Controller
                  name='difficulty'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={errors.difficulty ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder='Select difficulty' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Beginner'>Beginner</SelectItem>
                        <SelectItem value='Intermediate'>
                          Intermediate
                        </SelectItem>
                        <SelectItem value='Advanced'>Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.difficulty && (
                  <p className='text-sm text-red-500'>
                    {errors.difficulty.message}
                  </p>
                )}
              </div>

              {/* Exercise Type */}
              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='type'>
                  Exercise Type <span className='text-red-500'>*</span>
                </Label>
                <Controller
                  name='type'
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={errors.type ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                      <SelectContent>
                        {exerciseTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className='text-sm text-red-500'>{errors.type.message}</p>
                )}
              </div>
            </div>

            {/* Tutorial Image Upload - Optional for update */}
            <div className='space-y-2'>
              <Label htmlFor='tutorial'>Tutorial Image/GIF (Optional)</Label>

              {/* Show existing image if no new upload */}
              {!tutorialPreview && existingTutorialUrl && (
                <div className='relative border rounded-lg p-4 mb-2'>
                  <img
                    src={existingTutorialUrl}
                    alt='Current tutorial'
                    className='w-full max-h-64 object-contain rounded'
                  />
                  <p className='text-xs text-muted-foreground mt-2 text-center'>
                    Current tutorial image (upload new to replace)
                  </p>
                </div>
              )}

              {/* Upload new image */}
              {!tutorialPreview ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${
                    errors.tutorial ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <input
                    id='tutorial'
                    type='file'
                    accept='image/gif,image/jpeg,image/jpg,image/png,image/webp'
                    onChange={handleTutorialUpload}
                    className='hidden'
                  />
                  <label
                    htmlFor='tutorial'
                    className='cursor-pointer flex flex-col items-center space-y-2'
                  >
                    <Upload className='h-10 w-10 text-gray-400' />
                    <span className='text-sm text-gray-600'>
                      Click to upload new tutorial image (GIF, JPG, PNG, WEBP)
                    </span>
                    <span className='text-xs text-gray-500'>Max 10MB</span>
                  </label>
                </div>
              ) : (
                <div className='relative border rounded-lg p-4'>
                  <button
                    type='button'
                    onClick={removeTutorial}
                    className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'
                  >
                    <X className='h-4 w-4' />
                  </button>
                  <img
                    src={tutorialPreview}
                    alt='New tutorial preview'
                    className='w-full max-h-64 object-contain rounded'
                  />
                  <p className='text-xs text-muted-foreground mt-2 text-center'>
                    New tutorial image
                  </p>
                </div>
              )}
              {errors.tutorial && (
                <p className='text-sm text-red-500'>
                  {errors.tutorial.message}
                </p>
              )}
            </div>

            {/* Instructions */}
            <div className='space-y-2'>
              <Label htmlFor='instructions'>
                Instructions <span className='text-red-500'>*</span>
              </Label>
              <Controller
                name='instructions'
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id='instructions'
                    placeholder='Step-by-step instructions for the exercise...'
                    rows={4}
                    className={errors.instructions ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.instructions && (
                <p className='text-sm text-red-500'>
                  {errors.instructions.message}
                </p>
              )}
            </div>

            {/* Target Muscles */}
            <div className='space-y-2'>
              <Label>
                Target Muscles <span className='text-red-500'>*</span>
              </Label>
              {referencesLoading ? (
                <p className='text-sm text-muted-foreground'>
                  Loading muscles...
                </p>
              ) : (
                <div
                  className={`border rounded-lg p-3 max-h-48 overflow-y-auto ${
                    errors.muscles ? 'border-red-500' : ''
                  }`}
                >
                  {musclesList.length === 0 ? (
                    <p className='text-sm text-muted-foreground'>
                      No muscles available
                    </p>
                  ) : (
                    <div className='flex flex-wrap gap-2'>
                      {musclesList.map(muscle => (
                        <Badge
                          key={muscle.id}
                          variant={
                            (watchMuscles || []).includes(muscle.id)
                              ? 'default'
                              : 'outline'
                          }
                          className='cursor-pointer'
                          onClick={() => handleMuscleToggle(muscle.id)}
                        >
                          {muscle.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {(watchMuscles || []).length > 0 && (
                <p className='text-xs text-muted-foreground'>
                  Selected: {watchMuscles.length} muscle(s)
                </p>
              )}
              {errors.muscles && (
                <p className='text-sm text-red-500'>{errors.muscles.message}</p>
              )}
            </div>

            {/* Equipment */}
            <div className='space-y-2'>
              <Label>
                Equipment Needed <span className='text-red-500'>*</span>
              </Label>
              {referencesLoading ? (
                <p className='text-sm text-muted-foreground'>
                  Loading equipment...
                </p>
              ) : (
                <div
                  className={`border rounded-lg p-3 max-h-48 overflow-y-auto ${
                    errors.equipments ? 'border-red-500' : ''
                  }`}
                >
                  {equipmentsList.length === 0 ? (
                    <p className='text-sm text-muted-foreground'>
                      No equipment available
                    </p>
                  ) : (
                    <div className='flex flex-wrap gap-2'>
                      {equipmentsList.map(equipment => (
                        <Badge
                          key={equipment.id}
                          variant={
                            (watchEquipments || []).includes(equipment.id)
                              ? 'default'
                              : 'outline'
                          }
                          className='cursor-pointer'
                          onClick={() => handleEquipmentToggle(equipment.id)}
                        >
                          {equipment.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {(watchEquipments || []).length > 0 && (
                <p className='text-xs text-muted-foreground'>
                  Selected: {watchEquipments.length} equipment(s)
                </p>
              )}
              {errors.equipments && (
                <p className='text-sm text-red-500'>
                  {errors.equipments.message}
                </p>
              )}
            </div>

            <div className='flex gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleGoBack}
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={formLoading || referencesLoading}>
                {formLoading ? 'Updating...' : 'Update Exercise'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateExercise;
