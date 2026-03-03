import express from "express";
import cors from "cors";

import { GestorReservas } from "../services/GestorReservas";
import { Usuario } from "../models/Usuario";
import { Horario } from "../models/Horario";
import { Reserva } from "../models/Reserva";
import { Incidente } from "../models/Incidente";
import { GestorAutenticacion } from "../services/GestorAutenticacion";
import { GestorNotificaciones } from "../services/GestorNotificaciones";
import { Notificacion } from "../models/Notificacion";


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
      email,
      telefono,
      precio
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



const app = express();
const gestor = new GestorReservas();
const gestorAuth = new GestorAutenticacion();    // NUEVO
const gestorNotif = new GestorNotificaciones();  // NUEVO

// ====== REGISTRO DE USUARIO (NUEVO) ======
app.post("/registro", (req, res) => {
  const { nombre, email, contraseña, telefono } = req.body;

  try {
    if (!nombre || !email || !contraseña || !telefono) {
      return res.status(400).json({
        error: "Faltan datos obligatorios"
      });
    }

    const usuario = gestorAuth.registrarUsuario(
      nombre, email, contraseña, telefono
    );

    const token = gestorAuth.iniciarSesionUsuario(email, contraseña);

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      usuario: usuario.obtenerDatos(),
      token
    });

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ====== LOGIN DE USUARIO (NUEVO) ======
app.post("/login-usuario", (req, res) => {
  const { email, contraseña } = req.body;

  try {
    if (!email || !contraseña) {
      return res.status(400).json({
        error: "Email y contraseña son requeridos"
      });
    }

    const token = gestorAuth.iniciarSesionUsuario(email, contraseña);
    const usuario = gestorAuth.obtenerUsuarioActual();

    res.json({
      mensaje: "Sesión iniciada",
      usuario: usuario?.obtenerDatos(),
      token
    });

  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// ====== LOGOUT USUARIO (NUEVO) ======
app.post("/logout-usuario", (req, res) => {
  gestorAuth.cerrarSesionUsuario();
  res.json({ mensaje: "Sesión cerrada" });
});

// ====== CREAR RESERVA (MODIFICADO) ======
app.post("/reservas", (req, res) => {
  const { nombre, email, canchaId, fecha, hora } = req.body;

  try {
    // Obtener usuario por email o crear uno nuevo
    let usuario = gestorAuth.obtenerUsuarioPorEmail(email);
    
    if (!usuario) {
      // Si no existe, crear usuario
      usuario = gestorAuth.registrarUsuario(nombre, email, "temp123", "0");
    }

    const cancha = gestor.getCanchasDisponibles(fecha, hora)
      .find(c => c.getId() === canchaId);

    if (!cancha) {
      return res.status(400).json({
        error: "Cancha no disponible"
      });
    }

    const horario = new Horario(fecha, hora);
    const precio = cancha.obtenerPrecio(); // MODIFICADO: Usa precio dinámico
    const reserva = new Reserva(usuario, cancha, horario, precio);

    if (gestor.agregarReserva(reserva)) {
      // NUEVO: Crear notificación
      const notificacion = Notificacion.crearReservaConfirmada(
        usuario.getId(),
        reserva.getId().toString(),
        cancha.getNombre(),
        fecha,
        hora,
        precio
      );
      gestorNotif.guardarNotificacion(notificacion);

      res.status(201).json({
        mensaje: "Reserva creada correctamente",
        reserva: reserva.toJSON(),
        notificacion: notificacion.obtenerDetalles()
      });
    }

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ====== CANCELAR RESERVA (NUEVO) ======
app.post("/reservas/:id/cancelar", (req, res) => {
  const { id } = req.params;
  const { razon } = req.body;

  try {
    const reserva = gestor.obtenerReservas()
      .find(r => r.getId() === Number(id));

    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    if (gestor.cancelarReserva(Number(id), razon || 'Cancelación del usuario')) {
      // NUEVO: Crear notificación de cancelación
      const notificacion = Notificacion.crearCancelacion(
        reserva.getUsuario().getId(),
        id,
        reserva.getFecha(),
        reserva.getHora()
      );
      gestorNotif.guardarNotificacion(notificacion);

      res.json({
        mensaje: "Reserva cancelada",
        notificacion: notificacion.obtenerDetalles()
      });
    }

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ====== CAMBIAR PRECIO CANCHA (NUEVO - SOLO ADMIN) ======
app.put("/admin/canchas/:id/precio", (req, res) => {
  const { id } = req.params;
  const { nuevoPrecio, razon } = req.body;
  const token = req.headers.authorization;

  try {
    // Validar token de admin
    const admin = gestorAuth.obtenerAdminActual();
    if (!admin || !admin.tienePermiso('cambiar_precios')) {
      return res.status(403).json({ error: "No tienes permisos" });
    }

    if (gestor.cambiarPrecioCancha(Number(id), nuevoPrecio, razon)) {
      // NUEVO: Notificar a todos los usuarios
      const usuarios = gestorAuth.obtenerTodosLosUsuarios();
      const cancha = gestor.obtenerCancha(Number(id));
      
      usuarios.forEach(u => {
        const notificacion = Notificacion.crearCambioPrecio(
          u.getId(),
          cancha?.getNombre() || 'Cancha',
          cancha?.obtenerPrecio() || 0,
          nuevoPrecio
        );
        gestorNotif.guardarNotificacion(notificacion);
      });

      res.json({
        mensaje: "Precio actualizado",
        cancha: cancha?.obtenerDetalles()
      });
    }

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ====== OBTENER NOTIFICACIONES DEL USUARIO (NUEVO) ======
app.get("/usuario/notificaciones", (req, res) => {
  const usuario = gestorAuth.obtenerUsuarioActual();

  if (!usuario) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const notificaciones = gestorNotif.obtenerNotificacionesUsuario(usuario.getId());
  const noLeidas = gestorNotif.contarNoLeidas(usuario.getId());

  res.json({
    total: notificaciones.length,
    noLeidas,
    notificaciones: notificaciones.map(n => n.obtenerDetalles())
  });
});

// ====== MARCAR NOTIFICACIÓN COMO LEÍDA (NUEVO) ======
app.put("/notificaciones/:id/leer", (req, res) => {
  const { id } = req.params;

  try {
    if (gestorNotif.marcarComoLeida(id)) {
      res.json({ mensaje: "Notificación marcada como leída" });
    } else {
      res.status(404).json({ error: "Notificación no encontrada" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ====== ENVIAR NOTIFICACIÓN PERSONAL (NUEVO - SOLO ADMIN) ======
app.post("/admin/notificaciones/enviar", (req, res) => {
  const { usuarioId, titulo, mensaje } = req.body;
  const admin = gestorAuth.obtenerAdminActual();

  try {
    if (!admin || !admin.tienePermiso('ver_reservas')) {
      return res.status(403).json({ error: "No tienes permisos" });
    }

    const notificacion = new Notificacion(
      usuarioId,
      'admin',
      titulo,
      mensaje,
      'media'
    );

    gestorNotif.guardarNotificacion(notificacion);

    res.json({
      mensaje: "Notificación enviada",
      notificacion: notificacion.obtenerDetalles()
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ====== OBTENER RESERVAS DEL USUARIO (NUEVO) ======
app.get("/usuario/reservas", (req, res) => {
  const usuario = gestorAuth.obtenerUsuarioActual();

  if (!usuario) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const reservas = gestor.obtenerReservasUsuario(usuario.getId());

  res.json({
    total: reservas.length,
    reservas: reservas.map(r => r.toJSON())
  });
});
});