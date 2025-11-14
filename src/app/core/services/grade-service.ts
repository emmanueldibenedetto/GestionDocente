import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Grade } from '../../core/models/grade';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GradeService 
{
  private http = inject(HttpClient);
  private api = 'http://localhost:3000/grades';

   // Retorna Grade firme
  setGrade(grade: Grade): Observable<Grade> {
    if (grade.id) {
      return this.http.put<Grade>(`${this.api}/${grade.id}`, grade);
    }
    return this.http.post<Grade>(this.api, grade);
  }

  getGradesByCourse(courseId: string): Observable<Grade[]> {
  return this.http.get<Grade[]>(`${this.api}?courseId=${courseId}`);
}
}
