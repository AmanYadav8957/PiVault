import React, { useState } from 'react';
import { ProjectDocument } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteDocument } from '../../store/slices/documentSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  BookOpenText,
  Clock,
  Calendar,
  Copy,
  Check,
  Edit2,
  Trash2,
  Download,
  FileText,
  FileCode,
  Image as ImageIcon,
  File,
  Layers,
  ExternalLink,
} from 'lucide-react';
import DocEditorModal from './DocEditorModal';

interface DocViewerProps {
  document: ProjectDocument | null;
}

export default function DocViewer({ document: doc }: DocViewerProps) {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.project);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!doc) {
    return (
      <Card className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[450px]">
        <BookOpenText className="w-12 h-12 text-muted mb-3" />
        <h3 className="font-bold text-foreground text-base">Select a document to view</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Browse project documentation, uploaded PDFs, specifications, or notes from the list.
        </p>
      </Card>
    );
  }

  const project = projects.find((p) => p.id === doc.projectId);
  const isUploadedFile = doc.isUploaded || doc.category === 'Uploaded File';

  const handleCopyContent = () => {
    navigator.clipboard.writeText(doc.content);
    setIsCopied(true);
    dispatch(
      addToast({
        title: 'Copied Content',
        description: 'Document content copied to clipboard.',
        type: 'success',
      })
    );
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const filename = doc.fileName || `${doc.title.toLowerCase().replace(/\s+/g, '_')}.txt`;

    if (doc.fileDataUrl) {
      const a = document.createElement('a');
      a.href = doc.fileDataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create blob from content
      const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    dispatch(
      addToast({
        title: 'Download Started',
        description: `Downloading "${filename}"...`,
        type: 'info',
      })
    );
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
      dispatch(deleteDocument(doc.id));
      dispatch(
        addToast({
          title: 'Document Deleted',
          description: `${doc.title} was removed.`,
          type: 'warning',
        })
      );
    }
  };

  // Simple renderer for markdown text with code snippets
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${index}`}
              className="p-4 my-3 rounded-2xl bg-slate-950 text-indigo-200 font-mono text-xs overflow-x-auto border border-border/40 shadow-inner"
            >
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-base font-bold text-foreground mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2
            key={index}
            className="text-lg font-extrabold text-foreground mt-6 mb-2 border-b border-border/50 pb-1"
          >
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-xl font-bold text-foreground mt-4 mb-2">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="text-xs text-muted-foreground ml-4 my-1 list-disc">
            {line.replace('- ', '')}
          </li>
        );
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={index} className="text-xs text-muted-foreground leading-relaxed my-2">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  const getFileIcon = () => {
    if (doc.fileType === 'image') return <ImageIcon className="w-8 h-8 text-purple-500" />;
    if (doc.fileType === 'pdf') return <FileText className="w-8 h-8 text-red-500" />;
    if (doc.fileType === 'text') return <FileCode className="w-8 h-8 text-blue-500" />;
    return <File className="w-8 h-8 text-primary" />;
  };

  return (
    <>
      <Card className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-border/70">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={
                  isUploadedFile
                    ? 'cyan'
                    : doc.category === 'Architecture'
                    ? 'purple'
                    : doc.category === 'Security Policy'
                    ? 'destructive'
                    : 'outline'
                }
                size="sm"
              >
                {doc.category}
              </Badge>
              {project && (
                <Badge variant="outline" size="sm" className="flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {project.name}
                </Badge>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {doc.title}
            </h1>

            {/* Author info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-2">
                <img
                  src={doc.authorAvatar}
                  alt={doc.author}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-border"
                />
                <span className="font-medium text-foreground">{doc.author}</span>
              </div>

              <span>•</span>

              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Updated {doc.updatedAt}</span>
              </div>

              <span>•</span>

              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{doc.fileSize || doc.readTime}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {isUploadedFile ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadFile}
                className="text-xs h-8 gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyContent}
                className="text-xs h-8 gap-1.5"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{isCopied ? 'Copied' : 'Copy Text'}</span>
              </Button>
            )}

            {currentUser?.role !== 'Employee' && (
              <>
                {!isUploadedFile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-xs h-8 gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Button>
                )}

                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Uploaded File Showcase Box */}
        {isUploadedFile && (
          <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-background border border-border shadow-xs shrink-0">
                {getFileIcon()}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {doc.fileName || doc.title}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span>Size: {doc.fileSize || doc.readTime}</span>
                  <span>•</span>
                  <span>Project: {project?.name || 'General'}</span>
                </p>
              </div>
            </div>

            <Button
              variant="subtle"
              size="sm"
              onClick={handleDownloadFile}
              className="text-xs h-8 shrink-0"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download File
            </Button>
          </div>
        )}

        {/* Image Preview if uploaded image */}
        {isUploadedFile && doc.fileType === 'image' && doc.fileDataUrl && (
          <div className="rounded-2xl overflow-hidden border border-border bg-slate-900/50 p-2 text-center">
            <img
              src={doc.fileDataUrl}
              alt={doc.title}
              className="max-h-96 mx-auto rounded-xl object-contain shadow-sm"
            />
          </div>
        )}

        {/* Tags */}
        {doc.tags && doc.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground mr-1 font-semibold uppercase">
              Tags:
            </span>
            {doc.tags.map((t) => (
              <span
                key={t}
                className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-mono"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Document Content / Notes */}
        <div className="prose dark:prose-invert max-w-none pt-2">
          {renderFormattedContent(doc.content)}
        </div>
      </Card>

      {/* Edit Modal */}
      {isEditing && (
        <DocEditorModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          initialDoc={doc}
        />
      )}
    </>
  );
}
