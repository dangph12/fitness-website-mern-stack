import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, Trash2, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { mealValidationSchema } from '~/app/admin/manage-meals/validations/meal-validation';
import { FoodLibrary } from '~/components/admin/meals/food-library';
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
import { createMeal } from '~/store/features/meal-slice';

const CreateMeal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(state => state.auth.user.id);
  const { loading } = useSelector(state => state.meals);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(mealValidationSchema),
    defaultValues: {
      title: '',
      mealType: 'Breakfast',
      image: null,
      foods: []
    }
  });

  const foods = watch('foods') || [];
  const mealType = watch('mealType');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Calculate totals
  const totalFoods = foods.length;
  const totalCalories = foods.reduce((acc, item) => {
    const food = item.foodData;
    return acc + (food?.calories || 0) * (item.quantity || 1);
  }, 0);

  // Get selected food IDs for library
  const selectedFoodIds = foods.map(f => f.food);

  const handleAddFood = food => {
    const exists = foods.some(f => f.food === food._id);
    if (exists) {
      toast.info('Food already added');
      return;
    }

    const foodItem = {
      food: food._id,
      foodName: food.name,
      quantity: 1,
      foodData: food // Store full food data for display
    };

    setValue('foods', [...foods, foodItem]);
    toast.success('Food added');
  };

  const handleRemoveFood = foodIndex => {
    setValue(
      'foods',
      foods.filter((_, i) => i !== foodIndex)
    );
    toast.success('Food removed');
  };

  const handleQuantityChange = (foodIndex, quantity) => {
    const updatedFoods = [...foods];
    updatedFoods[foodIndex].quantity = Number(quantity);
    setValue('foods', updatedFoods);
  };

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue('image', file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setValue('image', null);
    setImageUrl('');
  };

  const onSubmit = async data => {
    console.log('Form data:', data); // Debug

    const mealData = new FormData();
    mealData.append('title', data.title.trim());
    mealData.append('mealType', data.mealType);
    mealData.append('user', userId);

    if (data.image) {
      mealData.append('image', data.image);
    }

    // Append foods array properly
    data.foods.forEach((foodItem, index) => {
      mealData.append(`foods[${index}][food]`, foodItem.food);
      mealData.append(`foods[${index}][quantity]`, String(foodItem.quantity));
    });

    // Debug FormData
    console.log('FormData entries:');
    for (const pair of mealData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const result = await dispatch(createMeal(mealData)).unwrap();
      console.log('Create result:', result);
      toast.success('Meal created successfully!');
      navigate('/admin/manage-meals');
    } catch (error) {
      console.error('Create error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create meal';
      toast.error(errorMessage);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/manage-meals');
  };

  const mealTypeColors = {
    Breakfast: 'bg-yellow-100 text-yellow-800',
    Lunch: 'bg-green-100 text-green-800',
    Dinner: 'bg-blue-100 text-blue-800',
    Snack: 'bg-purple-100 text-purple-800',
    Brunch: 'bg-orange-100 text-orange-800',
    Dessert: 'bg-pink-100 text-pink-800'
  };

  return (
    <div className='max-w-7xl mx-auto space-y-6'>
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleGoBack}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Meals
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6'>
          {/* Left Column - Meal Details */}
          <div className='space-y-6'>
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <span>Meal Information</span>
                  <div className='flex items-center gap-2 text-sm'>
                    <Badge variant='secondary'>{totalFoods} foods</Badge>
                    <Badge variant='secondary'>
                      {Math.round(totalCalories)} cal
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Meal Title */}
                <div className='space-y-2'>
                  <Label htmlFor='title'>
                    Meal Title <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='title'
                    {...register('title')}
                    placeholder='e.g. Healthy Breakfast Bowl'
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className='text-sm text-red-500'>
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Meal Type */}
                <div className='space-y-2'>
                  <Label htmlFor='mealType'>
                    Meal Type <span className='text-red-500'>*</span>
                  </Label>
                  <Select
                    value={mealType}
                    onValueChange={value => setValue('mealType', value)}
                  >
                    <SelectTrigger
                      className={errors.mealType ? 'border-red-500' : ''}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Breakfast'>
                        <div className='flex items-center gap-2'>
                          <Badge
                            variant='secondary'
                            className='bg-yellow-100 text-yellow-800'
                          >
                            Breakfast
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value='Lunch'>
                        <div className='flex items-center gap-2'>
                          <Badge
                            variant='secondary'
                            className='bg-green-100 text-green-800'
                          >
                            Lunch
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value='Dinner'>
                        <div className='flex items-center gap-2'>
                          <Badge
                            variant='secondary'
                            className='bg-blue-100 text-blue-800'
                          >
                            Dinner
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value='Snack'>
                        <div className='flex items-center gap-2'>
                          <Badge
                            variant='secondary'
                            className='bg-purple-100 text-purple-800'
                          >
                            Snack
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value='Brunch'>
                        <div className='flex items-center gap-2'>
                          <Badge
                            variant='secondary'
                            className='bg-orange-100 text-orange-800'
                          >
                            Brunch
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value='Dessert'>
                        <div className='flex items-center gap-2'>
                          <Badge
                            variant='secondary'
                            className='bg-pink-100 text-pink-800'
                          >
                            Dessert
                          </Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.mealType && (
                    <p className='text-sm text-red-500'>
                      {errors.mealType.message}
                    </p>
                  )}
                </div>

                {/* Meal Image */}
                <div className='space-y-2'>
                  <Label htmlFor='image'>Meal Image (Optional)</Label>
                  {!imageUrl ? (
                    <div className='border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors'>
                      <input
                        id='image'
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                        className='hidden'
                      />
                      <label
                        htmlFor='image'
                        className='cursor-pointer flex flex-col items-center space-y-2'
                      >
                        <Upload className='h-10 w-10 text-gray-400' />
                        <span className='text-sm text-gray-600'>
                          Click to upload meal image
                        </span>
                        <span className='text-xs text-gray-500'>
                          PNG, JPG, WEBP (max 10MB)
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className='relative border rounded-lg p-4'>
                      <button
                        type='button'
                        onClick={removeImage}
                        className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'
                      >
                        <X className='h-4 w-4' />
                      </button>
                      <img
                        src={imageUrl}
                        alt='Meal preview'
                        className='w-full max-h-64 object-cover rounded'
                      />
                    </div>
                  )}
                  {errors.image && (
                    <p className='text-sm text-red-500'>
                      {errors.image.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Foods List Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Foods
                  {foods.length === 0 && (
                    <span className='text-sm font-normal text-muted-foreground ml-2'>
                      - Use the library on the right to add foods
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {foods.length === 0 ? (
                  <div className='border-2 border-dashed rounded-lg p-10 text-center text-muted-foreground'>
                    <p>No foods added yet</p>
                    <p className='text-sm mt-2'>
                      Select foods from the library to get started
                    </p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {foods.map((foodItem, foodIndex) => {
                      const food = foodItem.foodData;
                      const itemCalories =
                        (food?.calories || 0) * (foodItem.quantity || 1);
                      const itemProtein =
                        (food?.protein || 0) * (foodItem.quantity || 1);
                      const itemCarbs =
                        (food?.carbs || 0) * (foodItem.quantity || 1);
                      const itemFat =
                        (food?.fat || 0) * (foodItem.quantity || 1);

                      return (
                        <div
                          key={`${foodItem.food}-${foodIndex}`}
                          className='border rounded-lg p-4 space-y-3'
                        >
                          {/* Food Header */}
                          <div className='flex items-start justify-between'>
                            <div className='flex items-center gap-3 flex-1'>
                              <div className='relative h-16 w-16 overflow-hidden rounded-md border flex-shrink-0'>
                                {food?.image ? (
                                  <img
                                    src={food.image}
                                    alt={food.name || 'Food'}
                                    className='h-full w-full object-cover'
                                  />
                                ) : (
                                  <div className='h-full w-full bg-muted flex items-center justify-center'>
                                    <span className='text-xs text-muted-foreground'>
                                      No img
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className='flex-1 min-w-0'>
                                <h4 className='font-semibold'>
                                  {foodIndex + 1}. {food?.name || 'Food'}
                                </h4>
                                <div className='flex flex-wrap gap-1 mt-1'>
                                  <Badge
                                    variant='secondary'
                                    className='text-xs'
                                  >
                                    {Math.round(itemCalories)} cal
                                  </Badge>
                                  <Badge variant='outline' className='text-xs'>
                                    P: {itemProtein.toFixed(1)}g
                                  </Badge>
                                  <Badge variant='outline' className='text-xs'>
                                    C: {itemCarbs.toFixed(1)}g
                                  </Badge>
                                  <Badge variant='outline' className='text-xs'>
                                    F: {itemFat.toFixed(1)}g
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => handleRemoveFood(foodIndex)}
                              className='text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>

                          {/* Quantity Input */}
                          <div className='flex items-center gap-2 pt-2 border-t'>
                            <Label
                              htmlFor={`quantity-${foodIndex}`}
                              className='text-sm min-w-fit'
                            >
                              Quantity:
                            </Label>
                            <Input
                              id={`quantity-${foodIndex}`}
                              type='number'
                              min='1'
                              max='1000'
                              value={foodItem.quantity}
                              onChange={e =>
                                handleQuantityChange(foodIndex, e.target.value)
                              }
                              className='w-24'
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {errors.foods && (
                  <p className='text-sm text-red-500 mt-2'>
                    {errors.foods.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className='flex gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleGoBack}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={loading} className='flex-1'>
                {loading ? 'Creating...' : 'Create Meal'}
              </Button>
            </div>
          </div>

          {/* Right Column - Food Library */}
          <aside className='xl:sticky xl:top-6 h-fit'>
            <FoodLibrary
              onAddFood={handleAddFood}
              selectedFoodIds={selectedFoodIds}
            />
          </aside>
        </div>
      </form>
    </div>
  );
};

export default CreateMeal;
