import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { loginSuccess, setAuthError } from '../../store/slices/authSlice';
import { authApi } from '../../services/api';
import { initialUsers } from '../../utils/mockData';
import { ShieldCheck, UserCheck, ArrowRight, Loader2 } from 'lucide-react';
import { addToast } from '../../store/slices/uiSlice';

export default function RoleDemoCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const handleQuickLogin = async (index: number) => {
    const selected = initialUsers[index];
    if (!selected) return;

    setLoadingIndex(index);
    try {
      // 🚀 Real API Call: Log in through backend with seeded user
      const response = await authApi.login(selected.email, 'password123');
      dispatch(loginSuccess(response));
      dispatch(
        addToast({
          title: `Logged in as ${response.user.role}`,
          description: `Active MongoDB session as ${response.user.name}`,
          type: 'success',
        })
      );
      navigate('/dashboard');
    } catch (err: any) {
      dispatch(setAuthError(err.message || 'Quick login failed'));
      dispatch(
        addToast({
          title: 'Login Failed',
          description: err.message,
          type: 'error',
        })
      );
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="pt-4 border-t border-border mt-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Demo Login
        </span>
        <span className="text-[10px] text-primary font-medium">1-Click</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Super Admin Preset */}
        <button
          type="button"
          onClick={() => handleQuickLogin(0)}
          disabled={loadingIndex !== null}
          className="p-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 hover:border-primary text-left transition-all group flex items-start justify-between cursor-pointer disabled:opacity-50"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-primary">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Super Admin</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Aman Sharma</p>
          </div>
          {loadingIndex === 0 ? (
            <Loader2 className="w-3.5 h-3.5 text-primary animate-spin mt-0.5" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-all mt-0.5" />
          )}
        </button>

        {/* Employee Preset */}
        <button
          type="button"
          onClick={() => handleQuickLogin(3)}
          disabled={loadingIndex !== null}
          className="p-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 hover:border-emerald-500 text-left transition-all group flex items-start justify-between cursor-pointer disabled:opacity-50"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-emerald-500">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Employee</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">David Kim</p>
          </div>
          {loadingIndex === 3 ? (
            <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin mt-0.5" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-emerald-500 transition-all mt-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}
