import { Validador } from "../utils/Validador";

export class TarifaService {

  static calcularPrecio(hora: string): number {
    const h = Validador.convertirAHora24(hora);

    // noche: 17:00 → 07:00
    if (h >= 17 || h < 7) return 60;
    return 40;
  }
}