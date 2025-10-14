import express from "express";
import mongoose from "mongoose";
import tokenRouter from "./routes/token";
import justifyRouter from "./routes/justify";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Connexion MongoDB
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI non défini");
        }

        await mongoose.connect(mongoUri);
        console.log("Connecté à MongoDB");
    } catch (err) {
        console.error("Erreur connexion MongoDB :", err);
        process.exit(1);
    }
};

connectDB();

app.use(express.json());

// Test de base
app.get("/", (req, res) => {
    res.send("Server is working!");
});

// Routes
app.use("/api/token", tokenRouter);
app.use("/api/justify", justifyRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});