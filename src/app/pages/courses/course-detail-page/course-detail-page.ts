import { CommonModule } from "@angular/common";
import { computed } from "@angular/core";
import { Component, inject, OnInit, signal, ViewChild } from "@angular/core";
import { CourseStudentComponent } from "../../../components/courses/course-student-component/course-student-component";
import { CourseGradesComponent } from "../../../components/courses/course-grade-component/course-grade-component";
import { CourseAttendanceComponent } from "../../../components/courses/course-asistent-component/course-asistent-component";
import { ActivatedRoute } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { Student } from "../../../core/models/student";
import { Course } from "../../../core/models/course";
import { CourseService } from "../../../core/services/course-service";
import { StudentService } from "../../../core/services/student-service";

@Component({
  selector: 'app-course-detail-page',
  standalone: true,
  templateUrl: './course-detail-page.html',
  styleUrls: ['./course-detail-page.css'],
  imports: [
  CommonModule,
  ReactiveFormsModule,
  CourseStudentComponent,
  CourseAttendanceComponent,
  CourseGradesComponent,
],

})
export class CourseDetailPage implements OnInit
{
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private studentService = inject(StudentService);
  
  courseId = signal<number>(0);
  course = signal<Course | null>(null);
  mostrarAsistencias = signal<boolean>(false);
  students = signal<Student[]>([]); // Lista de estudiantes para pasar a los componentes hijos

  // Computed para pasar estudiantes a los hijos
  studentsForChildren = computed(() => this.students());

  // Referencias a componentes hijos
  @ViewChild(CourseGradesComponent) gradesComp?: CourseGradesComponent;
  @ViewChild(CourseStudentComponent) studentsComp?: CourseStudentComponent;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.courseId.set(Number(idParam));
      this.loadCourse();
      this.loadStudents();
    }
  }

  loadCourse(){
    if (this.courseId() > 0) {
      this.courseService.getCourseById(this.courseId()).subscribe({
        next: c => this.course.set(c)
      });
    }
  }

  loadStudents() {
    if (this.courseId() > 0) {
      this.studentService.getStudentsByCourse(this.courseId()).subscribe({
        next: students => this.students.set(students),
        error: err => console.error('Error cargando alumnos', err)
      });
    }
  }

  toggleVista() {
    this.mostrarAsistencias.update(v => !v);
  }

  onStudentAdded(newStudent: Student) {
    // Actualizar lista local de estudiantes
    this.students.update(list => [...list, newStudent]);
    // Actualizar directamente la lista de estudiantes en el componente de notas
    this.gradesComp?.students.update(list => [...list, newStudent]);
  }

  onStudentRemoved(studentId: number) {
    // Actualizar lista local de estudiantes
    this.students.update(list => list.filter(s => s.id !== studentId));
    // Eliminar estudiante de la lista en el componente de notas
    this.gradesComp?.students.update(list => list.filter(s => s.id !== studentId));
    // También eliminar sus notas
    this.gradesComp?.grades.update(list => list.filter(g => g.studentId !== studentId));
  }

  onStudentUpdated(updatedStudent: Student) {
    // Actualizar lista local de estudiantes
    this.students.update(list => 
      list.map(s => s.id === updatedStudent.id ? updatedStudent : s)
    );
    // Actualizar estudiante en la lista del componente de notas
    this.gradesComp?.students.update(list => 
      list.map(s => s.id === updatedStudent.id ? updatedStudent : s)
    );
  }

  onGradesUpdated() {
    // Cuando se actualizan las notas, refrescar los promedios en el componente de estudiantes
    this.studentsComp?.refreshAverages();
  }

}
