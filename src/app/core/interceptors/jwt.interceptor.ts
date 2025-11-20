import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

/**
 * Interceptor HTTP que agrega el token JWT a todas las peticiones
 * excepto a los endpoints públicos (register, login)
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Endpoints públicos que no requieren token
  const publicEndpoints = ['/auth/register', '/auth/login'];
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    req.url.includes(endpoint)
  );

  // Si es un endpoint público, no agregar token
  if (isPublicEndpoint) {
    return next(req);
  }

  // Obtener token del localStorage
  const token = localStorage.getItem('jwt_token');

  // Si hay token, agregarlo al header Authorization
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Log para debugging (solo en desarrollo)
    if (!req.url.includes('assets')) {
      console.log(`[JWT Interceptor] Agregando token a: ${req.method} ${req.url}`);
    }
    
    return next(clonedRequest);
  }

  // Si no hay token, log warning y enviar la petición sin modificar
  // (el backend retornará 401 si requiere autenticación)
  console.warn(`[JWT Interceptor] No hay token JWT para: ${req.method} ${req.url}`);
  return next(req);
};

