import { Usuario } from "./Usuario";
import { Cancha } from "./Canchas";

export class Reserva {
  constructor(
    private usuario: Usuario,
    private cancha: Cancha,
    private fecha: string,
    private hora: string
  ) {}

  getDetalle(): string {
    return `${this.usuario.getNombre()} - ${this.cancha.getNombre()} - ${this.fecha} ${this.hora}`;
  }

  getFecha(): string {
    return this.fecha;
  }

  getHora(): string {
    return this.hora;
  }
}