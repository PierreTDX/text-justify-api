import express, { Request, Response } from "express";
import { justifyText } from "../utils/justifyText";
import { authMiddleware } from "../middlewares/auth";
import { rateLimit } from "../middlewares/rateLimit";

const router = express.Router();

/**
 * POST /api/justify
 * Protégé par authentification + rate limit
 */
router.post("/", express.text(), authMiddleware, rateLimit, (req: Request, res: Response) => {
    const text = req.body;

    // Vérifie que le corps contient bien un texte valide
    if (typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ error: "Texte vide ou invalide." });
    }

    // Justifie le texte
    const justified = justifyText(text);

    // Renvoie le texte justifié au format texte brut
    res.type("text/plain").send(justified);
});

export default router;