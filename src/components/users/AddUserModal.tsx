import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { addUser } from '../../store/slices/userSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { UserRole } from '../../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Employee');
  const [department, setDepartment] = useState('Engineering');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    dispatch(
      addUser({
        name: name.trim(),
        email: email.trim(),
        role,
        department,
        status: 'Active',
        assignedProjectIds: ['prj-1'],
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      })
    );

    dispatch(
      addToast({
        title: 'Team Member Added',
        description: `${name} has been invited with ${role} permissions.`,
        type: 'success',
      })
    );

    onClose();
    setName('');
    setEmail('');
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Company Member"
      description="Invite an engineer or admin to manage company project credentials and environments."
    >
      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Full Name *</label>
          <Input
            type="text"
            placeholder="e.g. John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Corporate Email *</label>
          <Input
            type="email"
            placeholder="john.doe@company.internal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full h-9 rounded-xl border border-border bg-white dark:bg-slate-900 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Department</label>
            <Input
              type="text"
              placeholder="e.g. Backend Dev"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} className="h-8 text-xs">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" className="h-8 text-xs">
            Add Member
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
