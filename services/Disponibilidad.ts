import { Reserva } from "../models/Reserva";

export class ServicioDisponibilidad {
  static estaDisponible(
    reservas: Reserva[],
    fecha: string,
    hora: string
  ): boolean {
    return !reservas.some(r =>
      r.getFecha() === fecha && r.getHora() === hora
    );
  }
}