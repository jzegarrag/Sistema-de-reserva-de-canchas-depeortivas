import { Reserva } from "./Reserva";

export class GestorReservas {
  private reservas: Reserva[] = [];

  agregarReserva(reserva: Reserva): void {
    this.reservas.push(reserva);
  }

  mostrarReservas(): void {
    this.reservas.forEach(r => console.log(r.getDetalle()));
  }
}
