import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { celularValidator } from '../../validators/cell-validator/cell-validator';
import { ProfessorService } from '../../core/services/professor-service';

@Component({
  selector: 'app-edit-professor-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-professor-page.html',
  styleUrl: './edit-professor-page.css',
})
export class EditProfessorPage 
{

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);
  private professorService = inject(ProfessorService);

  teacherId!: string | null ;

  idParam!: string | null;

  loading = signal(false);
  message = signal('');
  submitted = false;

  form = this.fb.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    cel: ['', [Validators.required, celularValidator]],
    password: ['', Validators.minLength(6)], // opcional
    confirmPassword: ['']
  });

  ngOnInit() {
    this.loadTeacher();
  }

  loadTeacher() {
      const id = String(this.route.snapshot.paramMap.get('id'));
      console.log("El id que me traigo es: ", id);
      if(id !== "null"){ //si hay id en el url, es un admin queriendo editar datos de otro usuario.
        console.log("hola, adminisrador");
        this.idParam = id;
        this.professorService.getById(id).subscribe({
            next: (profe) => {
              console.log("Profesor a editar id:", profe.id);
              console.log("Profesor a editar name:", profe.name);

              this.form.patchValue({
                name: profe.name,
                lastname: profe.lastname,
                email: profe.email,
                cel: profe.cel
              });
              this.teacherId = profe.id?.toString() ?? null;
              },
              error: (err) => {
                console.error("Error cargando profesor:", err);
              }
          });
    }else{ // si no hay id en la url, es que es el usuario el que quiere actualizar sus datos
      console.log("hola");
      const profe = this.authService.currentProfessor();
      console.log("Tengo el id id : ", profe?.id);
      console.log("cuyo profe tiene el  name : ", profe?.name);
      this.form.patchValue({
        name: profe?.name,
        lastname: profe?.lastname,
        email: profe?.email,
        cel: profe?.cel
      });
      this.teacherId = profe?.id?.toString() ?? null;
      
    }
  
  }

  passwordsDoNotMatch() {
    const p = this?.form.value.password;
    const cp = this.form.value.confirmPassword;

    return p && cp && p !== cp;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid || this.passwordsDoNotMatch()) return;

    if (!this.teacherId) {
      this.message.set('Error: no se encontró el ID del profesor.');
      return;
    }

    this.loading.set(true);

    const updatedData: any = {
      name: this.form.value.name,
      lastname: this.form.value.lastname,
      email: this.form.value.email,
      cel: this.form.value.cel
    };

    if (this.form.value.password) {
      updatedData.password = this.form.value.password;
    }
    if(this.idParam){
      this.professorService.update(this.idParam, updatedData).subscribe({
        next: () => {
          this.loading.set(false);
          this.message.set("Datos actualizados xorrectamente");
          setTimeout(() => this.router.navigate(['professors/list']), 1200);
        }
      })
    }else{
      this.authService.updateProfessor(this.teacherId, updatedData).subscribe({
        next: () => {
          this.loading.set(false);
          this.message.set('Datos actualizados correctamente');
          setTimeout(() => this.router.navigate(['course/list']), 1200);
        },
        error: () => {
          this.loading.set(false);
          this.message.set('Error al actualizar');
        }
      });
    }
  }

}

