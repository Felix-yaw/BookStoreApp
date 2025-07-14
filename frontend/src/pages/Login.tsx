import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { LoginRequest } from '../types/models';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 to-pink-200">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input type="email" {...register('email', { required: 'Email is required' })} className="w-full px-3 py-2 border rounded" />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input type="password" {...register('password', { required: 'Password is required' })} className="w-full px-3 py-2 border rounded" />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-4 text-center">
          <a href="/register" className="text-blue-500 hover:underline">Don't have an account? Register</a>
        </div>
      </form>
    </div>
  );
} 