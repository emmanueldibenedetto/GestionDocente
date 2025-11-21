// src/app/services/professor.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Professor } from '../models/professor';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfessorService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/professors';

  // Opcional: cache reactivo (muy útil)
  private cache = signal<Professor[] | null>(null);

  /** Obtiene todos los profesores (con cache opcional) */
  getAll(): Observable<Professor[]> {
    // Si ya tenés cache, devolvés directo (más rápido)
    if (this.cache()) {
      return of(this.cache()!);
    }

    return this.http.get<Professor[]>(this.API_URL).pipe(
      tap(data => {
        // Ordenar por ID descendente (más nuevos primero)
        const sorted = data.sort((a, b) => (b.id || 0) - (a.id || 0));
        this.cache.set(sorted);
      }),
      catchError(err => {
        console.error('Error cargando profesores:', err);
        throw err;
      })
    );
  }

  /** Fuerza recarga (útil después de crear/eliminar) */
  refresh(): void {
    this.cache.set(null);
  }

  /** Obtiene uno por ID */
  getById(id: number | string): Observable<Professor> {
    return this.http.get<Professor>(`${this.API_URL}/${id}`);
  }

  /** Eliminar (lo vas a usar después) */
  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => this.refresh())
    );
  }

  /** Actualiza un profesor existente */
update(id: number | string, data: Partial<Professor>): Observable<Professor> {
  return this.http.put<Professor>(`${this.API_URL}/${id}`, data).pipe(
    tap(() => {
      // invalida cache para que getAll vuelva a pedir datos actualizados
      this.refresh();
    }),
    catchError(err => {
      console.error('Error actualizando profesor:', err);
      throw err;
    })
  );
}

}