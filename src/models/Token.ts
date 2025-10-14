import mongoose, { Schema, Document, Model } from "mongoose";

interface IToken extends Document {
    token: string;
    email: string;
    createdAt?: Date;
    expiresAt: Date;
}

const tokenSchema = new Schema({
    token: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

// Supprimer automatiquement les tokens expirés après 24h
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Token = mongoose.model("Token", tokenSchema) as unknown as Model<IToken>;