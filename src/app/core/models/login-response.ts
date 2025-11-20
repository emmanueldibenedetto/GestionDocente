import { Professor } from './professor';

/**
 * Respuesta del endpoint de login del backend
 */
export interface LoginResponse {
  token: string;
  expiresIn: number; // en segundos
  professor: Professor;
}

