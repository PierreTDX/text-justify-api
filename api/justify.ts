import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import justifyRouter from "../src/routes/justify";
import { connectDB } from "../db";

const appPromise = (async () => {
    await connectDB();
    const app = express();
    app.use(express.json());
    app.use(express.text());
    app.use("/api/justify", justifyRouter);
    return app;
})();

export default async (req: VercelRequest, res: VercelResponse) => {
    const app = await appPromise;
    app(req as any, res as any);
};