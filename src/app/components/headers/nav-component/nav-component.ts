import { Component, ElementRef, inject, Input, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-nav-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-component.html',
  styleUrls: ['./nav-component.css']
})
export class NavComponent {

  @Input() userName!: string | null;        // <-- OK
  @Input() userImage!: string;       // <-- OK

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private router = inject(Router);
  private authService = inject(AuthService);

  menuOpen = signal(false);

  // ESTA señal es solo para actualizar la imagen localmente
  localImage = signal<string | null>(null);

  ngOnChanges() {
    // cuando cambien los @Input, actualizamos localImage
    this.localImage.set(this.userImage);
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

      this.localImage.set(base64);  // actualizar imagen local

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
