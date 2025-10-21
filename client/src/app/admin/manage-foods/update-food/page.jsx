'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, Loader2, Save, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
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
import {
  fetchFoodById,
  fetchFoods,
  updateFood
} from '~/store/features/food-slice';

// Validation schema
const foodSchema = yup.object().shape({
  title: yup.string().required('Food name is required').trim(),
  image: yup.string().url('Must be a valid URL').optional(),
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

export default function UpdateFoodPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { currentFood, loading, error } = useSelector(state => state.foods);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(foodSchema),
    defaultValues: {
      title: '',
      image: '',
      unit: 100,
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
    if (id) {
      dispatch(fetchFoodById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentFood) {
      reset({
        title: currentFood.title || '',
        image: currentFood.image || '',
        unit: currentFood.unit || 100,
        protein: currentFood.protein || 0,
        fat: currentFood.fat || 0,
        carbohydrate: currentFood.carbohydrate || 0,
        calories: currentFood.calories || 0,
        category: currentFood.category || ''
      });

      if (currentFood.image) {
        setImagePreview(currentFood.image);
      }
    }
  }, [currentFood, reset]);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
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
      reader.onload = e => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setLocalError('');
    }
  };

  const onSubmit = async data => {
    setLocalError('');
    setSuccess('');

    try {
      const updateData = new FormData();

      updateData.append('title', data.title.trim());
      updateData.append('unit', Number(data.unit));
      updateData.append('protein', Number(data.protein) || 0);
      updateData.append('fat', Number(data.fat) || 0);
      updateData.append('carbohydrate', Number(data.carbohydrate) || 0);
      updateData.append('calories', Number(data.calories));
      updateData.append('category', data.category);

      if (imageFile) {
        updateData.append('image', imageFile);
      } else if (data.image) {
        updateData.append('imageUrl', data.image);
      }

      await dispatch(
        updateFood({
          id: currentFood._id,
          updateData
        })
      ).unwrap();

      setSuccess('Food updated successfully!');
      dispatch(fetchFoods({}));

      setTimeout(() => {
        navigate('/admin/manage-foods');
      }, 1500);
    } catch (err) {
      setLocalError(err?.message || 'Failed to update food. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigate('/admin/manage-foods');
  };

  if (loading && !currentFood) {
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
          <CardContent className='flex items-center justify-center py-8'>
            <div className='flex items-center gap-2'>
              <Loader2 className='h-5 w-5 animate-spin' />
              Loading food details...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
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
          <CardContent>
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentFood) {
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
          <CardContent>
            <Alert>
              <AlertDescription>Food not found</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <CardTitle>Update Food</CardTitle>
          <CardDescription>
            Update food information for <b>{currentFood.title}</b>
          </CardDescription>
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

            {/* Image Upload Section */}
            <div className='space-y-2'>
              <Label>Food Image</Label>
              <div className='flex items-center gap-4'>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt='Food preview'
                    className='w-24 h-24 rounded-lg object-cover border'
                  />
                ) : (
                  <div className='w-24 h-24 rounded-lg bg-muted flex items-center justify-center border'>
                    <Upload className='w-8 h-8 text-muted-foreground' />
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
                    Change Image
                  </Label>
                  <p className='text-xs text-muted-foreground mt-1'>
                    PNG, JPG up to 5MB or paste URL below
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Food Name */}
            <div className='space-y-2'>
              <Label htmlFor='title'>
                Food Name <span className='text-destructive'>*</span>
              </Label>
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
              {/* Unit */}
              <div className='space-y-2'>
                <Label htmlFor='unit'>
                  Unit (gram) <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='unit'
                  type='number'
                  step='0.1'
                  {...register('unit')}
                  placeholder='100'
                />
                {errors.unit && (
                  <p className='text-sm text-destructive'>
                    {errors.unit.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className='space-y-2'>
                <Label htmlFor='category'>
                  Category <span className='text-destructive'>*</span>
                </Label>
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
                      Fruits & Vegetables
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

            {/* Nutritional Information */}
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
                  <Label htmlFor='carbohydrate'>carbohydrate (g)</Label>
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
                  <Label htmlFor='calories'>
                    Calories <span className='text-destructive'>*</span>
                  </Label>
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
                <Save className='h-4 w-4' />
                Update Food
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
