import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveStage, setEnvSearchQuery } from '../../store/slices/envSlice';
import { setCreateModalType, addToast } from '../../store/slices/uiSlice';
import { EnvStage } from '../../types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Plus, Copy, FileUp, Terminal } from 'lucide-react';
import EnvBulkImportModal from './EnvBulkImportModal';

export default function EnvGroupTabs() {
  const dispatch = useAppDispatch();
  const { activeStage, searchQuery, envVariables } = useAppSelector(
    (state) => state.environments
  );
  const { activeProjectId } = useAppSelector((state) => state.project);
  const { user } = useAppSelector((state) => state.auth);

  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const stages: { id: EnvStage; label: string; count: number }[] = [
    {
      id: 'production',
      label: 'Production',
      count: envVariables.filter(
        (e) =>
          e.environment === 'production' &&
          (activeProjectId ? e.projectId === activeProjectId : true)
      ).length,
    },
    {
      id: 'staging',
      label: 'Staging',
      count: envVariables.filter(
        (e) =>
          e.environment === 'staging' &&
          (activeProjectId ? e.projectId === activeProjectId : true)
      ).length,
    },
    {
      id: 'development',
      label: 'Development',
      count: envVariables.filter(
        (e) =>
          e.environment === 'development' &&
          (activeProjectId ? e.projectId === activeProjectId : true)
      ).length,
    },
  ];

  const handleCopyDotEnv = () => {
    const currentEnvs = envVariables.filter(
      (e) =>
        e.environment === activeStage &&
        (activeProjectId ? e.projectId === activeProjectId : true)
    );

    if (currentEnvs.length === 0) {
      dispatch(
        addToast({
          title: 'No Variables',
          description: `There are no variables in ${activeStage} to copy.`,
          type: 'warning',
        })
      );
      return;
    }

    const dotEnvContent = currentEnvs
      .map((e) => `# ${e.description}\n${e.key}=${e.value}`)
      .join('\n\n');

    navigator.clipboard.writeText(dotEnvContent);
    dispatch(
      addToast({
        title: `.env.${activeStage} Copied!`,
        description: `Copied ${currentEnvs.length} environment variables formatted as .env to clipboard.`,
        type: 'success',
      })
    );
  };

  return (
    <>
      <div className="flex flex-col gap-3 bg-card p-3 rounded-2xl border border-border">
        {/* Top Stage selection & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Stage Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border/40">
            {stages.map((st) => {
              const isActive = activeStage === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => dispatch(setActiveStage(st.id))}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all select-none ${
                    isActive
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      st.id === 'production'
                        ? 'bg-red-500'
                        : st.id === 'staging'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span>{st.label}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-muted text-muted-foreground">
                    {st.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyDotEnv}
              className="text-xs h-8 gap-1.5"
              title="Copy as .env file format"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy .env</span>
            </Button>

            {user?.role !== 'Employee' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsBulkOpen(true)}
                  className="text-xs h-8 gap-1.5"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Bulk Import</span>
                </Button>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => dispatch(setCreateModalType('env'))}
                  className="text-xs h-8 gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Variable</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Input
            type="text"
            placeholder={`Filter ${activeStage} variables by key or description...`}
            value={searchQuery}
            onChange={(e) => dispatch(setEnvSearchQuery(e.target.value))}
            icon={<Search className="w-4 h-4 text-muted-foreground" />}
            className="h-8 text-xs"
          />
        </div>
      </div>

      <EnvBulkImportModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        stage={activeStage}
      />
    </>
  );
}
