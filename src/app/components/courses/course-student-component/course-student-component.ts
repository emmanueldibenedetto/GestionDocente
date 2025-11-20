import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { StudentService } from '../../../core/services/student-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Student, StudentCreate } from '../../../core/models/student';
import { Course } from '../../../core/models/course';
import { CourseService } from '../../../core/services/course-service';

@Component({
  selector: 'app-course-students',
  imports: [ReactiveFormsModule],
  templateUrl: './course-student-component.html',
  styleUrl: './course-student-component.css',
})
export class CourseStudentComponent implements OnInit
{
  @Input() courseId!: number;

  @Output() studentAdded = new EventEmitter<Student>();

  private studentService = inject(StudentService);
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);

  students = signal<Student[]>([]);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: [''],
    cel: [''],
    email: [''],
    document: [''],
  });

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    console.log('📚 Cargando estudiantes del curso ID:', this.courseId);
    this.studentService.getStudentsByCourse(this.courseId).subscribe({
      next: (students) => {
        console.log('✅ Estudiantes cargados:', students);
        this.students.set(students);
        this.errorMessage.set(null);
      },
      error: (err) => {
        console.error('❌ Error al cargar alumnos:', err);
        let errorMsg = 'Error al cargar alumnos';
        if (err.error?.error) {
          errorMsg = err.error.error;
        }
        this.errorMessage.set(errorMsg);
      }
    });
  }

  addStudent() {
    if (this.form.invalid) {
      this.errorMessage.set('Por favor completa el nombre del alumno.');
      return;
    }

    const newStudent: StudentCreate = {
      ...this.form.getRawValue(),
      courseId: this.courseId
    };

    console.log('➕ Agregando estudiante:', newStudent);
    this.errorMessage.set(null);

    this.studentService.addStudentToCourse(newStudent).subscribe({
      next: (created) => {
        console.log('✅ Estudiante agregado exitosamente:', created);
        this.students.update(current => [...current, created]);
        this.form.reset();
        this.errorMessage.set(null);

        // ✅ Emitir evento
        this.studentAdded.emit(created);
      },
      error: (err) => {
        console.error('❌ Error al agregar alumno:', err);
        let errorMsg = 'No se pudo agregar el alumno';
        
        if (err.error?.error) {
          errorMsg = err.error.error;
        } else if (err.status === 401) {
          errorMsg = 'No estás autenticado. Por favor inicia sesión nuevamente.';
        } else if (err.status === 403) {
          errorMsg = 'No tienes permisos para agregar estudiantes a este curso.';
        } else if (err.status === 404) {
          errorMsg = 'El curso no existe.';
        } else if (err.status === 0) {
          errorMsg = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        }
        
        this.errorMessage.set(errorMsg);
      }
    });
  }

}