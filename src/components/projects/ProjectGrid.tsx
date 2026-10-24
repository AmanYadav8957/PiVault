import React from 'react';
import { Project } from '../../types';
import ProjectCard from './ProjectCard';
import { FolderKanban } from 'lucide-react';

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-border bg-card/50">
        <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground mx-auto flex items-center justify-center mb-3">
          <FolderKanban className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-foreground">No projects match the criteria</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          Try adjusting your search terms or selecting another category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {projects.map((proj) => (
        <ProjectCard key={proj.id} project={proj} />
      ))}
    </div>
  );
}
