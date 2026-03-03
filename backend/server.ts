import express from "express";
import cors from "cors";
import { GestorReservas } from "../services/GestorReservas";

const app = express();
app.use(cors());
app.use(express.json());

const gestor = new GestorReservas();

// Obtener reservas
app.get("/reservas", (req, res) => {
  res.json(gestor);
});

// Crear reserva
app.post("/reservas", (req, res) => {
  const { usuario, canchaId, fecha, hora } = req.body;

  // aquí usarías tu lógica real
  res.json({ mensaje: "Reserva recibida" });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});