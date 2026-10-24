import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addDocument, updateDocument } from '../../store/slices/documentSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ProjectDocument, DocumentCategory } from '../../types';

interface DocEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: ProjectDocument | null;
}

export default function DocEditorModal({
  isOpen,
  onClose,
  initialDoc,
}: DocEditorModalProps) {
  const dispatch = useAppDispatch();
  const { projects, activeProjectId } = useAppSelector((state) => state.project);
  const { user } = useAppSelector((state) => state.auth);

  const [projectId, setProjectId] = useState(
    initialDoc?.projectId || activeProjectId || projects[0]?.id || ''
  );
  const [title, setTitle] = useState(initialDoc?.title || '');
  const [category, setCategory] = useState<DocumentCategory>(
    (initialDoc?.category as DocumentCategory) || 'Architecture'
  );
  const [tagsStr, setTagsStr] = useState(initialDoc?.tags?.join(', ') || '');
  const [content, setContent] = useState(initialDoc?.content || '');

  React.useEffect(() => {
    if (initialDoc) {
      setProjectId(initialDoc.projectId);
      setTitle(initialDoc.title);
      setCategory((initialDoc.category as DocumentCategory) || 'Architecture');
      setTagsStr(initialDoc.tags.join(', '));
      setContent(initialDoc.content);
    } else {
      setProjectId(activeProjectId || projects[0]?.id || '');
      setTitle('');
      setCategory('Architecture');
      setTagsStr('Architecture, Microservices');
      setContent(`## Overview\nDescribe the architecture or runbook details here.\n\n### Endpoints\n- GET /api/v1/resource\n\n\`\`\`json\n{\n  "status": "ok"\n}\n\`\`\``);
    }
  }, [initialDoc, activeProjectId, projects, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !projectId) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (initialDoc) {
      dispatch(
        updateDocument({
          id: initialDoc.id,
          title: title.trim(),
          category,
          tags,
          content,
        })
      );
      dispatch(
        addToast({
          title: 'Document Updated',
          description: `${title} has been saved.`,
          type: 'success',
        })
      );
    } else {
      dispatch(
        addDocument({
          projectId,
          title: title.trim(),
          category,
          author: user?.name || 'Aman Sharma',
          authorAvatar:
            user?.avatar ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          readTime: `${Math.max(2, Math.ceil(content.split(' ').length / 150))} min read`,
          tags,
          content,
        })
      );
      dispatch(
        addToast({
          title: 'Document Published',
          description: `${title} has been added to project wiki.`,
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
      title={initialDoc ? 'Edit Document' : 'Create Project Document'}
      description="Write technical specifications, API schemas, or deployment runbooks."
      maxWidth="2xl"
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
            <label className="text-xs font-semibold text-foreground">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full h-9 rounded-xl border border-border bg-white dark:bg-slate-900 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            >
              <option value="Architecture">Architecture</option>
              <option value="API Specification">API Specification</option>
              <option value="Deployment Guide">Deployment Guide</option>
              <option value="Security Policy">Security Policy</option>
              <option value="Onboarding">Onboarding</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Document Title *</label>
          <Input
            type="text"
            placeholder="e.g. Distributed Consensus & Kafka Topology"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Tags (comma-separated)</label>
          <Input
            type="text"
            placeholder="Kafka, Architecture, Microservices"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Markdown Content *</label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write documentation using Markdown syntax..."
            className="w-full rounded-xl border border-border bg-white dark:bg-slate-900 p-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            required
          />
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} className="h-8 text-xs">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" className="h-8 text-xs">
            {initialDoc ? 'Save Changes' : 'Publish Document'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
