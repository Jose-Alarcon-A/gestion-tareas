import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:3000/tareas';

  constructor(private http: HttpClient) {}

  obtenerTareas(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  agregarTarea(tarea: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, tarea);
  }

  actualizarTareas(tarea: Task): Observable<Task> {
    return this.http.put<Task>(
      `${this.apiUrl}/${tarea.id}`,
      tarea
    );
  }

  eliminarTarea(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  cambiarEstado(tarea: Task) {

    const tareaActualizada: Task = {
      ...tarea,
      estado:
        tarea.estado === 'Pendiente' ? 'En proceso' :
        tarea.estado === 'En proceso' ? 'Finalizada' :
        'Pendiente'
    };

    this.actualizarTareas(tareaActualizada).subscribe({
      next: () => {
        console.log('Estado de la tarea cambiado correctamente');
      },
      error: (error) => {
        console.error('Error al cambiar el estado de la tarea:', error);
      }
    });
  }

}
