export interface Evaluation 
{
    id?: string;
    courseId: string;
    nombre: string;       // Ej: "Parcial 1", "TP", etc.podría ser Date, pero string simplifica con json-server
    date : string;
}
export type EvaluationCreate = Omit<Evaluation, 'id'>;
