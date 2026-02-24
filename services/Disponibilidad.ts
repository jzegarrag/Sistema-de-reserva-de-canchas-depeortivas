import { Reserva } from "../models/Reserva";

export class ServicioDisponibilidad {
  static estaDisponible(reservas: Reserva[], fecha: string, hora: string): boolean {
    return !reservas.some(r =>
      r.getDetalle().includes(fecha) &&
      r.getDetalle().includes(hora)
    );
  }
}
