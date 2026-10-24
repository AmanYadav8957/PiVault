import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../../types';
import { initialUsers } from '../../utils/mockData';

interface UserState {
  users: User[];
  searchQuery: string;
  roleFilter: string;
}

const initialState: UserState = {
  users: initialUsers,
  searchQuery: '',
  roleFilter: 'All',
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUserSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setUserRoleFilter: (state, action: PayloadAction<string>) => {
      state.roleFilter = action.payload;
    },
    addUser: (state, action: PayloadAction<Omit<User, 'id' | 'joinedAt'>>) => {
      const newUser: User = {
        ...action.payload,
        id: `usr-${Date.now()}`,
        joinedAt: new Date().toISOString().split('T')[0],
      };
      state.users.unshift(newUser);
    },
    updateUser: (state, action: PayloadAction<Partial<User> & { id: string }>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
    toggleProjectAssignment: (
      state,
      action: PayloadAction<{ userId: string; projectId: string }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user) {
        const hasProject = user.assignedProjectIds.includes(action.payload.projectId);
        if (hasProject) {
          user.assignedProjectIds = user.assignedProjectIds.filter(
            (id) => id !== action.payload.projectId
          );
        } else {
          user.assignedProjectIds.push(action.payload.projectId);
        }
      }
    },
  },
});

export const {
  setUserSearchQuery,
  setUserRoleFilter,
  addUser,
  updateUser,
  deleteUser,
  toggleProjectAssignment,
} = userSlice.actions;

export default userSlice.reducer;
