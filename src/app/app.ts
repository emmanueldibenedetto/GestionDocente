import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footers/footer-component/footer-component';
import { NavComponent } from './components/headers/nav-component/nav-component';
import { AuthService } from './core/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, NavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('GestionDocente');

  currentUser: any = null;

  private auth = inject(AuthService);

  constructor() {
    // si usás signals:
    effect(() => {
      this.currentUser = this.auth.currentProfessor(); 
    });
  }
}
