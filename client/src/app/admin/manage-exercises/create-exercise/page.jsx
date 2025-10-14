import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
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
import { Textarea } from '~/components/ui/textarea';
import { createExercise } from '~/store/features/exercise-slice';

const CreateExercise = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    difficulty: '',
    type: '',
    tutorial: '',
    instructions: '',
    muscles: '',
    equipments: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const exerciseData = {
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

      await dispatch(createExercise(exerciseData)).unwrap();
      toast.success('Exercise created successfully!');
      navigate('/admin/manage-exercises');
    } catch (error) {
      toast.error(error.message || 'Failed to create exercise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Create Exercise</h1>
        <p className='text-muted-foreground'>
          Add a new exercise to your fitness database.
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
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={loading}>
                {loading ? 'Creating...' : 'Create Exercise'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateExercise;
