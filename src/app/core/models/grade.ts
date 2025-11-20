export interface Grade 
{
  id?: number;
  courseId: number;
  studentId: number;
  evaluationId: number;
  grade: number; // Backend requiere @NotNull, no puede ser null
}

