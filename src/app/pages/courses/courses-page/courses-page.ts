import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course-service';
import { AuthService } from '../../../core/services/auth-service';
import { Course } from '../../../core/models/course';

@Component({
  selector: 'app-courses-page',
  standalone: true,
  templateUrl: './courses-page.html',
  imports: [RouterLink]
})
export class CoursesPage {

  private courseService = inject(CourseService);
  private authService = inject(AuthService);
  private router = inject(Router);

  courses = signal<Course[]>([]);
  errorMessage = signal('');

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    const professor = this.authService.currentProfessor();
    console.log("profesor: ", professor?.name);
    if (!professor) {
      this.errorMessage.set('No hay sesión activa.');
      return;
    }

    if (!professor) {
      this.errorMessage.set('No hay sesión activa.');
      return;
    }

    this.courseService.getCoursesByLoggedProfessor(professor.id!).subscribe({
      next: (data) => this.courses.set(data),
      error: () => this.errorMessage.set('Error al cargar cursos.')
    });
  }

  goToCreate() {
    this.router.navigate(['/course/create']);
  }

  editCourse(id: string) {
    this.router.navigate(['/course/edit/', id]);
  }

  deleteCourse(id: string) {
    if (!confirm('¿Seguro que deseas eliminar este curso?')) return;

    this.courseService.deleteCourse(id).subscribe(() => {
      this.loadCourses(); // Recarga lista luego de borrar
    });
  }
}
