export interface Evaluation 
{
    id?: number;
    courseId: number;
    nombre: string;       // Ej: "Parcial 1", "TP", etc.
    date: string;         // Fecha en formato ISO string
    tipo: string;         // Ej: "examen", "práctica", "tarea"
}
export type EvaluationCreate = Omit<Evaluation, 'id'>;
