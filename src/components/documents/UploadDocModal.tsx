import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addDocument } from '../../store/slices/documentSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  UploadCloud,
  File,
  FileText,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Layers,
} from 'lucide-react';
import { DocumentCategory } from '../../types';

interface UploadDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export default function UploadDocModal({
  isOpen,
  onClose,
  defaultProjectId,
}: UploadDocModalProps) {
  const dispatch = useAppDispatch();
  const { projects, activeProjectId } = useAppSelector((state) => state.project);
  const { user } = useAppSelector((state) => state.auth);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [projectId, setProjectId] = useState(
    defaultProjectId || activeProjectId || projects[0]?.id || ''
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Uploaded File');
  const [tagsStr, setTagsStr] = useState('');
  const [description, setDescription] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileTextContent, setFileTextContent] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (defaultProjectId) {
        setProjectId(defaultProjectId);
      } else if (activeProjectId) {
        setProjectId(activeProjectId);
      } else if (projects.length > 0) {
        setProjectId(projects[0].id);
      }
    }
  }, [isOpen, defaultProjectId, activeProjectId, projects]);

  const detectFileType = (
    fileName: string
  ): 'pdf' | 'image' | 'text' | 'archive' | 'sheet' | 'doc' | 'other' => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return 'pdf';
    if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext)) return 'image';
    if (['md', 'txt', 'json', 'yaml', 'yml', 'sql', 'js', 'ts', 'tsx'].includes(ext)) return 'text';
    if (['zip', 'tar', 'gz', 'rar'].includes(ext)) return 'archive';
    if (['csv', 'xlsx', 'xls'].includes(ext)) return 'sheet';
    if (['doc', 'docx'].includes(ext)) return 'doc';
    return 'other';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileProcess = (file: File) => {
    setSelectedFile(file);
    setIsReading(true);

    // Clean title from filename
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const formattedTitle = cleanName
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setTitle(formattedTitle);

    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
    setTagsStr(`${ext}, Upload`);

    // Read Data URL for preview and downloading
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileDataUrl((e.target?.result as string) || '');
      setIsReading(false);
    };
    reader.readAsDataURL(file);

    // If text/markdown, also read text content
    const extLower = file.name.split('.').pop()?.toLowerCase();
    if (['md', 'txt', 'json', 'yaml', 'yml', 'sql', 'csv'].includes(extLower || '')) {
      const textReader = new FileReader();
      textReader.onload = (e) => {
        setFileTextContent((e.target?.result as string) || '');
      };
      textReader.readAsText(file);
    } else {
      setFileTextContent('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setFileDataUrl('');
    setFileTextContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title.trim() || !projectId) return;

    const fileType = detectFileType(selectedFile.name);
    const sizeStr = formatFileSize(selectedFile.size);
    const targetProject = projects.find((p) => p.id === projectId);

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const contentPayload =
      fileTextContent ||
      description.trim() ||
      `# ${title.trim()}\n\nUploaded file: **${selectedFile.name}** (${sizeStr})\nProject: ${
        targetProject?.name || 'General'
      }\nUploaded by: ${user?.name || 'Admin'}`;

    dispatch(
      addDocument({
        projectId,
        title: title.trim(),
        category,
        author: user?.name || 'Aman Sharma',
        authorAvatar:
          user?.avatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        readTime: sizeStr,
        tags: tags.length > 0 ? tags : ['Uploaded', selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE'],
        content: contentPayload,
        fileName: selectedFile.name,
        fileSize: sizeStr,
        fileType,
        fileDataUrl,
        isUploaded: true,
      })
    );

    dispatch(
      addToast({
        title: 'Document Uploaded',
        description: `"${selectedFile.name}" added to ${targetProject?.name || 'project'}.`,
        type: 'success',
      })
    );

    onClose();
    // Reset state
    setSelectedFile(null);
    setTitle('');
    setTagsStr('');
    setDescription('');
    setFileDataUrl('');
    setFileTextContent('');
  };

  const getFileIcon = (fileName: string) => {
    const type = detectFileType(fileName);
    if (type === 'image') return <ImageIcon className="w-6 h-6 text-purple-500" />;
    if (type === 'pdf') return <FileText className="w-6 h-6 text-red-500" />;
    if (type === 'text') return <FileCode className="w-6 h-6 text-blue-500" />;
    return <File className="w-6 h-6 text-primary" />;
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Document"
      description="Attach documents, architecture blueprints, guides, or files project-wise."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
        {/* Project Selector */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" /> Target Project *
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full h-9 rounded-xl border border-border bg-white dark:bg-slate-900 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs font-medium"
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
            <label className="text-xs font-semibold text-foreground">Document Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full h-9 rounded-xl border border-border bg-white dark:bg-slate-900 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            >
              <option value="Uploaded File">Uploaded File</option>
              <option value="Architecture">Architecture</option>
              <option value="API Specification">API Specification</option>
              <option value="Deployment Guide">Deployment Guide</option>
              <option value="Security Policy">Security Policy</option>
              <option value="General Note">General Note</option>
            </select>
          </div>
        </div>

        {/* File Dropzone */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Select File *</label>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.md,.json,.yaml,.yml,.csv,.png,.jpg,.jpeg,.svg,.webp,.zip"
          />

          {!selectedFile ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center ${
                isDragging
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-border hover:border-primary/60 hover:bg-muted/40 bg-slate-50/50 dark:bg-slate-900/50'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                Click to browse or drag and drop your file here
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Supports PDF, Docs, Markdown, Text, Images, JSON, and CSV
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-2xl border border-primary/30 bg-primary/5 dark:bg-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-background border border-border shrink-0">
                  {getFileIcon(selectedFile.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                    <span>{formatFileSize(selectedFile.size)}</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  Change
                </Button>
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="p-1 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Document Title *</label>
          <Input
            type="text"
            placeholder="e.g. System Topology Map or API Reference"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Tags */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Tags (Optional)</label>
          <Input
            type="text"
            placeholder="e.g. PDF, Architecture, V2"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
          />
        </div>

        {/* Description / Notes */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">
            Summary / Notes (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Brief overview of what this file contains..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-border bg-white dark:bg-slate-900 p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
          />
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!selectedFile || !title.trim() || isReading}
            className="h-8 text-xs"
          >
            <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
            Upload Document
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
