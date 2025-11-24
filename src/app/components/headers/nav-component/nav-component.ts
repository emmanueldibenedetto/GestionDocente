import { Component, ElementRef, inject, Input, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { Role } from '../../../enums/roles';

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
  @Input() userRole?: Role;          // <-- Rol del usuario

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private router = inject(Router);
  private authService = inject(AuthService);

  menuOpen = signal(false);
  mobileMenuOpen = signal(false);

  get isAdmin(): boolean {
    return this.userRole === Role.ADMIN;
  }

  // ESTA señal es solo para actualizar la imagen localmente
  localImage = signal<string | null>(null);
  imageError = signal(false);

  ngOnChanges() {
    // cuando cambien los @Input, actualizamos localImage solo si hay una imagen válida
    // Si userImage es null, undefined, o string vacío, usar null para que use el default
    const validImage = this.userImage && this.userImage.trim() !== '' ? this.userImage : null;
    this.localImage.set(validImage);
    this.imageError.set(false); // Reset error state cuando cambia la imagen
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

  getImageSrc(): string {
    // Si hay una imagen local (recién cargada), usarla
    if (this.localImage()) {
      return this.localImage()!;
    }
    // Si hay una imagen del usuario válida, usarla
    if (this.userImage && this.userImage.trim() !== '') {
      return this.userImage;
    }
    // Si hay error o no hay imagen, usar la imagen por defecto
    return 'assets/default-profile.svg';
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    // Solo cambiar si no es ya la imagen por defecto para evitar loops
    if (img.src && !img.src.includes('default-profile.svg')) {
      img.src = 'assets/default-profile.svg';
      this.imageError.set(true);
    }
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
