import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setActiveProjectId } from '../../store/slices/projectSlice';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  KeyRound,
  FileCode2,
  BookOpenText,
  ChevronDown,
  X,
  Layers,
  ShieldCheck,
  Check,
  Plus,
} from 'lucide-react';
import { setCreateModalType } from '../../store/slices/uiSlice';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { projects, activeProjectId } = useAppSelector((state) => state.project);

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'All Projects', path: '/projects', icon: FolderKanban },
    { name: 'Team & Members', path: '/users', icon: Users },
    { name: 'Credentials Vault', path: '/credentials', icon: KeyRound },
    { name: 'Environment Variables', path: '/environments', icon: FileCode2 },
    { name: 'Project Documents', path: '/documents', icon: BookOpenText },
  ];

  const handleSelectProject = (id: string | null) => {
    dispatch(setActiveProjectId(id));
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-[100dvh] flex flex-col z-40 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shrink-0 select-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 shrink-0 flex items-center justify-between px-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-foreground text-base tracking-tight flex items-center gap-1.5">
                PigoPiOps
              </span>
              <p className="text-[10px] text-muted-foreground leading-none">Internal Project Hub</p>
            </div>
          </div>
          <button
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Fixed Project Selector (Real-Estate CRM Style) */}
        <div className="p-3 border-b border-sidebar-border relative z-30" ref={dropdownRef}>
          <div className="flex items-center justify-between mb-1.5 px-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Project
            </p>
            {user?.role !== 'Employee' && (
              <button
                onClick={() => dispatch(setCreateModalType('project'))}
                className="text-[11px] text-primary hover:underline flex items-center gap-0.5 font-medium"
                title="Add New Project"
              >
                <Plus className="w-3 h-3" /> New
              </button>
            )}
          </div>

          {/* Project Switcher Button */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl border border-sidebar-border bg-white dark:bg-card hover:bg-sidebar-accent text-left transition-all shadow-xs focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  activeProject ? 'bg-emerald-500' : 'bg-primary'
                )}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {activeProject ? activeProject.name : 'All Projects'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {activeProject ? activeProject.category : `${projects.length} Total Projects`}
                </p>
              </div>
            </div>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-muted-foreground transition-transform shrink-0',
                isDropdownOpen ? 'transform rotate-180' : ''
              )}
            />
          </button>

          {/* Solid Dropdown Popover */}
          {isDropdownOpen && (
            <div className="absolute left-3 right-3 top-[calc(100%+4px)] bg-white dark:bg-card border border-sidebar-border rounded-xl shadow-xl py-1 z-50 max-h-60 overflow-y-auto">
              <button
                type="button"
                onClick={() => handleSelectProject(null)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors',
                  activeProjectId === null ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>All Projects (Global)</span>
                </div>
                {activeProjectId === null && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>

              <div className="h-px bg-sidebar-border my-1" />

              <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Select Single Project
              </p>

              {projects.map((proj) => {
                const isSelected = activeProjectId === proj.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => handleSelectProject(proj.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors',
                      isSelected ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <div className="truncate">
                        <p className="truncate font-medium">{proj.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{proj.category}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Menu
          </p>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary text-white shadow-xs font-semibold'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{link.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer User Info */}
        <div className="p-3 border-t border-sidebar-border bg-sidebar shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-border"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">{user?.name || 'Guest'}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user?.role || 'User'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
