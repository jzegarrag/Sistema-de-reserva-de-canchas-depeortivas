export class Usuario {
  constructor(
    private id: number,
    private nombre: string,
    private email: string,
    private telefono: string
  ) {}

  getId(): number { return this.id; }
  getNombre(): string { return this.nombre; }
  getEmail(): string { return this.email; }
  getTelefono(): string { return this.telefono; }
}