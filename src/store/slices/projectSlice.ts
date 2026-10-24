import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../../types';
import { initialProjects } from '../../utils/mockData';
import { projectApi } from '../../services/api';

// Async Thunks connecting to the MongoDB Backend
export const fetchProjects = createAsyncThunk('project/fetchProjects', async (_, { rejectWithValue }) => {
  try {
    return await projectApi.getAll();
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch projects');
  }
});

export const createProjectAsync = createAsyncThunk(
  'project/createProjectAsync',
  async (projectData: Partial<Project>, { rejectWithValue }) => {
    try {
      return await projectApi.create(projectData);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create project');
    }
  }
);

export const updateProjectAsync = createAsyncThunk(
  'project/updateProjectAsync',
  async ({ id, data }: { id: string; data: Partial<Project> }, { rejectWithValue }) => {
    try {
      return await projectApi.update(id, data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update project');
    }
  }
);

export const deleteProjectAsync = createAsyncThunk(
  'project/deleteProjectAsync',
  async (id: string, { rejectWithValue }) => {
    try {
      await projectApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete project');
    }
  }
);

interface ProjectState {
  activeProjectId: string | null; // null means "All Projects"
  projects: Project[];
  selectedCategory: string;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  activeProjectId: null,
  projects: initialProjects,
  selectedCategory: 'All',
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setActiveProjectId: (state, action: PayloadAction<string | null>) => {
      state.activeProjectId = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    addProject: (state, action: PayloadAction<Omit<Project, 'id' | 'createdAt' | 'teamCount' | 'credentialsCount' | 'envCount' | 'docsCount'>>) => {
      const newId = `prj-${Date.now()}`;
      const newProject: Project = {
        ...action.payload,
        id: newId,
        teamCount: 1,
        credentialsCount: 0,
        envCount: 0,
        docsCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.projects.unshift(newProject);
      state.activeProjectId = newId;
    },
    updateProject: (state, action: PayloadAction<Partial<Project> & { id: string }>) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload };
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      if (state.activeProjectId === action.payload) {
        state.activeProjectId = null;
      }
    },
  },
  extraReducers: (builder) => {
    // fetchProjects
    builder.addCase(fetchProjects.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.loading = false;
      state.projects = action.payload;
      state.error = null;
    });
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Failed to load projects';
    });

    // createProjectAsync
    builder.addCase(createProjectAsync.fulfilled, (state, action) => {
      state.projects.unshift(action.payload);
      state.activeProjectId = action.payload.id;
    });

    // updateProjectAsync
    builder.addCase(updateProjectAsync.fulfilled, (state, action) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    });

    // deleteProjectAsync
    builder.addCase(deleteProjectAsync.fulfilled, (state, action) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      if (state.activeProjectId === action.payload) {
        state.activeProjectId = null;
      }
    });
  },
});

export const {
  setActiveProjectId,
  setSelectedCategory,
  setProjects,
  addProject,
  updateProject,
  deleteProject,
} = projectSlice.actions;

export default projectSlice.reducer;
