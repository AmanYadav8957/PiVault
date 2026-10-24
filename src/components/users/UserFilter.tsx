import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setUserSearchQuery, setUserRoleFilter } from '../../store/slices/userSlice';
import { setCreateModalType } from '../../store/slices/uiSlice';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, UserPlus } from 'lucide-react';

export default function UserFilter() {
  const dispatch = useAppDispatch();
  const { searchQuery, roleFilter } = useAppSelector((state) => state.users);
  const { user } = useAppSelector((state) => state.auth);

  const roles = ['All', 'Super Admin', 'Admin', 'Employee'];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border">
      <div className="relative flex-1 max-w-md">
        <Input
          type="text"
          placeholder="Search team by name, email or department..."
          value={searchQuery}
          onChange={(e) => dispatch(setUserSearchQuery(e.target.value))}
          icon={<Search className="w-4 h-4 text-muted-foreground" />}
          className="h-9 text-xs"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto">
        <div className="flex items-center gap-1">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => dispatch(setUserRoleFilter(r))}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                roleFilter === r
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {user?.role !== 'Employee' && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => dispatch(setCreateModalType('user'))}
            className="text-xs h-8 shrink-0 shadow-sm ml-auto"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1" />
            Add Member
          </Button>
        )}
      </div>
    </div>
  );
}
