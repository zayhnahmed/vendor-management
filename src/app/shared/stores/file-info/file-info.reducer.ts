import { createReducer, on } from "@ngrx/store";
import { initialState } from "./fire-info.state";
import { loadFileInfoSuccess } from "./file-info.actions";

export const fileInfoReducer = createReducer(
  initialState,

  on(loadFileInfoSuccess, (state, { file }) => ({
    ...state,
    entities: {
      ...state.entities,
      [file.id]: file, // 🔥 store by ID
    },
  }))
);