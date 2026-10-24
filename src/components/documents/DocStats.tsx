import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { Card } from '../ui/card';
import { BookOpenText, UploadCloud, FileText, Layers } from 'lucide-react';

export default function DocStats() {
  const { documents } = useAppSelector((state) => state.documents);
  const { activeProjectId, projects } = useAppSelector((state) => state.project);

  const scoped = activeProjectId
    ? documents.filter((d) => d.projectId === activeProjectId)
    : documents;

  const uploadedCount = scoped.filter((d) => d.isUploaded || d.category === 'Uploaded File').length;
  const writtenCount = scoped.filter((d) => !d.isUploaded && d.category !== 'Uploaded File').length;
  const projectsCovered = new Set(scoped.map((d) => d.projectId)).size;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <BookOpenText className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{scoped.length}</p>
          <p className="text-[11px] text-muted-foreground">Total Documents</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{uploadedCount}</p>
          <p className="text-[11px] text-muted-foreground">Uploaded Files</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{writtenCount}</p>
          <p className="text-[11px] text-muted-foreground">Notes & Specs</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">
            {activeProjectId ? projects.find((p) => p.id === activeProjectId)?.name.split(' ')[0] || '1' : projectsCovered}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {activeProjectId ? 'Active Project' : 'Projects Covered'}
          </p>
        </div>
      </Card>
    </div>
  );
}

