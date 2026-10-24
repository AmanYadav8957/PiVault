import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setCredSearchQuery,
  setCredCategoryFilter,
  hideAllSecrets,
} from '../../store/slices/credentialSlice';
import { setCreateModalType } from '../../store/slices/uiSlice';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Plus, EyeOff } from 'lucide-react';

export default function CredentialFilter() {
  const dispatch = useAppDispatch();
  const { searchQuery, categoryFilter, revealedSecretIds } = useAppSelector(
    (state) => state.credentials
  );
  const { user } = useAppSelector((state) => state.auth);

  const filters = ['All', 'Production', 'Staging', 'Development'];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border">
      <div className="relative flex-1 max-w-md">
        <Input
          type="text"
          placeholder="Search by account, username, URL, or notes..."
          value={searchQuery}
          onChange={(e) => dispatch(setCredSearchQuery(e.target.value))}
          icon={<Search className="w-4 h-4 text-muted-foreground" />}
          className="h-9 text-xs"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto">
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => dispatch(setCredCategoryFilter(filter))}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === filter
                  ? 'bg-background text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {revealedSecretIds.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => dispatch(hideAllSecrets())}
            className="text-xs h-8 text-muted-foreground hover:text-foreground shrink-0"
            title="Mask all revealed passwords"
          >
            <EyeOff className="w-3.5 h-3.5 mr-1" />
            Hide All
          </Button>
        )}

        {user?.role !== 'Employee' && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => dispatch(setCreateModalType('credential'))}
            className="text-xs h-8 shrink-0 shadow-sm ml-auto"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Credential
          </Button>
        )}
      </div>
    </div>
  );
}

