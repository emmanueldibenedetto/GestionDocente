import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course-service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth-service';
import { Course } from '../../../core/models/course';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-course-create-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-create-page.html',
  styleUrls: ['./course-create-page.css']
})
export class CourseCreatePage {

  public errorMessage = signal<string>('');

  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private authService = inject(AuthService);
  private router = inject(Router);

 form = this.fb.nonNullable.group({
  name: [''],
  school: [''],
  description: ['']
});

onSubmit() {

  if (this.form.invalid) return;

  const professor = this.authService.getLoggedProfessor();
  if (!professor) {
    this.errorMessage.set('No hay sesión activa. Por favor inicia sesión.');
    return;
  }

  // Verificar que hay token JWT
  const token = this.authService.getToken();
  if (!token) {
    this.errorMessage.set('No hay token de autenticación. Por favor inicia sesión nuevamente.');
    return;
  }

  console.log('Creando curso con profesor ID:', professor.id);
  console.log('Token JWT presente:', !!token);

  // El backend obtiene el professorId del JWT automáticamente,
  // pero lo incluimos por si acaso (el backend lo validará)
  const newCourse: Course = {
    ...this.form.getRawValue(),
    professorId: professor.id!
  };

  this.courseService.createCourse(newCourse).subscribe({
    next: () => {
      alert('Curso creado');
      this.router.navigate(['/course/list']);
    },
    error: (err) => {
      console.error('Error al crear curso:', err);
      let errorMsg = 'Error al guardar el curso';
      
      // Mostrar detalles del error si están disponibles
      if (err.error?.error) {
        errorMsg = err.error.error;
      } else if (err.message) {
        errorMsg = err.message;
      } else if (err.status === 401) {
        errorMsg = 'No estás autenticado. Por favor inicia sesión nuevamente.';
      } else if (err.status === 403) {
        errorMsg = 'No tienes permisos para realizar esta acción.';
      } else if (err.status === 0) {
        errorMsg = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
      }
      
      this.errorMessage.set(errorMsg);
      alert(errorMsg);
    }
  });
}


}
