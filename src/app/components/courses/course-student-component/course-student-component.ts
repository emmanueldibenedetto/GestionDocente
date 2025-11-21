import { Component, EventEmitter, inject, input, Input, OnInit, Output, signal } from '@angular/core';
import { StudentService } from '../../../core/services/student-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Student, StudentCreate } from '../../../core/models/student';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-students',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-student-component.html',
  styleUrl: './course-student-component.css',
})
export class CourseStudentComponent implements OnInit
{
  courseId = input.required<string>(); //Me lo traigo de CourseDetail.
  @Output() studentAdded = new EventEmitter<Student>();

  private studentService = inject(StudentService);
  private fb = inject(FormBuilder);

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
    this.studentService.getStudentsByCourse(this.courseId()).subscribe({
      next: s => this.students.set(s),
      error: () => this.errorMessage.set('Error al cargar alumnos')
    });
  }

  addStudent() {
    if (this.form.invalid) return;

    const newStudent: StudentCreate = {
      ...this.form.getRawValue(),
      courseId: this.courseId()
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