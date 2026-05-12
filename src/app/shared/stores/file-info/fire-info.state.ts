import { FileInfo } from '../../../core/models/file-info.model';

export interface FileState {
  entities: Record<string, FileInfo>;
  loading: boolean;
}

export const initialState: FileState = {
  entities: {},
  loading: false,
};
