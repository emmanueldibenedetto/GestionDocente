import { Component, signal, inject, effect } from '@angular/core';
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

  constructor() {

    // Se ejecuta cada vez que cambia currentProfessor
    effect(() => {
      const professor = this.authService.currentProfessor(); // ✔ obtener valor

      console.log("Profesor actual:", professor?.name);

      if (!professor) {
        this.errorMessage.set("No hay sesión activa.");
        this.courses.set([]); // Evita mostrar basura
        return;
      }

      // Cargar cursos del profe logueado
      this.loadCourses(professor.id!);
    });
  }

  loadCourses(professorId: number) {
    this.courseService.getCoursesByLoggedProfessor(professorId).subscribe({
      next: data => this.courses.set(data),
      error: () => this.errorMessage.set("Error al cargar cursos.")
    });
  }

  deleteCourse(id: string) {
    if (!confirm("¿Seguro que deseas eliminar este curso?")) return;

    this.courseService.deleteCourse(id).subscribe(() => {

      const professor = this.authService.currentProfessor(); // ✔ obtener valor

      if (professor?.id) {
        this.loadCourses(professor.id); // ✔ ID es number
      }
    });
  }

  goToCreate() {
    this.router.navigate(['/course/create']);
  }

  editCourse(id: string) {
    this.router.navigate(['/course/edit', id]);
  }
}
