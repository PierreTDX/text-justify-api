import mongoose, { Schema, Document } from "mongoose";

export interface IRateLimit extends Document {
    token: string;
    wordCount: number;
    date: Date;
}

const rateLimitSchema = new Schema<IRateLimit>({
    token: { type: String, required: true, unique: true, index: true },
    wordCount: { type: Number, required: true, default: 0 },
    date: { type: Date, required: true, default: Date.now }
});

// Supprime automatiquement les enregistrements après 24h
rateLimitSchema.index({ date: 1 }, { expireAfterSeconds: 86400 });

export const RateLimit = mongoose.model<IRateLimit>("RateLimit", rateLimitSchema);