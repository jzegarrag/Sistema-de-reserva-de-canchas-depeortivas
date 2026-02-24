import { Reserva } from "../models/Reserva";

export class ReporteUso {
  constructor(private reservas: Reserva[]) {}

  totalReservas(): number {
    return this.reservas.length;
  }

  mostrarResumen(): void {
    console.log("Total de reservas:", this.totalReservas());
  }
}