import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Módulos de PrimeNG
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker'; // Si usas PrimeNG 18+ (o reemplaza por CalendarModule desde 'primeng/calendar' si usas v17)
import { ButtonModule } from 'primeng/button';

// Modelos corregidos
import { Servicio } from '../../models/service.model';
import { Turno, Cliente } from '../../models/turno.model';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StepsModule,
    CardModule,
    DatePicker, // Coincide con el import de arriba
    ButtonModule,
  ],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss'], // Extensión corregida a .scss
})
export class ReservaComponent implements OnInit {
  // ---------- Estado del componente ----------

  currentStep: number = 0;

  servicios: Servicio[] = [
    {
      id: 1,
      nombre: 'Limpieza Facial Profunda',
      descripcion: 'Limpieza profunda con extracción de impurezas y mascarilla.',
      duracionMinutos: 60,
      precio: 25000,
    },
    {
      id: 2,
      nombre: 'Hidratación Facial',
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

  selectedServicio: Servicio | null = null;
  selectedDate: Date | null = null;

  cliente: Cliente = {
    nombre: '',
    telefono: '',
    email: '',
  };

  minDate: Date = new Date();

  steps: { label: string }[] = [
    { label: 'Servicio' },
    { label: 'Fecha y Hora' },
    { label: 'Confirmación' },
  ];

  constructor() {}

  ngOnInit(): void {}

  // ---------- Navegación ----------

  nextStep(): void {
    if (this.currentStep === 0 && !this.selectedServicio) {
      alert('Por favor selecciona un servicio.');
      return;
    }
    if (this.currentStep === 1 && !this.selectedDate) {
      alert('Por favor selecciona una fecha y hora.');
      return;
    }
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  seleccionarServicio(servicio: Servicio): void {
    this.selectedServicio = servicio;
    this.nextStep();
  }

  confirmarReserva(): void {
    if (!this.selectedServicio || !this.selectedDate) {
      alert('Faltan datos de la reserva.');
      return;
    }
    if (
      !this.cliente.nombre.trim() ||
      !this.cliente.telefono.trim() ||
      !this.cliente.email.trim()
    ) {
      alert('Por favor completa todos los datos de contacto.');
      return;
    }

    const turno: Turno = {
      servicio: this.selectedServicio,
      fechaHora: this.selectedDate,
      cliente: this.cliente,
    };

    console.log('Reserva confirmada:', turno);
    alert('¡Reserva confirmada con éxito!');

    this.resetForm();
  }

  resetForm(): void {
    this.currentStep = 0;
    this.selectedServicio = null;
    this.selectedDate = null;
    this.cliente = { nombre: '', telefono: '', email: '' };
  }
}
