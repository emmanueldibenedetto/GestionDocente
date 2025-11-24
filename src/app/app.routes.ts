import { Routes } from '@angular/router';
import { RegisterPage } from './pages/register-page/register-page';
import { LoginPage } from './pages/login-page/login-page';
import { CoursesPage } from './pages/courses/courses-page/courses-page';
import { CourseEditPage } from './pages/courses/course-edit-page/course-edit-page';
import { CourseCreatePage } from './pages/courses/course-create-page/course-create-page';
import { CourseDetailPage } from './pages/courses/course-detail-page/course-detail-page';
import { EditProfessorPage } from './pages/edit-professor-page/edit-professor-page';
import { ProfessorsListPage } from './pages/professors-list-page/professors-list-page';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './enums/roles';

export const routes: Routes = [
    // Rutas públicas (sin autenticación)
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'auth/login', component: LoginPage },
    { path: 'auth/register', component: RegisterPage },
    
    // Rutas protegidas (requieren autenticación)
    { 
        path: 'course/list', 
        component: CoursesPage,
        canActivate: [authGuard]
    },
    { 
        path: 'course/create', 
        component: CourseCreatePage,
        canActivate: [authGuard]
    },
    { 
        path: 'course/edit/:id', 
        component: CourseEditPage,
        canActivate: [authGuard]
    },
    { 
        path: 'course/detail/:id', 
        component: CourseDetailPage,
        canActivate: [authGuard]
    },
    { 
        path: 'auth/edit', 
        component: EditProfessorPage,
        canActivate: [authGuard]
    },
    
    // Rutas protegidas por rol (solo ADMIN)
    { 
        path: 'professors/list', 
        component: ProfessorsListPage,
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.ADMIN] }
    },
    
    // Ruta catch-all: redirigir a login si la ruta no existe
    { path: '**', redirectTo: 'auth/login' }
];
