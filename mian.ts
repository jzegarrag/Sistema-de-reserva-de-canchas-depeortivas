import { Usuario } from "./Usuario.ts";
import { Cancha } from "./Cancha";
import { Reserva } from "./Reserva";
import { GestorReservas } from "./GestorReservas";

const usuario1 = new Usuario(1, "Carlos", "carlos@mail.com");
const cancha1 = new Cancha(1, "Cancha Central", "Futbol");

const reserva1 = new Reserva(usuario1, cancha1, "2026-02-20", "18:00");

const gestor = new GestorReservas();
gestor.agregarReserva(reserva1);
gestor.mostrarReservas();
