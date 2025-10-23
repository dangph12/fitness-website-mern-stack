'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import {
  fetchEquipmentById,
  updateEquipment
} from '~/store/features/equipment-slice';

// Validation schema - Image is optional for update
const updateEquipmentSchema = yup
  .object({
    title: yup
      .string()
      .required('Equipment name is required')
      .trim()
      .min(2, 'Equipment name must be at least 2 characters'),
    image: yup
      .mixed()
      .nullable()
      .test('fileSize', 'File size must be less than 10MB', value => {
        if (!value) return true; // Optional for update
        return value.size <= 10 * 1024 * 1024;
      })
      .test(
        'fileType',
        'Only image files are allowed (JPG, PNG, WEBP)',
        value => {
          if (!value) return true; // Optional for update
          return /^image\/(jpeg|jpg|png|webp)$/.test(value.type);
        }
      )
  })
  .required();

export default function UpdateEquipmentPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentEquipment, loading } = useSelector(state => state.equipments);

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
    resolver: yupResolver(updateEquipmentSchema),
    defaultValues: {
      title: '',
      image: null
    }
  });

  // Watch form values
  const watchImage = watch('image');

  // Fetch equipment on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchEquipmentById(id));
    }
  }, [dispatch, id]);

  // Populate form when currentEquipment loads
  useEffect(() => {
    if (currentEquipment) {
      reset({
        title: currentEquipment.title || '',
        image: null
      });

      // Store existing image URL
      if (currentEquipment.image) {
        setExistingImageUrl(currentEquipment.image);
      }
    }
  }, [currentEquipment, reset]);

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
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', data.title.trim());

      // Only append image if new file is uploaded
      if (data.image) {
        formData.append('image', data.image);
      }

      console.log('Updating equipment with data:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await dispatch(updateEquipment({ id, updateData: formData })).unwrap();
      toast.success('Equipment updated successfully!');
      navigate('/admin/manage-equipments');
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update equipment';
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/manage-equipments');
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!currentEquipment) {
    return (
      <div className='container mx-auto py-10'>
        <div className='text-center space-y-4'>
          <h2 className='text-2xl font-bold'>Equipment not found</h2>
          <Button onClick={handleGoBack}>Back to Equipments</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='max-w-2xl mx-auto space-y-6'>
        <div className='flex items-center gap-4 mb-6'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleGoBack}
            className='flex items-center gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Equipments
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Update Equipment</CardTitle>
            <p className='text-muted-foreground'>
              Modify the equipment details below.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              {/* Equipment Name */}
              <div className='space-y-2'>
                <Label htmlFor='title'>
                  Equipment Name <span className='text-red-500'>*</span>
                </Label>
                <Controller
                  name='title'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='title'
                      placeholder='e.g. Dumbbells, Barbell, Resistance Bands'
                      className={errors.title ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.title && (
                  <p className='text-sm text-red-500'>{errors.title.message}</p>
                )}
              </div>

              {/* Equipment Image Upload - Optional for update */}
              <div className='space-y-2'>
                <Label htmlFor='image'>Equipment Image (Optional)</Label>

                {/* Show existing image if no new upload */}
                {!imagePreview && existingImageUrl && (
                  <div className='relative border rounded-lg p-4 mb-2 bg-gray-50'>
                    <div className='flex justify-center'>
                      <img
                        src={existingImageUrl}
                        alt='Current equipment'
                        className='max-w-full max-h-64 object-contain rounded'
                      />
                    </div>
                    <p className='text-xs text-muted-foreground mt-2 text-center'>
                      Current equipment image (upload new to replace)
                    </p>
                  </div>
                )}

                {/* Upload new image */}
                {!imagePreview ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition-colors ${
                      errors.image ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <input
                      id='image'
                      type='file'
                      accept='image/jpeg,image/jpg,image/png,image/webp'
                      onChange={handleImageUpload}
                      className='hidden'
                    />
                    <label
                      htmlFor='image'
                      className='cursor-pointer flex flex-col items-center space-y-3'
                    >
                      <div className='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center'>
                        <Upload className='h-8 w-8 text-gray-400' />
                      </div>
                      <div className='space-y-1'>
                        <p className='text-sm font-medium text-gray-700'>
                          Click to upload new equipment image
                        </p>
                        <p className='text-xs text-gray-500'>
                          JPG, PNG or WEBP (Max 10MB)
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className='relative border rounded-lg p-4 bg-gray-50'>
                    <button
                      type='button'
                      onClick={removeImage}
                      className='absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10'
                    >
                      <X className='h-4 w-4' />
                    </button>
                    <div className='flex justify-center'>
                      <img
                        src={imagePreview}
                        alt='New equipment preview'
                        className='max-w-full max-h-96 object-contain rounded'
                      />
                    </div>
                    <p className='text-xs text-muted-foreground mt-2 text-center'>
                      New equipment image
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
                  className='flex-1'
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={formLoading} className='flex-1'>
                  {formLoading ? 'Updating...' : 'Update Equipment'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
