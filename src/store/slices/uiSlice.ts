import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ToastMessage } from '../../types';

interface UIState {
  theme: 'dark' | 'light';
  toasts: ToastMessage[];
  isMobileSidebarOpen: boolean;
  createModalType: 'project' | 'user' | 'credential' | 'env' | 'doc' | 'upload_doc' | null;
}

const initialTheme = (localStorage.getItem('nexus_theme') as 'dark' | 'light') || 'dark';

// sync document class with initial theme
if (typeof document !== 'undefined') {
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

const initialState: UIState = {
  theme: initialTheme,
  toasts: [],
  isMobileSidebarOpen: false,
  createModalType: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('nexus_theme', state.theme);
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
      localStorage.setItem('nexus_theme', state.theme);
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleMobileSidebar: (state) => {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileSidebarOpen = action.payload;
    },
    setCreateModalType: (
      state,
      action: PayloadAction<'project' | 'user' | 'credential' | 'env' | 'doc' | 'upload_doc' | null>
    ) => {
      state.createModalType = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  setCreateModalType,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
