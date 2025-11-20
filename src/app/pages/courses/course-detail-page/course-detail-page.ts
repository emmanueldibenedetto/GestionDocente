import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal, ViewChild } from "@angular/core";
import { CourseStudentComponent } from "../../../components/courses/course-student-component/course-student-component";
import { CourseGradesComponent } from "../../../components/courses/course-grade-component/course-grade-component";
import { ActivatedRoute } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { Student } from "../../../core/models/student";
import { Course } from "../../../core/models/course";
import { CourseService } from "../../../core/services/course-service";

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
],

})
export class CourseDetailPage implements OnInit
{
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  courseId = signal<number>(0);
  course = signal<Course | null>(null);

  // Referencia al componente hijo
  @ViewChild(CourseGradesComponent) gradesComp?: CourseGradesComponent;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.courseId.set(Number(idParam));
      this.loadCourse();
    }
  }

  loadCourse(){
    if (this.courseId() > 0) {
      this.courseService.getCourseById(this.courseId()).subscribe({
        next: c => this.course.set(c)
      });
    }
  }

  onStudentAdded(newStudent: Student) {
    // ✅ Actualizar directamente la lista de estudiantes en el componente de notas
    this.gradesComp?.students.update(list => [...list, newStudent]);
  }

}
