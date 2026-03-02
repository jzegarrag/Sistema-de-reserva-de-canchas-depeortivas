import { Usuario } from "../models/Usuario";

export class Admin extends Usuario {
  constructor(
    id: number,
    nombre: string,
    email: string,
    telefono: string,
    private password: string
  ) {
    super(id, nombre, telefono);
  }

  validarPassword(pass: string): boolean {
    return this.password === pass;
  }
}