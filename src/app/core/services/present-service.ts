import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Present } from '../models/present';
import { API_CONFIG } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class PresentService {
  private http = inject(HttpClient);
  private readonly BASE_URL = API_CONFIG.BASE_URL;

  getAttendancesByCourse(courseId: number): Observable<Present[]> {
    return this.http.get<Present[]>(`${this.BASE_URL}/attendances/course/${courseId}`);
  }

  getAttendancesByStudent(studentId: number): Observable<Present[]> {
    return this.http.get<Present[]>(`${this.BASE_URL}/attendances/student/${studentId}`);
  }

  markAttendance(attendance: Present): Observable<Present> {
    return this.http.post<Present>(`${this.BASE_URL}/attendances`, attendance);
  }

  updateAttendance(id: number, attendance: Present): Observable<Present> {
    return this.http.put<Present>(`${this.BASE_URL}/attendances/${id}`, attendance);
  }

  getAttendancePercentage(studentId: number, courseId: number): Observable<number> {
    return this.http.get<number>(`${this.BASE_URL}/attendances/student/${studentId}/course/${courseId}/percentage`);
  }
}

