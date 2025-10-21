import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import * as yup from 'yup';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { createMuscle } from '~/store/features/muscles-slice';

// Validation schema
const muscleSchema = yup
  .object({
    title: yup
      .string()
      .required('Muscle name is required')
      .trim()
      .min(2, 'Muscle name must be at least 2 characters')
      .max(50, 'Muscle name must not exceed 50 characters'),
    image: yup
      .mixed()
      .nullable()
      .test('fileSize', 'File size must be less than 5MB', value => {
        if (!value) return true; // Image is optional
        return value.size <= 5 * 1024 * 1024;
      })
      .test(
        'fileType',
        'Only image files are allowed (JPG, PNG, WEBP, GIF)',
        value => {
          if (!value) return true;
          return /^image\/(jpeg|jpg|png|webp|gif)$/.test(value.type);
        }
      )
  })
  .required();

const CreateMusclePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(muscleSchema),
    defaultValues: {
      title: '',
      image: null
    }
  });

  // Watch form values
  const watchImage = watch('image');

  // Update preview when image changes
  useEffect(() => {
    if (watchImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(watchImage);
    } else {
      setImagePreview(null);
    }
  }, [watchImage]);

  const handleImageUpload = e => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file, { shouldValidate: true });
    }
  };

  const removeImage = () => {
    setValue('image', null);
    setImagePreview(null);
  };

  const onSubmit = async data => {
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', data.title.trim());
      if (data.image) {
        submitData.append('image', data.image);
      }

      console.log('Submitting muscle data:');
      for (const [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      await dispatch(createMuscle(submitData)).unwrap();
      toast.success('Muscle created successfully!');
      navigate('/admin/manage-muscles');
    } catch (error) {
      console.error('Create error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create muscle';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/manage-muscles');
  };

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
          Back to Muscles
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Muscle</CardTitle>
          <CardDescription>
            Add a new muscle group to your fitness database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Muscle Name */}
            <div className='space-y-2'>
              <Label htmlFor='title'>
                Muscle Name <span className='text-red-500'>*</span>
              </Label>
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='title'
                    placeholder='e.g., Biceps, Quadriceps, Deltoids'
                    className={errors.title ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.title && (
                <p className='text-sm text-red-500'>{errors.title.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className='space-y-2'>
              <Label htmlFor='image'>
                Muscle Image{' '}
                <span className='text-muted-foreground'>(Optional)</span>
              </Label>
              {!imagePreview ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${
                    errors.image ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <input
                    id='image'
                    type='file'
                    accept='image/jpeg,image/jpg,image/png,image/webp,image/gif'
                    onChange={handleImageUpload}
                    className='hidden'
                  />
                  <label
                    htmlFor='image'
                    className='cursor-pointer flex flex-col items-center space-y-2'
                  >
                    <Upload className='h-10 w-10 text-gray-400' />
                    <span className='text-sm text-gray-600'>
                      Click to upload muscle image
                    </span>
                    <span className='text-xs text-gray-500'>
                      JPG, PNG, WEBP, GIF - Max 5MB
                    </span>
                  </label>
                </div>
              ) : (
                <div className='relative border rounded-lg p-4'>
                  <button
                    type='button'
                    onClick={removeImage}
                    className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
                  >
                    <X className='h-4 w-4' />
                  </button>
                  <img
                    src={imagePreview}
                    alt='Muscle preview'
                    className='w-full max-h-64 object-contain rounded'
                  />
                </div>
              )}
              {errors.image && (
                <p className='text-sm text-red-500'>{errors.image.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleGoBack}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={loading}>
                {loading ? 'Creating...' : 'Create Muscle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMusclePage;
