import { Request, Response, NextFunction } from "express";
import { Token } from "../models/Token";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token manquant ou invalide." });
        }

        const token = authHeader.split(" ")[1];
        const tokenDoc = await Token.findOne({ token });

        if (!tokenDoc) {
            return res.status(403).json({ error: "Token non reconnu." });
        }

        // Vérifier que le token n'a pas expiré
        if (new Date() > tokenDoc.expiresAt) {
            await Token.deleteOne({ token });
            return res.status(403).json({ error: "Token expiré." });
        }

        (req as any).token = token;
        (req as any).email = tokenDoc.email;
        next();
    } catch (err) {
        console.error("Erreur authentification :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

export const addToken = async (email: string): Promise<string> => {
    try {
        const token = require("crypto").randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        const newToken = new Token({ token, email, expiresAt });
        await newToken.save();

        return token;
    } catch (err) {
        console.error("Erreur création token :", err);
        throw err;
    }
};