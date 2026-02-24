export class Cancha {
  private id: number;
  private nombre: string;
  private tipo: string; // futbol, voley, etc.

  constructor(id: number, nombre: string, tipo: string) {
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
  }

  getId(): number {
    return this.id;
  }

  getNombre(): string {
    return this.nombre;
  }

  getTipo(): string {
    return this.tipo;
  }
}
