import { Reserva } from "../models/Reserva";
import { Incidente } from "../models/Incidente";
import { Cancha } from "../models/Canchas";

export class GestorReservas {

  private reservas: Reserva[] = [];
  private incidentes: Incidente[] = [];

  private canchas: Cancha[] = [
    new Cancha(1, "Cancha 1", "Fútbol"),
    new Cancha(2, "Cancha 2", "Fútbol"),
    new Cancha(3, "Cancha 3", "Vóley"),
    new Cancha(4, "Cancha 4", "Basket")
  ];

  agregarReserva(reserva: Reserva): boolean {
    if (this.hayCruce(reserva)) {
      console.log("⚠️ ALERTA: ese horario ya está reservado");
      return false;
    }

    this.reservas.push(reserva);
    console.log("✅ Reserva registrada correctamente");
    return true;
  }

  private hayCruce(nueva: Reserva): boolean {
    return this.reservas.some(r =>
      r.getHorario().getFecha() === nueva.getHorario().getFecha() &&
      r.getHorario().getHora() === nueva.getHorario().getHora() &&
      r.getCancha().getId() === nueva.getCancha().getId()
    );
  }

  getCanchasDisponibles(fecha: string, hora: string): Cancha[] {
    return this.canchas.filter(c =>
      !this.reservas.some(r =>
        r.getCancha().getId() === c.getId() &&
        r.getHorario().getFecha() === fecha &&
        r.getHorario().getHora() === hora
      )
    );
  }

  mostrarReservas() {
    if (this.reservas.length === 0) {
      console.log("No hay reservas registradas");
      return;
    }

    this.reservas.forEach(r => {
      console.log(
        `${r.getUsuario().getNombre()} | ${r.getCancha().getNombre()} | ${r.getHorario().getFecha()} ${r.getHorario().getHora()}`
      );
    });
  }

  agregarIncidente(incidente: Incidente) {
    this.incidentes.push(incidente);
    console.log("🚨 Incidente registrado");
  }

  mostrarIncidentes() {
    if (this.incidentes.length === 0) {
      console.log("No hay incidentes reportados");
      return;
    }

    this.incidentes.forEach(i => {
      console.log(`${i.getFecha()} → ${i.getDescripcion()}`);
    });
  }

  // ⭐ Precio dinámico según tipo y horario
  calcularPrecio(tipoCancha: string, hora24: number): number {
    let precioBase = 0;

    switch (tipoCancha.toLowerCase()) {
      case "fútbol":
        precioBase = 80;
        break;
      case "vóley":
        precioBase = 50;
        break;
      case "basket":
        precioBase = 60;
        break;
      default:
        precioBase = 40;
    }

    // 🌙 horario nocturno: 17:00 a 07:00
    if (hora24 >= 17 || hora24 < 7) {
      precioBase += 20;
    }

    return precioBase;
  }
  obtenerReservas(): Reserva[] {
  return this.reservas;
}
obtenerIncidentes(): Incidente[] {
  return this.incidentes;
}

obtenerReservasUsuario(usuarioId: number): Reserva[] {
  return this.reservas.filter(r => r.getUsuario().getId() === usuarioId);
}

// NUEVO: Cancelar reserva
cancelarReserva(idReserva: number, razon: string): boolean {
  const reserva = this.reservas.find(r => r.getId() === idReserva);
  if (reserva) {
    reserva.cancelar(razon);
    // Liberar el slot
    const fecha = reserva.getFecha();
    const hora = reserva.getHora();
    const cancha = reserva.getCancha();
    
    // Las canchas vuelven a estar disponibles
    console.log(`↩️ Slot liberado: ${cancha.getNombre()} ${fecha} ${hora}`);
    return true;
  }
  return false;
}

// NUEVO: Cambiar precio de cancha (solo admin)
cambiarPrecioCancha(idCancha: number, nuevoPrecio: number, razon: string): boolean {
  const cancha = this.canchas.find(c => c.getId() === idCancha);
  if (cancha) {
    cancha.cambiarPrecio(nuevoPrecio, razon);
    return true;
  }
  return false;
}

// NUEVO: Obtener cancha por ID
obtenerCancha(id: number): Cancha | undefined {
  return this.canchas.find(c => c.getId() === id);
}

// NUEVO: Obtener todas las canchas
obtenerTodasLasCanchas(): Cancha[] {
  return this.canchas;
}
}