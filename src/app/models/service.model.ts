// Interface que define la estructura de un servicio de cosmetología
export interface Servicio {
  id: number; // Identificador único (lo usaremos para conectar con backend)
  nombre: string; // Nombre del servicio
  descripcion: string; // Descripción breve
  duracionMinutos: number; // Duración en minutos (para mostrar y validar horarios)
  precio: number; // Precio en moneda local
}
