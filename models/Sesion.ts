import { Usuario } from "./Usuario";

export class Sesion {
  private usuarioActual: Usuario | null = null;
  private tokenSesion: string | null = null;
  private tiempoExpiracion: number | null = null;
  private tiempoInactividad = 30 * 60 * 1000; // 30 minutos

  // Iniciar sesión
  iniciarSesion(usuario: Usuario): string {
    this.usuarioActual = usuario;
    this.tokenSesion = this.generarToken();
    this.tiempoExpiracion = Date.now() + this.tiempoInactividad;
    console.log(`✅ Sesión iniciada para: ${usuario.getNombre()}`);
    return this.tokenSesion;
  }

  // Generar token único
  private generarToken(): string {
    return 'token_' + Math.random().toString(36).substring(2) + Date.now();
  }

  // Obtener usuario actual
  obtenerUsuarioActual(): Usuario | null {
    if (!this.estaAutenticado()) {
      return null;
    }
    this.renovarSesion(); // Renovar tiempo
    return this.usuarioActual;
  }

  // Verificar si hay sesión activa
  estaAutenticado(): boolean {
    return this.usuarioActual !== null && 
           this.tiempoExpiracion !== null &&
           Date.now() < this.tiempoExpiracion;
  }

  // Renovar sesión
  renovarSesion(): void {
    if (this.estaAutenticado()) {
      this.tiempoExpiracion = Date.now() + this.tiempoInactividad;
    }
  }

  // Cerrar sesión
  cerrarSesion(): void {
    if (this.usuarioActual) {
      console.log(`👋 Sesión cerrada para: ${this.usuarioActual.getNombre()}`);
    }
    this.usuarioActual = null;
    this.tokenSesion = null;
    this.tiempoExpiracion = null;
  }

  // Verificar token
  verificarToken(token: string): boolean {
    return this.tokenSesion === token && this.estaAutenticado();
  }
}