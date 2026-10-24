import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ProjectDocument, DocumentCategory } from '../../types';
import { initialDocuments } from '../../utils/mockData';

interface DocumentState {
  documents: ProjectDocument[];
  selectedDocumentId: string | null;
  categoryFilter: string;
  searchQuery: string;
}

const initialState: DocumentState = {
  documents: initialDocuments,
  selectedDocumentId: initialDocuments[0]?.id || null,
  categoryFilter: 'All',
  searchQuery: '',
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setSelectedDocumentId: (state, action: PayloadAction<string | null>) => {
      state.selectedDocumentId = action.payload;
    },
    setDocCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
    },
    setDocSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addDocument: (
      state,
      action: PayloadAction<Omit<ProjectDocument, 'id' | 'updatedAt'>>
    ) => {
      const newDoc: ProjectDocument = {
        ...action.payload,
        id: `doc-${Date.now()}`,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      state.documents.unshift(newDoc);
      state.selectedDocumentId = newDoc.id;
    },
    updateDocument: (
      state,
      action: PayloadAction<Partial<ProjectDocument> & { id: string }>
    ) => {
      const index = state.documents.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.documents[index] = {
          ...state.documents[index],
          ...action.payload,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter((d) => d.id !== action.payload);
      if (state.selectedDocumentId === action.payload) {
        state.selectedDocumentId = state.documents[0]?.id || null;
      }
    },
  },
});

export const {
  setSelectedDocumentId,
  setDocCategoryFilter,
  setDocSearchQuery,
  addDocument,
  updateDocument,
  deleteDocument,
} = documentSlice.actions;

export default documentSlice.reducer;
