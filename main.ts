import { Usuario } from "./models/Usuario";
import { Horario } from "./models/Horario";
import { Reserva } from "./models/Reserva";
import { GestorReservas } from "./services/GestorReservas";
import { Incidente } from "./models/Incidente";
import { Validador } from "./utils/Validador";

import * as readline from "readline";
import { GestorAutenticacion } from "./services/GestorAutentication";
import { Administrador } from "./models/Administrador";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function preguntar(pregunta: string): Promise<string> {
  return new Promise(resolve => rl.question(pregunta, resolve));
}

const gestor = new GestorReservas();

const admins = [
  { user: "admin1", pass: "1234" },
  { user: "admin2", pass: "abcd" }
];


async function menuPrincipal() {
  console.log("\n=== SISTEMA DE RESERVA DE CANCHAS ===");
  console.log("1. Entrar como Cliente");
  console.log("2. Entrar como Administrador");
  console.log("3. Salir");

  const opcion = await preguntar("Seleccione una opción: ");

  switch (opcion) {
    case "1":
      await menuCliente();
      break;

    case "2":
      const user = await preguntar("Usuario admin: ");
      const pass = await preguntar("Contraseña: ");

      if (loginAdmin(user, pass)) {
        await menuAdmin();
      } else {
        console.log("❌ Credenciales incorrectas");
      }
      break;

    case "3":
      rl.close();
      return;

    default:
      console.log("❌ Opción inválida");
  }

  await menuPrincipal();
}

async function menuCliente() {
  console.log("\n=== MODO CLIENTE ===");
  console.log("1. Crear reserva");
  console.log("2. Ver horarios reservados");
  console.log("3. Volver");

  const opcion = await preguntar("Seleccione una opción: ");

  switch (opcion) {
    case "1":
      await crearReserva();
      break;

    case "2":
      gestor.mostrarReservas();
      break;

    case "3":
      return;

    default:
      console.log("❌ Opción inválida");
  }

  await menuCliente();
}

async function menuAdmin() {
  console.log("\n=== MODO ADMINISTRADOR ===");
  console.log("1. Ver horarios reservados");
  console.log("2. Registrar incidente");
  console.log("3. Ver incidentes");
  console.log("4. Volver");

  const opcion = await preguntar("Seleccione una opción: ");

  switch (opcion) {
    case "1":
      gestor.mostrarReservas();
      break;

    case "2":
      const descripcion = await preguntar("Descripción del incidente: ");
      const fecha = await preguntar("Fecha del incidente: ");
      gestor.agregarIncidente(new Incidente(descripcion, fecha));
      break;

    case "3":
      gestor.mostrarIncidentes();
      break;

    case "4":
      return;

    default:
      console.log("❌ Opción inválida");
  }

  await menuAdmin();
}
async function crearReserva() {
  const nombre = await preguntar("Nombre del cliente: ");
  const telefono = await preguntar("Teléfono: ");

  const usuario = new Usuario(
    Date.now(),
    nombre,
    telefono,
    
  );

  let fecha = await preguntar("Fecha (YYYY-MM-DD): ");
  while (!Validador.fechaValida(fecha)) {
    fecha = await preguntar("Fecha inválida. Reingrese: ");
  }

  let horaTexto = await preguntar("Hora (HH:MM AM/PM): ");
  while (!Validador.horaValida(horaTexto)) {
    horaTexto = await preguntar("Hora inválida. Reingrese: ");
  }

  const hora24 = Validador.convertirAHora24(horaTexto);

  const disponibles = gestor.getCanchasDisponibles(fecha, horaTexto);

  if (disponibles.length === 0) {
    console.log("❌ No hay canchas disponibles en ese horario");
    return;
  }

  console.log("\nCanchas disponibles:");
  disponibles.forEach(c => {
    console.log(`${c.getId()} - ${c.getNombre()}`);
  });

  const idCancha = Number(await preguntar("Seleccione cancha: "));
  const cancha = disponibles.find(c => c.getId() === idCancha);

  if (!cancha) {
    console.log("❌ Cancha inválida");
    return;
  }

  const precio = gestor.calcularPrecio(
    cancha.getTipo(),
    hora24
  );

  const horario = new Horario(fecha, horaTexto);
  const reserva = new Reserva(usuario, cancha, horario, precio);

  if (gestor.agregarReserva(reserva)) {
    console.log(`✅ Reserva creada. Precio: S/ ${precio}`);
  }
}
const gestorAuth = new GestorAutenticacion(); // NUEVO
let usuarioAutenticado: Usuario | null = null; // NUEVO
let adminAutenticado: Administrador | null = null; // NUEVO

// Reemplazar loginAdmin función vieja por:

async function loginAdmin(user: string, pass: string): boolean {
  try {
    gestorAuth.iniciarSesionAdmin(user, pass);
    adminAutenticado = gestorAuth.obtenerAdminActual() as any;
    return true;
  } catch {
    return false;
  }
}

// Agregar nuevo menú de registro/login para usuario:

async function menuAutenticacion() {
  console.log("\n=== AUTENTICACIÓN CLIENTE ===");
  console.log("1. Registrarse");
  console.log("2. Iniciar Sesión");
  console.log("3. Volver");

  const opcion = await preguntar("Seleccione: ");

  switch (opcion) {
    case "1":
      const nombre = await preguntar("Nombre: ");
      const email = await preguntar("Email: ");
      const contraseña = await preguntar("Contraseña: ");
      const telefono = await preguntar("Teléfono: ");

      try {
        const usuario = gestorAuth.registrarUsuario(nombre, email, contraseña, telefono);
        gestorAuth.iniciarSesionUsuario(email, contraseña);
        usuarioAutenticado = usuario;
        console.log(`✅ Bienvenido ${usuario.getNombre()}`);
        await menuCliente();
      } catch (error: any) {
        console.log(`❌ Error: ${error.message}`);
      }
      break;

    case "2":
      const emailLogin = await preguntar("Email: ");
      const contraLogin = await preguntar("Contraseña: ");

      try {
        gestorAuth.iniciarSesionUsuario(emailLogin, contraLogin);
        usuarioAutenticado = gestorAuth.obtenerUsuarioActual();
        console.log(`✅ Bienvenido ${usuarioAutenticado?.getNombre()}`);
        await menuCliente();
      } catch (error: any) {
        console.log(`❌ Error: ${error.message}`);
      }
      break;

    case "3":
      return;
  }

  await menuAutenticacion();
}
menuPrincipal();