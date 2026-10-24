import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import userReducer from './slices/userSlice';
import credentialReducer from './slices/credentialSlice';
import envReducer from './slices/envSlice';
import documentReducer from './slices/documentSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    users: userReducer,
    credentials: credentialReducer,
    environments: envReducer,
    documents: documentReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
