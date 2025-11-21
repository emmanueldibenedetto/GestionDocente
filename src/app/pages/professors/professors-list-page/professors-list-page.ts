// professors-list.component.ts
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { ProfessorService } from '../../../core/services/professor-service';
import { AuthService } from '../../../core/services/auth-service';
import { Professor } from '../../../core/models/professor';

@Component({
  selector: 'app-professors-list',
  standalone: true,
  imports: [DatePipe, AsyncPipe, RouterLink],
  templateUrl: './professors-list-page.html',
  styleUrl: './professors-list-page.css'
})
export class ProfessorsListPage implements OnInit {
  private professorService = inject(ProfessorService);
  private auth = inject(AuthService);
  private router = inject(Router);

  currentUser = this.auth.currentProfessor;

  professors = signal<Professor[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  page = signal(0);
  pageSize = 20;

  pagedProfessors = computed(() => {
    const start = this.page() * this.pageSize;
    const end = start + this.pageSize;
    return this.professors().slice(start, end);
  });

  ngOnInit(): void {
    if (this.currentUser()?.role === 'admin') {
      this.loadProfessors();
    }
  }

  private loadProfessors(): void {
    this.loading.set(true);
    this.error.set(null);

    this.professorService.getAll().subscribe({
      next: (data) => {
        this.professors.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar los profesores');
        this.loading.set(false);
      }
    });
  }

  refreshList(): void {
    this.professorService.refresh();
    this.loadProfessors();
  }

  editProfessor(id: string | number) {
    this.router.navigate(['/auth/edit/', id]);
  }

  deleteProfessor(id: string | number) {
    const ok = confirm('¿Seguro que desea eliminar al usuario?');

    if (!ok) return;

    this.professorService.delete(id).subscribe({
      next: () => {
        alert('Profesor eliminado correctamente');
        this.refreshList();
      },
      error: () => alert('Error al eliminar el profesor')
    });
  }


  nextPage() {
    const total = this.professors().length;
    const maxPage = Math.floor(total / this.pageSize);

    if (this.page() < maxPage) {
      this.page.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.page() > 0) {
      this.page.update(p => p - 1);
    }
  }
}
