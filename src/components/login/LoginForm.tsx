import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginSuccess, setAuthLoading, setAuthError } from '../../store/slices/authSlice';
import { authApi } from '../../services/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { addToast } from '../../store/slices/uiSlice';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('admin@company.internal');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      dispatch(setAuthError('Please enter both email and password'));
      return;
    }

    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      // API Call to Backend: POST http://localhost:5000/api/auth/login
      const response = await authApi.login(email, password);

      // Save user & token in Redux + localStorage
      dispatch(loginSuccess(response));

      dispatch(
        addToast({
          title: `Welcome, ${response.user.name}!`,
          description: `Authenticated successfully as ${response.user.role}.`,
          type: 'success',
        })
      );

      navigate('/dashboard');
    } catch (err: any) {
      dispatch(setAuthError(err.message || 'Login failed. Please check your credentials.'));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {error && (
        <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Email input */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">Email</label>
        <Input
          type="email"
          placeholder="name@company.internal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-3.5 h-3.5" />}
          required
        />
      </div>

      {/* Password input */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground">Password</label>
        </div>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-3.5 h-3.5" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full h-10 text-xs font-semibold mt-1 shadow-xs"
        isLoading={loading}
      >
        Sign In
      </Button>
    </form>
  );
}
