import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { bulkImportEnvs } from '../../store/slices/envSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { EnvStage } from '../../types';

interface EnvBulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: EnvStage;
}

export default function EnvBulkImportModal({
  isOpen,
  onClose,
  stage,
}: EnvBulkImportModalProps) {
  const dispatch = useAppDispatch();
  const { projects, activeProjectId } = useAppSelector((state) => state.project);

  const [projectId, setProjectId] = useState(activeProjectId || projects[0]?.id || '');
  const [rawText, setRawText] = useState(
    '# Paste your .env file content below\nPORT=3000\nDATABASE_URL=postgresql://user:pass@host:5432/db\nAPI_SECRET_KEY=sk_test_90128312'
  );

  React.useEffect(() => {
    if (activeProjectId) {
      setProjectId(activeProjectId);
    }
  }, [activeProjectId]);

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim() || !projectId) return;

    dispatch(
      bulkImportEnvs({
        projectId,
        environment: stage,
        rawEnvText: rawText,
      })
    );

    dispatch(
      addToast({
        title: 'Variables Imported',
        description: `Parsed and synced new environment variables to ${stage}.`,
        type: 'success',
      })
    );

    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Bulk Import into ${stage.toUpperCase()}`}
      description="Paste lines from your .env file. Secrets will be automatically detected and encrypted."
      maxWidth="xl"
    >
      <form onSubmit={handleImport} className="space-y-4 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Target Project *</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full h-10 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Raw .env Key-Value Text</label>
          <textarea
            rows={8}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="w-full rounded-xl border border-border bg-muted/40 p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
        </div>

        <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Import Variables
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
