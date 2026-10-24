import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { createProjectAsync } from '../../store/slices/projectSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Link as LinkIcon, Loader2 } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Financial Technology');
  const [repoUrl, setRepoUrl] = useState('');
  const [leadName, setLeadName] = useState('Aman Sharma');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Financial Technology',
    'PropTech CRM',
    'HealthTech & Compliance',
    'Big Data & Analytics',
    'AI & Automation',
    'Infrastructure & Cloud',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setIsSubmitting(true);

    try {
      await dispatch(
        createProjectAsync({
          name: name.trim(),
          slug,
          description: description.trim() || 'Internal service infrastructure component.',
          category,
          status: 'active',
          leadName,
          leadAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          repoUrl: repoUrl.trim() || `https://github.com/company/${slug}`,
          color: 'from-blue-500 to-indigo-600',
        })
      ).unwrap();

      dispatch(
        addToast({
          title: 'Project Initialized',
          description: `${name} has been added and saved to database.`,
          type: 'success',
        })
      );

      onClose();
      setName('');
      setDescription('');
      setRepoUrl('');
    } catch (err: any) {
      dispatch(
        addToast({
          title: 'Failed to Create Project',
          description: err || 'Server error occurred.',
          type: 'error',
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Internal Project"
      description="Add a new repository, microservice, or product portal to the directory."
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Project Name *</label>
          <Input
            type="text"
            placeholder="e.g. Identity & OAuth Service"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Domain / Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-9 rounded-xl border border-border bg-white dark:bg-slate-900 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Description</label>
          <textarea
            rows={3}
            placeholder="Brief technical or business summary of this project..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-border bg-white dark:bg-slate-900 p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Git Repository URL</label>
          <Input
            type="url"
            placeholder="https://github.com/company/repo-name"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            icon={<LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />}
          />
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting} className="h-8 text-xs">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} className="h-8 text-xs gap-1.5">
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
