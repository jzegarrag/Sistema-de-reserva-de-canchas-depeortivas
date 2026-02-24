import { Usuario } from "./models/Usuario";
import { Cancha } from "./models/Canchas";
import { Horario } from "./models/Horario";
import { Reserva } from "./models/Reserva";
import { GestorReservas } from "./services/GestorReservas";

const usuario1 = new Usuario(1, "Carlos", "carlos@mail.com");
const cancha1 = new Cancha(1, "Cancha Central", "Futbol");
const horario1 = new Horario("2026-02-20", "18:00");

const reserva1 = new Reserva(usuario1, cancha1, horario1);

const gestor = new GestorReservas();
gestor.agregarReserva(reserva1);

gestor.mostrarReservas();
gestor.cancelarReserva(0);
gestor.mostrarReservas();
gestor.cancelarReserva(0);
gestor.mostrarReservas();