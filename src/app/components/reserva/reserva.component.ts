import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { MenuItem } from 'primeng/api';

import { ReservaService } from '../../services/reserva.service';
import { Turno } from '../../models/turno.model';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule, StepsModule, CardModule, ButtonModule, DatePickerModule],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.scss',
})
export class ReservaComponent {
  // Estado con Signals
  pasoActual = signal<number>(0);
  servicioSeleccionado = signal<any>(null);

  // Manejo de fecha y hora separados para una UX impecable
  fechaSeleccionada = signal<Date | null>(null);
  horaSeleccionada = signal<string | null>(null);
  fechaHoraSeleccionada = signal<Date | null>(null);

  // Formulario cliente
  nombreCliente = signal<string>('');
  telefonoCliente = signal<string>('');
  emailCliente = signal<string>('');

  // Ítems de navegación de PrimeNG Steps
  pasosItems: MenuItem[] = [
    { label: 'Servicio' },
    { label: 'Fecha y Hora' },
    { label: 'Confirmación' },
  ];

  // Datos mock de servicios con imágenes de alta calidad
  servicios = [
    {
      id: 1,
      nombre: 'Limpieza Facial Profunda',
      descripcion: 'Limpieza profunda con extracción de impurezas y mascarilla botánica.',
      duracionMinutos: 60,
      precio: 25000,
      imagen:
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      nombre: 'Tratamiento Hidratante',
      descripcion: 'Tratamiento intensivo para hidratar, nutrir y revitalizar la piel.',
      duracionMinutos: 45,
      precio: 18000,
      imagen:
        'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      nombre: 'Perfilado de Cejas',
      descripcion: 'Diseño y perfilado de cejas adaptado a la morfología de tu rostro.',
      duracionMinutos: 30,
      precio: 8000,
      imagen:
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Generación automática de horarios (10:00 a 20:00 hrs condicionado a la duración)
  horariosDisponibles = computed(() => {
    const servicio = this.servicioSeleccionado();
    const fecha = this.fechaSeleccionada();

    if (!servicio || !fecha) return [];

    const horarios: string[] = [];
    const horaApertura = 10;
    const horaCierre = 20;
    const duracion = servicio.duracionMinutos;

    for (let h = horaApertura; h < horaCierre; h++) {
      for (let m = 0; m < 60; m += 30) {
        const inicioEnMinutos = h * 60 + m;
        const finEnMinutos = inicioEnMinutos + duracion;
        const cierreEnMinutos = horaCierre * 60;

        if (finEnMinutos <= cierreEnMinutos) {
          const horaStr = h.toString().padStart(2, '0');
          const minStr = m.toString().padStart(2, '0');
          horarios.push(`${horaStr}:${minStr}`);
        }
      }
    }
    return horarios;
  });

  constructor(private reservaService: ReservaService) {}

  seleccionarServicio(servicio: any) {
    this.servicioSeleccionado.set(servicio);
    this.pasoActual.set(1);
  }

  seleccionarHora(hora: string) {
    this.horaSeleccionada.set(hora);
    if (this.fechaSeleccionada()) {
      const [horas, minutos] = hora.split(':').map(Number);
      const fechaFinal = new Date(this.fechaSeleccionada()!);
      fechaFinal.setHours(horas, minutos, 0, 0);
      this.fechaHoraSeleccionada.set(fechaFinal);
    }
  }

  siguientePaso() {
    if (this.pasoActual() < 2) {
      this.pasoActual.update((p) => p + 1);
    }
  }

  pasoAnterior() {
    if (this.pasoActual() > 0) {
      this.pasoActual.update((p) => p - 1);
    }
  }

  confirmarReserva() {
    const nuevaReserva: Turno = {
      servicio: this.servicioSeleccionado(),
      fechaHora: this.fechaHoraSeleccionada(),
      cliente: {
        nombre: this.nombreCliente(),
        telefono: this.telefonoCliente(),
        email: this.emailCliente(),
      },
    };

    this.reservaService.crearReserva(nuevaReserva).subscribe({
      next: () => {
        alert('¡Reserva realizada con éxito!');
        this.pasoActual.set(0);
        this.servicioSeleccionado.set(null);
        this.fechaSeleccionada.set(null);
        this.horaSeleccionada.set(null);
        this.fechaHoraSeleccionada.set(null);
        this.nombreCliente.set('');
        this.telefonoCliente.set('');
        this.emailCliente.set('');
      },
      error: (err) => {
        console.error('Error al reservar:', err);
      },
    });
  }
}
