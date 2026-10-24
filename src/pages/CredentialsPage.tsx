import React from 'react';
import CredentialStats from '../components/credentials/CredentialStats';
import CredentialFilter from '../components/credentials/CredentialFilter';
import CredentialTable from '../components/credentials/CredentialTable';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCreateModalType } from '../store/slices/uiSlice';
import { KeyRound, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function CredentialsPage() {
  const dispatch = useAppDispatch();
  const { activeProjectId, projects } = useAppSelector((state) => state.project);
  const { user } = useAppSelector((state) => state.auth);
  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              Credentials Vault
            </h1>
            {activeProject ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-primary dark:bg-blue-950/40">
                Scoped to: {activeProject.name}
              </span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                All Projects
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Store usernames, passwords, and access details for your accounts and services.
          </p>
        </div>

        {user?.role !== 'Employee' && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => dispatch(setCreateModalType('credential'))}
            className="text-xs h-8 shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Credential
          </Button>
        )}
      </div>

      {/* Stats */}
      <CredentialStats />

      {/* Filter Bar */}
      <CredentialFilter />

      {/* Vault Table */}
      <CredentialTable />
    </div>
  );
}
