import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Student } from '../../../core/models/student';
import { Present } from '../../../core/models/present';
import { StudentService } from '../../../core/services/student-service';
import { PresentService } from '../../../core/services/present-service';

@Component({
  selector: 'app-course-attendance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe],
  templateUrl: './course-asistent-component.html',
  styleUrls: ['./course-asistent-component.css']
})
export class CourseAttendanceComponent implements OnInit {
  @Input({ required: true }) courseId!: number;

  private studentService = inject(StudentService);
  private presentService = inject(PresentService);
  private fb = inject(FormBuilder);

  students = signal<Student[]>([]);
  attendances = signal<Present[]>([]);
  attendancePercentages = signal<Map<number, number>>(new Map());
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Estado temporal de asistencias antes de guardar
  pendingAttendances = signal<Map<number, boolean>>(new Map());

  attendanceForm = this.fb.nonNullable.group({
    date: [this.selectedDate(), Validators.required]
  });

  ngOnInit() {
    this.loadStudents();
    this.loadAttendances();
  }

  loadAttendancePercentages() {
    const students = this.students();
    if (students.length === 0) {
      return;
    }

    // Limpiar porcentajes anteriores
    this.attendancePercentages.set(new Map());

    let completed = 0;
    const total = students.length;

    students.forEach(student => {
      if (student.id) {
        this.presentService.getAttendancePercentage(student.id, this.courseId).subscribe({
          next: percentage => {
            this.attendancePercentages.update(map => {
              const newMap = new Map(map);
              newMap.set(student.id!, percentage);
              return newMap;
            });
            completed++;
          },
          error: (err) => {
            console.error(`Error al obtener porcentaje para estudiante ${student.id}:`, err);
            // En caso de error, establecer 0 como fallback
            this.attendancePercentages.update(map => {
              const newMap = new Map(map);
              newMap.set(student.id!, 0);
              return newMap;
            });
            completed++;
          }
        });
      } else {
        completed++;
      }
    });
  }

  loadStudents() {
    this.studentService.getStudentsByCourse(this.courseId).subscribe({
      next: students => {
        this.students.set(students);
        // Cargar porcentajes después de cargar estudiantes
        if (students.length > 0) {
          this.loadAttendancePercentages();
        }
      },
      error: () => this.error.set('Error al cargar estudiantes')
    });
  }

  loadAttendances() {
    this.presentService.getAttendancesByCourse(this.courseId).subscribe({
      next: attendances => this.attendances.set(attendances),
      error: () => this.error.set('Error al cargar asistencias')
    });
  }

  onDateChange(date: string) {
    this.selectedDate.set(date);
    this.pendingAttendances.set(new Map()); // Limpiar cambios pendientes
    this.loadAttendances();
    // Recargar porcentajes después de cambiar la fecha
    this.loadAttendancePercentages();
  }

  toggleAttendance(studentId: number, present: boolean) {
    // Solo actualizar el estado temporal, no guardar todavía
    this.pendingAttendances.update(map => {
      const newMap = new Map(map);
      newMap.set(studentId, present);
      return newMap;
    });
  }

  updateAttendancePercentage(studentId: number) {
    this.presentService.getAttendancePercentage(studentId, this.courseId).subscribe({
      next: percentage => {
        this.attendancePercentages.update(map => {
          const newMap = new Map(map);
          newMap.set(studentId, percentage);
          return newMap;
        });
      },
      error: () => {
        // Ignorar errores
      }
    });
  }

  isPresent(studentId: number): boolean {
    // Primero verificar si hay un cambio pendiente
    const pending = this.pendingAttendances().get(studentId);
    if (pending !== undefined) {
      return pending;
    }
    
    // Si no hay cambio pendiente, verificar asistencia guardada
    const date = this.selectedDate();
    const attendance = this.attendances().find(
      a => a.studentId === studentId && a.date === date
    );
    return attendance?.present ?? true; // Por defecto: presente
  }

  getAttendancePercentage(studentId: number): number {
    return this.attendancePercentages().get(studentId) ?? 0;
  }

  // Guardar todas las asistencias: crea o actualiza asistencias para TODOS los estudiantes
  // Usa los valores seleccionados (pendientes) o "presente" (true) por defecto si no hay selección
  saveAllAttendances() {
    const date = this.selectedDate();
    const students = this.students();
    const pending = this.pendingAttendances();
    const attendances = this.attendances();
    
    this.loading.set(true);
    this.error.set(null);

    let completed = 0;
    let total = students.length;

    if (total === 0) {
      this.loading.set(false);
      return;
    }

    // Procesar TODOS los estudiantes
    students.forEach(student => {
      if (!student.id) {
        completed++;
        if (completed === total) {
          this.finishSaving();
        }
        return;
      }

      // Determinar el valor a guardar:
      // 1. Si hay un cambio pendiente (seleccionado por el usuario), usar ese valor
      // 2. Si no hay cambio pendiente pero ya tiene asistencia guardada, mantener ese valor
      // 3. Si no hay cambio pendiente ni asistencia guardada, usar "presente" (true) por defecto
      const pendingValue = pending.get(student.id);
      const existing = attendances.find(
        a => a.studentId === student.id && a.date === date
      );

      let valueToSave: boolean;
      if (pendingValue !== undefined) {
        // Hay cambio pendiente (usuario seleccionó presente/ausente), usar ese valor
        valueToSave = pendingValue;
      } else if (existing) {
        // No hay cambio pendiente pero ya tiene asistencia guardada, mantener el valor actual
        valueToSave = existing.present;
      } else {
        // No hay cambio pendiente ni asistencia guardada, usar "presente" (true) por defecto
        valueToSave = true;
      }

      // Crear o actualizar asistencia
      if (existing) {
        // Ya existe, actualizar solo si el valor cambió
        if (existing.present !== valueToSave) {
          const updatedAttendance: Present = {
            ...existing,
            present: valueToSave
          };

          this.presentService.updateAttendance(existing.id!, updatedAttendance).subscribe({
            next: updated => {
              this.attendances.update(list =>
                list.map(a => a.id === updated.id ? updated : a)
              );
              completed++;
              if (completed === total) {
                this.finishSaving();
              }
            },
            error: () => {
              this.error.set(`Error al guardar asistencia para ${student.firstName} ${student.lastName}`);
              completed++;
              if (completed === total) {
                this.finishSaving();
              }
            }
          });
        } else {
          // El valor no cambió, solo contar
          completed++;
          if (completed === total) {
            this.finishSaving();
          }
        }
      } else {
        // No existe, crear nueva
        const newAttendance: Present = {
          id: undefined,
          date,
          present: valueToSave,
          courseId: this.courseId,
          studentId: student.id
        };

        this.presentService.markAttendance(newAttendance).subscribe({
          next: created => {
            this.attendances.update(list => [...list, created]);
            completed++;
            if (completed === total) {
              this.finishSaving();
            }
          },
          error: () => {
            this.error.set(`Error al guardar asistencia para ${student.firstName} ${student.lastName}`);
            completed++;
            if (completed === total) {
              this.finishSaving();
            }
          }
        });
      }
    });
  }

  private finishSaving() {
    this.loading.set(false);
    this.pendingAttendances.set(new Map()); // Limpiar cambios pendientes
    this.loadAttendances(); // Recargar lista completa desde el backend
    // Recargar porcentajes después de guardar para mostrar el promedio actualizado
    // El delay asegura que el backend haya procesado todos los cambios
    setTimeout(() => {
      this.loadAttendancePercentages();
    }, 800);
  }
}

