import { Component, inject } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { ConfirmDialogService } from '../../core/services/confirm-dialog/confirm-dialog.service';
import { Store } from '@ngrx/store';
import { appLogout } from '../../features/auth/store/auth/auth.actions';

@Component({
  selector: 'app-buyer.layout',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './buyer.layout.html',
  styleUrl: './buyer.layout.css',
})
export class BuyerLayout {
  private readonly confirmDialog: ConfirmDialogService = inject(ConfirmDialogService);
  private readonly store: Store = inject(Store);

  logout() {
    this.confirmDialog
      .open({
        message: 'Do you want to logout from admin?',
        confirmText: 'Logout',
        severity: 'danger',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.store.dispatch(appLogout());
          console.log('confirmed');
          // this.router.navigate(['/'])
        }
      });
  }
}
