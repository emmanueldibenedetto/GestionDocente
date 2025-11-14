import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student, StudentCreate } from '../../core/models/student';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/students';

  addStudentToCourse(student: StudentCreate): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  updateStudent(id: string, student: Partial<Student>): Observable<Student> {
    return this.http.patch<Student>(`${this.apiUrl}/${id}`, student);
  }

  removeStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStudentsByCourse(courseId: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}?courseId=${courseId}`);
  }
}
