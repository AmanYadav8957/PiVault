import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ToastContainer } from '../shared/ToastContainer';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setMobileSidebarOpen } from '../../store/slices/uiSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import GlobalModals from '../shared/GlobalModals';

export default function DashboardLayout() {
  const dispatch = useAppDispatch();
  const isMobileSidebarOpen = useAppSelector((state) => state.ui.isMobileSidebarOpen);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className="flex h-[100dvh] w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar with fixed top project selector */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => dispatch(setMobileSidebarOpen(false))}
      />

      {/* Main Workspace Column */}
      <div className="flex flex-col flex-1 w-full h-full overflow-hidden min-w-0">
        <Topbar onMenuClick={() => dispatch(setMobileSidebarOpen(true))} />

        <main className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto bg-background p-2 sm:p-3 min-h-0 relative">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <GlobalModals />
      <ToastContainer />
    </div>
  );
}
