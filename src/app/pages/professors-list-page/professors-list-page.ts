import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Professor } from '../../core/models/professor';
import { ProfessorService } from '../../core/services/professor-service';
import { SearchService } from '../../core/services/search-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-professors-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './professors-list-page.html',
  styleUrls: ['./professors-list-page.css']
})
export class ProfessorsListPage implements OnInit {
  private professorService = inject(ProfessorService);
  private searchService = inject(SearchService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  professors = signal<Professor[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  searchForm = this.fb.nonNullable.group({
    lastname: ['']
  });

  ngOnInit() {
    this.loadProfessors();
  }

  loadProfessors() {
    this.loading.set(true);
    this.error.set(null);
    this.professorService.getProfessors().subscribe({
      next: professors => {
        this.professors.set(professors);
        this.loading.set(false);
      },
      error: err => {
        this.error.set('Error al cargar profesores');
        this.loading.set(false);
      }
    });
  }

  searchByLastname() {
    const lastname = this.searchForm.controls.lastname.value.trim();
    if (!lastname) {
      this.loadProfessors();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.professorService.searchProfessorsByLastname(lastname).subscribe({
      next: professors => {
        this.professors.set(professors);
        this.loading.set(false);
        this.error.set(null);
      },
      error: err => {
        let errorMsg = 'Error al buscar profesores';
        if (err.error?.error) {
          errorMsg = err.error.error;
        } else if (err.status === 403 || err.status === 401) {
          errorMsg = 'No tienes permisos para buscar profesores';
        }
        this.error.set(errorMsg);
        this.loading.set(false);
      }
    });
  }

  editProfessor(professor: Professor) {
    this.router.navigate(['/professor/edit', professor.id]);
  }

  deleteProfessor(id: number) {
    if (!confirm('¿Estás seguro de eliminar este profesor?')) {
      return;
    }

    this.professorService.deleteProfessor(id).subscribe({
      next: () => {
        this.professors.update(list => list.filter(p => p.id !== id));
        this.error.set(null);
      },
      error: (err) => {
        let errorMsg = 'Error al eliminar profesor';
        if (err.error?.error) {
          errorMsg = err.error.error;
        } else if (err.status === 403 || err.status === 401) {
          errorMsg = 'No tienes permisos para eliminar profesores';
        } else if (err.status === 409) {
          errorMsg = 'No se puede eliminar el profesor porque tiene cursos asociados';
        }
        this.error.set(errorMsg);
      }
    });
  }
}

