export class Horario {
  private fecha: string;
  private horaInicio: string;
  private horaFin: string;

  constructor(fecha: string, horaInicio: string, horaFin: string) {
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
  }

  getFecha(): string {
    return this.fecha;
  }

  getHoraInicio(): string {
    return this.horaInicio;
  }

  getHoraFin(): string {
    return this.horaFin;
  }
}
