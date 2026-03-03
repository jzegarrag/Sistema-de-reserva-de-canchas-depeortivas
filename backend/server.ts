import express from "express";
import cors from "cors";

import { GestorReservas } from "../services/GestorReservas";
import { Usuario } from "../models/Usuario";
import { Horario } from "../models/Horario";
import { Reserva } from "../models/Reserva";
import { Incidente } from "../models/Incidente";

const app = express();
app.use(cors());
app.use(express.json());

const gestor = new GestorReservas();

// ====== LOGIN ADMIN ======

const admins = [
  { user: "admin1", pass: "1234" },
  { user: "admin2", pass: "abcd" }
];

let adminLogueado = false;

app.post("/login", (req, res) => {
  const { user, pass } = req.body;

  const valido = admins.some(
    a => a.user === user && a.pass === pass
  );

  if (valido) {
    adminLogueado = true;
    return res.json({ mensaje: "Login correcto" });
  }

  res.status(401).json({ error: "Credenciales incorrectas" });
});

// ====== CREAR RESERVA ======

app.post("/reservas", (req, res) => {

  const { nombre, telefono, canchaId, fecha, hora } = req.body;

  try {

    if (!nombre || !telefono || !canchaId || !fecha || !hora) {
      return res.status(400).json({
        error: "Faltan datos obligatorios"
      });
    }

    const usuario = new Usuario(
      Date.now(),
      nombre,
      telefono
    );

    const cancha = gestor
      .getCanchasDisponibles(fecha, hora)
      .find(c => c.getId() === canchaId);

    if (!cancha) {
      return res.status(400).json({
        error: "Cancha no disponible"
      });
    }

    const horario = new Horario(fecha, hora);

    const precio = 80;

    const reserva = new Reserva(usuario, cancha, horario, precio);

    const creada = gestor.agregarReserva(reserva);

    if (!creada) {
      return res.status(400).json({
        error: "Horario ya reservado"
      });
    }

    res.status(201).json({
      mensaje: "Reserva creada correctamente",
      reserva: reserva.toJSON()
    });

  } catch (error) {
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});

// ====== VER RESERVAS (SOLO ADMIN) ======

app.get("/reservas", (req, res) => {

  if (!adminLogueado) {
    return res.status(403).json({
      error: "Acceso solo para administrador"
    });
  }

  const reservas = gestor.obtenerReservas();

  res.json(reservas.map(r => r.toJSON()));
});

// ====== REGISTRAR INCIDENTE (SOLO ADMIN) ======

app.post("/incidentes", (req, res) => {

  if (!adminLogueado) {
    return res.status(403).json({
      error: "Acceso solo para administrador"
    });
  }

  const { descripcion, fecha } = req.body;

  gestor.agregarIncidente(
    new Incidente(descripcion, fecha)
  );

  res.json({ mensaje: "Incidente registrado" });
});

// ====== VER INCIDENTES (SOLO ADMIN) ======

app.get("/incidentes", (req, res) => {

  if (!adminLogueado) {
    return res.status(403).json({
      error: "Acceso solo para administrador"
    });
  }

  res.json(gestor.obtenerIncidentes());
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});