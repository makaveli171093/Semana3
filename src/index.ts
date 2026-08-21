import express from "express";
import estudiantesRouter from "./routes/estudiantes";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(
  cors({
    origin: "*", // Permite peticiones desde Netlify o cualquier origen
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API activa y respondiendo" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.get("/api/status", (req, res) => {
  res.send({ status: "Servidor en línea", version: "1.0.0" });
});

app.use("/api/students", estudiantesRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
