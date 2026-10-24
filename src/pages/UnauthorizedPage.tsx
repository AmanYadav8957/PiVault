import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { switchRole } from '../store/slices/authSlice';
import { addToast } from '../store/slices/uiSlice';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ShieldAlert, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleElevateToAdmin = () => {
    dispatch(switchRole('Super Admin'));
    dispatch(
      addToast({
        title: 'Elevated to Super Admin',
        description: 'You now have full administrator access to all views.',
        type: 'success',
      })
    );
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-5 border-border shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge variant="destructive" size="sm">
            Access Restricted
          </Badge>
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            Admin Privileges Required
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your current account role is <span className="font-semibold text-foreground">{user?.role || 'Guest'}</span>.
            This view or action is protected by corporate security policy.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-muted/60 border border-border text-left text-xs space-y-1.5">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Testing Role Protected Views?
          </p>
          <p className="text-muted-foreground">
            You can elevate your session to Super Admin with one click below or using the role switch in the top header.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Dashboard
          </Button>

          <Button variant="primary" size="sm" onClick={handleElevateToAdmin}>
            Switch to Super Admin
          </Button>
        </div>
      </Card>
    </div>
  );
}
