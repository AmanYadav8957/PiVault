import React from 'react';
import { Layers, ShieldCheck, KeyRound, FileCode2 } from 'lucide-react';

export default function LoginHero() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-slate-50 dark:bg-slate-900 border-r border-border relative select-none">
      {/* Top Branding */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">PigoPiOps</span>
        </div>
        <p className="text-muted-foreground text-xs mt-1.5">
          Enterprise Internal Project & Secret Management
        </p>
      </div>

      {/* Center Highlight Cards */}
      <div className="space-y-3.5 my-8">
        <div className="p-4 rounded-xl bg-white dark:bg-card border border-border shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-primary dark:bg-blue-950/40 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Role-Protected Access</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                Super Admin governance with employee assigned workspaces.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-card border border-border shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Central Credentials Vault</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                Encrypted database URIs, API tokens, and cloud keys with audit logging.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-card border border-border shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 shrink-0">
              <FileCode2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Multi-Stage Env Sync</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                Development, staging, and production parameter management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Quote */}
      <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>SOC2 & ISO 27001 Ready</span>
        <span>v2.4.0</span>
      </div>
    </div>
  );
}
