import React from 'react';
import UserStats from '../components/users/UserStats';
import UserFilter from '../components/users/UserFilter';
import UserTable from '../components/users/UserTable';
import { useAppSelector } from '../store/hooks';
import { Users } from 'lucide-react';

export default function UsersPage() {
  const { activeProjectId, projects } = useAppSelector((state) => state.project);
  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Company Team & Project Assignments
            </h1>
            {activeProject && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-primary dark:bg-blue-950/40">
                Scoped to: {activeProject.name}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Manage engineers, tech leads, role permissions, and assigned project memberships.
          </p>
        </div>
      </div>

      {/* User Stats */}
      <UserStats />

      {/* Filter Bar */}
      <UserFilter />

      {/* Team Table */}
      <UserTable />
    </div>
  );
}
