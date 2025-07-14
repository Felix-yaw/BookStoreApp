import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Book, Category, CreateBookRequest } from '../types/models';
import { getAllCategories } from '../services/categoryService';
import { toast } from 'react-hot-toast';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBookRequest) => Promise<void>;
  book?: Book | null;
  title: string;
}

export default function BookFormModal({ isOpen, onClose, onSubmit, book, title }: BookFormModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateBookRequest>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: 0,
    }
  });

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (book) {
        reset({
          name: book.name,
          description: book.description,
          price: book.price,
          categoryId: book.categoryId,
        });
      } else {
        reset({
          name: '',
          description: '',
          price: 0,
          categoryId: 0,
        });
      }
    }
  }, [isOpen, book, reset]);

  const loadCategories = async () => {
    try {
      const cats = await getAllCategories();
      setCategories(cats);
    } catch (error: any) {
      toast.error('Failed to load categories');
    }
  };

  const handleFormSubmit = async (data: CreateBookRequest) => {
    setLoading(true);
    try {
      await onSubmit(data);
      toast.success(book ? 'Book updated successfully!' : 'Book created successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Book Name</label>
            <input
              type="text"
              {...register('name', { required: 'Book name is required' })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('price', { 
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' },
                valueAsNumber: true
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              {...register('categoryId', { 
                required: 'Category is required',
                valueAsNumber: true
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="text-red-500 text-sm">{errors.categoryId.message}</span>}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (book ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 