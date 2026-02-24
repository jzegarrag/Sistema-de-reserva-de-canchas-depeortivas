import { Reserva } from "../Reserva";

export class GestorReservas {
  private reservas: Reserva[] = [];

  agregarReserva(reserva: Reserva): void {
    this.reservas.push(reserva);
  }

  cancelarReserva(indice: number): void {
    this.reservas.splice(indice, 1);
  }

  mostrarReservas(): void {
    this.reservas.forEach(r => console.log(r.getDetalle()));
  }

  getReservas(): Reserva[] {
    return this.reservas;
  }
}