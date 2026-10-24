import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { Card } from '../ui/card';
import { KeyRound, ShieldCheck, Server, Globe } from 'lucide-react';

export default function CredentialStats() {
  const { credentials } = useAppSelector((state) => state.credentials);
  const { activeProjectId } = useAppSelector((state) => state.project);

  const scoped = activeProjectId
    ? credentials.filter((c) => c.projectId === activeProjectId)
    : credentials;

  const prodCount = scoped.filter((c) => c.environment === 'Production').length;
  const nonProdCount = scoped.filter((c) => c.environment === 'Staging' || c.environment === 'Development').length;
  const webPortalsCount = scoped.filter((c) => Boolean(c.endpoint)).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{scoped.length}</p>
          <p className="text-[11px] text-muted-foreground">Saved Accounts</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{prodCount}</p>
          <p className="text-[11px] text-muted-foreground">Production Logins</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Server className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{nonProdCount}</p>
          <p className="text-[11px] text-muted-foreground">Staging & Dev</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{webPortalsCount}</p>
          <p className="text-[11px] text-muted-foreground">With Web Portals</p>
        </div>
      </Card>
    </div>
  );
}

