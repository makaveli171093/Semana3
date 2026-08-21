import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Estudiante } from "../types/estudiantes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.join(__dirname, "database.json");

export let estudiantes: Estudiante[] = [];

export async function cargarDatos(): Promise<void> {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    estudiantes = JSON.parse(data);
    console.log("Datos cargados desde database.json");
  } catch (error) {
    console.log(
      "No se encontró database.json o está vacío. Inicializando arreglo vacío.",
    );
    estudiantes = [];
    await guardarDatos();
  }
}

export async function guardarDatos(): Promise<void> {
  try {
    await fs.writeFile(
      FILE_PATH,
      JSON.stringify(estudiantes, null, 2),
      "utf-8",
    );
  } catch (error) {
    console.error("Error al guardar datos en el archivo:", error);
  }
}
