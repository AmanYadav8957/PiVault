import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addCredential } from '../../store/slices/credentialSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

interface AddCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCredentialModal({ isOpen, onClose }: AddCredentialModalProps) {
  const dispatch = useAppDispatch();
  const { projects, activeProjectId } = useAppSelector((state) => state.project);
  const { user } = useAppSelector((state) => state.auth);

  const [projectId, setProjectId] = useState(activeProjectId || projects[0]?.id || '');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [secretValue, setSecretValue] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [environment, setEnvironment] = useState<'Production' | 'Staging' | 'Development'>('Production');
  const [notes, setNotes] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (activeProjectId) {
        setProjectId(activeProjectId);
      } else if (projects.length > 0) {
        setProjectId(projects[0].id);
      }
    }
  }, [isOpen, activeProjectId, projects]);

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~';
    let pass = '';
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSecretValue(pass);
    setShowPassword(true);
    dispatch(
      addToast({
        title: 'Strong Password Generated',
        description: 'A 16-character secure password has been generated.',
        type: 'info',
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !secretValue.trim() || !projectId) return;

    dispatch(
      addCredential({
        projectId,
        name: name.trim(),
        service: name.trim(),
        category: 'Web Login',
        environment,
        username: username.trim() || undefined,
        secretValue: secretValue.trim(),
        endpoint: endpoint.trim() || undefined,
        notes: notes.trim() || undefined,
        updatedBy: user?.name || 'Admin',
      })
    );

    dispatch(
      addToast({
        title: 'Credential Saved',
        description: `${name.trim()} has been saved to your vault.`,
        type: 'success',
      })
    );

    onClose();
    setName('');
    setUsername('');
    setSecretValue('');
    setEndpoint('');
    setNotes('');
    setShowPassword(false);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Credential"
      description="Store account login credentials and access details securely."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Account / Service *</label>
            <Input
              type="text"
              placeholder="e.g. AWS Console, GitHub, Postgres"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Target Project *</label>
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
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Username / Email</label>
            <Input
              type="text"
              placeholder="e.g. admin@company.com or master_usr"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Environment</label>
            <select
              value={environment}
              onChange={(e) =>
                setEnvironment(e.target.value as 'Production' | 'Staging' | 'Development')
              }
              className="w-full h-9 rounded-xl border border-border bg-white dark:bg-slate-900 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            >
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
              <option value="Development">Development</option>
            </select>
          </div>
        </div>

        {/* Password field with generator */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">Password / Secret *</label>
            <button
              type="button"
              onClick={generatePassword}
              className="text-[11px] text-primary hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Generate Strong Password
            </button>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password or key"
              value={secretValue}
              onChange={(e) => setSecretValue(e.target.value)}
              className="font-mono text-xs pr-9"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Website / URL */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Website / URL / Host (Optional)</label>
          <Input
            type="text"
            placeholder="e.g. https://console.aws.amazon.com or db.internal:5432"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="font-mono text-xs"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Notes / Minor Details (Optional)</label>
          <textarea
            rows={2}
            placeholder="e.g. 2FA configured with authenticator app, backup code stored in safe..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-border bg-white dark:bg-slate-900 p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
          />
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} className="h-8 text-xs">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" className="h-8 text-xs">
            Save Credential
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
