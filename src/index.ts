import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());
interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  bootcamp: string;
}

let estudiantes: Estudiante[] = [
  {
    id: 1,
    nombre: "string",
    email: "string",
    bootcamp: "string",
  },
];
let nextId = 2;

app.get("/api/estudiantes", function (req, res) {
  res.status(200).json(estudiantes);
});

app.get("/api/estudiantes/:id", function (req, res) {
  try {
    const estudiante = estudiantes.find((e) => e.id === Number(req.params.id));
    if (!estudiante) {
      res.status(404).json({ error: `Estudiante no encontrado` });
      return;
    }
    res.status(200).json(estudiantes);
  } catch {
    res.status(500).json({ error: `Error interno` });
  }
});

app.post("/api/estudiantes", function (req, res) {
  try {
    const { nombre, email, bootcamp } = req.body;
    if (!email) {
      res.status(400).json({ error: `El email es requerido` });
      return;
    }
    const nuevoEstudiante = { id: nextId++, nombre, email, bootcamp };
    estudiantes.push(nuevoEstudiante);
    res.status(201).json(nuevoEstudiante);
  } catch {
    res.status(500).json({ error: `Error interno` });
  }
});

app.put("/api/estudiantes/:id", function (req, res) {
  try {
    const index = estudiantes.findIndex((e) => e.id === Number(req.params.id));
    if (index === -1) {
      res.status(404).json({ error: `Estudiante no encontrado` });
      return;
    }
    estudiantes[index] = {
      ...estudiantes[index],
      ...req.body,
      id: estudiantes[index].id,
    };
    res.status(200).json(estudiantes[index]);
  } catch {
    res.status(500).json({ error: `Error interno` });
  }
});

app.delete("/api/estudiantes/:id", function (req, res) {
  try {
    const index = estudiantes.findIndex((e) => e.id === Number(req.params.id));
    if (index === -1) {
      res.status(404).json({ error: `Estudiante no encontrado` });
      return;
    }
    const eliminado = estudiantes[index];
    estudiantes = estudiantes.filter((e) => e.id !== Number(req.params.id));
    res.status(200).json(eliminado);
  } catch {
    res.status(500).json({ error: `Error interno` });
  }
});

app.get("/api/status", (req, res) => {
  res.send({ status: "Servidor en línea", version: "1.0.0" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
