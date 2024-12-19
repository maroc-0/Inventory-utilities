require("dotenv").config(); // Para usar variables de entorno
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "Cluster0",
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Eventos de conexión
mongoose.connection.on("connected", () => {
  console.log("Conexión a MongoDB establecida");
});

mongoose.connection.on("disconnected", () => {
  console.log("Conexión a MongoDB terminada");
});

mongoose.connection.on("error", (err) => {
  console.error("Error de conexión a MongoDB:", err);
});

// Esquema de datos
const DaySchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true },
  baguet: { type: Number, default: 0, min: 0 },
  lagarto: { type: Number, default: 0, min: 0 },
  pina: { type: Number, default: 0, min: 0 },
  sobranteBaguet: { type: Number, default: 0, min: 0 },
  sobranteLagarto: { type: Number, default: 0, min: 0 },
  sobrantePina: { type: Number, default: 0, min: 0 },
});

const Day = mongoose.model("Day", DaySchema);

// Rutas
app.get("/data", async (req, res) => {
  try {
    const data = await Day.find();
    res.status(200).json(data); // Código de estado 200 para éxito
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).json({ message: "Error al obtener datos" }); // Código de estado 500 para error
  }
});

app.post("/data", async (req, res) => {
  const {
    day,
    baguet = 0,
    lagarto = 0,
    pina = 0,
    sobranteBaguet = 0,
    sobranteLagarto = 0,
    sobrantePina = 0,
  } = req.body;

  try {
    const existingDay = await Day.findOne({ day });

    if (existingDay) {
      // Actualizar datos existentes
      existingDay.baguet = baguet;
      existingDay.lagarto = lagarto;
      existingDay.pina = pina;
      existingDay.sobranteBaguet = sobranteBaguet;
      existingDay.sobranteLagarto = sobranteLagarto;
      existingDay.sobrantePina = sobrantePina;
      await existingDay.save();

      res.status(200).json({ message: "Datos actualizados correctamente" }); // Código de estado 200 para éxito
    } else {
      // Crear nuevo registro
      const newDay = new Day({
        day,
        baguet,
        lagarto,
        pina,
        sobranteBaguet,
        sobranteLagarto,
        sobrantePina,
      });
      await newDay.save();

      res.status(201).json({ message: "Datos creados correctamente" }); // Código de estado 201 para creación
    }
  } catch (error) {
    console.error("Error al guardar datos:", error);
    res.status(500).json({ message: "Error al guardar datos" }); // Código de estado 500 para error
  }
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
