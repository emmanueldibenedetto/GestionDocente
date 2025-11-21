import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Class } from '../models/class';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClassService {
  private http = inject(HttpClient);
  private api = 'http://localhost:3000/classes';

  getByCourse(courseId: string): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.api}?courseId=${courseId}`);
  }

  create(record: Class): Observable<Class> {
    return this.http.post<Class>(this.api, record);
  }
}
