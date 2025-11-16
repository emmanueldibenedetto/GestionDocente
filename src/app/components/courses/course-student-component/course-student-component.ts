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
  @Input() courseId!: string;

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
    this.studentService.getStudentsByCourse(this.courseId).subscribe({
      next: s => this.students.set(s),
      error: () => this.errorMessage.set('Error al cargar alumnos')
    });
  }

  addStudent() {
    if (this.form.invalid) return;

    const newStudent: StudentCreate = {
      ...this.form.getRawValue(),
      courseId: this.courseId
    };

    this.studentService.addStudentToCourse(newStudent).subscribe({
      next: created => {
        this.students.update(current => [...current, created]);
        this.form.reset();

        // ✅ Emitir evento
        this.studentAdded.emit(created);
      },
      error: () => this.errorMessage.set('No se pudo agregar el alumno')
    });
  }

}