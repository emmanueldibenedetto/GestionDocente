// course-detail-page.ts
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CourseStudentComponent } from "../../../components/courses/course-student-component/course-student-component";
import { CourseGradesComponent } from "../../../components/courses/course-grade-component/course-grade-component";
import { CourseAsistentComponent } from "../../../components/courses/course-asistent-component/course-asistent-component";

import { CourseService } from "../../../core/services/course-service";
import { StudentService } from "../../../core/services/student-service"; // ← Tu servicio real
import { Student } from "../../../core/models/student";
import { Course } from "../../../core/models/course";

@Component({
  selector: 'app-course-detail-page',
  standalone: true,
  templateUrl: './course-detail-page.html',
  styleUrls: ['./course-detail-page.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CourseStudentComponent,
    CourseGradesComponent,
    CourseAsistentComponent,
  ],
})
export class CourseDetailPage {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private studentService = inject(StudentService); // ← ¡Tu servicio!

  // Signals
  courseId = signal<string>('');
  course = signal<Course | null>(null);
  students = signal<Student[]>([]); // ← El padre es dueño de la lista

  // Toggle
  mostrarAsistencias = signal(false);

  // Para pasar a los hijos
  studentsForChildren = computed(() => this.students());

  ngOnInit() {
    this.courseId.set(this.route.snapshot.paramMap.get('id')!);
    this.loadCourse();
    this.loadStudents(); // ← Carga alumnos desde el StudentService
  }

  private loadCourse() {
    this.courseService.getCourseById(this.courseId()).subscribe({
      next: c => this.course.set(c)
    });
  }

  private loadStudents() {
    this.studentService.getStudentsByCourse(this.courseId()).subscribe({
      next: students => this.students.set(students),
      error: err => console.error('Error cargando alumnos', err)
    });
  }

  // Cuando se agrega un alumno desde CourseStudentComponent
  onStudentAdded(newStudent: Student) {
    this.students.update(list => [...list, newStudent]);
    // ¡Automático! Todos los hijos (Grades y Asistencias) se actualizan porque usan studentsForChildren()
  }

  toggleVista() {
    this.mostrarAsistencias.update(v => !v);
  }
}