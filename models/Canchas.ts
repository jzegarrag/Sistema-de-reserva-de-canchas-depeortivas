interface HistoricoPrecios {
  fecha: Date;
  precio: number;
  precioPasado?: number;
  razon: string;
}

export class Cancha {
  private precioBase: number;
  private precioActual: number;
  private descripcion: string;
  private horarios: string[];
  private historicoPrecios: HistoricoPrecios[];

  constructor(
    private id: number,
    private nombre: string,
    private tipo: string,
    precioBase: number = 50,              // NUEVO
    descripcion: string = ''              // NUEVO
  ) {
    this.precioBase = precioBase;
    this.precioActual = precioBase;
    this.descripcion = descripcion;
    this.horarios = this.generarHorarios();
    this.historicoPrecios = [
      { fecha: new Date(), precio: precioBase, razon: 'Precio inicial' }
    ];
  }

  // NUEVO: Generar horarios (9am a 9pm)
  private generarHorarios(): string[] {
    const horarios: string[] = [];
    for (let i = 9; i < 21; i++) {
      horarios.push(`${String(i).padStart(2, '0')}:00`);
    }
    return horarios;
  }

  // NUEVO: Obtener precio actual
  obtenerPrecio(): number {
    return this.precioActual;
  }

  // NUEVO: Cambiar precio (solo admin)
  cambiarPrecio(nuevoPrecio: number, razon: string = 'Cambio de precio'): void {
    if (nuevoPrecio < 0) {
      throw new Error('Precio no puede ser negativo');
    }
    const precioPasado = this.precioActual;
    this.precioActual = nuevoPrecio;
    this.historicoPrecios.push({
      fecha: new Date(),
      precio: nuevoPrecio,
      precioPasado: precioPasado,
      razon: razon
    });
    console.log(`💰 Precio actualizado: $${this.precioActual}`);
  }

  // NUEVO: Obtener histórico
  obtenerHistoricoPrecios(): HistoricoPrecios[] {
    return this.historicoPrecios;
  }

  // GETTERS
  getId(): number { return this.id; }
  getNombre(): string { return this.nombre; }
  getTipo(): string { return this.tipo; }
  getDescripcion(): string { return this.descripcion; }
  getHorarios(): string[] { return this.horarios; }

  // NUEVO: Obtener detalles
  obtenerDetalles() {
    return {
      id: this.id,
      nombre: this.nombre,
      tipo: this.tipo,
      precio: this.precioActual,
      descripcion: this.descripcion,
      horarios: this.horarios
    };
  }
}