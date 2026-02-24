import { Usuario } from "./Usuario";
import { Cancha } from "./Canchas";
import { Horario } from "./Horario";

export class Reserva {
  private id: number;
  private usuario: Usuario;
  private cancha: Cancha;
  private horario: Horario;
  private estado: string;

  constructor(id: number, usuario: Usuario, cancha: Cancha, horario: Horario) {
    this.id = id;
    this.usuario = usuario;
    this.cancha = cancha;
    this.horario = horario;
    this.estado = "Activa";
  }

  confirmar(): void {
    this.estado = "Confirmada";
  }

  cancelar(): void {
    this.estado = "Cancelada";
  }

  getDetalle(): string {
    return `
Reserva #${this.id}
Usuario: ${this.usuario.getNombre()}
Cancha: ${this.cancha.getNombre()}
Fecha: ${this.horario.getFecha()}
Hora: ${this.horario.getHoraInicio()} - ${this.horario.getHoraFin()}
Estado: ${this.estado}
`;
  }
}