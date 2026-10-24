import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { Card } from '../ui/card';
import {
  FolderKanban,
  Users,
  KeyRound,
  FileCode2,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function DashboardMetrics() {
  const { projects, activeProjectId } = useAppSelector((state) => state.project);
  const { users } = useAppSelector((state) => state.users);
  const { credentials } = useAppSelector((state) => state.credentials);
  const { envVariables } = useAppSelector((state) => state.environments);

  const displayProjectsCount = activeProjectId ? 1 : projects.length;

  const displayUsersCount = activeProjectId
    ? users.filter((u) => u.assignedProjectIds.includes(activeProjectId)).length
    : users.length;

  const displayCredsCount = activeProjectId
    ? credentials.filter((c) => c.projectId === activeProjectId).length
    : credentials.length;

  const displayEnvsCount = activeProjectId
    ? envVariables.filter((e) => e.projectId === activeProjectId).length
    : envVariables.length;

  const metrics = [
    {
      title: activeProjectId ? 'Project Status' : 'Total Projects',
      value: activeProjectId ? 'Active' : displayProjectsCount,
      subtitle: activeProjectId ? 'Production Ready' : 'Across 4 Domains',
      icon: FolderKanban,
      iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-primary',
    },
    {
      title: activeProjectId ? 'Assigned Team' : 'Active Engineers',
      value: displayUsersCount,
      subtitle: activeProjectId ? 'Engineers Assigned' : 'Company-wide Team',
      icon: Users,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600',
    },
    {
      title: 'Stored Credentials',
      value: displayCredsCount,
      subtitle: activeProjectId ? 'In this vault' : 'Total enterprise secrets',
      icon: KeyRound,
      iconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600',
    },
    {
      title: 'Environment Variables',
      value: displayEnvsCount,
      subtitle: 'Dev, Staging & Prod',
      icon: FileCode2,
      iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card
            key={idx}
            className="p-5 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {item.title}
                </p>
                <p className="text-2xl font-bold text-foreground tracking-tight">
                  {item.value}
                </p>
                <p className="text-[11px] text-muted-foreground">{item.subtitle}</p>
              </div>

              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  item.iconBg
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
