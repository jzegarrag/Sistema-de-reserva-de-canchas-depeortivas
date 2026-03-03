export type TipoNotificacion = 
  | 'reserva_confirmada' 
  | 'precio_cambio' 
  | 'cancelacion' 
  | 'incidente'
  | 'admin';

export type UrgenciaNotificacion = 'baja' | 'media' | 'alta';

export class Notificacion {
  private id: string;
  private fechaEnvio: Date;
  private fechaLectura: Date | null = null;
  private leída: boolean = false;

  constructor(
    private usuarioId: number,
    private tipo: TipoNotificacion,
    private titulo: string,
    private mensaje: string,
    private urgencia: UrgenciaNotificacion = 'media',
    private reservaId: string | null = null
  ) {
    this.id = 'NOT_' + Date.now();
    this.fechaEnvio = new Date();
  }

  // Marcar como leída
  marcarComoLeida(): void {
    this.leída = true;
    this.fechaLectura = new Date();
  }

  // Getters
  getId(): string { return this.id; }
  getUsuarioId(): number { return this.usuarioId; }
  getTipo(): TipoNotificacion { return this.tipo; }
  getTitulo(): string { return this.titulo; }
  getMensaje(): string { return this.mensaje; }
  getUrgencia(): UrgenciaNotificacion { return this.urgencia; }
  estaLeida(): boolean { return this.leída; }

  // Obtener detalles
  obtenerDetalles() {
    return {
      id: this.id,
      usuarioId: this.usuarioId,
      tipo: this.tipo,
      titulo: this.titulo,
      mensaje: this.mensaje,
      urgencia: this.urgencia,
      leída: this.leída,
      fechaEnvio: this.fechaEnvio,
      fechaLectura: this.fechaLectura,
      reservaId: this.reservaId
    };
  }

  // Métodos estáticos para crear notificaciones específicas
  static crearReservaConfirmada(
    usuarioId: number,
    reservaId: string,
    nomCancha: string,
    fecha: string,
    hora: string,
    precio: number
  ): Notificacion {
    return new Notificacion(
      usuarioId,
      'reserva_confirmada',
      '✅ Reserva Confirmada',
      `Tu reserva en ${nomCancha} para el ${fecha} a las ${hora} ha sido confirmada. Precio: $${precio}`,
      'media',
      reservaId
    );
  }

  static crearCambioPrecio(
    usuarioId: number,
    nomCancha: string,
    precioPasado: number,
    precioNuevo: number
  ): Notificacion {
    return new Notificacion(
      usuarioId,
      'precio_cambio',
      '💰 Cambio de Precio',
      `El precio de ${nomCancha} ha cambiado de $${precioPasado} a $${precioNuevo}`,
      'baja'
    );
  }

  static crearCancelacion(
    usuarioId: number,
    reservaId: string,
    fecha: string,
    hora: string
  ): Notificacion {
    return new Notificacion(
      usuarioId,
      'cancelacion',
      '❌ Reserva Cancelada',
      `Tu reserva para el ${fecha} a las ${hora} ha sido cancelada.`,
      'alta',
      reservaId
    );
  }

  static crearIncidente(
    usuarioId: number,
    descripcion: string
  ): Notificacion {
    return new Notificacion(
      usuarioId,
      'incidente',
      '⚠️ Incidente Reportado',
      `Se ha reportado un incidente: ${descripcion}`,
      'alta'
    );
  }
}