import { Servicio } from './service.model';

// Interface para los datos del cliente (formulario de contacto)
export interface Cliente {
  nombre: string;
  telefono: string;
  email: string;
}

// Interface que representa un turno/reserva completo
export interface Turno {
  servicio: Servicio; // Servicio seleccionado
  fechaHora: Date; // Fecha y hora elegida
  cliente: Cliente; // Datos del cliente
}
