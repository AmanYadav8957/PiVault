import React from 'react';
import EnvStats from '../components/environments/EnvStats';
import EnvGroupTabs from '../components/environments/EnvGroupTabs';
import EnvTable from '../components/environments/EnvTable';
import { useAppSelector } from '../store/hooks';
import { FileCode2 } from 'lucide-react';

export default function EnvironmentsPage() {
  const { activeProjectId, projects } = useAppSelector((state) => state.project);
  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-primary" />
              Environment Variables & Secrets
            </h1>
            {activeProject ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-primary dark:bg-blue-950/40">
                Scoped to: {activeProject.name}
              </span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Global Projects View
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Synchronize configuration variables, runtime secrets, and export .env files across environments.
          </p>
        </div>
      </div>

      {/* Stats */}
      <EnvStats />

      {/* Stage Group Tabs & Search */}
      <EnvGroupTabs />

      {/* Variables Table */}
      <EnvTable />
    </div>
  );
}
