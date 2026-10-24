import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setDocSearchQuery, setDocCategoryFilter } from '../../store/slices/documentSlice';
import { setCreateModalType } from '../../store/slices/uiSlice';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Plus, UploadCloud } from 'lucide-react';

export default function DocFilter() {
  const dispatch = useAppDispatch();
  const { searchQuery, categoryFilter } = useAppSelector((state) => state.documents);
  const { user } = useAppSelector((state) => state.auth);

  const categories = [
    'All',
    'Uploaded Files',
    'Architecture',
    'API Specification',
    'Deployment Guide',
    'Security Policy',
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border">
      <div className="relative flex-1 max-w-md">
        <Input
          type="text"
          placeholder="Search documents, uploaded file names, or tags..."
          value={searchQuery}
          onChange={(e) => dispatch(setDocSearchQuery(e.target.value))}
          icon={<Search className="w-4 h-4 text-muted-foreground" />}
          className="h-9 text-xs"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto">
        <div className="flex items-center gap-1">
          {categories.map((cat) => {
            const isActive =
              categoryFilter === cat ||
              (cat === 'Uploaded Files' && categoryFilter === 'Uploaded File');

            return (
              <button
                key={cat}
                onClick={() =>
                  dispatch(setDocCategoryFilter(cat === 'Uploaded Files' ? 'Uploaded File' : cat))
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {user?.role !== 'Employee' && (
          <div className="flex items-center gap-1.5 ml-auto shrink-0">
            <Button
              size="sm"
              variant="subtle"
              onClick={() => dispatch(setCreateModalType('upload_doc'))}
              className="text-xs h-8 shadow-xs"
            >
              <UploadCloud className="w-3.5 h-3.5 mr-1" />
              Upload Doc
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={() => dispatch(setCreateModalType('doc'))}
              className="text-xs h-8 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Doc
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

