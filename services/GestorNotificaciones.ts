import { Notificacion } from "../models/Notificacion";

export class GestorNotificaciones {
  private notificaciones: Notificacion[] = [];

  // Guardar notificación
  guardarNotificacion(notificacion: Notificacion): void {
    this.notificaciones.push(notificacion);
    console.log(`📢 Notificación enviada a usuario ${notificacion.getUsuarioId()}`);
  }

  // Obtener notificaciones de un usuario
  obtenerNotificacionesUsuario(usuarioId: number): Notificacion[] {
    return this.notificaciones.filter(n => n.getUsuarioId() === usuarioId);
  }

  // Obtener no leídas
  obtenerNoLeidasUsuario(usuarioId: number): Notificacion[] {
    return this.obtenerNotificacionesUsuario(usuarioId)
      .filter(n => !n.estaLeida());
  }

  // Marcar como leída
  marcarComoLeida(notificacionId: string): boolean {
    const notificacion = this.notificaciones.find(n => n.getId() === notificacionId);
    if (notificacion) {
      notificacion.marcarComoLeida();
      return true;
    }
    return false;
  }

  // Contar no leídas
  contarNoLeidas(usuarioId: number): number {
    return this.obtenerNoLeidasUsuario(usuarioId).length;
  }

  // Obtener todas las notificaciones
  obtenerTodas(): Notificacion[] {
    return this.notificaciones;
  }

  // Limpiar notificaciones antiguas (más de 30 días)
  limpiarAntiguas(): void {
    const hace30Dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    this.notificaciones = this.notificaciones.filter(n => {
      const fecha = new Date(n.obtenerDetalles().fechaEnvio);
      return fecha > hace30Dias;
    });
  }
}