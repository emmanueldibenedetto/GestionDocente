import { Component, signal, inject, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course-service';
import { AuthService } from '../../../core/services/auth-service';
import { Course } from '../../../core/models/course';

@Component({
  selector: 'app-courses-page',
  standalone: true,
  templateUrl: './courses-page.html',
  styleUrls: ['./courses-page.css'],
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
      console.log("Profesor id:", professor?.id);

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
    console.log('📚 Cargando cursos para profesor ID:', professorId);
    // El backend filtra automáticamente por el profesor del JWT
    // No necesitamos pasar el professorId como parámetro
    this.courseService.getCourses().subscribe({
      next: (data) => {
        console.log('✅ Cursos cargados:', data);
        this.courses.set(data);
        this.errorMessage.set('');
      },
      error: (err) => {
        console.error('❌ Error al cargar cursos:', err);
        this.errorMessage.set("Error al cargar cursos.");
        this.courses.set([]);
      }
    });
  }

  deleteCourse(id: number) {
    if (!confirm("¿Seguro que deseas eliminar este curso? Esta acción no se puede deshacer.")) return;

    console.log('🗑️ Intentando eliminar curso ID:', id);
    
    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        console.log('✅ Curso eliminado exitosamente');
        const professor = this.authService.currentProfessor();
        if (professor?.id) {
          this.loadCourses(professor.id);
        }
        this.errorMessage.set('');
        // Asegurar que permanecemos en la página de cursos (no redirigir)
        this.router.navigate(['/course/list']);
      },
      error: (err) => {
        console.error('❌ Error al eliminar curso:', err);
        let errorMsg = 'Error al eliminar el curso.';
        
        if (err.error?.error) {
          errorMsg = err.error.error;
        } else if (err.status === 401) {
          errorMsg = 'No estás autenticado. Por favor inicia sesión nuevamente.';
        } else if (err.status === 403) {
          errorMsg = 'No tienes permisos para eliminar este curso.';
        } else if (err.status === 404) {
          errorMsg = 'El curso no existe.';
        } else if (err.status === 0) {
          errorMsg = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        }
        
        this.errorMessage.set(errorMsg);
      }
    });
  }

  goToCreate() {
    this.router.navigate(['/course/create']);
  }

  editCourse(id: number) {
    this.router.navigate(['/course/edit', id]);
  }
}
