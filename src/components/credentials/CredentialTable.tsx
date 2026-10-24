import React, { useState } from 'react';
import { CredentialItem } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  toggleRevealSecret,
  updateCredential,
  deleteCredential,
} from '../../store/slices/credentialSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Pencil,
  Sparkles,
  Lock,
  Globe,
  User,
} from 'lucide-react';
import { Dialog } from '../ui/dialog';

export default function CredentialTable() {
  const dispatch = useAppDispatch();
  const { credentials, revealedSecretIds, searchQuery, categoryFilter } = useAppSelector(
    (state) => state.credentials
  );
  const { projects, activeProjectId } = useAppSelector((state) => state.project);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inspectCred, setInspectCred] = useState<CredentialItem | null>(null);
  const [editingCred, setEditingCred] = useState<CredentialItem | null>(null);

  // Edit form states
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editSecretValue, setEditSecretValue] = useState('');
  const [editEndpoint, setEditEndpoint] = useState('');
  const [editEnvironment, setEditEnvironment] = useState<'Production' | 'Staging' | 'Development'>('Production');
  const [editProjectId, setEditProjectId] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);

  const filteredCreds = credentials.filter((c) => {
    const matchesProject = activeProjectId ? c.projectId === activeProjectId : true;
    const matchesCategory =
      categoryFilter === 'All' ||
      c.environment === categoryFilter ||
      c.category === categoryFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.service && c.service.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.endpoint && c.endpoint.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.username && c.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesProject && matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    dispatch(
      addToast({
        title: `${label} Copied`,
        description: `Copied to clipboard.`,
        type: 'success',
      })
    );
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name} from your vault?`)) {
      dispatch(deleteCredential(id));
      if (inspectCred?.id === id) setInspectCred(null);
      if (editingCred?.id === id) setEditingCred(null);
      dispatch(
        addToast({
          title: 'Credential Deleted',
          description: `${name} has been removed from the vault.`,
          type: 'warning',
        })
      );
    }
  };

  const handleStartEdit = (cred: CredentialItem) => {
    setEditingCred(cred);
    setEditName(cred.name);
    setEditUsername(cred.username || '');
    setEditSecretValue(cred.secretValue);
    setEditEndpoint(cred.endpoint || '');
    setEditEnvironment(cred.environment);
    setEditProjectId(cred.projectId);
    setEditNotes(cred.notes || '');
    setShowEditPassword(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCred || !editName.trim() || !editSecretValue.trim() || !editProjectId) return;

    dispatch(
      updateCredential({
        id: editingCred.id,
        name: editName.trim(),
        service: editName.trim(),
        username: editUsername.trim() || undefined,
        secretValue: editSecretValue.trim(),
        endpoint: editEndpoint.trim() || undefined,
        environment: editEnvironment,
        projectId: editProjectId,
        notes: editNotes.trim() || undefined,
        updatedBy: currentUser?.name || 'Admin',
      })
    );

    dispatch(
      addToast({
        title: 'Credential Updated',
        description: `${editName.trim()} has been updated successfully.`,
        type: 'success',
      })
    );

    // If inspect dialog was open for this cred, update it too
    if (inspectCred?.id === editingCred.id) {
      setInspectCred({
        ...inspectCred,
        name: editName.trim(),
        service: editName.trim(),
        username: editUsername.trim() || undefined,
        secretValue: editSecretValue.trim(),
        endpoint: editEndpoint.trim() || undefined,
        environment: editEnvironment,
        projectId: editProjectId,
        notes: editNotes.trim() || undefined,
        updatedBy: currentUser?.name || 'Admin',
        updatedAt: new Date().toISOString().split('T')[0],
      });
    }

    setEditingCred(null);
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~';
    let pass = '';
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setEditSecretValue(pass);
    setShowEditPassword(true);
    dispatch(
      addToast({
        title: 'Password Generated',
        description: 'A 16-character strong password has been generated.',
        type: 'info',
      })
    );
  };

  return (
    <>
      <Card className="overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Account / Service</th>
                <th className="py-3 px-4">Username / Email</th>
                <th className="py-3 px-4">Password</th>
                {!activeProjectId && <th className="py-3 px-4">Project</th>}
                <th className="py-3 px-4">Environment</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-normal">
              {filteredCreds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground text-xs">
                    No credentials stored in vault for the current search or scope.
                  </td>
                </tr>
              ) : (
                filteredCreds.map((cred) => {
                  const isRevealed = revealedSecretIds.includes(cred.id);
                  const isUserCopied = copiedKey === `user-${cred.id}`;
                  const isPassCopied = copiedKey === `pass-${cred.id}`;
                  const project = projects.find((p) => p.id === cred.projectId);

                  const hasValidUrl =
                    cred.endpoint &&
                    (cred.endpoint.startsWith('http://') || cred.endpoint.startsWith('https://'));

                  return (
                    <tr
                      key={cred.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Account & Service */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            {cred.endpoint ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <button
                              onClick={() => setInspectCred(cred)}
                              className="font-semibold text-foreground text-xs hover:text-primary transition-colors text-left truncate block max-w-[200px]"
                              title={cred.name}
                            >
                              {cred.name}
                            </button>
                            {cred.endpoint && (
                              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                {hasValidUrl ? (
                                  <a
                                    href={cred.endpoint}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-primary flex items-center gap-1 truncate max-w-[180px]"
                                    title={`Open ${cred.endpoint}`}
                                  >
                                    <span className="truncate">{cred.endpoint.replace(/^https?:\/\//, '')}</span>
                                    <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                                  </a>
                                ) : (
                                  <span className="truncate max-w-[180px] font-mono text-[10px]" title={cred.endpoint}>
                                    {cred.endpoint}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Username / Email */}
                      <td className="py-3 px-4">
                        {cred.username ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs text-foreground truncate max-w-[180px]">
                              {cred.username}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(cred.username!, `user-${cred.id}`, 'Username')}
                              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
                              title="Copy Username"
                            >
                              {isUserCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">—</span>
                        )}
                      </td>

                      {/* Password / Secret */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <div className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs text-foreground truncate max-w-[160px] select-all">
                            {isRevealed ? cred.secretValue : '••••••••••••'}
                          </div>

                          <button
                            type="button"
                            onClick={() => dispatch(toggleRevealSecret(cred.id))}
                            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
                            title={isRevealed ? 'Hide Password' : 'Show Password'}
                          >
                            {isRevealed ? (
                              <EyeOff className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopy(cred.secretValue, `pass-${cred.id}`, 'Password')}
                            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
                            title="Copy Password"
                          >
                            {isPassCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Project */}
                      {!activeProjectId && (
                        <td className="py-3 px-4">
                          <span className="text-xs text-foreground font-medium px-2 py-0.5 rounded-md bg-muted/50">
                            {project ? project.name : 'Unknown'}
                          </span>
                        </td>
                      )}

                      {/* Environment */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            cred.environment === 'Production'
                              ? 'bg-red-50 text-red-600 dark:bg-red-950/40'
                              : cred.environment === 'Staging'
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                          }`}
                        >
                          {cred.environment}
                        </span>
                      </td>

                      {/* Notes */}
                      <td className="py-3 px-4">
                        <span className="text-xs text-muted-foreground truncate block max-w-[180px]">
                          {cred.notes || '—'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setInspectCred(cred)}
                            className="text-xs h-7 text-muted-foreground hover:text-foreground"
                          >
                            View
                          </Button>

                          <button
                            type="button"
                            onClick={() => handleStartEdit(cred)}
                            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Credential"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {currentUser?.role !== 'Employee' && (
                            <button
                              type="button"
                              onClick={() => handleDelete(cred.id, cred.name)}
                              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                              title="Delete Credential"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspect / View Details Modal */}
      {inspectCred && (
        <Dialog
          isOpen={!!inspectCred}
          onClose={() => setInspectCred(null)}
          title={inspectCred.name}
          description="Stored account login and access details"
          maxWidth="md"
        >
          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2.5 text-xs">
              {/* Username */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Username / Email:
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-medium text-foreground">
                    {inspectCred.username || 'Not set'}
                  </span>
                  {inspectCred.username && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(inspectCred.username!, 'inspect-user', 'Username')}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      title="Copy Username"
                    >
                      {copiedKey === 'inspect-user' ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Password:
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-medium text-foreground px-2 py-0.5 rounded bg-background">
                    {revealedSecretIds.includes(inspectCred.id)
                      ? inspectCred.secretValue
                      : '••••••••••••'}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => dispatch(toggleRevealSecret(inspectCred.id))}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    title={
                      revealedSecretIds.includes(inspectCred.id)
                        ? 'Hide Password'
                        : 'Show Password'
                    }
                  >
                    {revealedSecretIds.includes(inspectCred.id) ? (
                      <EyeOff className="w-3 h-3 text-primary" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(inspectCred.secretValue, 'inspect-pass', 'Password')}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    title="Copy Password"
                  >
                    {copiedKey === 'inspect-pass' ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Website / URL */}
              {inspectCred.endpoint && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Website / URL:
                  </span>
                  <div className="flex items-center gap-1 max-w-[240px]">
                    <a
                      href={
                        inspectCred.endpoint.startsWith('http')
                          ? inspectCred.endpoint
                          : `https://${inspectCred.endpoint}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-primary hover:underline truncate"
                    >
                      {inspectCred.endpoint}
                    </a>
                    <ExternalLink className="w-3 h-3 text-primary shrink-0" />
                  </div>
                </div>
              )}

              {/* Environment */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Environment:</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    inspectCred.environment === 'Production'
                      ? 'bg-red-50 text-red-600 dark:bg-red-950/40'
                      : inspectCred.environment === 'Staging'
                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                      : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                  }`}
                >
                  {inspectCred.environment}
                </span>
              </div>

              {/* Project */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Project:</span>
                <span className="font-medium text-foreground">
                  {projects.find((p) => p.id === inspectCred.projectId)?.name || 'Unknown'}
                </span>
              </div>

              {/* Last Updated */}
              <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
                <span>Last updated</span>
                <span>
                  {inspectCred.updatedAt} by {inspectCred.updatedBy}
                </span>
              </div>
            </div>

            {/* Notes */}
            {inspectCred.notes && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Notes</label>
                <p className="text-xs text-muted-foreground p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 leading-relaxed whitespace-pre-wrap">
                  {inspectCred.notes}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <Button
                variant="subtle"
                size="sm"
                onClick={() => {
                  const target = inspectCred;
                  setInspectCred(null);
                  handleStartEdit(target);
                }}
                className="h-8 text-xs"
              >
                <Pencil className="w-3 h-3 mr-1.5" />
                Edit Credential
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setInspectCred(null)}
                className="h-8 text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Edit Credential Modal */}
      {editingCred && (
        <Dialog
          isOpen={!!editingCred}
          onClose={() => setEditingCred(null)}
          title="Edit Credential"
          description="Update username, password, or minor account details."
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Account / Service *</label>
                <Input
                  type="text"
                  placeholder="e.g. AWS Console, GitHub, Postgres"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Project *</label>
                <select
                  value={editProjectId}
                  onChange={(e) => setEditProjectId(e.target.value)}
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
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Environment</label>
                <select
                  value={editEnvironment}
                  onChange={(e) =>
                    setEditEnvironment(e.target.value as 'Production' | 'Staging' | 'Development')
                  }
                  className="w-full h-9 rounded-xl border border-border bg-white dark:bg-slate-900 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                </select>
              </div>
            </div>

            {/* Password with generator & toggle */}
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
                  type={showEditPassword ? 'text' : 'password'}
                  placeholder="Enter password or secret"
                  value={editSecretValue}
                  onChange={(e) => setEditSecretValue(e.target.value)}
                  className="font-mono text-xs pr-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  title={showEditPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Website / URL */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Website / URL / Host (Optional)</label>
              <Input
                type="text"
                placeholder="e.g. https://console.aws.amazon.com or db.internal:5432"
                value={editEndpoint}
                onChange={(e) => setEditEndpoint(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. 2FA configured on office phone, hardware token required..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full rounded-xl border border-border bg-white dark:bg-slate-900 p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
              />
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditingCred(null)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="h-8 text-xs">
                Save Changes
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
}
