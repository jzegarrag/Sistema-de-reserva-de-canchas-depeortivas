import { Usuario } from "./Usuario";
import { Cancha } from "./Canchas";
import { Horario } from "./Horario";

export class Reserva {

  private id: number;

  constructor(
    private usuario: Usuario,
    private cancha: Cancha,
    private horario: Horario,
    private precio: number
  ) {
    this.id = Date.now(); // ID automático simple
  }

  // ===== GETTERS =====

  getId(): number {
    return this.id;
  }

  getUsuario(): Usuario {
    return this.usuario;
  }

  getCancha(): Cancha {
    return this.cancha;
  }

  getHorario(): Horario {
    return this.horario;
  }

  getPrecio(): number {
    return this.precio;
  }

  getFecha(): string {
    return this.horario.getFecha();
  }

  getHora(): string {
    return this.horario.getHora();
  }

  // ===== LÓGICA PROPIA DE RESERVA =====

  actualizarPrecio(nuevoPrecio: number): void {
    if (nuevoPrecio > 0) {
      this.precio = nuevoPrecio;
    }
  }

  // ===== MÉTODO CLAVE PARA API =====
  // Convierte la reserva en objeto plano para enviar como JSON

  toJSON() {
    return {
      id: this.id,
      usuario: {
        nombre: this.usuario.getNombre(),
        telefono: this.usuario.getTelefono()
      },
      cancha: {
        id: this.cancha.getId(),
        nombre: this.cancha.getNombre(),
        tipo: this.cancha.getTipo()
      },
      fecha: this.getFecha(),
      hora: this.getHora(),
      precio: this.precio
    };
  }
}