import { Routes } from '@angular/router';
import { ReservaComponent } from './components/reserva/reserva.component';

export const routes: Routes = [
  { path: '', component: ReservaComponent }, // Tu pantalla principal será Reserva
  { path: '**', redirectTo: '' },
];
