// src/app/features/course/course-asistent-component.ts

import { Component, computed, effect, input, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { Student } from '../../../core/models/student';
import { Present } from '../../../core/models/present';
import { Class } from '../../../core/models/class';

import { PresentService } from '../../../core/services/present-service';
import { ClassService } from '../../../core/services/class-service';

@Component({
  selector: 'app-course-asistent-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-asistent-component.html',
  styleUrl: './course-asistent-component.css'
})
export class CourseAsistentComponent implements OnInit {

  // ─────────────────────────────────────────────────────────────
  // INPUTS
  // ─────────────────────────────────────────────────────────────
  courseId = input.required<string>();
  students = input.required<Student[]>();

  // ─────────────────────────────────────────────────────────────
  // Servicios
  // ─────────────────────────────────────────────────────────────
  private presentService = inject(PresentService);
  private classService = inject(ClassService);

  // ─────────────────────────────────────────────────────────────
  // Estado interno
  // ─────────────────────────────────────────────────────────────
  registros = signal<Present[]>([]);
  clases = signal<Class[]>([]);

  // ─────────────────────────────────────────────────────────────
  // Computed reactivos
  // ─────────────────────────────────────────────────────────────

  fechas = computed(() =>
    [...new Set(this.registros().map(r => r.date))].sort()
  );

  presenteMap = computed(() => {
    const map = new Map<string, Map<string, boolean>>();

    this.registros().forEach(r => {
      if (!map.has(r.date)) map.set(r.date, new Map());
      map.get(r.date)!.set(r.studentId, r.present);
    });

    return map;
  });

  porcentajePorAlumno = computed(() => {
    const total = this.fechas().length;
    const map = new Map<string, number>();
    if (total === 0) return map;

    for (const s of this.students()) {
      let presentes = 0;
      for (const f of this.fechas()) {
        if (this.presenteMap().get(f)?.get(s.id)) presentes++;
      }
      map.set(s.id, Math.round((presentes / total) * 100));
    }

    return map;
  });

  totalPresentesPorFecha = computed(() => {
    const map = new Map<string, number>();

    for (const f of this.fechas()) {
      let count = 0;
      for (const s of this.students()) {
        if (this.presenteMap().get(f)?.get(s.id)) count++;
      }
      map.set(f, count);
    }

    return map;
  });

  hoyFormateado = computed(() =>
    new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  );

  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos() {
    const cid = this.courseId();

    this.presentService.getByCourse(cid).subscribe(data => {
      this.registros.set(data);
    });

    this.classService.getByCourse(cid).subscribe(data => {
      this.clases.set(data);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // MÉTODOS PÚBLICOS — visibles desde el template
  // ─────────────────────────────────────────────────────────────

  public agregarFechaHoy(): void {
    const hoy = new Date().toLocaleDateString('sv-SE');
    const cid = this.courseId();

    if (this.fechas().includes(hoy)) {
      alert('Ya existe la asistencia de hoy');
      return;
    }

    // Crear clase
    const nuevaClase: Class = {
      courseId: cid,
      fecha: hoy
    };

    this.classService.create(nuevaClase).subscribe(claseCreada => {
      this.clases.update(prev => [...prev, claseCreada]);
    });

    // Crear asistencias
    const nuevos: Present[] = this.students().map(s => ({
      courseId: cid,
      studentId: s.id,
      date: hoy,
      present: true
    }));

    this.presentService.createMany(nuevos).subscribe(creados => {
      this.registros.update(prev => [...prev, ...creados]);
    });
  }

  public toggleAsistencia(studentId: string, date: string, checked: boolean): void {
    const registro = this.registros().find(r => r.studentId === studentId && r.date === date);
    if (!registro || !registro.id) return;

    const actualizado = { ...registro, present: checked };

    this.presentService.update(registro.id!, actualizado).subscribe(res => {
      this.registros.update(prev => prev.map(r => r.id === res.id ? res : r));
    });
  }

  public marcarTodosFecha(date: string, present: boolean): void {
    const cid = this.courseId();

    const registrosDeFecha = this.registros().filter(r => r.date === date);

    registrosDeFecha.forEach(r => {
      if (!r.id) return;
      const actualizado = { ...r, present };
      this.presentService.update(r.id, actualizado).subscribe();
    });

    this.registros.update(prev =>
      prev.map(r => r.date === date ? { ...r, present } : r)
    );
  }

  public formatearFecha(iso: string): string {
    return new Date(iso).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    }).replace('.', '');
  }

  // ─────────────────────────────────────────────────────────────
  // Exportar Excel
  // ─────────────────────────────────────────────────────────────

  public async exportarExcel(): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Asistencias');

    sheet.mergeCells('A1', `${String.fromCharCode(65 + this.fechas().length + 1)}1`);
    sheet.getCell('A1').value = `Asistencias - Curso ${this.courseId()}`;
    sheet.getCell('A1').font = { size: 16, bold: true };
    sheet.getCell('A1').alignment = { horizontal: 'center' };

    // Cabeceras
    const header = sheet.getRow(3);
    header.getCell(1).value = 'Alumno';

    this.fechas().forEach((f, i) => {
      header.getCell(2 + i).value = this.formatearFecha(f);
    });

    header.getCell(2 + this.fechas().length).value = '% Asistencia';
    header.font = { bold: true };

    // Datos
    this.students().forEach((s, rowIdx) => {
      const row = sheet.getRow(4 + rowIdx);
      row.getCell(1).value = s.firstName;

      this.fechas().forEach((f, colIdx) => {
        const presente = this.presenteMap().get(f)?.get(s.id) ?? false;
        const cell = row.getCell(2 + colIdx);
        cell.value = presente ? 'P' : 'A';
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: presente ? 'FFCCFFCC' : 'FFFFCCCC' }
        };
      });

      const porc = this.porcentajePorAlumno().get(s.id) ?? 0;
      const cell = row.getCell(2 + this.fechas().length);
      cell.value = `${porc}%`;
      cell.font = {
        bold: true,
        color: { argb: porc >= 90 ? 'FF006400' : porc >= 75 ? 'FF8B8000' : 'FFDC143C' }
      };
    });

    // Auto tamaño columnas
    sheet.columns.forEach(col => {
      let max = 10;
      col.eachCell?.({ includeEmpty: true }, cell => {
        const len = cell.value ? String(cell.value).length : 10;
        if (len > max) max = len;
      });
      col.width = max + 3;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Asistencias_${this.courseId()}_${this.hoyFormateado().replace(/ /g, '_')}.xlsx`);
  }
}
