# Decisiones Técnicas - GestionDocente

Este documento detalla las decisiones técnicas tomadas durante el desarrollo del proyecto, explicando el razonamiento detrás de cada elección.

## 1. Framework Frontend: Angular 20

### Decisión
Utilizar Angular 20 como framework principal del frontend.

### Justificación
- **Versión Actual**: Angular 20 es la versión más reciente y estable
- **Standalone Components**: Permite mejor modularidad y tree-shaking
- **Signals**: Nueva API reactiva para gestión de estado
- **TypeScript**: Tipado estático para mayor seguridad en el código
- **Ecosistema Completo**: Router, HTTP Client, Forms integrados

## 2. Backend: Spring Boot vs json-server

### Decisión
Implementar un backend completo con Spring Boot en lugar de usar json-server.

### Justificación
Aunque la consigna sugiere json-server, elegimos Spring Boot por:

1. **Robustez y Escalabilidad**
   - Arquitectura empresarial probada
   - Manejo de errores y excepciones robusto
   - Preparado para producción

2. **Seguridad Real**
   - Implementación completa de JWT
   - Validaciones de seguridad en backend
   - Protección contra ataques comunes (SQL Injection, XSS)

3. **Base de Datos Real**
   - Persistencia con MySQL
   - Transacciones ACID
   - Relaciones entre entidades bien definidas

4. **Valor Educativo**
   - Experiencia con tecnologías utilizadas en la industria
   - Arquitectura RESTful completa
   - Buenas prácticas de desarrollo

5. **Funcionalidades Avanzadas**
   - Cálculo de promedios en backend
   - Validaciones de negocio complejas
   - Sistema de roles y permisos

### Consideración
Esta decisión puede ser vista como una mejora sobre el requisito mínimo, ya que proporciona una solución más completa y profesional.

## 3. Autenticación: JWT (JSON Web Tokens)

### Decisión
Implementar autenticación basada en JWT.

### Justificación
- **Stateless**: No requiere almacenamiento de sesión en servidor
- **Escalable**: Funciona bien en arquitecturas distribuidas
- **Seguro**: Tokens firmados y con expiración
- **Estándar de la Industria**: Ampliamente utilizado

### Implementación
- Token almacenado en localStorage
- Interceptor HTTP agrega token automáticamente
- Guards verifican validez del token
- Refresh token opcional para futuras mejoras

## 4. Guards de Rutas: Functional Guards

### Decisión
Implementar guards como funciones (functional guards) en lugar de clases.

### Justificación
- **Nuevo Enfoque de Angular**: Recomendado desde Angular 15+
- **Más Simple**: Menos código boilerplate
- **Type-Safe**: Mejor integración con TypeScript
- **Testeable**: Más fácil de probar

### Implementación
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  // Lógica del guard
};
```

## 5. Gestión de Estado: Angular Signals

### Decisión
Utilizar Angular Signals para gestión de estado reactivo.

### Justificación
- **Nativo de Angular**: Parte del core framework
- **Reactivo**: Actualizaciones automáticas de la UI
- **Simple**: Menos complejidad que RxJS para casos simples
- **Performance**: Optimizaciones automáticas

### Uso
- Signals para estado local de componentes
- RxJS para operaciones asíncronas (HTTP)
- Combinación de ambos según necesidad

## 6. Diseño Responsive: Mobile First

### Decisión
Implementar diseño responsive con enfoque Mobile First.

### Justificación
- **Tendencia Actual**: Mayor uso de dispositivos móviles
- **Mejor UX**: Experiencia optimizada para todos los dispositivos
- **Requisito del TP**: Necesario para nota superior
- **Accesibilidad**: Mejor acceso desde cualquier dispositivo

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 7. Validaciones: Frontend y Backend

### Decisión
Implementar validaciones tanto en frontend como backend.

### Justificación
- **UX Mejorada**: Feedback inmediato al usuario
- **Seguridad**: Backend valida siempre (nunca confiar solo en frontend)
- **Doble Capa**: Defensa en profundidad
- **Mejor Experiencia**: Validaciones frontend para UX, backend para seguridad

### Implementación
- **Frontend**: Validators de Angular Forms
- **Backend**: Anotaciones de Jakarta Validation
- **Mensajes**: Claros y específicos en ambos lados

## 8. Estructura de Componentes: Standalone

### Decisión
Utilizar componentes standalone en lugar de módulos.

### Justificación
- **Modularidad**: Cada componente es independiente
- **Tree-Shaking**: Mejor optimización del bundle
- **Simplicidad**: Menos configuración
- **Futuro de Angular**: Dirección hacia la que va Angular

## 9. Base de Datos: MySQL

### Decisión
Utilizar MySQL como base de datos relacional.

### Justificación
- **Relaciones**: Necesarias para el modelo de datos (Cursos, Estudiantes, etc.)
- **ACID**: Garantías de consistencia
- **Escalabilidad**: Preparado para crecimiento
- **Estándar**: Ampliamente utilizado en la industria

## 10. Interceptores HTTP

### Decisión
Implementar interceptor para agregar token JWT automáticamente.

### Justificación
- **DRY**: No repetir código en cada servicio
- **Centralizado**: Manejo de autenticación en un solo lugar
- **Mantenible**: Fácil de modificar o extender
- **Estándar**: Patrón común en aplicaciones Angular

## 11. Manejo de Errores

### Decisión
Implementar manejo de errores centralizado y específico.

### Justificación
- **UX**: Mensajes claros al usuario
- **Debugging**: Mejor información para desarrolladores
- **Consistencia**: Mismo formato de errores en toda la app
- **Recuperación**: Estrategias de manejo de errores

## 12. Diseño Visual

### Decisión
Invertir tiempo en diseño visual y UX.

### Justificación
- **Profesionalismo**: Aplicación se ve profesional
- **Usabilidad**: Mejor experiencia de usuario
- **Requisito TP**: Necesario para nota superior
- **Diferencia**: Destaca sobre otros proyectos

## Conclusiones

Todas las decisiones técnicas fueron tomadas considerando:
1. **Requisitos del TP**: Cumplir y superar expectativas
2. **Mejores Prácticas**: Seguir estándares de la industria
3. **Escalabilidad**: Preparar el código para crecimiento futuro
4. **Mantenibilidad**: Código limpio y bien documentado
5. **Experiencia de Usuario**: Priorizar la usabilidad

Estas decisiones resultan en una aplicación robusta, escalable y profesional que cumple con todos los requisitos del TP y va más allá en términos de calidad y funcionalidad.

