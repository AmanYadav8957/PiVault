import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedCategory } from '../../store/slices/projectSlice';
import { setCreateModalType } from '../../store/slices/uiSlice';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Plus, Filter } from 'lucide-react';

interface ProjectFilterProps {
  search: string;
  onSearchChange: (val: string) => void;
}

export default function ProjectFilter({ search, onSearchChange }: ProjectFilterProps) {
  const dispatch = useAppDispatch();
  const { selectedCategory } = useAppSelector((state) => state.project);
  const { user } = useAppSelector((state) => state.auth);

  const categories = ['All', 'Financial Technology', 'PropTech CRM', 'HealthTech & Compliance', 'Big Data & Analytics'];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Input
          type="text"
          placeholder="Search projects by name, slug or description..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<Search className="w-4 h-4 text-muted-foreground" />}
          className="h-9 text-xs"
        />
      </div>

      {/* Categories & Actions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        <div className="flex items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => dispatch(setSelectedCategory(cat))}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {user?.role !== 'Employee' && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => dispatch(setCreateModalType('project'))}
            className="text-xs h-8 ml-auto shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Project
          </Button>
        )}
      </div>
    </div>
  );
}
