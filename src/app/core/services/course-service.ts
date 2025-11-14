import { inject, Injectable } from '@angular/core';
import { Course } from '../models/course';
import { AuthService } from './auth-service';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student';
import { Evaluation } from '../models/evaluation';

@Injectable({ providedIn: 'root' })
export class CourseService {

  private readonly apiUrl = 'http://localhost:3000/courses';

  private http = inject(HttpClient);

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }


  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${course.id}`, course);
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCoursesByLoggedProfessor(professorId: number | string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}?professorId=${professorId}`);
  }

  
}
