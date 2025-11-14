// src/app/features/auth/register/register.page.ts
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { celularValidator } from '../../validators/cell-validator/cell-validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css']
})
export class RegisterPage 
{
  public submitted = false;
  public loading = signal(false);
  public message = signal<string | null>(null);
  public errorMessage = signal<string | null>(null);

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    cel: ['', [Validators.required, celularValidator]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  passwordsDoNotMatch = computed(() => {
    const p = this.form.get('password')?.value;
    const c = this.form.get('confirmPassword')?.value;
    return p && c && p !== c;
  });

onSubmit() {
  this.submitted = true;
  this.errorMessage.set(null);

  if (this.form.invalid) return;

  const { name, lastname, email, cel, password, confirmPassword } = this.form.value;

  if (password !== confirmPassword) {
    this.errorMessage.set('Las contraseñas no coinciden');
    return;
  }

  this.loading.set(true);

  this.auth.register({
    name: name!,
    lastname: lastname!,
    email: email!,
    password: password!,
    cel: cel!
  }).subscribe({
    next: (created) => {
      console.log('✅ Profesor creado:', created);
      this.loading.set(false);
      this.router.navigate(['/auth/login']);
    },
    error: (err) => {
      console.error('❌ Error al registrar profesor:', err);
      this.loading.set(false);
      this.errorMessage.set('Error al registrar el profesor.');
    }
  });
}



}
