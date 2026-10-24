import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { CredentialItem, CredentialCategory } from '../../types';
import { initialCredentials } from '../../utils/mockData';

interface CredentialState {
  credentials: CredentialItem[];
  revealedSecretIds: string[];
  searchQuery: string;
  categoryFilter: string;
}

const initialState: CredentialState = {
  credentials: initialCredentials,
  revealedSecretIds: [],
  searchQuery: '',
  categoryFilter: 'All',
};

const credentialSlice = createSlice({
  name: 'credentials',
  initialState,
  reducers: {
    toggleRevealSecret: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.revealedSecretIds.includes(id)) {
        state.revealedSecretIds = state.revealedSecretIds.filter((item) => item !== id);
      } else {
        state.revealedSecretIds.push(id);
      }
    },
    hideAllSecrets: (state) => {
      state.revealedSecretIds = [];
    },
    setCredSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCredCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
    },
    addCredential: (
      state,
      action: PayloadAction<Omit<CredentialItem, 'id' | 'updatedAt'>>
    ) => {
      const newCred: CredentialItem = {
        ...action.payload,
        id: `cred-${Date.now()}`,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      state.credentials.unshift(newCred);
    },
    updateCredential: (
      state,
      action: PayloadAction<Partial<CredentialItem> & { id: string }>
    ) => {
      const index = state.credentials.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.credentials[index] = {
          ...state.credentials[index],
          ...action.payload,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
    },
    deleteCredential: (state, action: PayloadAction<string>) => {
      state.credentials = state.credentials.filter((c) => c.id !== action.payload);
      state.revealedSecretIds = state.revealedSecretIds.filter((id) => id !== action.payload);
    },
  },
});

export const {
  toggleRevealSecret,
  hideAllSecrets,
  setCredSearchQuery,
  setCredCategoryFilter,
  addCredential,
  updateCredential,
  deleteCredential,
} = credentialSlice.actions;

export default credentialSlice.reducer;
