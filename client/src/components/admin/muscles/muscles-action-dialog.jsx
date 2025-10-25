import { Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { updateMuscle } from '~/store/features/muscles-slice';

import { useMuscles } from './muscles-provider';

export const MusclesActionDialog = () => {
  const dispatch = useDispatch();
  const {
    isActionDialogOpen,
    setIsActionDialogOpen,
    selectedMuscle,
    actionMode,
    closeAllDialogs
  } = useMuscles();

  const [formData, setFormData] = useState({
    title: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedMuscle && actionMode === 'edit') {
      setFormData({
        title: selectedMuscle.title || '',
        image: null
      });
      setImagePreview(selectedMuscle.image || '');
    } else {
      setFormData({ title: '', image: null });
      setImagePreview('');
    }
  }, [selectedMuscle, actionMode]);

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      await dispatch(
        updateMuscle({ id: selectedMuscle._id, updateData: submitData })
      ).unwrap();
      toast.success('Muscle updated successfully');

      closeAllDialogs();
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Only show dialog for edit mode
  if (actionMode !== 'edit') return null;

  return (
    <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Edit Muscle</DialogTitle>
          <DialogDescription>Update muscle group information</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
