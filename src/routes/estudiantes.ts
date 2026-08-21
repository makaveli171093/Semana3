import { Router } from "express";
import type { Request, Response } from "express";
import { estudiantes, guardarDatos } from "../data/db";

const router = Router();

let nextId = estudiantes.length + 1;

router.get("/", function (req: Request, res: Response) {
  /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Obtener lista de estudiantes'
    #swagger.description = "Obtiene la lista de estudiantes filtrados por Bootcamp si se envia en query"
    #swagger.parameters['bootcamp'] = {
      in: 'query',
      description: 'Filtrar estudiantes por name del bootcamp (ej: Frontend, Backend)',
      required: false,
      type: 'string'
    }
  */
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
  /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Obtener lista de estudiantes por su ID'
    #swagger.description = "Muestra al estudiante con ID requerido"
   */
  try {
    const estudiante = estudiantes.find((e) => e.id === Number(req.params.id));
    if (!estudiante) {
      res.status(404).json({ error: `Estudiante no encontrado` });
      return;
    }
    res.status(200).json(estudiante);
  } catch {
    res.status(500).json({ error: `Error interno` });
  }
});

router.post("/", async (req: Request, res: Response) => {
  /*
  #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Crear estudiante'
    #swagger.description = "Crea un nuevo estudiante"
  */
  try {
    const { name, email, bootcamp } = req.body;
    if (!email) {
      res.status(400).json({ error: `El email es requerido` });
      return;
    }
    const nuevoEstudiante = { id: nextId++, name, email, bootcamp };
    estudiantes.push(nuevoEstudiante);
    await guardarDatos();
    res.status(201).json(nuevoEstudiante);
  } catch {
    res.status(500).json({ error: `Error interno` });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Actualizar un estudiante existente'
    #swagger.description = 'Actualizar los datos de un estudiante con el ID enviado en path'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del estudiante a actualizar',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos a actualizar del estudiante',
      required: true,
      schema: {
        name: 'Maria',
        email: 'maria@mail.com',
        bootcamp: 'Full Stack'
      }
    }
  */

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
    await guardarDatos();
    res.status(200).json(estudiantes[index]);
  } catch {
    res.status(500).json({ error: `Error interno` });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Estudiantes']
    #swagger.summary = 'Eliminar un estudiante existente'
    #swagger.description = 'Elimina a un estudiante con el ID enviado en path'
 */
  try {
    const index = estudiantes.findIndex((e) => e.id === Number(req.params.id));
    if (index === -1) {
      res.status(404).json({ error: `Estudiante no encontrado` });
      return;
    }
    const eliminado = estudiantes.splice(index, 1);
    await guardarDatos();
    res.status(200).json([{ mensaje: "Eliminado con exito", eliminado }]);
  } catch {
    res.status(500).json({ error: `Error interno` });
  }
});

export default router;
