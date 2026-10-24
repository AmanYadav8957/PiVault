import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout, switchRole } from '../../store/slices/authSlice';
import { toggleTheme, setCreateModalType, addToast } from '../../store/slices/uiSlice';
import { UserRole } from '../../types';
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  Bell,
  Shield,
  Layers,
  ChevronDown,
  Check,
  Plus,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../utils/cn';
import { authApi } from '../../services/api';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);
  const { projects, activeProjectId } = useAppSelector((state) => state.project);

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setIsRoleMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Proceed with client logout even if server request fails
    }
    dispatch(logout());
    dispatch(
      addToast({
        title: 'Logged Out',
        description: 'You have been signed out.',
        type: 'info',
      })
    );
    navigate('/login');
  };

  const handleRoleChange = (newRole: UserRole) => {
    dispatch(switchRole(newRole));
    setIsRoleMenuOpen(false);
    dispatch(
      addToast({
        title: `Switched Role to ${newRole}`,
        description: `View updated to ${newRole} permissions.`,
        type: 'success',
      })
    );
  };

  const roles: UserRole[] = ['Super Admin', 'Admin', 'Employee'];

  return (
    <header className="h-16 bg-white dark:bg-card border-b border-border px-4 lg:px-6 flex items-center justify-between shrink-0 z-30 sticky top-0 shadow-2xs">
      {/* Left: Mobile Menu & Active Scope */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Scope:</span>
          {activeProject ? (
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {activeProject.name}
            </span>
          ) : (
            <span className="text-xs font-semibold text-primary flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40">
              <Layers className="w-3.5 h-3.5" />
              All Projects
            </span>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Demo Control */}
        <div className="relative" ref={roleMenuRef}>
          <button
            type="button"
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white dark:bg-card hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-foreground transition-all shadow-xs"
            title="Switch User Role to test permissions"
          >
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline text-muted-foreground">Role:</span>
            <span className="font-semibold">{user?.role || 'Guest'}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground ml-0.5" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-white dark:bg-card text-foreground shadow-xl py-1 z-50">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs font-bold text-foreground">Switch Role (Live Demo)</p>
                <p className="text-[10px] text-muted-foreground">Test permissions & protected views</p>
              </div>

              {roles.map((r) => {
                const isCurrent = user?.role === r;
                return (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors',
                      isCurrent ? 'bg-primary/10 text-primary font-bold' : 'text-foreground'
                    )}
                  >
                    <div>
                      <p className="font-medium">{r}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {r === 'Employee' ? 'Read-only & assigned views' : 'Full CRUD access'}
                      </p>
                    </div>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Global Quick Action button for Admin */}
        {user?.role !== 'Employee' && (
          <div className="hidden md:flex items-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch(setCreateModalType('credential'))}
              className="text-xs h-8 gap-1.5 border-border"
            >
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>Add Secret</span>
            </Button>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-white dark:bg-card text-foreground shadow-xl p-4 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-bold text-foreground">Project Alerts</span>
                <Badge variant="default" size="sm">3 New</Badge>
              </div>
              <div className="divide-y divide-border/60 text-xs">
                <div className="py-2.5">
                  <p className="font-semibold text-foreground">Stripe Master Key Rotated</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">PayPulse FinTech secret updated by Sarah.</p>
                  <span className="text-[10px] text-muted-foreground/80 mt-1 block">10 mins ago</span>
                </div>
                <div className="py-2.5">
                  <p className="font-semibold text-foreground">New Member Assigned</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">David Kim joined PulseHealth portal.</p>
                  <span className="text-[10px] text-muted-foreground/80 mt-1 block">2 hours ago</span>
                </div>
                <div className="py-2.5">
                  <p className="font-semibold text-foreground">Env Variables Deployed</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">Production env updated for AcreFlow CRM.</p>
                  <span className="text-[10px] text-muted-foreground/80 mt-1 block">Yesterday</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-border"
            />
            <span className="text-xs font-semibold text-foreground hidden sm:block">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-white dark:bg-card text-foreground shadow-xl p-2 z-50">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                <div className="mt-1.5">
                  <Badge variant="purple" size="sm">
                    {user?.role}
                  </Badge>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
