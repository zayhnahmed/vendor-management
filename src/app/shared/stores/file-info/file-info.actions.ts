import { createAction, props } from "@ngrx/store";
import { FileInfo } from "../../../core/models/file-info.model";

export const loadFileInfo = createAction(
  '[File] Load Info',
  props<{ id: string }>()
);

export const loadFileInfoSuccess = createAction(
  '[File] Load Info Success',
  props<{ file: FileInfo }>()
);

export const loadFileInfoFailure = createAction(
  '[File] Load Info Failure',
  props<{ error: any }>()
);