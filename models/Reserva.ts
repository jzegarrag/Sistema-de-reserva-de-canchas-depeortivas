import { Cancha } from "./Canchas";
import { Horario } from "./Horario";
import { Usuario } from "./Usuario";

export class Reserva {
  private id: number;
  private estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';  // NUEVO
  private fechaCreacion: Date;                                              // NUEVO
  private fechaCancelacion: Date | null = null;                             // NUEVO
  private razonCancelacion: string | null = null;                           // NUEVO

  constructor(
    private usuario: Usuario,
    private cancha: Cancha,
    private horario: Horario,
    private precio: number
  ) {
    this.id = Date.now();
    this.estado = 'pendiente';                // NUEVO
    this.fechaCreacion = new Date();          // NUEVO
  }

  // NUEVO: Cancelar reserva
  cancelar(razon: string = 'Cancelación del usuario'): boolean {
    if (this.estado === 'cancelada') {
      throw new Error('Esta reserva ya está cancelada');
    }
    if (this.estado === 'completada') {
      throw new Error('No se puede cancelar una reserva completada');
    }

    this.estado = 'cancelada';
    this.fechaCancelacion = new Date();
    this.razonCancelacion = razon;
    console.log(`❌ Reserva cancelada: ${this.id}`);
    return true;
  }

  // NUEVO: Confirmar reserva
  confirmar(): boolean {
    if (this.estado !== 'pendiente') {
      throw new Error('Reserva ya confirmada');
    }
    this.estado = 'confirmada';
    return true;
  }

  // NUEVO: Obtener estado
  getEstado(): string {
    return this.estado;
  }

  // GETTERS existentes (sin cambios)
  getId(): number { return this.id; }
  getUsuario(): Usuario { return this.usuario; }
  getCancha(): Cancha { return this.cancha; }
  getHorario(): Horario { return this.horario; }
  getPrecio(): number { return this.precio; }
  getFecha(): string { return this.horario.getFecha(); }
  getHora(): string { return this.horario.getHora(); }

  // NUEVO: Obtener detalles
  obtenerDetalles() {
    return {
      id: this.id,
      usuario: this.usuario.obtenerDatos(),
      cancha: this.cancha.obtenerDetalles(),
      fecha: this.getFecha(),
      hora: this.getHora(),
      precio: this.precio,
      estado: this.estado,
      fechaCreacion: this.fechaCreacion,
      fechaCancelacion: this.fechaCancelacion,
      razonCancelacion: this.razonCancelacion
    };
  }

  // MODIFICADO: toJSON con nuevo formato
  toJSON() {
    return {
      id: this.id,
      usuario: {
        id: this.usuario.getId(),
        nombre: this.usuario.getNombre(),
        email: this.usuario.getEmail(),
        telefono: this.usuario.getTelefono()
      },
      cancha: {
        id: this.cancha.getId(),
        nombre: this.cancha.getNombre(),
        tipo: this.cancha.getTipo()
      },
      fecha: this.getFecha(),
      hora: this.getHora(),
      precio: this.precio,
      estado: this.estado
    };
  }
}