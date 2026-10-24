import React from 'react';
import ProjectSelectorHero from '../components/dashboard/ProjectSelectorHero';
import DashboardMetrics from '../components/dashboard/DashboardMetrics';
import ProjectHealthGrid from '../components/dashboard/ProjectHealthGrid';
import RecentActivityList from '../components/dashboard/RecentActivityList';

export default function DashboardPage() {
  return (
    <div className="space-y-3">
      {/* Contextual Scope Banner */}
      <ProjectSelectorHero />

      {/* High-level KPIs */}
      <DashboardMetrics />

      {/* Main Grid: Health & Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-3">
          <ProjectHealthGrid />
        </div>
        <div className="space-y-3">
          <RecentActivityList />
        </div>
      </div>
    </div>
  );
}
