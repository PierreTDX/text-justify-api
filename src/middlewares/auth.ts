import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

// Chemin du fichier JSON pour stocker les tokens
const TOKEN_FILE = path.join(__dirname, "../../tokens.json");

// Charger les tokens depuis le fichier ou créer un fichier vide
let tokens: Set<string> = new Set();
if (fs.existsSync(TOKEN_FILE)) {
    const data = fs.readFileSync(TOKEN_FILE, "utf-8");
    try {
        const parsed: string[] = JSON.parse(data);
        tokens = new Set(parsed);
    } catch (err) {
        console.error("Erreur lecture tokens.json :", err);
        tokens = new Set();
    }
} else {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify([]));
}

/**
 * Middleware pour protéger une route avec token Bearer.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token manquant ou invalide." });
    }

    const token = authHeader.split(" ")[1];
    if (!tokens.has(token)) {
        return res.status(403).json({ error: "Token non reconnu." });
    }

    (req as any).token = token;
    next();
};

/**
 * Ajoute un token valide et le sauvegarde dans le fichier JSON.
 */
export const addToken = (token: string) => {
    tokens.add(token);
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(Array.from(tokens), null, 2));
};