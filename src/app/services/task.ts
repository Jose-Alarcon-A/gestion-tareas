import { Injectable } from '@angular/core';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private storageKey = 'tareas';

  obtenerTareas(): Task[] {
    const data = localStorage.getItem(this.storageKey);

    if (data) {
      return JSON.parse(data);
    }

    const tareasIniciales: Task[] = [
      {
        id: 1,
        titulo: 'Reunión de Coordinación',
        estado: 'Pendiente',
        prioridad: 'Alta',
        fechaCreacion: '2026-05-28',
        descripcion: 'Reunión del equipo de trabajo'
      },
      {
        id: 2,
        titulo: 'Preparar informe de reunión de coordinación',
        estado: 'Pendiente',
        prioridad: 'Media',
        fechaCreacion: '2026-05-28',
        descripcion: 'Resumir lo tratado en la reunión'
      },
    ];

    this.guardarTareas(tareasIniciales);

    return tareasIniciales;
  }

  agregarTarea(tarea: Task){
    const tareas = this.obtenerTareas();

    tareas.push(tarea);

    this.guardarTareas(tareas);
  }

  eliminarTarea(id: number){
    const tareas = this.obtenerTareas();

    const tareasActualizadas = tareas.filter(t => t.id !== id);

    this.guardarTareas(tareasActualizadas);
  }

  actualizarTareas(tareaActualizada: Task){
    const tareas = this.obtenerTareas();

    const tareasActualizadas = tareas.map(t => {
      if (t.id === tareaActualizada.id){
        return tareaActualizada;
      }

      return t;
    });

    this.guardarTareas(tareasActualizadas);
  }

  guardarTareas(tareas: Task[]){
    localStorage.setItem(this.storageKey, JSON.stringify(tareas));
  }

  cambiarEstado(task: Task): void {
    if (task.estado === 'Pendiente') {
      task.estado = 'En proceso';
    } else if (task.estado === 'En proceso') {
      task.estado = 'Finalizada';
    } else {
      task.estado = 'Pendiente';
    }

    this.actualizarTareas(task);
  }

  avanzarEstado(task: Task): void {
    if (task.estado === 'Pendiente') {
      task.estado = 'En proceso';
    } else if (task.estado === 'En proceso') {
      task.estado = 'Finalizada';
    } else if (task.estado === 'Finalizada') {
      task.estado = 'En proceso';
    }

    this.actualizarTareas(task);
  }

  retrocederEstado(task: Task): void {
    if (task.estado === 'En proceso') {
      task.estado = 'Pendiente';
    } else if (task.estado === 'Finalizada') {
      task.estado = 'En proceso';
    }

    this.actualizarTareas(task);
  }
}
