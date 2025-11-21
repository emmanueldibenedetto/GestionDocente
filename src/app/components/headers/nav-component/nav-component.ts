import { Component, ElementRef, inject, Input, signal, ViewChild, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { Roles } from '../../../enums/roles';

@Component({
  selector: 'app-nav-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-component.html',
  styleUrls: ['./nav-component.css']
})
export class NavComponent {

  @Input() userName!: string | null;
  @Input() userImage!: string;
  @Input() role!: Roles | null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private router = inject(Router);
  private authService = inject(AuthService);

  menuOpen = signal(false);

  Roles = Roles;

  // Imagen local
  localImage = signal<string | null>(null);

  // 🔥 NUEVO: signal para texto de búsqueda (solo admin)
  searchTerm = signal('');

  // 🔥 NUEVO: output hacia componente padre para filtrar
  onSearch = output<string>();

  ngOnChanges() {
    this.localImage.set(this.userImage);
  }

  // 🔥 NUEVO: emite en vivo mientras el admin escribe
  handleSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.onSearch.emit(value);
  }

  openFilePicker(event: Event) {
    event.stopPropagation();
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      this.localImage.set(base64);

      const prof = this.authService.currentProfessor();
      if (!prof) return;

      this.authService.updatePhoto(prof.id!, base64).subscribe({
        next: () => console.log("Foto actualizada"),
        error: () => console.error("Error al actualizar foto")
      });
    };

    reader.readAsDataURL(file);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
