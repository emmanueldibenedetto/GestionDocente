// src/app/features/auth/register/register.page.ts
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { celularValidator } from '../../validators/cell-validator/cell-validator';
import { Router } from '@angular/router';
import { Roles } from '../../enums/roles';

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

  professor = this.auth.currentProfessor();

  form = this.fb.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    cel: ['', [Validators.required, celularValidator]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
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

  const { name, lastname, email, cel, password, confirmPassword} = this.form.value;

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
    cel: cel!,
    role: this.professor ? Roles.Admin : Roles.Professor!, 
    isActive: true!,
    createdAt: new Date().toISOString()!,   // ← 2025-04-05T14:32:10.123Z
    lastLogin: new Date().toISOString()!
  }).subscribe({
    next: (created) => {
      console.log('✅ Profesor creado:', created);
      this.loading.set(false);
      if(!this.professor){
        this.router.navigate(['/auth/login']);
      }else{
        this.router.navigate(['/professors/list']);
      }
    },
    error: (err) => {
      console.error('❌ Error al registrar profesor:', err);
      this.loading.set(false);
      this.errorMessage.set('Error al registrar el profesor.');
    }
  });
}



}
