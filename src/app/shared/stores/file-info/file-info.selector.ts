import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FileState } from "./fire-info.state";

export const selectFileState = createFeatureSelector<FileState>('fileInfo');

export const selectFileEntities = createSelector(selectFileState, (s) => s.entities);

export const selectFileById = (id: string) =>
  createSelector(selectFileEntities, (entities) => entities[id]);
