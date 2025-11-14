import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewChild } from "@angular/core";
import { CourseStudentComponent } from "../../../components/courses/course-student-component/course-student-component";
import { CourseGradesComponent } from "../../../components/courses/course-grade-component/course-grade-component";
import { ActivatedRoute } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { Student } from "../../../core/models/student";

@Component({
  selector: 'app-course-detail-page',
  standalone: true,
  templateUrl: './course-detail-page.html',
  imports: [
  CommonModule,
  ReactiveFormsModule,
  CourseStudentComponent,
  CourseGradesComponent,
],

})
export class CourseDetailPage {
  private route = inject(ActivatedRoute);
  courseId = signal<string>('');

  // Referencia al componente hijo
  @ViewChild(CourseGradesComponent) gradesComp?: CourseGradesComponent;

  ngOnInit() {
    this.courseId.set(this.route.snapshot.paramMap.get('id')!);
  }

  onStudentAdded(newStudent: Student) {
    // ✅ Actualizar directamente la lista de estudiantes en el componente de notas
    this.gradesComp?.students.update(list => [...list, newStudent]);
  }

}
