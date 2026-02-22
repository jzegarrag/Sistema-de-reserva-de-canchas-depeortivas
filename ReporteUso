import { Reserva } from "./Reserva";

export class ReporteUso {
  private reservas: Reserva[];

  constructor(reservas: Reserva[]) {
    this.reservas = reservas;
  }

  totalReservas(): number {
    return this.reservas.length;
  }

  mostrarResumen(): void {
    console.log("Total de reservas:", this.totalReservas());
  }
}
