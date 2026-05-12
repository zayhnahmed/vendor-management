import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { TokenService } from '../../../../core/services/token/token.service';
import { getUserRole } from '../../../../core/utils/auth.util';
import { UserRole } from '../../../../core/enums/user.enum';

@Component({
  selector: 'app-set-password-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './set-password.page.html',
})
export class SetPasswordPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly fb = inject(FormBuilder);

  form: FormGroup = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordsMatch },
  );

  token = '';
  loading = false;
  error = '';
  hidePassword = true;
  hideConfirm = true;

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) this.router.navigate(['/auth/login']);
  }

  passwordsMatch(group: AbstractControl) {
    const pw = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pw === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.form.invalid || !this.token) return;
    this.loading = true;
    this.error = '';

    this.authService.executePasswordAction(this.token, this.form.value.newPassword).subscribe({
      next: (res) => {
        this.tokenService.setAccessToken(res.access_token);
        this.tokenService.setRefreshToken(res.refresh_token);
        const role = getUserRole(res.access_token);
        if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
          this.router.navigate(['/buyer']);
        } else if (role === UserRole.VENDOR_NEW) {
          this.router.navigate(['/supplier/onboard']);
        } else {
          this.router.navigate(['/supplier']);
        }
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Invalid or expired token. Please request a new link.';
        this.loading = false;
      },
    });
  }

  get newPassword() { return this.form.get('newPassword'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }
}
