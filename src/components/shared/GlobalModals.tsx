import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCreateModalType } from '../../store/slices/uiSlice';
import CreateProjectModal from '../projects/CreateProjectModal';
import AddUserModal from '../users/AddUserModal';
import AddCredentialModal from '../credentials/AddCredentialModal';
import EnvEditorModal from '../environments/EnvEditorModal';
import DocEditorModal from '../documents/DocEditorModal';
import UploadDocModal from '../documents/UploadDocModal';

export default function GlobalModals() {
  const dispatch = useAppDispatch();
  const createModalType = useAppSelector((state) => state.ui.createModalType);

  const handleClose = () => {
    dispatch(setCreateModalType(null));
  };

  return (
    <>
      <CreateProjectModal
        isOpen={createModalType === 'project'}
        onClose={handleClose}
      />
      <AddUserModal
        isOpen={createModalType === 'user'}
        onClose={handleClose}
      />
      <AddCredentialModal
        isOpen={createModalType === 'credential'}
        onClose={handleClose}
      />
      <EnvEditorModal
        isOpen={createModalType === 'env'}
        onClose={handleClose}
      />
      <DocEditorModal
        isOpen={createModalType === 'doc'}
        onClose={handleClose}
      />
      <UploadDocModal
        isOpen={createModalType === 'upload_doc'}
        onClose={handleClose}
      />
    </>
  );
}
