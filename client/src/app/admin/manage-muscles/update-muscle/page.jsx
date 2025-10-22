import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import * as yup from 'yup';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Spinner } from '~/components/ui/spinner';
import { fetchMuscleById, updateMuscle } from '~/store/features/muscles-slice';

// Validation schema - Image is optional for update
const updateMuscleSchema = yup
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
        if (!value) return true; // Optional for update
        return value.size <= 5 * 1024 * 1024;
      })
      .test(
        'fileType',
        'Only image files are allowed (JPG, PNG, WEBP, GIF)',
        value => {
          if (!value) return true; // Optional for update
          return /^image\/(jpeg|jpg|png|webp|gif)$/.test(value.type);
        }
      )
  })
  .required();

const UpdateMusclePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentMuscle, loading } = useSelector(state => state.muscles);

  const [formLoading, setFormLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  // React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(updateMuscleSchema),
    defaultValues: {
      title: '',
      image: null
    }
  });

  // Watch form values
  const watchImage = watch('image');

  // Fetch muscle on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchMuscleById(id));
    }
  }, [dispatch, id]);

  // Populate form when currentMuscle loads
  useEffect(() => {
    if (currentMuscle) {
      reset({
        title: currentMuscle.title || '',
        image: null
      });

      // Store existing image URL
      if (currentMuscle.image) {
        setExistingImageUrl(currentMuscle.image);
      }
    }
  }, [currentMuscle, reset]);

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
    setFormLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', data.title.trim());

      // Only append image if new file is uploaded
      if (data.image) {
        submitData.append('image', data.image);
      }

      console.log('Updating muscle with data:');
      for (const [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      await dispatch(updateMuscle({ id, updateData: submitData })).unwrap();
      toast.success('Muscle updated successfully!');
      navigate('/admin/manage-muscles');
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update muscle';
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/manage-muscles');
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!currentMuscle) {
    return (
      <div className='text-center space-y-4'>
        <h2 className='text-2xl font-bold'>Muscle not found</h2>
        <Button onClick={handleGoBack}>Back to Muscles</Button>
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
          Back to Muscles
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Muscle</CardTitle>
          <p className='text-muted-foreground'>
            Modify the muscle group details below.
          </p>
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

            {/* Image Upload - Optional for update */}
            <div className='space-y-2'>
              <Label htmlFor='image'>
                Muscle Image{' '}
                <span className='text-muted-foreground'>(Optional)</span>
              </Label>

              {/* Show existing image if no new upload */}
              {!imagePreview && existingImageUrl && (
                <div className='relative border rounded-lg p-4 mb-2'>
                  <img
                    src={existingImageUrl}
                    alt='Current muscle image'
                    className='w-full max-h-64 object-contain rounded'
                  />
                  <p className='text-xs text-muted-foreground mt-2 text-center'>
                    Current muscle image (upload new to replace)
                  </p>
                </div>
              )}

              {/* Upload new image */}
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
                      Click to upload new muscle image
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
                    alt='New muscle preview'
                    className='w-full max-h-64 object-contain rounded'
                  />
                  <p className='text-xs text-muted-foreground mt-2 text-center'>
                    New muscle image
                  </p>
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
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={formLoading}>
                {formLoading ? 'Updating...' : 'Update Muscle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateMusclePage;
