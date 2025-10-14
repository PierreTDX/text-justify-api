import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import tokenRouter from "../src/routes/token";
import { connectDB } from "../db";

const appPromise = (async () => {
    await connectDB();
    const app = express();
    app.use(express.json());
    app.use("/api/token", tokenRouter);
    return app;
})();

export default async (req: VercelRequest, res: VercelResponse) => {
    const app = await appPromise;
    app(req as any, res as any);
};