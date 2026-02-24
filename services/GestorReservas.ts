import { Reserva } from "../models/Reserva";

export class GestorReservas {
  private reservas: Reserva[] = [];

  agregarReserva(reserva: Reserva): void {
    this.reservas.push(reserva);
  }

  cancelarReserva(indice: number): void {
    if (indice >= 0 && indice < this.reservas.length) {
      this.reservas.splice(indice, 1);
      console.log("Reserva cancelada correctamente");
    } else {
      console.log("Índice de reserva inválido");
    }
  }

  mostrarReservas(): void {
    this.reservas.forEach((r, i) =>
      console.log(`[${i}] ${r.getDetalle()}`)
    );
  }

  getReservas(): Reserva[] {
    return this.reservas;
  }
}