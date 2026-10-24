import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { EnvVariable, EnvStage } from '../../types';
import { initialEnvVariables } from '../../utils/mockData';

interface EnvState {
  envVariables: EnvVariable[];
  activeStage: EnvStage;
  revealedEnvIds: string[];
  searchQuery: string;
}

const initialState: EnvState = {
  envVariables: initialEnvVariables,
  activeStage: 'production',
  revealedEnvIds: [],
  searchQuery: '',
};

const envSlice = createSlice({
  name: 'environments',
  initialState,
  reducers: {
    setActiveStage: (state, action: PayloadAction<EnvStage>) => {
      state.activeStage = action.payload;
    },
    toggleRevealEnv: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.revealedEnvIds.includes(id)) {
        state.revealedEnvIds = state.revealedEnvIds.filter((item) => item !== id);
      } else {
        state.revealedEnvIds.push(id);
      }
    },
    setEnvSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addEnvVariable: (
      state,
      action: PayloadAction<Omit<EnvVariable, 'id' | 'lastModified'>>
    ) => {
      const newEnv: EnvVariable = {
        ...action.payload,
        id: `env-${Date.now()}`,
        lastModified: new Date().toISOString().split('T')[0],
      };
      state.envVariables.unshift(newEnv);
    },
    updateEnvVariable: (
      state,
      action: PayloadAction<Partial<EnvVariable> & { id: string }>
    ) => {
      const index = state.envVariables.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.envVariables[index] = {
          ...state.envVariables[index],
          ...action.payload,
          lastModified: new Date().toISOString().split('T')[0],
        };
      }
    },
    deleteEnvVariable: (state, action: PayloadAction<string>) => {
      state.envVariables = state.envVariables.filter((e) => e.id !== action.payload);
      state.revealedEnvIds = state.revealedEnvIds.filter((id) => id !== action.payload);
    },
    bulkImportEnvs: (
      state,
      action: PayloadAction<{
        projectId: string;
        environment: EnvStage;
        rawEnvText: string;
      }>
    ) => {
      const { projectId, environment, rawEnvText } = action.payload;
      const lines = rawEnvText.split('\n');
      const parsed: EnvVariable[] = [];

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let value = trimmed.slice(eqIdx + 1).trim();
          // Remove surrounding quotes if any
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }

          const isSecret =
            /SECRET|KEY|PASSWORD|TOKEN|PASS|PRIVATE|AUTH|SALT|CERT/i.test(key);

          parsed.push({
            id: `env-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            projectId,
            environment,
            key,
            value,
            isSecret,
            description: `Imported variable for ${environment}`,
            lastModified: new Date().toISOString().split('T')[0],
          });
        }
      });

      state.envVariables = [...parsed, ...state.envVariables];
    },
  },
});

export const {
  setActiveStage,
  toggleRevealEnv,
  setEnvSearchQuery,
  addEnvVariable,
  updateEnvVariable,
  deleteEnvVariable,
  bulkImportEnvs,
} = envSlice.actions;

export default envSlice.reducer;
