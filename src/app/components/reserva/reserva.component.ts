import { Component, signal } from '@angular/core';
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

  // Datos mock de servicios
  servicios = [
    {
      id: 1,
      nombre: 'Limpieza Facial Profunda',
      descripcion: 'Limpieza profunda con extracción de impurezas y mascarilla.',
      duracionMinutos: 60,
      precio: 25000,
    },
    {
      id: 2,
      nombre: 'Tratamiento Hidratante',
      descripcion: 'Tratamiento intensivo para hidratar y revitalizar la piel.',
      duracionMinutos: 45,
      precio: 18000,
    },
    {
      id: 3,
      nombre: 'Perfilado de Cejas',
      descripcion: 'Diseño y perfilado de cejas según la morfología del rostro.',
      duracionMinutos: 30,
      precio: 8000,
    },
  ];

  constructor(private reservaService: ReservaService) {}

  seleccionarServicio(servicio: any) {
    this.servicioSeleccionado.set(servicio);
    this.pasoActual.set(1);
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
      next: (res) => {
        alert('¡Reserva realizada con éxito!');
        // Resetear flujo
        this.pasoActual.set(0);
        this.servicioSeleccionado.set(null);
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
