import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import {
  CdkDragDrop,
  DragDropModule
} from '@angular/cdk/drag-drop';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-kanban',
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    DragDropModule
  ],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban implements OnInit {

  tareas: Task[] = [];

  estados: string[] = [
    'Pendiente',
    'En proceso',
    'Finalizada'
  ];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.tareas = this.taskService.obtenerTareas().map(tarea => {
      return {
        ...tarea,
        estado: tarea.estado.trim()
      };
    });
  }

  obtenerTareasPorEstado(estado: string): Task[] {
    return this.tareas.filter(
      tarea => tarea.estado === estado
    );
  }

  cambiarEstado(tarea: Task): void {
    this.taskService.cambiarEstado(tarea);
    this.cargarTareas();
  }

  drop(event: CdkDragDrop<Task[]>, nuevoEstado: string): void {
    console.log('DROP OK');
    console.log('Nuevo estado:', nuevoEstado);
    console.log('Tarea:', event.item.data);

    const tarea = event.item.data as Task;

    if (!tarea) {
      return;
    }

    tarea.estado = nuevoEstado;

    this.taskService.actualizarTareas(tarea);

    this.cargarTareas();
  }

  avanzarEstado(tarea: Task): void {
    this.taskService.avanzarEstado(tarea);
    this.cargarTareas();
  }

  retrocederEstado(tarea: Task): void {
    this.taskService.retrocederEstado(tarea);
    this.cargarTareas();
  }
}
