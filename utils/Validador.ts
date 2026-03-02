export class Validador {

  static fechaValida(fecha: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(fecha);
  }

  static horaValida(hora: string): boolean {
    return /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(hora.trim());
  }

  static convertirAHora24(hora: string): number {

    if (!this.horaValida(hora)) {
      throw new Error("Formato de hora inválido");
    }

    const partes = hora.trim().split(" ");

    if (partes.length !== 2) {
      throw new Error("Hora incompleta");
    }

    const time = partes[0]!;       // ← garantizamos que existe
    const periodo = partes[1]!.toUpperCase();

    const partesHora = time.split(":");

    if (partesHora.length !== 2) {
      throw new Error("Hora mal formada");
    }

    let h = Number(partesHora[0]!);
    const m = Number(partesHora[1]!);

    if (isNaN(h) || isNaN(m)) {
      throw new Error("Hora no numérica");
    }

    if (periodo === "PM" && h !== 12) h += 12;
    if (periodo === "AM" && h === 12) h = 0;

    return h;
  }
}