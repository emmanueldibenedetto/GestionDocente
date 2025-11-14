import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Evaluation } from '../models/evaluation';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EvaluationService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/evaluations';

  getEvaluationsByCourse(courseId: string): Observable<Evaluation[]> {
    const params = new HttpParams().set('courseId', courseId);
    return this.http.get<Evaluation[]>(this.apiUrl, { params });
  }

  addEvaluation(evaluation: Omit<Evaluation, 'id'>): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.apiUrl, evaluation);
  }

  deleteEvaluation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}