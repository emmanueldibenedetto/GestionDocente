import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../core/services/course-service';
import { AuthService } from '../../../core/services/auth-service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Course } from '../../../core/models/course';

@Component({
  standalone: true,
  selector: 'app-course-edit-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-edit-page.html',
  styleUrls: ['./course-edit-page.css']
})
export class CourseEditPage implements OnInit
{

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private authService = inject(AuthService);

  errorMessage = signal<string>('');
  course!: Course;

 form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    school: ['', [Validators.required]],
    description: ['']
  });


  id = String(this.route.snapshot.paramMap.get('id'));


  ngOnInit(): void
  {
    this.loadCourse(this.id);
  }

loadCourse(id: number | string) {
  const professor = this.authService.getLoggedProfessor();
  if (!professor) {
    this.errorMessage.set('No hay sesión activa.');
    return;
  }

  this.courseService.getCoursesByLoggedProfessor(professor.id!).subscribe({
    next: (courses) => {
      const found = courses.find(c => c.id === id);

      if (!found) {
        this.errorMessage.set('Curso no encontrado o no pertenece al profesor.');
        return;
      }

      this.course = found;
      this.form.patchValue({
        name: found.name,
        school: found.school,
        description: found.description ?? ''
      });
    },
    error: () => {
      this.errorMessage.set('Error al cargar el curso.');
    }
  });
}


  onSubmit() 
  {
    if (this.form.invalid || !this.course) return;

    const updated: Course = {
      ...this.course,
      ...this.form.getRawValue()
    };

    this.courseService.updateCourse(updated).subscribe(() => {
      alert('Curso actualizado');
      this.router.navigate(['/course/list']);
    });
  }

}
