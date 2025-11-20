# Guía de Debugging - Frontend-Backend

## Errores Comunes y Cómo Identificarlos

### 1. Error: "No se pudo conectar con el servidor" (Status 0)

**Causa:** El frontend no puede alcanzar el backend.

**Síntomas:**
- Error en consola: `ERR_CONNECTION_REFUSED` o `ERR_FAILED`
- Status code: 0
- No hay respuesta del servidor

**Soluciones:**
1. Verificar que el backend esté corriendo en `http://localhost:8080`
2. Verificar que no haya firewall bloqueando el puerto 8080
3. Verificar la URL en `api.config.ts` sea correcta

---

### 2. Error: "No estás autenticado" (Status 401)

**Causa:** El token JWT no está presente o es inválido.

**Síntomas:**
- Status code: 401 Unauthorized
- Mensaje del backend: "Full authentication is required to access this resource"

**Soluciones:**
1. Verificar en consola del navegador (F12):
   ```javascript
   localStorage.getItem('jwt_token')
   ```
   Debe retornar un token (string largo).

2. Si no hay token:
   - Hacer login nuevamente
   - Verificar que el login esté guardando el token correctamente

3. Si hay token pero sigue dando 401:
   - El token puede haber expirado (verificar `expiresIn` en login)
   - Verificar que el interceptor JWT esté agregando el header `Authorization: Bearer {token}`

**Verificar en Network tab (F12):**
- Abrir pestaña Network
- Hacer una petición (ej: crear curso)
- Verificar que el header `Authorization` esté presente en la petición

---

### 3. Error CORS (Cross-Origin Resource Sharing)

**Causa:** El backend no permite peticiones desde el origen del frontend.

**Síntomas:**
- Error en consola: `Access to XMLHttpRequest at 'http://localhost:8080/api/...' from origin 'http://localhost:4200' has been blocked by CORS policy`
- Status code: 0 o sin respuesta

**Soluciones:**
1. Verificar que `CorsConfig.java` esté configurado correctamente
2. Verificar que `SecurityConfig.java` incluya la configuración CORS
3. Reiniciar el backend después de cambios en CORS

**Verificar configuración CORS:**
- El backend debe permitir origen: `http://localhost:4200`
- El backend debe permitir métodos: GET, POST, PUT, DELETE, OPTIONS
- El backend debe permitir headers: Authorization, Content-Type

---

### 4. Error: "No puede crear cursos para otros profesores"

**Causa:** El `professorId` en el body no coincide con el del JWT.

**Solución:**
- El backend obtiene el `professorId` del JWT automáticamente
- No es necesario (y puede causar problemas) enviar `professorId` en el body
- El backend validará que coincidan si se envía

---

### 5. Error: "El profesor autenticado no existe en la base de datos"

**Causa:** El token JWT contiene un `professorId` que no existe en la BD.

**Solución:**
- Verificar que el usuario esté registrado correctamente
- Hacer login nuevamente para obtener un token válido

---

## Cómo Verificar que Todo Funciona

### 1. Verificar Token JWT
```javascript
// En consola del navegador (F12)
localStorage.getItem('jwt_token')
// Debe retornar un string largo (el token)
```

### 2. Verificar Peticiones HTTP
1. Abrir DevTools (F12)
2. Ir a pestaña "Network"
3. Hacer una acción (ej: crear curso)
4. Verificar:
   - Status code: 201 (Created) o 200 (OK)
   - Request Headers: debe incluir `Authorization: Bearer {token}`
   - Response: debe tener los datos esperados

### 3. Verificar Logs del Backend
- Revisar la ventana de PowerShell del backend
- Buscar errores o excepciones
- Verificar que las peticiones lleguen al backend

### 4. Verificar Logs del Frontend
- Revisar la consola del navegador (F12)
- Buscar mensajes de `[JWT Interceptor]`
- Verificar errores de JavaScript

---

## Comandos Útiles para Debugging

### En Consola del Navegador (F12)

```javascript
// Ver token JWT
localStorage.getItem('jwt_token')

// Ver profesor guardado
localStorage.getItem('loggedProfessor')

// Limpiar todo (útil para resetear)
localStorage.clear()

// Ver todas las peticiones HTTP
// (usar pestaña Network en DevTools)
```

### Verificar Backend

```powershell
# Verificar que el backend esté corriendo
Test-NetConnection -ComputerName localhost -Port 8080

# Probar endpoint directamente
Invoke-WebRequest -Uri "http://localhost:8080/api/courses" -Method GET
```

---

## Checklist de Verificación

Antes de reportar un error, verifica:

- [ ] Backend está corriendo en puerto 8080
- [ ] Frontend está corriendo en puerto 4200
- [ ] Hay un token JWT en `localStorage.getItem('jwt_token')`
- [ ] El token no ha expirado
- [ ] Las peticiones incluyen el header `Authorization`
- [ ] No hay errores CORS en la consola
- [ ] Los logs del backend no muestran errores
- [ ] La base de datos MySQL está corriendo

