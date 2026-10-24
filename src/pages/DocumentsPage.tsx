import React, { useMemo } from 'react';
import DocStats from '../components/documents/DocStats';
import DocFilter from '../components/documents/DocFilter';
import DocList from '../components/documents/DocList';
import DocViewer from '../components/documents/DocViewer';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCreateModalType } from '../store/slices/uiSlice';
import { BookOpenText, Plus, UploadCloud } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function DocumentsPage() {
  const dispatch = useAppDispatch();
  const { documents, selectedDocumentId, searchQuery, categoryFilter } = useAppSelector(
    (state) => state.documents
  );
  const { activeProjectId, projects } = useAppSelector((state) => state.project);
  const { user } = useAppSelector((state) => state.auth);
  const activeProject = projects.find((p) => p.id === activeProjectId);

  const filteredDocs = useMemo(() => {
    return documents.filter((d) => {
      const matchesProject = activeProjectId ? d.projectId === activeProjectId : true;
      const matchesCategory =
        categoryFilter === 'All' ||
        d.category === categoryFilter ||
        (categoryFilter === 'Uploaded File' && (d.isUploaded || d.category === 'Uploaded File'));
      const matchesSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.fileName && d.fileName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesProject && matchesCategory && matchesSearch;
    });
  }, [documents, activeProjectId, categoryFilter, searchQuery]);

  const activeDoc = useMemo(() => {
    return filteredDocs.find((d) => d.id === selectedDocumentId) || filteredDocs[0] || null;
  }, [filteredDocs, selectedDocumentId]);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <BookOpenText className="w-5 h-5 text-primary" />
              Project Documents & Files
            </h1>
            {activeProject ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-primary dark:bg-blue-950/40">
                Scoped to: {activeProject.name}
              </span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                All Project Documents
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize specifications, notes, and uploaded files project-wise.
          </p>
        </div>

        {user?.role !== 'Employee' && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="subtle"
              onClick={() => dispatch(setCreateModalType('upload_doc'))}
              className="text-xs h-8 shadow-xs"
            >
              <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
              Upload Document
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={() => dispatch(setCreateModalType('doc'))}
              className="text-xs h-8 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Document
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      <DocStats />

      {/* Filter and Search Bar */}
      <DocFilter />

      {/* Split view: Left Doc list, Right Doc viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        <div className="lg:col-span-5 space-y-2">
          <DocList documents={filteredDocs} />
        </div>
        <div className="lg:col-span-7">
          <DocViewer document={activeDoc} />
        </div>
      </div>
    </div>
  );
}
