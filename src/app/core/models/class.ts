export interface Class {
  id?: string;        // ← json-server lo genera
  courseId: string;   // ← LO ESTÁS USANDO EN EL FILTRO
  fecha: string;
  notas?: string;
}
