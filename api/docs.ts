import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { setupSwagger } from "../src/swagger";
import { connectDB } from "../db";

const appPromise = (async () => {
    await connectDB();
    const app = express();
    setupSwagger(app);
    return app;
})();

export default async (req: VercelRequest, res: VercelResponse) => {
    const app = await appPromise;
    app(req as any, res as any);
};