import React from 'react';
import { User, Project } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleProjectAssignment } from '../../store/slices/userSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Check, FolderKanban } from 'lucide-react';

interface AssignProjectModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AssignProjectModal({ user, isOpen, onClose }: AssignProjectModalProps) {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.project);

  if (!user) return null;

  const handleToggle = (projectId: string, projectName: string) => {
    dispatch(toggleProjectAssignment({ userId: user.id, projectId }));
    const isCurrentlyAssigned = user.assignedProjectIds.includes(projectId);
    dispatch(
      addToast({
        title: isCurrentlyAssigned ? 'Project Unassigned' : 'Project Assigned',
        description: `${user.name} was ${isCurrentlyAssigned ? 'removed from' : 'assigned to'} ${projectName}.`,
        type: 'info',
      })
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Projects to ${user.name}`}
      description={`Manage project scope for ${user.role}.`}
    >
      <div className="space-y-3 pt-1">
        <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
          {projects.map((proj) => {
            const isAssigned = user.assignedProjectIds.includes(proj.id);
            return (
              <div
                key={proj.id}
                onClick={() => handleToggle(proj.id, proj.name)}
                className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                  isAssigned ? 'bg-blue-50/50 dark:bg-blue-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-primary dark:bg-blue-950/40 flex items-center justify-center">
                    <FolderKanban className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{proj.name}</p>
                    <p className="text-[10px] text-muted-foreground">{proj.category}</p>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isAssigned
                      ? 'bg-primary border-primary text-white'
                      : 'border-border bg-white dark:bg-slate-900'
                  }`}
                >
                  {isAssigned && <Check className="w-3 h-3" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-border flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose} className="h-8 text-xs">
            Done
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
