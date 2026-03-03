import { Usuario } from "./Usuario";

export type PermisoAdmin = 
  | 'cambiar_precios'
  | 'ver_reservas'
  | 'registrar_incidentes'
  | '*'; // todos los permisos

export class Administrador extends Usuario {
  private permisos: PermisoAdmin[];
  private activo: boolean = true;

  constructor(
    id: number,
    nombre: string,
    email: string,
    telefono: string,
    contraseña: string,
    permisos: PermisoAdmin[] = ['*']
  ) {
    super(id, nombre, email, telefono, contraseña);
    this.permisos = permisos;
  }

  // NUEVO: Validar permiso
  tienePermiso(permiso: PermisoAdmin): boolean {
    return this.permisos.includes(permiso) || this.permisos.includes('*');
  }

  // NUEVO: Obtener permisos
  getPermisos(): PermisoAdmin[] {
    return this.permisos;
  }

  // NUEVO: Desactivar admin
  desactivar(): void {
    this.activo = false;
  }

  // NUEVO: Reactivar admin
  activar(): void {
    this.activo = true;
  }

  estaActivo(): boolean {
    return this.activo;
  }

  // Método para datos públicos
  obtenerDatos() {
    return {
      ...super.obtenerDatos(),
      permisos: this.permisos,
      activo: this.activo
    };
  }
}