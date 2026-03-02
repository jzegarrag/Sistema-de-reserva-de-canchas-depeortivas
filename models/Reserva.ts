import { Usuario } from "./Usuario";
import { Cancha } from "./Canchas";
import { Horario } from "./Horario";

export class Reserva {
  constructor(
    private usuario: Usuario,
    private cancha: Cancha,
    private horario: Horario,
    private precio: number
  ) {}

  getUsuario(): Usuario {
    return this.usuario;
  }

  getCancha(): Cancha {
    return this.cancha;
  }

  getHorario(): Horario {
    return this.horario;
  }

  getPrecio(): number {
    return this.precio;
  }

  getFecha(): string {
    return this.horario.getFecha();
  }

  getHora(): string {
    return this.horario.getHora();
  }
}