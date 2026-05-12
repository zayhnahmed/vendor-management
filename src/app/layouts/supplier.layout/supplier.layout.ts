import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { ConfirmDialogService } from '../../core/services/confirm-dialog/confirm-dialog.service';
import { Store } from '@ngrx/store';
import { appLogout } from '../../features/auth/store/auth/auth.actions';
import { AuthUserFacade } from '../../features/auth/store/user/user.facade';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier.layout',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive, CommonModule],
  templateUrl: './supplier.layout.html',
  styleUrl: './supplier.layout.css',
})
export class SupplierLayout implements OnInit {
  private readonly confirmDialog: ConfirmDialogService = inject(ConfirmDialogService);
  private readonly store: Store = inject(Store);
  private readonly authUserFacade: AuthUserFacade = inject(AuthUserFacade);

  user$ = this.authUserFacade.user$;

  ngOnInit(): void {
    this.authUserFacade.loadUser();
  }

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
