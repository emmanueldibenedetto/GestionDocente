// src/app/services/auth.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Professor } from '../models/professor';
import { map, tap, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:3000/professors';
  private readonly SESSION_KEY = 'loggedProfessor';

  // === STATE SIGNAL ===
  currentProfessor = signal<Professor | null>(null);

  constructor() {
  const saved = this.getLoggedProfessor();
    if (saved) {
      this.currentProfessor.set(saved);
    }
  }

  // --- REGISTER ---
  register(professor: Professor): Observable<Professor> {
    return this.http.post<Professor>(this.API_URL, professor);
  }

  // --- CHECK EMAIL ---
  emailExists(email: string): Observable<boolean> {
    return this.http.get<Professor[]>(`${this.API_URL}?email=${email}`).pipe(
      map(response => response.length > 0)
    );
  }

  // --- LOGIN ---
  login(email: string, password: string): Observable<boolean> {

  return this.http.get<Professor[]>(`${this.API_URL}?email=${email}&password=${password}`).pipe(
    map((response) => {
      console.log('Respuesta del servidor:', response); // ← DEBUG

      if (!response || response.length === 0) {
        console.log('No se encontró el usuario');
        return false;
      }

      const professor = response[0];
      console.log('Usuario encontrado:', professor);

      // GUARDA EN localStorage
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(professor));
      this.currentProfessor.set(professor);

      console.log('Guardado en localStorage:', localStorage.getItem(this.SESSION_KEY));
      return true;
    })
  );
}
  // --- LOGOUT ---
  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    this.currentProfessor.set(null);
  }

  // --- GET LOGGED USER ---
  getLoggedProfessor(): Professor | null {
    return JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null');
  }

  updatePhoto(userId: number, base64: string) {
    return this.http.patch(`${this.API_URL}/${userId}`, {
      photoUrl: base64
    });
  }
}
