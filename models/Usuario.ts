export class Usuario {
  constructor(
    private id: number,
    private nombre: string,
    private telefono: string
  ) {}

  getId(): number { return this.id; }
  getNombre(): string { return this.nombre; }
  getTelefono(): string { return this.telefono; }
}