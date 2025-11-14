export interface Student {
    id: string;
  firstName: string;
  lastName?: string;
  cel?: string;
  email?: string;
  document?: string; // DNI o Legajo
  courseId: string; // a qué curso pertenece
}
export type StudentCreate = Omit<Student, 'id'>;
