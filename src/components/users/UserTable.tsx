import React, { useState } from 'react';
import { User } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteUser } from '../../store/slices/userSlice';
import { addToast } from '../../store/slices/uiSlice';
import AssignProjectModal from './AssignProjectModal';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Trash2,
  Settings2,
} from 'lucide-react';

export default function UserTable() {
  const dispatch = useAppDispatch();
  const { users, searchQuery, roleFilter } = useAppSelector((state) => state.users);
  const { projects, activeProjectId } = useAppSelector((state) => state.project);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [selectedUserForAssign, setSelectedUserForAssign] = useState<User | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesProject = activeProjectId
      ? u.assignedProjectIds.includes(activeProjectId)
      : true;

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;

    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesProject && matchesRole && matchesSearch;
  });

  const handleDelete = (userId: string, userName: string) => {
    if (confirm(`Remove ${userName} from company directory?`)) {
      dispatch(deleteUser(userId));
      dispatch(
        addToast({
          title: 'Member Removed',
          description: `${userName} was removed.`,
          type: 'warning',
        })
      );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return (
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-purple-50 text-purple-600 dark:bg-purple-950/40 inline-flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            Super Admin
          </span>
        );
      case 'Admin':
        return (
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-blue-50 text-primary dark:bg-blue-950/40 inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Admin / Lead
          </span>
        );
      default:
        return (
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 inline-flex items-center gap-1">
            <UserCheck className="w-3 h-3" />
            Employee
          </span>
        );
    }
  };

  return (
    <>
      <Card className="overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Assigned Projects</th>
                <th className="py-3 px-4">Status</th>
                {currentUser?.role !== 'Employee' && (
                  <th className="py-3 px-4 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground text-xs">
                    No team members found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const assignedProjects = projects.filter((p) =>
                    u.assignedProjectIds.includes(p.id)
                  );

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-border shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-foreground text-xs group-hover:text-primary transition-colors">
                              {u.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">{getRoleBadge(u.role)}</td>

                      {/* Department */}
                      <td className="py-3 px-4 text-xs text-foreground font-medium">
                        {u.department}
                      </td>

                      {/* Assigned Projects */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {assignedProjects.length === 0 ? (
                            <span className="text-xs text-muted-foreground italic">
                              None
                            </span>
                          ) : (
                            assignedProjects.map((p) => (
                              <span
                                key={p.id}
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-foreground font-medium"
                              >
                                {p.name.split(' ')[0]}
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-600">
                          {u.status}
                        </span>
                      </td>

                      {/* Actions */}
                      {currentUser?.role !== 'Employee' && (
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedUserForAssign(u)}
                              className="text-xs h-7 gap-1 text-primary hover:bg-blue-50 dark:hover:bg-blue-950/30"
                              title="Assign Projects"
                            >
                              <Settings2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Assign</span>
                            </Button>

                            {currentUser?.role === 'Super Admin' && u.id !== currentUser.id && (
                              <button
                                onClick={() => handleDelete(u.id, u.name)}
                                className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                title="Remove User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Assign Projects Modal */}
      <AssignProjectModal
        user={selectedUserForAssign}
        isOpen={!!selectedUserForAssign}
        onClose={() => setSelectedUserForAssign(null)}
      />
    </>
  );
}
