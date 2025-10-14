import mongoose, { Schema, Document } from "mongoose";

interface IToken extends Document {
    token: string;
    email: string;
    createdAt: Date;
    expiresAt: Date;
}

const tokenSchema = new Schema<IToken>({
    token: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
});

// Supprimer automatiquement les tokens expirés après 24h
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Token = mongoose.model<IToken>("Token", tokenSchema);