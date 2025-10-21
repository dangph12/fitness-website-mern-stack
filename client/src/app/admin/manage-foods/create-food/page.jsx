'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, Loader2, Plus, Upload } from 'lucide-react';
import { ImageIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import * as yup from 'yup';

import { Alert, AlertDescription } from '~/components/ui/alert';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { createFood, fetchFoods } from '~/store/features/food-slice';

const foodSchema = yup.object().shape({
  title: yup.string().required('Food name is required').trim(),
  image: yup.string().optional(),
  unit: yup
    .number()
    .typeError('Unit must be a number')
    .positive('Unit must be positive')
    .required('Unit is required'),
  protein: yup
    .number()
    .typeError('Protein must be a number')
    .min(0, 'Protein cannot be negative')
    .optional(),
  fat: yup
    .number()
    .typeError('Fat must be a number')
    .min(0, 'Fat cannot be negative')
    .optional(),
  carbohydrate: yup
    .number()
    .typeError('Carbohydrate must be a number')
    .min(0, 'Carbohydrate cannot be negative')
    .optional(),
  calories: yup
    .number()
    .typeError('Calories must be a number')
    .min(0, 'Calories cannot be negative')
    .required('Calories is required'),
  category: yup
    .string()
    .oneOf(['Meat', 'Fruits & Vegetables', 'Egg'])
    .required('Category is required')
});

export default function CreateFoodPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(foodSchema),
    defaultValues: {
      title: '',
      image: '',
      unit: 0,
      protein: 0,
      fat: 0,
      carbohydrate: 0,
      calories: 0,
      category: ''
    }
  });

  const watchedImage = watch('image');
  const watchedCategory = watch('category');

  useEffect(() => {
    if (watchedImage && !imagePreview) {
      setImagePreview(watchedImage);
    }
  }, [watchedImage, imagePreview]);

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLocalError('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLocalError('Image file size must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => {
      setImagePreview(ev.target.result);
      setValue('image', ev.target.result);
    };
    reader.readAsDataURL(file);
    setLocalError('');
  };

  const onSubmit = async data => {
    setLocalError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate image file
      if (!imageFile) {
        setLocalError('Please select an image file');
        setLoading(false);
        return;
      }

      const payload = new FormData();
      payload.append('title', data.title.trim());
      payload.append('unit', Number(data.unit));
      payload.append('protein', Number(data.protein) || 0);
      payload.append('fat', Number(data.fat) || 0);
      payload.append('carbohydrate', Number(data.carbohydrate) || 0);
      payload.append('calories', Number(data.calories));
      payload.append('category', data.category);
      payload.append('image', imageFile);

      // Debug log
      console.log('Submitting food data...');

      const result = await dispatch(createFood(payload)).unwrap();
      console.log('Create food success:', result);

      setSuccess('Food created successfully!');

      // Reset form
      reset({
        title: '',
        image: '',
        unit: 0,
        protein: 0,
        fat: 0,
        carbohydrate: 0,
        calories: 0,
        category: ''
      });
      setImageFile(null);
      setImagePreview(null);

      // Refresh food list
      await dispatch(
        fetchFoods({
          page: 1,
          limit: 10,
          sortBy: '',
          sortOrder: '',
          filterParams: {}
        })
      );

      // Navigate after successful creation
      setTimeout(() => navigate('/admin/manage-foods'), 1000);
    } catch (err) {
      console.error('Create food error:', err);
      setLocalError(
        err?.message ||
          err?.error ||
          err ||
          'Failed to create food. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/manage-foods');
  };

  return (
    <div className='container mx-auto py-6 max-w-2xl'>
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleGoBack}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Foods
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Food</CardTitle>
          <CardDescription>Create a new food item</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {localError && (
              <Alert variant='destructive'>
                <AlertDescription>{localError}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className='border-green-200 bg-green-50 text-green-800'>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className='space-y-2'>
              <Label>Food Image (Optional)</Label>
              <div className='flex items-center gap-4'>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt='Food preview'
                    className='w-24 h-24 rounded-lg object-cover border'
                  />
                ) : (
                  <div className='w-24 h-24 rounded-lg bg-muted flex items-center justify-center border'>
                    <ImageIcon className='w-8 h-8 text-muted-foreground' />
                  </div>
                )}

                <div className='flex-1'>
                  <Input
                    id='imageFile'
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                  />
                  <Label
                    htmlFor='imageFile'
                    className='cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80'
                  >
                    <Upload className='w-4 h-4' />
                    Choose Image
                  </Label>
                  <p className='text-xs text-muted-foreground mt-1'>
                    PNG, JPG up to 5MB or paste URL into the image field
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className='space-y-2'>
              <Label htmlFor='title'>Food Name *</Label>
              <Input
                id='title'
                type='text'
                {...register('title')}
                placeholder='Enter food name'
              />
              {errors.title && (
                <p className='text-sm text-destructive'>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='unit'>Unit (gram) *</Label>
                <Input
                  id='unit'
                  type='number'
                  step='0.1'
                  {...register('unit')}
                  placeholder='0'
                />
                {errors.unit && (
                  <p className='text-sm text-destructive'>
                    {errors.unit.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='category'>Category *</Label>
                <Select
                  value={watchedCategory}
                  onValueChange={value => setValue('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Meat'>Meat</SelectItem>
                    <SelectItem value='Fruits & Vegetables'>
                      Fruits &amp; Vegetables
                    </SelectItem>
                    <SelectItem value='Egg'>Egg</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className='text-sm text-destructive'>
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className='space-y-4'>
              <Label className='text-base font-medium'>
                Nutritional Information (per {watch('unit') || 100}g)
              </Label>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='protein'>Protein (g)</Label>
                  <Input
                    id='protein'
                    type='number'
                    step='0.1'
                    {...register('protein')}
                    placeholder='0'
                  />
                  {errors.protein && (
                    <p className='text-sm text-destructive'>
                      {errors.protein.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='fat'>Fat (g)</Label>
                  <Input
                    id='fat'
                    type='number'
                    step='0.1'
                    {...register('fat')}
                    placeholder='0'
                  />
                  {errors.fat && (
                    <p className='text-sm text-destructive'>
                      {errors.fat.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='carbohydrate'>Carbohydrate (g)</Label>
                  <Input
                    id='carbohydrate'
                    type='number'
                    step='0.1'
                    {...register('carbohydrate')}
                    placeholder='0'
                  />
                  {errors.carbohydrate && (
                    <p className='text-sm text-destructive'>
                      {errors.carbohydrate.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='calories'>Calories *</Label>
                  <Input
                    id='calories'
                    type='number'
                    step='0.1'
                    {...register('calories')}
                    placeholder='0'
                  />
                  {errors.calories && (
                    <p className='text-sm text-destructive'>
                      {errors.calories.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className='flex items-center gap-4 pt-4'>
              <Button
                type='submit'
                disabled={loading}
                className='flex items-center gap-2'
              >
                {loading && <Loader2 className='h-4 w-4 animate-spin' />}
                <Plus className='h-4 w-4' />
                Create Food
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={handleGoBack}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
