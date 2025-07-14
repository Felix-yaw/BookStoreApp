import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { RegisterRequest } from '../types/models';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register: registerField, handleSubmit, formState: { errors } } = useForm<RegisterRequest>();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      await register(data);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 to-pink-200">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input type="email" {...registerField('email', { required: 'Email is required' })} className="w-full px-3 py-2 border rounded" />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Username</label>
          <input type="text" {...registerField('userName', { required: 'Username is required' })} className="w-full px-3 py-2 border rounded" />
          {errors.userName && <span className="text-red-500 text-sm">{errors.userName.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input type="password" {...registerField('password', { required: 'Password is required' })} className="w-full px-3 py-2 border rounded" />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-500 hover:underline">Already have an account? Login</a>
        </div>
      </form>
    </div>
  );
} 