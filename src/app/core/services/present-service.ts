import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Present } from '../models/present';
import { Observable, forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PresentService {
  private http = inject(HttpClient);
  private api = 'http://localhost:3000/presents';

  getByCourse(courseId: string): Observable<Present[]> {
    return this.http.get<Present[]>(`${this.api}?courseId=${courseId}`);
  }

  createMany(records: Present[]): Observable<Present[]> {
    return forkJoin(records.map(r => this.http.post<Present>(this.api, r)));
  }

  update(id: string, record: Present): Observable<Present> {
    return this.http.put<Present>(`${this.api}/${id}`, record);
  }
}
