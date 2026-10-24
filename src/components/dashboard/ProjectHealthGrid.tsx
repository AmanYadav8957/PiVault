import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setActiveProjectId } from '../../store/slices/projectSlice';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  FolderKanban,
  Users,
  KeyRound,
  FileCode2,
  BookOpenText,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function ProjectHealthGrid() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projects, activeProjectId } = useAppSelector((state) => state.project);
  const { credentials } = useAppSelector((state) => state.credentials);
  const { envVariables } = useAppSelector((state) => state.environments);
  const { documents } = useAppSelector((state) => state.documents);

  // If a single project is selected, show its subsystem navigation cards
  if (activeProjectId) {
    const project = projects.find((p) => p.id === activeProjectId);
    if (!project) return null;

    const credCount = credentials.filter((c) => c.projectId === project.id).length;
    const envCount = envVariables.filter((e) => e.projectId === project.id).length;
    const docCount = documents.filter((d) => d.projectId === project.id).length;

    const modules = [
      {
        title: 'Credentials & Secrets Vault',
        desc: `${credCount} Production & Staging Secrets Configured`,
        path: '/credentials',
        icon: KeyRound,
        iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40',
        actionText: 'Manage Vault',
      },
      {
        title: 'Environment Variables',
        desc: `${envCount} Variables Across Dev, Staging & Prod`,
        path: '/environments',
        icon: FileCode2,
        iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40',
        actionText: 'View Variables',
      },
      {
        title: 'Architecture & Specifications',
        desc: `${docCount} Documents, PRDs & Runbooks`,
        path: '/documents',
        icon: BookOpenText,
        iconBg: 'bg-blue-50 text-primary dark:bg-blue-950/40',
        actionText: 'Read Wiki',
      },
      {
        title: 'Assigned Engineering Team',
        desc: 'Review Project Leads & Contributor Access',
        path: '/users',
        icon: Users,
        iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40',
        actionText: 'Manage Members',
      },
    ];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span>{project.name} Modules & Subsystems</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">
              Active
            </span>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(setActiveProjectId(null))}
            className="text-xs text-primary"
          >
            Show All Projects
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <Card
                key={i}
                className="p-5 hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                      mod.iconBg
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                      {mod.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{mod.desc}</p>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Synced
                  </span>
                  <Button
                    size="sm"
                    variant="subtle"
                    onClick={() => navigate(mod.path)}
                    className="text-xs h-7 gap-1"
                  >
                    <span>{mod.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // When All Projects is selected
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Company Internal Projects</h3>
          <p className="text-xs text-muted-foreground">
            Select any project to scope the entire workspace
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate('/projects')}
          className="text-xs h-8"
        >
          View All Grid
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => {
          const credCount = credentials.filter((c) => c.projectId === proj.id).length;
          const envCount = envVariables.filter((e) => e.projectId === proj.id).length;
          const docCount = documents.filter((d) => d.projectId === proj.id).length;

          return (
            <Card
              key={proj.id}
              className="p-5 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary dark:bg-blue-950/40 flex items-center justify-center">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                        {proj.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">{proj.category}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                  {proj.description}
                </p>

                {/* Subsystem counts */}
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

              <div className="pt-3 mt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <img
                    src={proj.leadAvatar}
                    alt={proj.leadName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>{proj.leadName}</span>
                </div>

                <Button
                  size="sm"
                  variant="subtle"
                  onClick={() => dispatch(setActiveProjectId(proj.id))}
                  className="text-xs h-7 gap-1"
                >
                  <span>Select Scope</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
