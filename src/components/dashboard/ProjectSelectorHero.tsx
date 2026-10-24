import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setActiveProjectId } from '../../store/slices/projectSlice';
import { setCreateModalType } from '../../store/slices/uiSlice';
import {
  FolderKanban,
  ShieldCheck,
  KeyRound,
  FileCode2,
  ExternalLink,
  Plus,
  Layers,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export default function ProjectSelectorHero() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { projects, activeProjectId } = useAppSelector((state) => state.project);
  const { credentials } = useAppSelector((state) => state.credentials);
  const { envVariables } = useAppSelector((state) => state.environments);
  const { documents } = useAppSelector((state) => state.documents);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="rounded-2xl border border-border bg-white dark:bg-card p-6 shadow-xs transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              Role: {user?.role || 'Guest'}
            </span>

            {activeProject ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                Scope: {activeProject.name}
              </span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Scope: All Projects (Global)
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {activeProject ? activeProject.name : 'Company Projects & Vault Overview'}
          </h1>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {activeProject
              ? activeProject.description
              : 'Monitor internal microservices, configure encrypted environment variables, manage API secrets, and review documentation.'}
          </p>

          {activeProject && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <span className="text-muted-foreground">Lead:</span>
                <img
                  src={activeProject.leadAvatar}
                  alt={activeProject.leadName}
                  className="w-4 h-4 rounded-full object-cover"
                />
                {activeProject.leadName}
              </span>

              <span>•</span>

              <a
                href={activeProject.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-primary hover:underline font-mono text-xs"
              >
                <ExternalLink className="w-3 h-3" />
                Repository
              </a>

              <span>•</span>

              <button
                onClick={() => dispatch(setActiveProjectId(null))}
                className="text-xs text-primary hover:underline font-medium"
              >
                Reset to All Projects View
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap md:flex-col sm:flex-row gap-2 shrink-0">
          {user?.role !== 'Employee' ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => dispatch(setCreateModalType('credential'))}
                className="shadow-xs text-xs h-8"
              >
                <KeyRound className="w-3.5 h-3.5 mr-1.5" />
                Add Credential
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(setCreateModalType('env'))}
                className="text-xs h-8"
              >
                <FileCode2 className="w-3.5 h-3.5 mr-1.5" />
                New Env Variable
              </Button>
            </>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-muted-foreground max-w-xs">
              <p className="font-semibold text-foreground flex items-center gap-1.5 mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Employee Access Mode
              </p>
              Read-only visibility for assigned projects and masked secret keys.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
