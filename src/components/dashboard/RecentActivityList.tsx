import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { KeyRound, FileCode2, BookOpenText, UserPlus, Clock } from 'lucide-react';

export default function RecentActivityList() {
  const activities = [
    {
      id: 'act-1',
      action: 'Stripe Master Gateway Key Rotated',
      project: 'PayPulse FinTech Engine',
      user: 'Sarah Jenkins',
      time: '15m ago',
      icon: KeyRound,
      badge: 'Security',
    },
    {
      id: 'act-2',
      action: 'Updated Production DATABASE_URL Pool',
      project: 'AcreFlow Real Estate CRM',
      user: 'Alex Rivera',
      time: '2h ago',
      icon: FileCode2,
      badge: 'Env Sync',
    },
    {
      id: 'act-3',
      action: 'Published HIPAA Video Encryption Spec',
      project: 'PulseHealth Patient Portal',
      user: 'Dr. Michael Chen',
      time: '5h ago',
      icon: BookOpenText,
      badge: 'Architecture',
    },
    {
      id: 'act-4',
      action: 'Assigned David Kim to Pod',
      project: 'PayPulse FinTech Engine',
      user: 'Aman Sharma',
      time: '1d ago',
      icon: UserPlus,
      badge: 'Team',
    },
  ];

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="font-bold text-foreground text-sm">Security & Audit Activity</h3>
          <p className="text-[11px] text-muted-foreground">Secret access and configuration log</p>
        </div>
        <span className="text-[10px] font-semibold text-primary flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Live
        </span>
      </div>

      <div className="divide-y divide-border/60 mt-1">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="py-2.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-foreground shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{act.action}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {act.project} • {act.user}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                {act.time}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
