import express, { Request, Response } from "express";
import { addToken } from "../middlewares/auth";
import { Token } from "../models/Token";

const router = express.Router();

/**
 * POST /api/token
 * Body: { "email": "foo@bar.com" }
 * Retourne le token existant ou en crée un nouveau.
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        // Vérifie que l'email existe et est de type string
        if (!email || typeof email !== "string") {
            return res
                .status(400)
                .json({ error: "Email invalide ou manquant." });
        }

        // Vérifie le format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Format d'email invalide." });
        }

        // Vérifie s'il existe déjà un token valide pour cet email
        const existingToken = await Token.findOne({
            email,
            expiresAt: { $gt: new Date() }
        });

        if (existingToken) {
            return res.json({ token: existingToken.token });
        }

        // Sinon, génère et sauvegarde un nouveau token
        const token = await addToken(email);
        res.json({ token });
    } catch (err) {
        console.error("Erreur génération token :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

export default router;