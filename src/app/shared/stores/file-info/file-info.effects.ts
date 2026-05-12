import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as FileActions from './file-info.actions';
import { catchError, map, switchMap, of, mergeMap } from 'rxjs';
import { FileInfoService } from '../../../core/services/file-info/file-info.service';

@Injectable()
export class FileInfoEffects {
  private actions$ = inject(Actions);
  private service = inject(FileInfoService);

  submitSupplierRegistration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileActions.loadFileInfo),
      mergeMap(({ id }) =>
        this.service.getFileInfo(id).pipe(
          map((res) => FileActions.loadFileInfoSuccess({ file: res.file })),
          catchError((error) => of(FileActions.loadFileInfoFailure({ error }))),
        ),
      ),
    ),
  );
}
