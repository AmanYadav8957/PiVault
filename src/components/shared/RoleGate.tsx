import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { UserRole } from '../../types';

interface RoleGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ allowedRoles, children, fallback = null }: RoleGateProps) {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return <>{fallback}</>;

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
