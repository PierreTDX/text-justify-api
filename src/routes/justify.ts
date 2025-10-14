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

/**
 * @swagger
 * tags:
 *   name: Justify
 *   description: Justification de texte
 */

/**
 * @swagger
 * /api/justify:
 *   post:
 *     tags: [Justify]
 *     summary: Justifie un texte
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *             example: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
 *     responses:
 *       200:
 *         description: Texte justifié
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       402:
 *         $ref: '#/components/responses/PaymentRequired'
 */