'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import {
  createEquipment,
  updateEquipment
} from '~/store/features/equipment-slice';

import { useEquipments } from './equipments-provider';

const equipmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  image: z.any().optional()
});

export function EquipmentsActionDialog() {
  const dispatch = useDispatch();
  const { isActionDialogOpen, closeAllDialogs, selectedEquipment, actionMode } =
    useEquipments();
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      title: '',
      image: null
    }
  });

  useEffect(() => {
    if (selectedEquipment && actionMode === 'edit') {
      form.reset({
        title: selectedEquipment.title || ''
      });
      setImagePreview(selectedEquipment.image);
    } else {
      form.reset({
        title: ''
      });
      setImagePreview(null);
    }
  }, [selectedEquipment, actionMode, form]);

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async data => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);

      if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      if (actionMode === 'edit' && selectedEquipment) {
        await dispatch(
          updateEquipment({
            id: selectedEquipment._id,
            updateData: formData
          })
        ).unwrap();
        toast.success('Equipment updated successfully');
      } else {
        await dispatch(createEquipment(formData)).unwrap();
        toast.success('Equipment created successfully');
      }

      closeAllDialogs();
      form.reset();
      setImagePreview(null);
    } catch (error) {
      toast.error(error.message || `Failed to ${actionMode} equipment`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isActionDialogOpen} onOpenChange={closeAllDialogs}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {actionMode === 'edit' ? 'Edit Equipment' : 'Create Equipment'}
          </DialogTitle>
          <DialogDescription>
            {actionMode === 'edit'
              ? 'Update the equipment details below.'
              : 'Fill in the details to create a new equipment.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter equipment title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='image'
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='image/*'
                      onChange={handleImageChange}
                      {...field}
                    />
                  </FormControl>
                  {imagePreview && (
                    <div className='mt-2'>
                      <img
                        src={imagePreview}
                        alt='Preview'
                        className='w-32 h-32 object-cover rounded-md'
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={closeAllDialogs}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : actionMode === 'edit'
                    ? 'Update'
                    : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
