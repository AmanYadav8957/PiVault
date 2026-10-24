import React, { useState, useMemo, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchProjects } from '../store/slices/projectSlice';
import ProjectStats from '../components/projects/ProjectStats';
import ProjectFilter from '../components/projects/ProjectFilter';
import ProjectGrid from '../components/projects/ProjectGrid';
import { FolderKanban, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { projects, selectedCategory, loading, error } = useAppSelector((state) => state.project);
  const [search, setSearch] = useState('');

  // Fetch live projects from backend on mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, search]);

  return (
    <div className="space-y-3">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-primary" />
            Company Projects Directory
          </h1>
          <p className="text-xs text-muted-foreground">
            All active internal microservices, client applications, and shared infrastructure platforms.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(fetchProjects())}
          disabled={loading}
          className="self-start sm:self-auto h-8 text-xs gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(fetchProjects())}
            className="h-7 text-xs"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <ProjectStats />

      {/* Filter and Search Bar */}
      <ProjectFilter search={search} onSearchChange={setSearch} />

      {/* Projects Grid */}
      <ProjectGrid projects={filteredProjects} />
    </div>
  );
}
