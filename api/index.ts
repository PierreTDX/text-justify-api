import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { setupSwagger } from "../src/swagger";
import tokenRouter from "../src/routes/token";
import justifyRouter from "../src/routes/justify";
import dotenv from "dotenv";
import { connectDB } from "../db";

dotenv.config();

const appPromise = (async () => {
  await connectDB();

  const app = express();
  app.use(express.json());
  app.use(express.text());

  // Routes API
  app.use("/api/token", tokenRouter);
  app.use("/api/justify", justifyRouter);
  // Swagger
  setupSwagger(app);

  // Page d'accueil
  app.get("/", (req, res) => {
    res.send(`
    <html>
      <head>
        <title>Text Justify API</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; }
          a { color: #1E90FF; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>Bienvenue sur Text Justify API</h1>
        <p>Cette API permet de justifier du texte via l'endpoint <code>/api/justify</code>.</p>
        <p>Avant de l'utiliser, récupérez un token avec <code>/api/token</code>.</p>
        <p>Consultez la documentation Swagger pour tester les endpoints :</p>
        <p><a href="/api/docs">📚 Documentation Swagger</a></p>
        <p>Exemple d'utilisation :</p>
        <ul>
          <li>POST /api/token avec un JSON { "email": "foo@bar.com" }</li>
          <li>POST /api/justify avec le header Authorization: Bearer &lt;token&gt; et un texte en body</li>
        </ul>
      </body>
    </html>
  `);
  });

  return app;
})();

// Export pour Vercel
export default async (req: VercelRequest, res: VercelResponse) => {
  const app = await appPromise;
  app(req as any, res as any);
};