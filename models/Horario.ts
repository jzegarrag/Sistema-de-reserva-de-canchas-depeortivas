export class Horario {
  constructor(
    private fecha: string,
    private hora: string
  ) {}

  getFecha(): string { return this.fecha; }
  getHora(): string { return this.hora; }
}