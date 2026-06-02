import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';
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

  dataSource = new MatTableDataSource<Task>();

  estados: string[] = [
    'Pendiente',
    'En proceso',
    'Finalizada'
  ];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas() {
    this.taskService.obtenerTareas().subscribe({
      next: (datos) => {
        this.dataSource.data = datos;
      },
      error: (error) => {
        console.error('Error al cargar las tareas:', error);
      }
    });
  }

  obtenerTareasPorEstado(estado: string): Task[] {
    return this.dataSource.data.filter(tarea => tarea.estado === estado);
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

    this.taskService.actualizarTareas(tarea).subscribe({
      next: () => {
        console.log('Estado de la tarea actualizado correctamente');
        this.cargarTareas();
      },
      error: (error) => {
        console.error('Error al actualizar el estado de la tarea:', error);
      }
    });
    this.cargarTareas();
  }

  avanzarEstado(task: Task): void {
    if (task.estado === 'Pendiente') {
      task.estado = 'En proceso';
    } else if (task.estado === 'En proceso') {
      task.estado = 'Finalizada';
    } else if (task.estado === 'Finalizada') {
      task.estado = 'En proceso';
    }

    this.taskService.actualizarTareas(task).subscribe({
      next: () => {
        console.log('Estado de la tarea avanzado correctamente');
        this.cargarTareas();
      },
      error: (error) => {
        console.error('Error al avanzar el estado de la tarea:', error);
      }
    });
  }

  retrocederEstado(task: Task): void {
    if (task.estado === 'En proceso') {
      task.estado = 'Pendiente';
    } else if (task.estado === 'Finalizada') {
      task.estado = 'En proceso';
    }
    this.taskService.actualizarTareas(task).subscribe({
      next: () => {
        console.log('Estado de la tarea retrocedido correctamente');
        this.cargarTareas();
      },
      error: (error) => {
        console.error('Error al retroceder el estado de la tarea:', error);
      }
    });
  }
}
