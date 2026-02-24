import { Usuario } from "./Usuario";

export class Administrador extends Usuario {
  private permisos: string[] = [
    "GESTIONAR_CANCHAS",
    "VER_REPORTES"
  ];

  getPermisos(): string[] {
    return this.permisos;
  }
}