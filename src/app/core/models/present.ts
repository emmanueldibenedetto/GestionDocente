export interface Present {
    id?: string;
    courseId?: string; //Volverlo obligatorio luego
    studentId: string;
    date: string;
    present: boolean;
    late?: boolean;
    justify?: boolean;
}
