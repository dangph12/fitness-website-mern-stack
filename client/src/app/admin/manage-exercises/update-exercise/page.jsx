import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

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
  updateExercise
} from '~/store/features/exercise-slice';

const UpdateExercise = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentExercise, loading } = useSelector(state => state.exercises);

  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    difficulty: '',
    type: '',
    tutorial: '',
    instructions: '',
    muscles: '',
    equipments: ''
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchExerciseById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentExercise) {
      setFormData({
        title: currentExercise.title || '',
        difficulty: currentExercise.difficulty || '',
        type: currentExercise.type || '',
        tutorial: currentExercise.tutorial || '',
        instructions: currentExercise.instructions || '',
        muscles: Array.isArray(currentExercise.muscles)
          ? currentExercise.muscles.join(', ')
          : '',
        equipments: Array.isArray(currentExercise.equipments)
          ? currentExercise.equipments.join(', ')
          : ''
      });
    }
  }, [currentExercise]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const updateData = {
        ...formData,
        muscles: formData.muscles
          .split(',')
          .map(m => m.trim())
          .filter(Boolean),
        equipments: formData.equipments
          .split(',')
          .map(e => e.trim())
          .filter(Boolean)
      };

      await dispatch(updateExercise({ id, updateData })).unwrap();
      toast.success('Exercise updated successfully!');
      navigate('/admin/manage-exercises');
    } catch (error) {
      toast.error(error.message || 'Failed to update exercise');
    } finally {
      setFormLoading(false);
    }
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
      <div className='text-center'>
        <h2 className='text-2xl font-bold'>Exercise not found</h2>
        <Button
          onClick={() => navigate('/admin/manage-exercises')}
          className='mt-4'
        >
          Back to Exercises
        </Button>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Update Exercise</h1>
        <p className='text-muted-foreground'>
          Modify the exercise details below.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exercise Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Exercise Name *</Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder='e.g. Push-ups'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='difficulty'>Difficulty *</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={value =>
                    handleInputChange('difficulty', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select difficulty' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Beginner'>Beginner</SelectItem>
                    <SelectItem value='Intermediate'>Intermediate</SelectItem>
                    <SelectItem value='Advanced'>Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='type'>Exercise Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={value => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Strength'>Strength</SelectItem>
                    <SelectItem value='Cardio'>Cardio</SelectItem>
                    <SelectItem value='Flexibility'>Flexibility</SelectItem>
                    <SelectItem value='Balance'>Balance</SelectItem>
                    <SelectItem value='Endurance'>Endurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='tutorial'>Tutorial URL</Label>
                <Input
                  id='tutorial'
                  type='url'
                  value={formData.tutorial}
                  onChange={e => handleInputChange('tutorial', e.target.value)}
                  placeholder='https://example.com/tutorial'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='instructions'>Instructions *</Label>
              <Textarea
                id='instructions'
                value={formData.instructions}
                onChange={e =>
                  handleInputChange('instructions', e.target.value)
                }
                placeholder='Step-by-step instructions for the exercise...'
                rows={4}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='muscles'>Target Muscles</Label>
              <Input
                id='muscles'
                value={formData.muscles}
                onChange={e => handleInputChange('muscles', e.target.value)}
                placeholder='e.g. chest, shoulders, triceps (comma separated)'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='equipments'>Equipment Needed</Label>
              <Input
                id='equipments'
                value={formData.equipments}
                onChange={e => handleInputChange('equipments', e.target.value)}
                placeholder='e.g. dumbbells, resistance bands (comma separated)'
              />
            </div>

            <div className='flex gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => navigate('/admin/manage-exercises')}
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={formLoading}>
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
