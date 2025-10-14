import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Text Justify API",
            version: "1.0.0",
            description: "API pour justifier du texte avec auth token et rate limit",
        },
        tags: [
            { name: "Token", description: "Gestion des tokens" },
            { name: "Justify", description: "Justification de texte" }
        ],
        components: {
            securitySchemes: {
                BearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
            },
            responses: {
                Unauthorized: { description: "Token manquant ou invalide" },
                PaymentRequired: { description: "Limite journalière atteinte" }
            }
        },
        security: [{ BearerAuth: [] }]
    },
    apis: ["./src/routes/*.ts"]
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    // On ne passe que swaggerSpec et options valides
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};