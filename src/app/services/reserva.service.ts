// src/app/services/reserva.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from '../models/turno.model';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  // URL de la API REST en Spring Boot
  private apiUrl = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) {}

  /**
   * Envía la reserva/turno al backend vía HTTP POST
   */
  crearReserva(turno: Turno): Observable<Turno> {
    return this.http.post<Turno>(this.apiUrl, turno);
  }
}
