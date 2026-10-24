import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { Card } from '../ui/card';
import { FolderKanban, Activity, CheckCircle2, Archive } from 'lucide-react';

export default function ProjectStats() {
  const { projects } = useAppSelector((state) => state.project);

  const activeCount = projects.filter((p) => p.status === 'active').length;
  const inProgressCount = projects.filter((p) => p.status === 'in_progress').length;
  const maintenanceCount = projects.filter((p) => p.status === 'maintenance').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
          <FolderKanban className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{projects.length}</p>
          <p className="text-[11px] text-muted-foreground">Total Projects</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{activeCount}</p>
          <p className="text-[11px] text-muted-foreground">Production Active</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{inProgressCount}</p>
          <p className="text-[11px] text-muted-foreground">Under Development</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
          <Archive className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{maintenanceCount}</p>
          <p className="text-[11px] text-muted-foreground">Maintenance Mode</p>
        </div>
      </Card>
    </div>
  );
}
