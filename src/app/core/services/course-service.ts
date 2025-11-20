import { inject, Injectable } from '@angular/core';
import { Course } from '../models/course';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CourseService {

  private readonly BASE_URL = API_CONFIG.BASE_URL;
  private readonly apiUrl = `${this.BASE_URL}${API_CONFIG.COURSES.BASE}`;
  private http = inject(HttpClient);

  getCourses(): Observable<Course[]> {
    // El backend filtra automáticamente por el profesor del JWT
    console.log('📤 Obteniendo cursos del profesor autenticado:', this.apiUrl);
    return this.http.get<Course[]>(this.apiUrl).pipe(
      tap({
        next: (courses) => console.log('✅ Cursos recibidos:', courses),
        error: (err) => {
          console.error('❌ Error al obtener cursos:', err);
          console.error('Status:', err.status);
          console.error('Error body:', err.error);
        }
      })
    );
  }

  getCourseById(id: number): Observable<Course> {
    console.log('📖 Obteniendo curso por ID:', id);
    console.log('📍 URL:', `${this.apiUrl}/${id}`);
    
    return this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: (course) => console.log('✅ Curso obtenido:', course),
        error: (err) => {
          console.error('❌ Error al obtener curso:', err);
          console.error('Status:', err.status);
          console.error('Error body:', err.error);
        }
      })
    );
  }

  createCourse(course: Course): Observable<Course> {
    console.log('📤 Enviando curso al backend:', course);
    console.log('📍 URL:', this.apiUrl);
    
    return this.http.post<Course>(this.apiUrl, course).pipe(
      tap({
        next: (created) => console.log('✅ Curso creado exitosamente:', created),
        error: (err) => {
          console.error('❌ Error al crear curso:', err);
          console.error('Status:', err.status);
          console.error('Error body:', err.error);
        }
      })
    );
  }

  updateCourse(course: Course): Observable<Course> {
    if (!course.id) {
      throw new Error('El curso debe tener un ID para actualizarlo');
    }
    
    console.log('📝 Actualizando curso:', course);
    console.log('📍 URL:', `${this.apiUrl}/${course.id}`);
    
    return this.http.put<Course>(`${this.apiUrl}/${course.id}`, course).pipe(
      tap({
        next: (updated) => console.log('✅ Curso actualizado exitosamente:', updated),
        error: (err) => {
          console.error('❌ Error al actualizar curso:', err);
          console.error('Status:', err.status);
          console.error('Error body:', err.error);
        }
      })
    );
  }

  deleteCourse(id: number): Observable<void> {
    console.log('🗑️ Eliminando curso ID:', id);
    console.log('📍 URL:', `${this.apiUrl}/${id}`);
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => console.log('✅ Curso eliminado exitosamente'),
        error: (err) => {
          console.error('❌ Error al eliminar curso:', err);
          console.error('Status:', err.status);
          console.error('Error body:', err.error);
        }
      })
    );
  }

  getCoursesByLoggedProfessor(professorId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.BASE_URL}${API_CONFIG.COURSES.BY_PROFESSOR}/${professorId}`);
  }
}
