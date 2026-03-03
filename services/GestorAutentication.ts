import { Usuario } from "../models/Usuario";
import { Administrador, PermisoAdmin } from "../models/Administrador";
import { Sesion } from "../models/Sesion";

export class GestorAutenticacion {
  private usuarios: Usuario[] = [];
  private administradores: Administrador[] = [];
  private sesionUsuario: Sesion = new Sesion();
  private sesionAdmin: Sesion = new Sesion();

  constructor() {
    this.inicializarAdminsDefault();
  }

  // NUEVO: Registrar usuario
  registrarUsuario(
    nombre: string,
    email: string,
    contraseña: string,
    telefono: string
  ): Usuario {
    // Validar que no exista
    if (this.usuarios.find(u => u.getEmail() === email)) {
      throw new Error('Este email ya está registrado');
    }

    const usuario = Usuario.registrar(nombre, email, contraseña, telefono);
    this.usuarios.push(usuario);
    console.log(`✅ Usuario registrado: ${nombre}`);
    return usuario;
  }

  // NUEVO: Iniciar sesión de usuario
  iniciarSesionUsuario(email: string, contraseña: string): string {
    const usuario = this.usuarios.find(u => u.getEmail() === email);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    if (!usuario.validarContraseña(contraseña)) {
      throw new Error('Contraseña incorrecta');
    }

    const token = this.sesionUsuario.iniciarSesion(usuario);
    return token;
  }

  // NUEVO: Obtener usuario actual
  obtenerUsuarioActual(): Usuario | null {
    return this.sesionUsuario.obtenerUsuarioActual();
  }

  // NUEVO: Cerrar sesión usuario
  cerrarSesionUsuario(): void {
    this.sesionUsuario.cerrarSesion();
  }

  // NUEVO: Iniciar sesión admin
  iniciarSesionAdmin(usuario: string, contraseña: string): string {
    const admin = this.administradores.find(a => a.getNombre() === usuario);
    
    if (!admin) {
      throw new Error('Admin no encontrado');
    }

    if (!admin.validarContraseña(contraseña)) {
      throw new Error('Contraseña incorrecta');
    }

    const token = this.sesionAdmin.iniciarSesion(admin as any);
    return token;
  }

  // NUEVO: Obtener admin actual
  obtenerAdminActual(): Administrador | null {
    return this.sesionAdmin.obtenerUsuarioActual() as any;
  }

  // NUEVO: Cerrar sesión admin
  cerrarSesionAdmin(): void {
    this.sesionAdmin.cerrarSesion();
  }

  // NUEVO: Obtener usuario por ID
  obtenerUsuarioPorId(id: number): Usuario | undefined {
    return this.usuarios.find(u => u.getId() === id);
  }

  // NUEVO: Obtener usuario por email
  obtenerUsuarioPorEmail(email: string): Usuario | undefined {
    return this.usuarios.find(u => u.getEmail() === email);
  }

  // NUEVO: Obtener todos los usuarios
  obtenerTodosLosUsuarios(): Usuario[] {
    return this.usuarios;
  }

  // NUEVO: Inicializar admins default
  private inicializarAdminsDefault(): void {
    const admin1 = new Administrador(
      1,
      'admin1',
      'admin1@sportcenter.com',
      '+51 999 111 111',
      'SportCenter2024',
      ['*'] // todos los permisos
    );

    const admin2 = new Administrador(
      2,
      'admin2',
      'admin2@sportcenter.com',
      '+51 999 222 222',
      'Admin@Secure',
      ['cambiar_precios', 'ver_reservas', 'registrar_incidentes']
    );

    this.administradores = [admin1, admin2];
  }

  // NUEVO: Obtener todos los admins
  obtenerTodosLosAdmins(): Administrador[] {
    return this.administradores;
  }
}