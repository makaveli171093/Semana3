import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  bootcamp: string;
}

let estudiantes: Estudiante[] = [
  {
    id: 1,
    nombre: "Jared",
    email: "jared@mail.com",
    bootcamp: "SQL",
  },
  {
    id: 2,
    nombre: "Angel",
    email: "angel@mail.com",
    bootcamp: "Frontend",
  },
  {
    id: 3,
    nombre: "Juan",
    email: "juan@mail.com",
    bootcamp: "BackEnd",
  },
];
let nextId = 2;

router.get("/", function (req: Request, res: Response) {
  const { bootcamp } = req.query;

  if (bootcamp && typeof bootcamp === "string") {
    const filtrados = estudiantes.filter(
      (e) => e.bootcamp.toLowerCase() === bootcamp.toLowerCase(),
    );
    return res.json(filtrados);
  }

  return res.status(200).json(estudiantes);
});

router.get("/:id", function (req: Request, res: Response) {
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

router.post("/", function (req: Request, res: Response) {
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

router.put("/:id", function (req: Request, res: Response) {
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

router.delete("/:id", function (req: Request, res: Response) {
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

export default router;
