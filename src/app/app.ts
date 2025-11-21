import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footers/footer-component/footer-component';
import { NavComponent } from './components/headers/nav-component/nav-component';
import { AuthService } from './core/services/auth-service';
import { SearchService } from './core/services/search-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, NavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App 
{
  protected readonly title = signal('GestionDocente');

  private authService = inject(AuthService);

  // SIGNAL que el template usa
  currentUser = signal(this.authService.currentProfessor());

  // Nuevo: término de búsqueda
  search = inject(SearchService);
  page = signal(0);
  constructor() {
    // Sync del authService -> app
    effect(() => {
      this.currentUser.set(this.authService.currentProfessor());
    });
  }

    // 🔥 Recibido desde el navbar

  filterProfessors(term: string) {
    this.search.term.set(term);
  }

}

//>json-server --watch db.json