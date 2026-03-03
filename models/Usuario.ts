export class Usuario {
  private contraseña: string;
  private fechaRegistro: Date;
  private estado: string;

  constructor(
    private id: number,
    private nombre: string,
    private email: string,           // NUEVO
    private telefono: string,
    contraseña: string               // NUEVO
  ) {
    this.contraseña = this.hashPassword(contraseña);  // NUEVO
    this.fechaRegistro = new Date();                   // NUEVO
    this.estado = 'activo';                            // NUEVO
  }

  // NUEVO: Hash de contraseña
  private hashPassword(contraseña: string): string {
    return btoa(this.email + contraseña + 'SportCenter2024Secret');
  }

  // NUEVO: Validar contraseña
  validarContraseña(contraseña: string): boolean {
    return this.hashPassword(contraseña) === this.contraseña;
  }

  // NUEVO: Obtener datos públicos
  obtenerDatos() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      estado: this.estado,
      fechaRegistro: this.fechaRegistro
    };
  }

  // GETTERS existentes
  getId(): number { return this.id; }
  getNombre(): string { return this.nombre; }
  getEmail(): string { return this.email; }      // NUEVO
  getTelefono(): string { return this.telefono; }

  // NUEVO: Método estático para registro
  static registrar(
    nombre: string,
    email: string,
    contraseña: string,
    telefono: string
  ): Usuario {
    if (!nombre || !email || !contraseña || !telefono) {
      throw new Error('Todos los campos son requeridos');
    }
    if (email.indexOf('@') === -1) {
      throw new Error('Email inválido');
    }
    if (contraseña.length < 6) {
      throw new Error('Contraseña debe tener mínimo 6 caracteres');
    }
    
    return new Usuario(Date.now(), nombre, email, telefono, contraseña);
  }
}