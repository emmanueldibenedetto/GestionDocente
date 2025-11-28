/**
 * Configuración centralizada de endpoints de la API
 */
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    VERIFY_EMAIL: '/auth/verify-email'
  },
  
  PROFESSORS: {
    BASE: '/professors',
    EMAIL_EXISTS: '/professors/email-exists'
  },
  
  COURSES: {
    BASE: '/courses',
    BY_PROFESSOR: '/courses/professor'
  },
  
  STUDENTS: {
    BASE: '/students',
    BY_COURSE: '/students/course'
  },
  
  EVALUATIONS: {
    BASE: '/evaluations',
    BY_COURSE: '/evaluations/course'
  },
  
  GRADES: {
    BASE: '/grades',
    BY_COURSE: '/grades/course',
    BY_EVALUATION: '/grades/evaluation',
    AVERAGES: '/grades',
    STUDENT_AVERAGE: '/grades/student'
  }
};

