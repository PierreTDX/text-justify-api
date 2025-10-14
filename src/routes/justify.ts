import express, { Request, Response } from "express";
import { justifyText } from "../utils/justifyText";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.post("/", authMiddleware, express.text(), (req: Request, res: Response) => {
    const text = req.body;

    if (typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).send("Le texte fourni est vide ou invalide.");
    }

    const justified = justifyText(text);
    return res.type("text/plain").send(justified);
});

export default router;