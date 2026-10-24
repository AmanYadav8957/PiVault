import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addEnvVariable, updateEnvVariable } from '../../store/slices/envSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EnvVariable, EnvStage } from '../../types';

interface EnvEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEnv?: EnvVariable | null;
}

export default function EnvEditorModal({
  isOpen,
  onClose,
  initialEnv,
}: EnvEditorModalProps) {
  const dispatch = useAppDispatch();
  const { projects, activeProjectId } = useAppSelector((state) => state.project);
  const { activeStage } = useAppSelector((state) => state.environments);

  const [projectId, setProjectId] = useState(
    initialEnv?.projectId || activeProjectId || projects[0]?.id || ''
  );
  const [environment, setEnvironment] = useState<EnvStage>(
    initialEnv?.environment || activeStage
  );
  const [key, setKey] = useState(initialEnv?.key || '');
  const [value, setValue] = useState(initialEnv?.value || '');
  const [isSecret, setIsSecret] = useState(initialEnv?.isSecret ?? true);
  const [description, setDescription] = useState(initialEnv?.description || '');

  React.useEffect(() => {
    if (initialEnv) {
      setProjectId(initialEnv.projectId);
      setEnvironment(initialEnv.environment);
      setKey(initialEnv.key);
      setValue(initialEnv.value);
      setIsSecret(initialEnv.isSecret);
      setDescription(initialEnv.description);
    } else {
      setProjectId(activeProjectId || projects[0]?.id || '');
      setEnvironment(activeStage);
      setKey('');
      setValue('');
      setIsSecret(true);
      setDescription('');
    }
  }, [initialEnv, activeProjectId, activeStage, projects, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !value.trim() || !projectId) return;

    if (initialEnv) {
      dispatch(
        updateEnvVariable({
          id: initialEnv.id,
          key: key.trim().toUpperCase(),
          value: value.trim(),
          isSecret,
          description: description.trim() || 'Environment parameter',
          environment,
        })
      );
      dispatch(
        addToast({
          title: 'Variable Updated',
          description: `${key.toUpperCase()} has been saved.`,
          type: 'success',
        })
      );
    } else {
      dispatch(
        addEnvVariable({
          projectId,
          environment,
          key: key.trim().toUpperCase(),
          value: value.trim(),
          isSecret,
          description: description.trim() || 'Environment parameter',
        })
      );
      dispatch(
        addToast({
          title: 'Variable Created',
          description: `${key.toUpperCase()} has been added to ${environment}.`,
          type: 'success',
        })
      );
    }

    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialEnv ? 'Edit Environment Variable' : 'New Environment Variable'}
      description="Configure environment parameter or runtime secret for application pods."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Project *</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full h-9 rounded-xl border border-border bg-white dark:bg-slate-900 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              required
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Stage *</label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as EnvStage)}
              className="w-full h-9 rounded-xl border border-border bg-white dark:bg-slate-900 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            >
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Key Name *</label>
          <Input
            type="text"
            placeholder="e.g. DATABASE_URL or API_KEY"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            className="font-mono"
            required
            autoFocus
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Value *</label>
          <Input
            type="text"
            placeholder="Parameter value or secret token"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="font-mono text-xs"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Description</label>
          <Input
            type="text"
            placeholder="What this variable is used for"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isSecret}
              onChange={(e) => setIsSecret(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary w-4 h-4"
            />
            <span className="font-medium text-foreground">
              Treat as sensitive secret (masked by default)
            </span>
          </label>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} className="h-8 text-xs">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" className="h-8 text-xs">
            {initialEnv ? 'Save Changes' : 'Create Variable'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
