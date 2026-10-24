import React from 'react';
import LoginHero from '../components/login/LoginHero';
import LoginForm from '../components/login/LoginForm';
import RoleDemoCard from '../components/login/RoleDemoCard';
import { Layers } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F0F2F5] dark:bg-background p-4 sm:p-6 lg:p-8">
      {/* Main Login Card */}
      <div className="w-full max-w-4xl bg-white dark:bg-card rounded-2xl border border-border shadow-xl flex flex-col lg:flex-row overflow-hidden relative z-10">
        {/* Left Visual Brand Panel */}
        <LoginHero />

        {/* Right Authentication Form Panel */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          {/* Mobile Header Brand */}
          <div className="flex lg:hidden items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">PigoPiOps</span>
          </div>

          <div className="mb-5">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Welcome to <span className="text-primary">PigoPiOps</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Internal project management, secrets vault, and environment variables hub.
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Role Presets */}
          <RoleDemoCard />
        </div>
      </div>
    </div>
  );
}
