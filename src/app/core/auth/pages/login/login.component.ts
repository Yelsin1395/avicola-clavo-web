import { Component, signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { HotToastService } from '@ngxpert/hot-toast';
import { ErrorResponse } from '@core/models/errorResponse.model';
import { getErrorDescription } from '@shared/utils/catalogException.utils';
import { regex } from '@shared/utils/regex.util';
import { LoginForm, LoginRequest } from '../../models/in/auth.in';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  protected readonly isLoading = signal(false);
  loginForm: FormGroup<LoginForm>;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private toast: HotToastService,
    private readonly router: Router
  ) {
    this.loginForm = new FormGroup<LoginForm>({
      dni: new FormControl('', {
        validators: [Validators.pattern(regex.dni), Validators.required],
        nonNullable: true,
      }),
      password: new FormControl('', { nonNullable: true }),
    });
  }

  get dni() {
    return this.loginForm.get('dni');
  }

  submitForm(): void {
    this.isLoading.set(true);

    const payload = this.loginForm.value as LoginRequest;

    this.authService
      .login(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: () => void this.router.navigate(['/console']),
        error: (error: ErrorResponse) => {
          this.toast.error(getErrorDescription(error?.errorCode));
        },
      });
  }
}
