import React, { useState } from 'react';
import { EnvVariable } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleRevealEnv, deleteEnvVariable } from '../../store/slices/envSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit2,
  Trash2,
  Lock,
} from 'lucide-react';
import EnvEditorModal from './EnvEditorModal';

export default function EnvTable() {
  const dispatch = useAppDispatch();
  const { envVariables, activeStage, revealedEnvIds, searchQuery } = useAppSelector(
    (state) => state.environments
  );
  const { projects, activeProjectId } = useAppSelector((state) => state.project);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingEnv, setEditingEnv] = useState<EnvVariable | null>(null);

  const filteredEnvs = envVariables.filter((e) => {
    const matchesStage = e.environment === activeStage;
    const matchesProject = activeProjectId ? e.projectId === activeProjectId : true;
    const matchesSearch =
      e.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.value.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStage && matchesProject && matchesSearch;
  });

  const handleCopy = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    dispatch(
      addToast({
        title: 'Copied',
        description: `Copied ${label} to clipboard.`,
        type: 'success',
      })
    );
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleDelete = (id: string, key: string) => {
    if (confirm(`Remove environment variable ${key}?`)) {
      dispatch(deleteEnvVariable(id));
      dispatch(
        addToast({
          title: 'Variable Removed',
          description: `${key} was deleted from ${activeStage}.`,
          type: 'warning',
        })
      );
    }
  };

  return (
    <>
      <Card className="overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Variable Key</th>
                {!activeProjectId && <th className="py-3 px-4">Project</th>}
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-normal">
              {filteredEnvs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground text-xs">
                    No environment variables defined for {activeStage} in current scope.
                  </td>
                </tr>
              ) : (
                filteredEnvs.map((env) => {
                  const isRevealed = revealedEnvIds.includes(env.id);
                  const isCopied = copiedKey === env.id;
                  const project = projects.find((p) => p.id === env.projectId);

                  return (
                    <tr key={env.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group">
                      {/* Key */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-xs text-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded select-all">
                            {env.key}
                          </span>
                          <button
                            onClick={() => handleCopy(env.key, `${env.id}-key`, env.key)}
                            className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Copy key"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Project */}
                      {!activeProjectId && (
                        <td className="py-3 px-4">
                          <span className="text-xs text-foreground font-medium">
                            {project ? project.name : 'Unknown'}
                          </span>
                        </td>
                      )}

                      {/* Value */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 max-w-sm">
                          <div className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-border font-mono text-xs text-foreground truncate select-all flex-1">
                            {env.isSecret && !isRevealed ? '••••••••••••••••••••' : env.value}
                          </div>

                          {env.isSecret && (
                            <button
                              type="button"
                              onClick={() => dispatch(toggleRevealEnv(env.id))}
                              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
                              title={isRevealed ? 'Hide Value' : 'Reveal Value'}
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleCopy(env.value, env.id, env.key)}
                            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
                            title="Copy Value"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs truncate">
                        {env.description}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-4">
                        {env.isSecret ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-purple-50 text-purple-600 dark:bg-purple-950/40 inline-flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            Secret
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 dark:bg-slate-800">
                            Config
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        {currentUser?.role !== 'Employee' ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditingEnv(env)}
                              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                              title="Edit Variable"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(env.id, env.key)}
                              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                              title="Delete Variable"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground italic">Read-only</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Env Modal */}
      {editingEnv && (
        <EnvEditorModal
          isOpen={!!editingEnv}
          onClose={() => setEditingEnv(null)}
          initialEnv={editingEnv}
        />
      )}
    </>
  );
}
