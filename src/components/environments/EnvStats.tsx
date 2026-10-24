import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { Card } from '../ui/card';
import { FileCode2, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

export default function EnvStats() {
  const { envVariables } = useAppSelector((state) => state.environments);
  const { activeProjectId } = useAppSelector((state) => state.project);

  const scoped = activeProjectId
    ? envVariables.filter((e) => e.projectId === activeProjectId)
    : envVariables;

  const prodCount = scoped.filter((e) => e.environment === 'production').length;
  const stagingCount = scoped.filter((e) => e.environment === 'staging').length;
  const devCount = scoped.filter((e) => e.environment === 'development').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
          <FileCode2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{scoped.length}</p>
          <p className="text-[11px] text-muted-foreground">Configured Variables</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{prodCount}</p>
          <p className="text-[11px] text-muted-foreground">Production Envs</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{stagingCount}</p>
          <p className="text-[11px] text-muted-foreground">Staging Envs</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{devCount}</p>
          <p className="text-[11px] text-muted-foreground">Development Envs</p>
        </div>
      </Card>
    </div>
  );
}
