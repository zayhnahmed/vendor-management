import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../../core/services/token/token.service';
import { getUserRole } from '../../../../core/utils/auth.util';
import { UserRole } from '../../../../core/enums/user.enum';

@Component({
  selector: 'app-unauthorized-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './unauthorized.page.html',
  styleUrl: './unauthorized.page.css',
})
export class UnauthorizedPage {
  private router = inject(Router);
  private tokenService = inject(TokenService);

  goHome(): void {
    const token = this.tokenService.getAccessToken();
    const role = getUserRole(token);

    if (role === UserRole.BUYER || role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
      this.router.navigate(['/buyer']);
    } else if (role === UserRole.VENDOR_ACTIVE) {
      this.router.navigate(['/supplier']);
    } else if (role === UserRole.VENDOR_NEW) {
      this.router.navigate(['/supplier/onboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  goBack(): void {
    window.history.back();
  }
}
