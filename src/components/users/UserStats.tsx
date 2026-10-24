import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { Card } from '../ui/card';
import { Users, ShieldAlert, ShieldCheck, UserCheck } from 'lucide-react';

export default function UserStats() {
  const { users } = useAppSelector((state) => state.users);

  const superAdminCount = users.filter((u) => u.role === 'Super Admin').length;
  const adminCount = users.filter((u) => u.role === 'Admin').length;
  const employeeCount = users.filter((u) => u.role === 'Employee').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{users.length}</p>
          <p className="text-[11px] text-muted-foreground">Total Team Members</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{superAdminCount}</p>
          <p className="text-[11px] text-muted-foreground">Super Admins</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{adminCount}</p>
          <p className="text-[11px] text-muted-foreground">Admins / Tech Leads</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{employeeCount}</p>
          <p className="text-[11px] text-muted-foreground">Staff & Employees</p>
        </div>
      </Card>
    </div>
  );
}
