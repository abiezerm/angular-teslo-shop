import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <form class="flex flex-col gap-2" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <label class="input validator">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2.5"
            fill="none"
            stroke="currentColor"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </g>
        </svg>
        <input type="email" placeholder="Email" formControlName="email" />
      </label>

      <label class="input validator">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
            ></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </g>
        </svg>
        <input
          class="grow"
          type="password"
          placeholder="Password"
          formControlName="password"
        />
      </label>

      <button
        type="submit"
        class="btn btn-secondary"
      >
        Login
      </button>

      @if (hasError()) {
        <div role="alert" class="alert alert-error animate-in fade-in fixed bottom-5 right-5 w-52">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Please verify the information entered</span>
        </div>
      }

      <p class="text-slate-700 ">
        Don't have an account?  <a class="text-secondary" routerLink="/auth/register">Create one</a>
      </p>
    </form>

  `,
})
export class LoginPageComponent {
  fb = inject(FormBuilder)
  router = inject(Router);
  authService = inject(AuthService);

  hasError = signal(false);
  isPosting = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService
    .login(email!, password!)
    .subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        this.hasError.set(true);
        return;
      }

      this.router.navigateByUrl('/');
      return;
    });

  }
}
