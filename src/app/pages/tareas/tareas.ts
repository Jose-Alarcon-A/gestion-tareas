import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe} from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource} from '@angular/material/table';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-tareas',
  imports: [
    FormsModule,
    DatePipe,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule
  ],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class Tareas implements OnInit {

  dataSource = new MatTableDataSource<Task>();

  columnas: string[] = [
    'id',
    'titulo',
    'estado',
    'prioridad',
    'fecha',
    'descripcion',
    'acciones'
  ];

  nuevaTarea: Task = {
    id: 0,
    titulo: '',
    estado: '',
    prioridad: '',
    fechaCreacion: '',
    descripcion: ''
  }

  constructor(private taskService: TaskService){};

  ngOnInit() {
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

  agregarTarea() {
    if (
      !this.nuevaTarea.titulo ||
      !this.nuevaTarea.estado ||
      !this.nuevaTarea.prioridad ||
      !this.nuevaTarea.fechaCreacion ||
      !this.nuevaTarea.descripcion
    ) {
      alert('Debe completar todos los campos');
      return;
    }

    const tarea: Task = {
      id: Date.now(),
      titulo: this.nuevaTarea.titulo,
      estado: this.nuevaTarea.estado,
      prioridad: this.nuevaTarea.prioridad,
      fechaCreacion: this.nuevaTarea.fechaCreacion,
      descripcion: this.nuevaTarea.descripcion
    }

    this.taskService.agregarTarea(tarea).subscribe({
      next: (treaCreada) => {
        this.dataSource.data = [...this.dataSource.data, treaCreada];

        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al agregar la tarea:', error);
      }
    });
  }

  eliminarTarea(id: number) {
    const confirmar = confirm('¿Está seguro de eliminar la tarea?');

    if (!confirmar){
      return;
    }

    this.taskService.eliminarTarea(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter((t: Task) => t.id !== id);
      },
      error: (error) => {
        console.error('Error al eliminar la tarea:', error);
      }
    });
  }

  cambiarEstado(tarea: Task) {

    const tareaActualizada: Task = {
      ...tarea,
      estado:
        tarea.estado === 'Pendiente' ? 'En proceso' :
        tarea.estado === 'En proceso' ? 'Finalizada' :
        'Pendiente'
    };

    this.taskService.actualizarTareas(tareaActualizada).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.map(
          (t: Task) => {
            if (t.id === tareaActualizada.id){
              return tareaActualizada;
            }
            return t;
          }
        );
      },
      error: (error) => {
        console.error('Error al cambiar el estado de la tarea:', error);
      }
    });
  }

  limpiarFormulario() {
    this.nuevaTarea = {
      id: 0,
      titulo: '',
      estado: '',
      prioridad: '',
      fechaCreacion: '',
      descripcion: ''
    }
  }

  obtenerClaseEstado(estado: string) {
    if (estado === 'Pendiente'){
      return 'estado-pendiente';
    } else if (estado === 'En proceso'){
      return 'estado-proceso';
    } else {
      return 'estado-finalizada';
    }
  }

  obtenerClasePrioridad(prioridad: string) {
    if (prioridad === 'Alta'){
      return 'prioridad-alta';
    } else if (prioridad === 'Media'){
      return 'prioridad-media';
    } else {
      return 'prioridad-baja';
    }
  }

  existenTareas() {
    return this.dataSource.data.length > 0;
  }

}
