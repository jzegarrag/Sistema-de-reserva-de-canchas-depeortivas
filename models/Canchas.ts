export class Cancha {
  constructor(
    private id: number,
    private nombre: string,
    private tipo: string
  ) {}

  getId(): number { return this.id; }
  getNombre(): string { return this.nombre; }
  getTipo(): string { return this.tipo; }
}