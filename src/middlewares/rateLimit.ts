import { Request, Response, NextFunction } from "express";
import { RateLimit } from "../models/RateLimit";

const DAILY_LIMIT = 80000;

/**
 * Middleware rate limit par token.
 * Limite à DAILY_LIMIT mots par jour et renvoie 402 si dépassement.
 * 
 * @param req - Requête Express (doit contenir un header Authorization et un body texte)
 * @param res - Réponse Express utilisée pour renvoyer les erreurs éventuelles
 * @param next - Fonction permettant de passer au middleware ou handler suivant
 *
 * @returns Appelle `next()` si la limite n’est pas atteinte, sinon renvoie une erreur 402.
 */
export const rateLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Vérifie que le header Authorization est présent
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Token manquant." });
        }

        // Extrait le token
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Format du token invalide." });
        }

        // Compter les mots du texte envoyé
        const text = req.body as string;
        const wordCount = text.trim().split(/\s+/).length;

        // Récupère ou crée l'entrée pour ce token
        let userLimit = await RateLimit.findOne({ token });

        if (!userLimit) {
            userLimit = await RateLimit.create({
                token,
                wordCount: 0,
                date: new Date(),
            });
        }

        // Vérifie si c’est encore le même jour
        // Compare la date de la dernière utilisation avec la date actuelle
        const now = new Date();
        const sameDay =
            userLimit.date.getFullYear() === now.getFullYear() &&
            userLimit.date.getMonth() === now.getMonth() &&
            userLimit.date.getDate() === now.getDate();

        // Si on est passé à un nouveau jour, on réinitialise le compteur
        if (!sameDay) {
            userLimit.wordCount = 0;
            userLimit.date = now;
        }

        // Vérifie la limite et bloque la requête avec un code 402
        if (userLimit.wordCount + wordCount > DAILY_LIMIT) {
            return res.status(402).json({
                error: `Limite journalière de ${DAILY_LIMIT} mots atteinte. Passer à la version payante.`,
            });
        }

        // Met à jour le compteur
        userLimit.wordCount += wordCount;
        await userLimit.save();

        // Passe au middleware suivant (ou à la route)
        next();
    } catch (error) {
        console.error("Erreur rate limit:", error);
        res.status(500).json({ error: "Erreur serveur interne." });
    }
};