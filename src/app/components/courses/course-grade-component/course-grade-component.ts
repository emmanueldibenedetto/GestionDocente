import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Student } from '../../../core/models/student';
import { Evaluation } from '../../../core/models/evaluation';
import { Grade } from '../../../core/models/grade';
import { StudentService } from '../../../core/services/student-service';
import { EvaluationService } from '../../../core/services/evaluation-service';
import { GradeService } from '../../../core/services/grade-service';

@Component({
  selector: 'app-course-grades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-grade-component.html',
  styleUrls: ['./course-grade-component.css']
})

export class CourseGradesComponent implements OnInit {
  @Input({ required: true }) courseId!: number;

  private studentService = inject(StudentService);
  private evaluationService = inject(EvaluationService);
  private gradeService = inject(GradeService);
  private fb = inject(FormBuilder);

  students = signal<Student[]>([]);
  evaluations = signal<Evaluation[]>([]);
  grades = signal<Grade[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  // formulario rápido para crear una evaluación
  evalForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    date: [''] // opcional
  });

  // carga inicial
  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading.set(true);
    this.error.set(null);

    // cargar estudiantes
    this.studentService.getStudentsByCourse(this.courseId).subscribe({
      next: s => this.students.set(s),
      error: () => this.error.set('Error al cargar alumnos')
    });
    console.log("aca tamos");
    // cargar evaluaciones
    this.evaluationService.getEvaluationsByCourse(this.courseId).subscribe({
      next: e => this.evaluations.set(e),
      error: () => this.error.set('Error al cargar evaluaciones')
    });

    // cargar notas
    this.gradeService.getGradesByCourse(this.courseId).subscribe({
      next: g => {
        this.grades.set(g);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar notas');
        this.loading.set(false);
      }
    });
  }

  // helper: obtener nota existente o null
  getGrade(studentId: number, evaluationId: number): number | '' {
    const g = this.grades().find(x => x.studentId === studentId && x.evaluationId === evaluationId);
    return g ? g.grade : '';
  }

  // crear evaluación rápida
  addEvaluation() {
    if (this.evalForm.invalid) return;

    const payload: Omit<Evaluation, 'id'> = {
      courseId: this.courseId,
      nombre: this.evalForm.value.name!.trim(),
      date: this.evalForm.value.date || new Date().toISOString().split('T')[0],
      tipo: 'examen' // Valor por defecto, puede ser configurable
    };

    this.evaluationService.addEvaluation(payload).subscribe({
      next: (created) => {
        // actualizar lista de evaluaciones
        this.evaluations.update(list => [...list, created]);
        this.evalForm.reset();
      },
      error: () => this.error.set('No se pudo crear la evaluación')
    });
  }

  // actualizar o crear nota
  updateGrade(studentId: number, evaluationId: number, rawValue: string) {
    // normalizar: vacío => 0 (backend requiere @NotNull)
    const parsed = rawValue === '' ? 0 : Number(rawValue);
    const value: number = Number.isNaN(parsed) ? 0 : parsed;

    // buscar existente
    const existing = this.grades().find(g => g.studentId === studentId && g.evaluationId === evaluationId);

    // preparar objeto para enviar al backend (Grade)
    const gradePayload: Grade = existing
      ? { ...existing, grade: value }
      : {
          id: undefined,
          courseId: this.courseId,
          studentId,
          evaluationId,
          grade: value
        };

    // llamar al servicio (setGrade maneja POST vs PUT)
    this.gradeService.setGrade(gradePayload).subscribe({
      next: (saved: Grade) => {
        // guardar en signal de forma tipada
        this.grades.update((list: Grade[]): Grade[] => {
          if (existing) {
            return list.map(g => g.id === saved.id ? saved : g);
          }
          return [...list, saved];
        });
      },
      error: () => {
        this.error.set('No se pudo guardar la nota');
      }
    });
  }

  // borrar evaluación (opcional)
  removeEvaluation(evId: number) {
    if (!confirm('¿Eliminar evaluación? Se perderán sus notas.')) return;
    this.evaluationService.deleteEvaluation(evId).subscribe({
      next: () => {
        // quitar evaluación y sus notas locales
        this.evaluations.update(list => list.filter(e => e.id !== evId));
        this.grades.update(list => list.filter(g => g.evaluationId !== evId));
      },
      error: () => this.error.set('No se pudo eliminar la evaluación')
    });
  }
}

