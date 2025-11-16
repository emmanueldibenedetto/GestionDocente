import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPage {
  loading = signal(false);
  submitted = false;
  errorMessage = signal<string | null>(null);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
  if (this.form.invalid) return;

  this.loading.set(true);

  const { email, password } = this.form.value;

  this.auth.login(email!, password!).subscribe({
    next: ok => {
      this.loading.set(false);
      if (!ok) return this.errorMessage.set("Email o contraseña incorrectos.");

      this.router.navigate(['/course/list']);
    },
    error: () => {
      this.loading.set(false);
      this.errorMessage.set("Error en el servidor.");
    }
  });
}

}
