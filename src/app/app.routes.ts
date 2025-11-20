import { Routes } from '@angular/router';
import { RegisterPage } from './pages/register-page/register-page';
import { LoginPage } from './pages/login-page/login-page';
import { CoursesPage } from './pages/courses/courses-page/courses-page';
import { CourseEditPage } from './pages/courses/course-edit-page/course-edit-page';
import { CourseCreatePage } from './pages/courses/course-create-page/course-create-page';
import { CourseDetailPage } from './pages/courses/course-detail-page/course-detail-page';
import { EditProfessorPage } from './pages/edit-professor-page/edit-professor-page';

export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'auth/register', component: RegisterPage },
    { path: 'course/list', component: CoursesPage },
    { path: 'course/edit/:id', component: CourseEditPage },
    { path: 'course/create', component: CourseCreatePage },
    { path: 'course/detail/:id', component: CourseDetailPage },
    { path: 'auth/edit', component: EditProfessorPage },
    { path: 'auth/login', component: LoginPage }
];
