import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../../types';
import { initialUsers } from '../../utils/mockData';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Default to initial user or read from localStorage
const storedUserJson = localStorage.getItem('nexus_user');
const storedToken = localStorage.getItem('nexus_token');
let defaultUser: User | null = null;

try {
  if (storedUserJson) {
    defaultUser = JSON.parse(storedUserJson);
  } else {
    defaultUser = initialUsers[0]; // Aman Sharma (Super Admin)
  }
} catch {
  defaultUser = initialUsers[0];
}

const initialState: AuthState = {
  user: defaultUser,
  token: storedToken,
  isAuthenticated: !!defaultUser,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('nexus_user', JSON.stringify(action.payload.user));
      localStorage.setItem('nexus_token', action.payload.token);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('nexus_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('nexus_user');
      localStorage.removeItem('nexus_token');
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    switchRole: (state, action: PayloadAction<UserRole>) => {
      if (!state.user) return;
      const targetRole = action.payload;
      const matching = initialUsers.find((u) => u.role === targetRole);
      if (matching) {
        state.user = { ...matching };
      } else {
        state.user = {
          ...state.user,
          role: targetRole,
        };
      }
      localStorage.setItem('nexus_user', JSON.stringify(state.user));
    },
  },
});

export const { loginSuccess, setUser, logout, setAuthLoading, setAuthError, switchRole } = authSlice.actions;
export default authSlice.reducer;
