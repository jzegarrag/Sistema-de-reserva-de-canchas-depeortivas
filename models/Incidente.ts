export class Incidente {
  constructor(
    private descripcion: string,
    private fecha: string
  ) {}

  getDescripcion(): string { return this.descripcion; }
  getFecha(): string { return this.fecha; }
}