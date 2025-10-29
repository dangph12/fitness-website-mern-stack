import { format } from 'date-fns';
import { Calendar, Clock, User, Utensils } from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';

export function MealsDetailsDialog({ meal, open, onOpenChange }) {
  if (!meal) return null;

  const totalFoods = meal.foods?.length || 0;

  const mealTypeColors = {
    Breakfast: 'bg-yellow-100 text-yellow-800',
    Lunch: 'bg-green-100 text-green-800',
    Dinner: 'bg-blue-100 text-blue-800',
    Snack: 'bg-purple-100 text-purple-800',
    Brunch: 'bg-orange-100 text-orange-800',
    Dessert: 'bg-pink-100 text-pink-800'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Meal Details</DialogTitle>
          <DialogDescription>
            Complete information about the meal
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[calc(90vh-120px)]'>
          <div className='space-y-6 pr-4'>
            {/* Meal Image */}
            {meal.image && (
              <div className='relative w-full h-64 rounded-lg overflow-hidden border'>
                <img
                  src={meal.image}
                  alt={meal.title}
                  className='w-full h-full object-cover'
                />
              </div>
            )}

            {/* Basic Information */}
            <div className='space-y-3'>
              <div>
                <h3 className='text-2xl font-bold'>{meal.title}</h3>
              </div>

              <div className='flex items-center gap-2'>
                <User className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>
                  Created by: {meal.user?.name || 'Unknown'}
                </span>
              </div>
            </div>

            <Separator />

            {/* Statistics Cards */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='p-4 border rounded-lg bg-card'>
                <div className='flex items-center gap-2 mb-2'>
                  <Utensils className='h-4 w-4 text-primary' />
                  <p className='text-xs font-medium text-muted-foreground'>
                    Meal Type
                  </p>
                </div>
                <Badge
                  variant='secondary'
                  className={mealTypeColors[meal.mealType]}
                >
                  {meal.mealType}
                </Badge>
              </div>

              <div className='p-4 border rounded-lg bg-card'>
                <div className='flex items-center gap-2 mb-2'>
                  <Utensils className='h-4 w-4 text-primary' />
                  <p className='text-xs font-medium text-muted-foreground'>
                    Total Foods
                  </p>
                </div>
                <p className='text-2xl font-bold'>{totalFoods}</p>
              </div>
            </div>

            <Separator />

            {/* Foods List */}
            <div className='space-y-3'>
              <h4 className='font-semibold flex items-center gap-2'>
                <Utensils className='h-4 w-4' />
                Foods ({totalFoods})
              </h4>

              {meal.foods && meal.foods.length > 0 ? (
                <div className='space-y-3'>
                  {meal.foods.map((foodItem, index) => {
                    // Extract food data from nested structure
                    const food = foodItem.food || foodItem;
                    const quantity = foodItem.quantity || 1;

                    // Calculate nutrition based on quantity
                    const calories = (food.calories || 0) * quantity;
                    const protein = (food.protein || 0) * quantity;
                    const carbs = (food.carbs || 0) * quantity;
                    const fat = (food.fat || 0) * quantity;

                    return (
                      <div
                        key={food._id || index}
                        className='p-4 border rounded-lg hover:bg-muted/50 transition-colors'
                      >
                        <div className='flex items-start gap-4'>
                          {/* Food Image */}
                          {food.image && (
                            <div className='relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border'>
                              <img
                                src={food.image}
                                alt={food.title || 'Food'}
                                className='h-full w-full object-cover'
                                onError={e => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.classList.add(
                                    'bg-muted'
                                  );
                                }}
                              />
                            </div>
                          )}

                          {/* Food Info */}
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-start justify-between gap-2'>
                              <p className='font-semibold text-base'>
                                {index + 1}. {food.title || 'Unknown Food'}
                              </p>
                              <Badge
                                variant='outline'
                                className='text-xs flex-shrink-0'
                              >
                                x{quantity}
                              </Badge>
                            </div>

                            {/* Nutritional Info */}
                            <div className='grid grid-cols-2 gap-2 mt-2'>
                              <div className='text-sm'>
                                <span className='text-muted-foreground'>
                                  Calories:{' '}
                                </span>
                                <span className='font-medium'>
                                  {Math.round(calories)} kcal
                                </span>
                              </div>
                              <div className='text-sm'>
                                <span className='text-muted-foreground'>
                                  Protein:{' '}
                                </span>
                                <span className='font-medium'>
                                  {protein.toFixed(1)}g
                                </span>
                              </div>
                              <div className='text-sm'>
                                <span className='text-muted-foreground'>
                                  Carbs:{' '}
                                </span>
                                <span className='font-medium'>
                                  {carbs.toFixed(1)}g
                                </span>
                              </div>
                              <div className='text-sm'>
                                <span className='text-muted-foreground'>
                                  Fat:{' '}
                                </span>
                                <span className='font-medium'>
                                  {fat.toFixed(1)}g
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className='p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground'>
                  <Utensils className='h-12 w-12 mx-auto mb-2 opacity-50' />
                  <p>No foods added to this meal</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Timestamps */}
            <div className='space-y-3'>
              <h4 className='font-semibold flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                Timeline
              </h4>

              <div className='grid grid-cols-2 gap-4'>
                <div className='p-3 border rounded-lg bg-muted/30'>
                  <div className='flex items-center gap-2 mb-1'>
                    <Clock className='h-3 w-3 text-muted-foreground' />
                    <p className='text-xs font-medium text-muted-foreground'>
                      Created At
                    </p>
                  </div>
                  <p className='text-sm font-medium'>
                    {meal.createdAt
                      ? format(new Date(meal.createdAt), 'PPP')
                      : 'N/A'}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {meal.createdAt
                      ? format(new Date(meal.createdAt), 'p')
                      : ''}
                  </p>
                </div>

                <div className='p-3 border rounded-lg bg-muted/30'>
                  <div className='flex items-center gap-2 mb-1'>
                    <Clock className='h-3 w-3 text-muted-foreground' />
                    <p className='text-xs font-medium text-muted-foreground'>
                      Updated At
                    </p>
                  </div>
                  <p className='text-sm font-medium'>
                    {meal.updatedAt
                      ? format(new Date(meal.updatedAt), 'PPP')
                      : 'N/A'}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {meal.updatedAt
                      ? format(new Date(meal.updatedAt), 'p')
                      : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
