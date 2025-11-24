/**
 * Configuración centralizada de la API
 */
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  PROFESSORS: {
    BASE: '/professors',
    EMAIL_EXISTS: '/professors/email-exists',
    SEARCH: '/professors/search'
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
    AVERAGES: '/grades/course',
    STUDENT_AVERAGE: '/grades/student'
  },
  ATTENDANCES: {
    BASE: '/attendances',
    BY_COURSE: '/attendances/course',
    BY_STUDENT: '/attendances/student',
    PERCENTAGE: '/attendances/student'
  },
  CLASSES: {
    BASE: '/classes'
  }
} as const;

