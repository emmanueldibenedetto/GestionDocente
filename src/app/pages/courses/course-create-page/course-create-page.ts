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
  console.log("nombre:");
  if (!professor) return;

  const newCourse: Course = {
    ...this.form.getRawValue(),  // evita los nulls
    professorId: professor.id!
  };

  this.courseService.createCourse(newCourse).subscribe({
    next: () => {
      alert('Curso creado');
      this.router.navigate(['/course/list']);
    },
    error: () => alert('Error al guardar el curso')
  });
}


}
