import React from 'react';
import { Project } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveProjectId, deleteProjectAsync } from '../../store/slices/projectSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  FolderKanban,
  Check,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const dispatch = useAppDispatch();
  const { activeProjectId } = useAppSelector((state) => state.project);
  const { user } = useAppSelector((state) => state.auth);
  const { credentials } = useAppSelector((state) => state.credentials);
  const { envVariables } = useAppSelector((state) => state.environments);
  const { documents } = useAppSelector((state) => state.documents);

  const isCurrentScope = activeProjectId === project.id;

  const credCount = credentials.filter((c) => c.projectId === project.id).length;
  const envCount = envVariables.filter((e) => e.projectId === project.id).length;
  const docCount = documents.filter((d) => d.projectId === project.id).length;

  const handleSelectScope = () => {
    dispatch(setActiveProjectId(project.id));
    dispatch(
      addToast({
        title: `Switched Scope to ${project.name}`,
        description: 'All pages are now scoped to this project.',
        type: 'info',
      })
    );
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${project.name}? This will permanently cascade-delete all its credentials, env variables, and documents.`)) {
      try {
        await dispatch(deleteProjectAsync(project.id)).unwrap();
        dispatch(
          addToast({
            title: 'Project Deleted',
            description: `${project.name} was removed from database.`,
            type: 'warning',
          })
        );
      } catch (err: any) {
        dispatch(
          addToast({
            title: 'Failed to Delete Project',
            description: err || 'Permission denied or server error.',
            type: 'error',
          })
        );
      }
    }
  };

  return (
    <Card
      className={cn(
        'p-5 hover:shadow-sm transition-all flex flex-col justify-between group',
        isCurrentScope ? 'ring-1 ring-primary border-primary bg-blue-50/20 dark:bg-blue-950/20' : ''
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary dark:bg-blue-950/40 flex items-center justify-center shrink-0">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-[11px] text-muted-foreground">{project.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isCurrentScope && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-primary font-semibold">
                Active
              </span>
            )}
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold capitalize">
              {project.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">
          {project.description}
        </p>

        {/* Inline Stats without noisy boxes */}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span>
            <strong className="text-foreground">{credCount}</strong> Secrets
          </span>
          <span>•</span>
          <span>
            <strong className="text-foreground">{envCount}</strong> Envs
          </span>
          <span>•</span>
          <span>
            <strong className="text-foreground">{docCount}</strong> Docs
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 mt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={project.leadAvatar}
            alt={project.leadName}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-border"
          />
          <span className="text-xs text-muted-foreground">{project.leadName}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {user?.role === 'Super Admin' && (
            <button
              onClick={handleDelete}
              className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <Button
            size="sm"
            variant={isCurrentScope ? 'primary' : 'outline'}
            onClick={handleSelectScope}
            className="text-xs h-7 gap-1"
          >
            {isCurrentScope ? (
              <>
                <Check className="w-3 h-3" />
                <span>Selected</span>
              </>
            ) : (
              <>
                <span>Select Scope</span>
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
