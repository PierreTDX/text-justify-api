import mongoose from "mongoose";

export const connectDB = async () => {
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