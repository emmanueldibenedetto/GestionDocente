import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-component.html',
  styleUrls: ['./nav-component.css']
})
export class NavComponent {
  @Input() userName!: string | null;
  @Input() userImage!: string | null;

  // Controla el menú desplegable
  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }
}
