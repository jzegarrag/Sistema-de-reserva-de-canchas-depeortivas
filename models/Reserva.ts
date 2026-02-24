import { Usuario } from "./Usuario";
import { Cancha } from "./Canchas";
import { Horario } from "./Horario";

export class Reserva {
  constructor(
    private usuario: Usuario,
    private cancha: Cancha,
    private horario: Horario
  ) {}

  getDetalle(): string {
    return `${this.usuario.getNombre()} reservó ${this.cancha.getNombre()} el ${this.horario.getFecha()} a las ${this.horario.getHora()}`;
  }

  getFecha(): string { return this.horario.getFecha(); }
  getHora(): string { return this.horario.getHora(); }
}