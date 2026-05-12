import { ApplicationRef, createComponent, inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfirmDialogUi } from '../../../shared/ui/confirm-dialog.ui/confirm-dialog.ui';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private appRef = inject(ApplicationRef);

  open(options: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    severity?: string;
  }): Observable<boolean> {
    const componentRef = createComponent(ConfirmDialogUi, {
      environmentInjector: this.appRef.injector,
    });

    componentRef.instance.title = options.title ?? 'Confirm';
    componentRef.instance.message = options.message;
    componentRef.instance.confirmText = options.confirmText ?? 'Yes';
    componentRef.instance.cancelText = options.cancelText ?? 'No';
    componentRef.instance.severity = options.severity ?? 'brand';

    const result$ = new Subject<boolean>();

    componentRef.instance.close = (result: boolean) => {
      result$.next(result);
      result$.complete();
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    };

    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(componentRef.location.nativeElement);

    return result$.asObservable();
  }
}
