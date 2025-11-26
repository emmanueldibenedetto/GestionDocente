# GestionDocente - Sistema de Gestión Académica

Una aplicación web completa desarrollada en Angular 20 que permite a los profesores gestionar sus cursos, estudiantes, evaluaciones, notas y asistencias de manera eficiente y organizada.

## 📋 Tabla de Contenidos

- [Inicio Rápido](#-inicio-rápido)
- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Funcionalidades](#funcionalidades)
- [Seguridad y Autenticación](#seguridad-y-autenticación)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Solución de Problemas](#-solución-de-problemas-comunes)
- [Contribuidores](#contribuidores)
- [Licencia](#licencia)

## 🚀 Inicio Rápido

¿Quieres empezar rápido? Sigue estos pasos:

### 1. Clonar Repositorios

```bash
# Frontend
git clone https://github.com/emmanueldibenedetto/GestionDocente.git
cd GestionDocente

# Backend (en otra terminal o carpeta)
git clone https://github.com/juanfranpaezz/GestionDocenteBackend.git
cd GestionDocenteBackend
```

### 2. Configurar Backend

1. Edita `src/main/resources/application.properties` y configura MySQL:
   ```properties
   spring.datasource.password=tu_contraseña_mysql
   ```

2. Asegúrate de que MySQL esté corriendo

3. Ejecuta el backend:
   ```bash
   .\mvnw.cmd spring-boot:run  # Windows
   # o
   ./mvnw spring-boot:run      # Linux/Mac
   ```

### 3. Instalar y Ejecutar Frontend

En otra terminal:

```bash
cd GestionDocente
npm install
npm start
```

### 4. Abrir la Aplicación

Abre tu navegador en: **http://localhost:4200**

**¡Listo!** Ya puedes registrarte y comenzar a usar la aplicación.

---

## 📖 Descripción

GestionDocente es una aplicación web diseñada para facilitar la gestión académica de profesores. Permite administrar cursos, estudiantes, evaluaciones, calificaciones y asistencias de manera centralizada y eficiente.

### Características Principales

- ✅ **Gestión de Cursos**: Crear, editar, eliminar y listar cursos
- ✅ **Gestión de Estudiantes**: CRUD completo de estudiantes por curso
- ✅ **Sistema de Evaluaciones**: Crear y gestionar evaluaciones (parciales, exámenes, etc.)
- ✅ **Planilla de Notas**: Sistema completo de calificaciones con promedios automáticos
- ✅ **Control de Asistencias**: Registro de asistencias con cálculo de porcentajes
- ✅ **Sistema de Autenticación**: Login con roles (PROFESSOR, ADMIN)
- ✅ **Guards de Rutas**: Protección de rutas basada en autenticación y roles
- ✅ **Diseño Responsive**: Completamente adaptable a móviles, tablets y escritorio
- ✅ **Interfaz Moderna**: Diseño profesional con mejoras estéticas

## 🚀 Tecnologías Utilizadas

### Frontend
- **Angular 20.3.0**: Framework principal
- **TypeScript 5.9.2**: Lenguaje de programación
- **Angular Material 20.2.12**: Componentes UI
- **RxJS 7.8.0**: Programación reactiva
- **CSS3**: Estilos personalizados y responsive design

### Backend
- **Spring Boot**: Framework backend
- **Java**: Lenguaje de programación
- **JWT (JSON Web Tokens)**: Autenticación y autorización
- **MySQL**: Base de datos relacional
- **JPA/Hibernate**: ORM para persistencia

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### Frontend
- **Node.js** (versión 18 o superior)
- **npm** (versión 9 o superior) - viene con Node.js
- **Angular CLI** (versión 20.3.6 o superior) - se instala con npm

### Backend (requerido para que funcione el frontend)
- **Java JDK** (versión 21 o superior)
- **Maven** (versión 3.6 o superior) - opcional, el proyecto incluye Maven Wrapper
- **MySQL** (versión 8.0 o superior) - para la base de datos

### Verificar Instalación

```bash
# Verificar Node.js y npm
node -v
npm -v

# Verificar Angular CLI
ng version

# Verificar Java (para backend)
java -version
```

## 🔧 Instalación

### Paso 1: Clonar Repositorios

#### Frontend
```bash
git clone https://github.com/emmanueldibenedetto/GestionDocente.git
cd GestionDocente
```

#### Backend (en otra carpeta)
```bash
git clone https://github.com/juanfranpaezz/GestionDocenteBackend.git
cd GestionDocenteBackend
```

### Paso 2: Configurar y Ejecutar el Backend

**⚠️ IMPORTANTE: El backend debe estar ejecutándose antes de iniciar el frontend.**

1. **Configurar MySQL** en `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/GestionDocenteDB?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=tu_contraseña_mysql
   ```

2. **Asegúrate de que MySQL esté corriendo**

3. **Ejecutar el backend**:
   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run
   
   # Linux/Mac
   ./mvnw spring-boot:run
   ```

4. **Verificar que el backend esté funcionando**:
   - Abre: http://localhost:8080/api/auth/me
   - Deberías ver una respuesta (aunque sea un error de autenticación, significa que el servidor está corriendo)

**Para más detalles sobre el backend, consulta el README del repositorio del backend.**

### Paso 3: Instalar Dependencias del Frontend

```bash
# Volver a la carpeta del frontend
cd GestionDocente

# Instalar dependencias
npm install
```

**Nota**: La primera vez puede tardar varios minutos mientras descarga todas las dependencias.

## ⚙️ Configuración

### Frontend

La configuración del backend ya está establecida en `src/app/core/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  // ... resto de la configuración
};
```

**Si cambias el puerto del backend**, actualiza esta URL.

### Backend

La configuración del backend se encuentra en `src/main/resources/application.properties` del proyecto backend.

**Configuración mínima requerida**:

```properties
# Base de datos MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/GestionDocenteDB?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=tu_contraseña_mysql

# Puerto del servidor
server.port=8080
```

**Nota**: La base de datos se crea automáticamente si no existe gracias a `createDatabaseIfNotExist=true`.

## 🏃 Ejecución

### ⚠️ Orden de Ejecución

**IMPORTANTE**: Siempre ejecuta primero el backend, luego el frontend.

### Paso 1: Ejecutar el Backend

```bash
# Navegar a la carpeta del backend
cd GestionDocenteBackend

# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

**Verificar que el backend esté corriendo**:
- Espera a ver el mensaje: `Started GestionDocenteBackendApplication in X.XXX seconds`
- El servidor estará disponible en: **http://localhost:8080**

### Paso 2: Ejecutar el Frontend

Abre una **nueva terminal** (deja el backend corriendo):

```bash
# Navegar a la carpeta del frontend
cd GestionDocente

# Ejecutar en modo desarrollo
npm start
# o
ng serve
```

**La aplicación estará disponible en**: **http://localhost:4200**

### Verificar que Todo Funciona

1. **Backend**: Abre http://localhost:8080/api/auth/me (debería responder)
2. **Frontend**: Abre http://localhost:4200 (debería cargar la aplicación)
3. **Probar login**: Intenta registrarte o iniciar sesión

### Detener los Servidores

- **Backend**: Presiona `Ctrl + C` en la terminal del backend
- **Frontend**: Presiona `Ctrl + C` en la terminal del frontend

## 📁 Estructura del Proyecto

```
GestionDocente/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── courses/         # Componentes de cursos
│   │   │   ├── headers/         # Componentes de navegación
│   │   │   └── footers/         # Componentes de pie de página
│   │   ├── core/
│   │   │   ├── guards/          # Guards de autenticación y roles
│   │   │   ├── interceptors/    # Interceptores HTTP
│   │   │   ├── models/          # Modelos de datos
│   │   │   ├── services/        # Servicios Angular
│   │   │   └── config/          # Configuración
│   │   ├── pages/               # Páginas principales
│   │   │   ├── courses/         # Páginas de cursos
│   │   │   ├── login-page/      # Página de login
│   │   │   └── register-page/   # Página de registro
│   │   ├── enums/               # Enumeraciones
│   │   ├── validators/           # Validadores personalizados
│   │   ├── app.routes.ts         # Configuración de rutas
│   │   └── app.ts                # Componente raíz
│   ├── assets/                   # Recursos estáticos
│   └── main.ts                   # Punto de entrada
├── angular.json                   # Configuración de Angular
├── package.json                   # Dependencias
└── README.md                      # Este archivo
```

## 🏗️ Arquitectura

### Patrón de Diseño

La aplicación sigue una arquitectura modular basada en componentes standalone de Angular:

- **Componentes Standalone**: Cada componente es independiente y auto-contenido
- **Servicios**: Lógica de negocio y comunicación con el backend
- **Guards**: Protección de rutas basada en autenticación y roles
- **Interceptores**: Manejo de tokens JWT en peticiones HTTP
- **Signals**: Gestión de estado reactivo con Angular Signals

### Flujo de Autenticación

1. Usuario inicia sesión con email y contraseña
2. Backend valida credenciales y retorna JWT token
3. Token se almacena en localStorage
4. Guards verifican autenticación en cada ruta protegida
5. Interceptor agrega token a todas las peticiones HTTP

### Roles de Usuario

- **PROFESSOR**: Acceso a gestión de cursos, estudiantes, evaluaciones y notas
- **ADMIN**: Acceso completo incluyendo gestión de profesores

## 🎯 Funcionalidades

### Gestión de Cursos
- Crear nuevos cursos
- Editar información de cursos existentes
- Eliminar cursos
- Listar todos los cursos del profesor

### Gestión de Estudiantes
- Agregar estudiantes a un curso
- Editar información de estudiantes
- Eliminar estudiantes
- Ver promedio de calificaciones por estudiante

### Sistema de Evaluaciones
- Crear evaluaciones (parciales, exámenes, etc.)
- Asignar fechas a evaluaciones
- Validación de duplicados (mismo nombre y fecha)
- Eliminar evaluaciones

### Planilla de Notas
- Ingresar calificaciones por estudiante y evaluación
- Cálculo automático de promedios
- Validación de rangos (0-10)
- Visualización en tabla interactiva

### Control de Asistencias
- Registrar asistencias por fecha
- Marcar presente/ausente
- Cálculo automático de porcentaje de asistencia
- Guardado masivo de asistencias

## 🔒 Seguridad y Autenticación

### Guards Implementados

1. **authGuard**: Protege rutas que requieren autenticación
   - Verifica si el usuario tiene un token JWT válido
   - Redirige al login si no está autenticado

2. **roleGuard**: Protege rutas basadas en roles
   - Verifica autenticación y rol del usuario
   - Permite acceso solo a usuarios con roles específicos

### Ejemplo de Uso de Guards

```typescript
// Ruta protegida por autenticación
{ 
  path: 'course/list', 
  component: CoursesPage,
  canActivate: [authGuard]
}

// Ruta protegida por rol
{ 
  path: 'professors/list', 
  component: ProfessorsListPage,
  canActivate: [authGuard, roleGuard],
  data: { roles: [Role.ADMIN] }
}
```

## 💡 Decisiones Técnicas

### ¿Por qué Spring Boot en lugar de json-server?

Aunque la consigna sugiere json-server, elegimos Spring Boot por las siguientes razones:

1. **Robustez**: Spring Boot proporciona una arquitectura más robusta y escalable
2. **Seguridad**: Implementación real de JWT, validaciones y seguridad
3. **Base de Datos Real**: Persistencia real con MySQL en lugar de archivos JSON
4. **Preparación para Producción**: El código está listo para despliegue en producción
5. **Experiencia de Aprendizaje**: Mayor valor educativo al trabajar con tecnologías empresariales

### Arquitectura Frontend

- **Standalone Components**: Utilizamos componentes standalone para mejor modularidad
- **Signals**: Implementamos Angular Signals para gestión de estado reactivo
- **Functional Guards**: Guards implementados como funciones (nuevo enfoque de Angular)
- **Interceptores**: Manejo centralizado de autenticación HTTP

### Diseño Responsive

- **Mobile First**: Diseño pensado primero para móviles
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Menú Hamburguesa**: Navegación optimizada para móviles
- **Tablas Adaptativas**: Conversión a cards en dispositivos móviles

## 📊 CRUDs Implementados

1. **Cursos** (Course)
   - Create, Read, Update, Delete
   - Listado por profesor

2. **Estudiantes** (Student)
   - Create, Read, Update, Delete
   - Asociación a cursos
   - Validaciones de datos

3. **Evaluaciones** (Evaluation)
   - Create, Read, Delete
   - Validación de duplicados

4. **Notas** (Grade)
   - Create, Update
   - Cálculo de promedios

5. **Asistencias** (Attendance)
   - Create, Update
   - Cálculo de porcentajes

6. **Profesores** (Professor) - Solo ADMIN
   - Read, Update, Delete
   - Búsqueda por apellido

## 🎨 Mejoras Estéticas

- Diseño moderno con gradientes y sombras
- Transiciones suaves en interacciones
- Iconos y emojis para mejor UX
- Mensajes de error y éxito estilizados
- Formularios con validación visual
- Tablas con hover effects
- Botones con estados activos

## 📱 Diseño Responsive

- Menú hamburguesa para móviles
- Tablas convertidas a cards en pantallas pequeñas
- Formularios apilados verticalmente en móvil
- Grid de cursos adaptativo (1 columna móvil, 2 tablet, múltiples desktop)
- Botones full-width en móvil
- Tipografía optimizada para diferentes tamaños de pantalla

## 🧪 Testing y Build

### Frontend

```bash
# Tests unitarios
npm test

# Build de producción
npm run build

# El build estará en la carpeta dist/
```

### Backend

```bash
# Tests unitarios
mvn test

# Build de producción (crea JAR)
mvn clean package

# El JAR estará en: target/Gestion-Docente-Backend-0.0.1-SNAPSHOT.jar
```

## ⚠️ Solución de Problemas Comunes

### Error: "Cannot GET /api/..."

**Causa**: El backend no está corriendo o está en otro puerto.

**Solución**:
1. Verifica que el backend esté ejecutándose en http://localhost:8080
2. Verifica la URL en `src/app/core/config/api.config.ts`

### Error: "Network Error" o "CORS Error"

**Causa**: El backend no está permitiendo peticiones desde el frontend.

**Solución**: El backend ya tiene CORS configurado. Si persiste el error:
1. Verifica que el backend esté corriendo
2. Verifica que la URL del backend sea correcta

### Error: "npm install" falla

**Causa**: Problemas con la conexión o permisos.

**Solución**:
```bash
# Limpiar caché de npm
npm cache clean --force

# Intentar de nuevo
npm install
```

### Error: "Puerto 4200 ya está en uso"

**Solución**: Cambia el puerto:
```bash
ng serve --port 4201
```

### Error: "No se puede conectar a MySQL"

**Causa**: MySQL no está corriendo o las credenciales son incorrectas.

**Solución**:
1. Verifica que MySQL esté corriendo
2. Verifica las credenciales en `application.properties` del backend
3. Verifica que la base de datos exista o que `createDatabaseIfNotExist=true` esté configurado

## 📝 Registro de Cambios

### Versión 1.0.0
- ✅ Implementación completa de CRUDs
- ✅ Sistema de autenticación con JWT
- ✅ Guards de rutas (authGuard, roleGuard)
- ✅ Diseño responsive completo
- ✅ Validaciones frontend y backend
- ✅ Mejoras estéticas
- ✅ Sistema de asistencias
- ✅ Cálculo de promedios automático

## 👥 Contribuidores

- [Emmanuel Di Benedetto](https://github.com/emmanueldibenedetto)
- [Juan Francisco Paez](https://github.com/juanfranpaezz)

## 📄 Licencia

Este proyecto fue desarrollado como Trabajo Práctico Final para la materia Programación IV - UTN Mar del Plata.

## 🔗 Enlaces Relacionados

- **Frontend Repository**: https://github.com/emmanueldibenedetto/GestionDocente
- **Backend Repository**: https://github.com/juanfranpaezz/GestionDocenteBackend

## 📞 Contacto

Para consultas o sugerencias, contactar a los contribuidores a través de GitHub.

---

**Desarrollado con ❤️ usando Angular 20**
