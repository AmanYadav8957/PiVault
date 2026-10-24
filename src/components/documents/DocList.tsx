import React from 'react';
import { ProjectDocument } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedDocumentId } from '../../store/slices/documentSlice';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, ChevronRight, Paperclip, FileText, FileCode } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DocListProps {
  documents: ProjectDocument[];
}

export default function DocList({ documents }: DocListProps) {
  const dispatch = useAppDispatch();
  const { selectedDocumentId } = useAppSelector((state) => state.documents);
  const { projects, activeProjectId } = useAppSelector((state) => state.project);

  if (documents.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground text-xs">
        No documents or files found for the selected scope.
      </Card>
    );
  }

  const getDocBadgeVariant = (category: string, isUploaded?: boolean) => {
    if (isUploaded || category === 'Uploaded File') return 'blue';
    if (category === 'Architecture') return 'purple';
    if (category === 'Security Policy') return 'destructive';
    if (category === 'API Specification') return 'emerald';
    return 'outline';
  };

  return (
    <div className="space-y-2">
      {documents.map((doc) => {
        const isSelected = selectedDocumentId === doc.id;
        const project = projects.find((p) => p.id === doc.projectId);
        const isUploadedFile = doc.isUploaded || doc.category === 'Uploaded File';

        return (
          <div
            key={doc.id}
            onClick={() => dispatch(setSelectedDocumentId(doc.id))}
            className={cn(
              'p-4 rounded-2xl border transition-all cursor-pointer text-left group',
              isSelected
                ? 'bg-primary/10 border-primary shadow-sm'
                : 'bg-card border-border hover:bg-muted/40 hover:border-border/80'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={getDocBadgeVariant(doc.category, doc.isUploaded) as any}
                    size="sm"
                    className="text-[10px] flex items-center gap-1"
                  >
                    {isUploadedFile ? (
                      <>
                        <Paperclip className="w-2.5 h-2.5" />
                        {doc.fileName ? doc.fileName.split('.').pop()?.toUpperCase() : 'FILE'}
                      </>
                    ) : (
                      doc.category
                    )}
                  </Badge>

                  {!activeProjectId && project && (
                    <span className="text-[10px] text-muted-foreground truncate">
                      • {project.name.split(' ')[0]}
                    </span>
                  )}
                </div>

                <h4
                  className={cn(
                    'text-sm font-bold truncate transition-colors',
                    isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
                  )}
                >
                  {doc.title}
                </h4>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                  <span>{doc.author}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {isUploadedFile ? (
                      <>
                        <FileText className="w-3 h-3" />
                        {doc.fileSize || doc.readTime}
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        {doc.readTime}
                      </>
                    )}
                  </span>
                </div>
              </div>

              <ChevronRight
                className={cn(
                  'w-4 h-4 text-muted-foreground transition-transform shrink-0 mt-1',
                  isSelected ? 'text-primary translate-x-0.5' : 'group-hover:translate-x-0.5'
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
