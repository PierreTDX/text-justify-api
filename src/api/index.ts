import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import mongoose from "mongoose";
import tokenRouter from "../routes/token";
import justifyRouter from "../routes/justify";
import dotenv from "dotenv";
import { setupSwagger } from "../swagger";

dotenv.config();

const app = express();

// Connexion MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI non défini");
    }

    await mongoose.connect(mongoUri);
    console.log("Connecté à MongoDB");
  } catch (err) {
    console.error("Erreur connexion MongoDB :", err);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(express.json());
app.use(express.text()); // pour parser text/plain dans /api/justify

// page d'accueil
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
                <p><a href="/api/docs" target="_blank">📚 Documentation Swagger</a></p>
                <p>Exemple d'utilisation :</p>
                <ul>
                    <li>POST /api/token avec un JSON { "email": "foo@bar.com" }</li>
                    <li>POST /api/justify avec le header Authorization: Bearer &lt;token&gt; et un texte en body</li>
                </ul>
            </body>
        </html>
    `);
});

// Routes
app.use("/api/token", tokenRouter);
app.use("/api/justify", justifyRouter);

// Swagger
// route /api/docs
setupSwagger(app);

// Export pour Vercel (plus besoin de app.listen)
export default (req: VercelRequest, res: VercelResponse) => {
  app(req as any, res as any);
};