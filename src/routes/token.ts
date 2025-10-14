import express, { Request, Response } from "express";
import crypto from "crypto";
import { addToken } from "../middlewares/auth";

const router = express.Router();

/**
 * POST /api/token
 * Body: { "email": "foo@bar.com" }
 * Retourne un token unique pour l'utilisateur.
 */
router.post("/", (req: Request, res: Response) => {
    const { email } = req.body;

    // Vérifie que l'email existe et est de type string
    if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email invalide ou manquant." });
    }

    // Vérifie le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Format d'email invalide." });
    }

    // Génère un token aléatoire
    const token = crypto.randomBytes(32).toString("hex");

    // Sauvegarde le token dans tokens.json
    addToken(token);

    res.json({ token });
});

export default router;