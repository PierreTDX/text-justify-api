import express from "express";
import dotenv from "dotenv";
import tokenRouter from "./routes/token";
import justifyRouter from "./routes/justify";
import { setupSwagger } from "./swagger";
import { connectDB } from "../db";

dotenv.config();

const start = async () => {
    await connectDB(); // on se connecte via db.ts

    const app = express();

    // Middleware
    app.use(express.json());
    app.use(express.text());

    // Routes
    app.use("/api/token", tokenRouter);
    app.use("/api/justify", justifyRouter);

    // Swagger
    // route /api/docs
    setupSwagger(app);

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

    // Lancement serveur
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Serveur local lancé sur http://localhost:${PORT}`);
    });
};

start();